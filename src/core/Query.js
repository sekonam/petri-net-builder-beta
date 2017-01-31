import {EntityNames, NodeNames, NodeGroupNames, StatusNames} from './Entities.js';

export default class Query {

  constructor(state) {
    Query.instance = this;

    const s = (name) => name + 's';

    StatusNames.forEach( (statusName) => {
      this[statusName] = state[statusName];
      this[statusName].isSet = () => state[statusName].data
        && state[statusName].data.netId == state.current.net.id ? true : false;
    } );

    const queryFactory = {

      get: (entityName) => state.db.get(entityName),

      options: (entityName, paramName = 'name') => () => this[ s(entityName) ]().cmap((item) => ({
        'value': item.id,
        'label': item[paramName]
      })),

      selectedOptions: (entityName, paramName = 'name') => (selectedIds) => selectedIds.cmap((id) => ({
        'value': id,
        'label': state.db[ s(entityName) ].valueById(id)[paramName]
      }))

    };

    EntityNames.forEach( (entityName) => {
      this[ s(entityName) ] = state.db.getAll( entityName );

      this[entityName] = {};

      for (let methodName in queryFactory) {
        this[entityName][methodName] = queryFactory[methodName](entityName);
      }
    } );

    NodeGroupNames.forEach( (entityName) => {

      this[entityName].isActive = (id) => {
        if (this.active.isSet() && this.active.data.id == id) return true;
        return false;
      }
    } );

    const listFunc = (entityName, condition) => (ids = null, exceptIds = null) => {
      if (!state.current.net) return [];

      let entities = state.db[ s(entityName) ].filter(condition);

      if (ids) {
        entities = entities.filter( (entity) => ids.has(entity.id) );
      }

      if (exceptIds) {
        entities = entities.filter( (entity) => !exceptIds.has(entity.id) );
      }

      return entities;
    };

    NodeGroupNames.forEach( (entityName) => {
      this[ s(entityName) ] = listFunc( entityName,
        (entity) => entity.netId == state.current.net.id
      );

      this[ s(entityName) + 'NotActive' ] = listFunc( entityName,
        (entity) => entity.netId == state.current.net.id
          && !this[entityName].isActive(entity.id)
      );
    } );

    this.arc.netId = (id) => {
      const arc = this.arc.get(id),
        socket = this.socket.get(arc.startSocketId),
        node = this[socket.nodeType].get(socket.nodeId);
      return node.netId;
    };

    this.arcs = (ids = null) => {
      if (!state.current.net) return [];

      const minimizedGroups = this.groups().filter( (group) => group.minimized );
      let internalArcIds = [];
      minimizedGroups.forEach( (group) => {
        internalArcIds = internalArcIds.concat(
          this.group.internalArcs(group.id).map( (arc) => arc.id )
        );
      } );

      let entities = state.db.arcs.filter(
        (entity) => this.arc.netId(entity.id) == state.current.net.id
          && !internalArcIds.has(entity.id)
      );

      if (ids) {
        entities = entities.filter( (entity) => ids.has(entity.id) );
      }

      return entities;
    };

    this.arc.netId = (id) => {
      const arc = this.arc.get(id),
        socket = this.socket.get(arc.startSocketId),
        node = this[socket.nodeType].get(socket.nodeId);
      return node.netId;
    };

    this.group.nodes = (id) => {
      let nodes = [],
        group = this.group.get(id);
      NodeNames.forEach((nodeName) => {
        group[nodeName + 'Ids'] . forEach( (nid) => {
          nodes.push( this[nodeName] . get(nid) );
        });
      });
      return nodes;
    };

    this.group.socketIds = (id) => {
      let socketIds = [];
      this.group.nodes(id).forEach( (node) => {
        socketIds = socketIds.concat( node.socketIds );
      } );
      return socketIds.unique();
    };

    this.group.arcs = (id, condition) => (
      state.db.arcs.filter( (arc) => (
        condition(arc, this.group.socketIds(id))
      ) )
    );

    this.group.externalArcs = (id) => this.group.arcs( id,
      (arc, socketIds) => socketIds.has(arc.startSocketId) ^ socketIds.has(arc.finishSocketId)
    );

    this.group.internalArcs = (id) => this.group.arcs( id,
      (arc, socketIds) => socketIds.has(arc.startSocketId) && socketIds.has(arc.finishSocketId)
    );

    this.group.externalSocketIds = (id) => {
      const socketIds = this.group.socketIds(id),
        externalArcs = this.group.externalArcs(id);

      let externalSocketIds = [];
      externalArcs.forEach( (arc) => {
        if (socketIds.has( arc.startSocketId )) {
          externalSocketIds.push(arc.startSocketId);
        }
        if (socketIds.has( arc.finishSocketId )) {
          externalSocketIds.push(arc.finishSocketId);
        }
      } );

      return externalSocketIds.unique();
    };

    this.group.empty = (id) => {
      let empty = true,
        group = this.group.get(id);

      NodeNames.forEach( (entityName) => {
        empty = empty && !group[entityName + 'Ids'].length;
      } );

      return empty;
    };

    this.group.size = (id) => {
      const group = this.group.get(id),
        {min, max} = this.minmax(id),
        INDENT = 10, HEADER = 20;
      return {
        x: min.x - INDENT,
        y: min.y - INDENT - HEADER,
        width: group.minimized ? group.width : max.x - min.x + 2 * INDENT,
        height: group.minimized ? group.height : max.y - min.y + 2 * INDENT + HEADER
      };
    };

    NodeNames.forEach( (nodeName) => {
      this[nodeName].minimized = (id) => (
        this.groups().find(
          (group) => group.minimized && group[nodeName + 'Ids'].has(id)
        )
      )
    } );

    this.subnet.net = (id) => this.nets.find( (net) => net.subnetId == id );

    this.groupsEntityIds = () => {
      let ids = [];

      NodeNames.forEach( (nodeName) => {
        this.groups().forEach( (group) => {
          ids = ids.concat( group[ nodeName + 'Ids' ] );
        } );
      } );

      return ids;
    };

    this.freeNodes = () => {
      const groups = this.groups(),
        entities = {},
        ids = {};

      NodeNames.forEach( (entityName) => {
        ids[entityName] = [];

        groups.forEach( (group) => {
          ids[entityName] = ids[entityName].concat( group[entityName + 'Ids'] );
        } );
      } );

      NodeNames.forEach( (entityName) => {
        entities[ s(entityName) ] = this[ s(entityName) ] () . filter(
          (entity) => ! ids[entityName].has(entity.id)
        );
      } );

      return entities;
    };

    this.socket.node = (socketId) => {
      const socket = state.db.sockets.valueById(socketId);
      return state.db[ s(socket.nodeType) ].valueById(socket.nodeId);
    };

    this.zoom = {
      get: () => state.viewport.zoom,
      offset: (diff) => {
        const viewport = state.viewport;

        return {
          x: diff.x / viewport.zoom,
          y: diff.y / viewport.zoom
        };
      }
    };

    this.minmax = (gid = null) => {
      const BIG_INT = 1000000;

      let max = {
          x: -BIG_INT,
          y: -BIG_INT
        },
        min = {
          x: BIG_INT,
          y: BIG_INT
        };

      NodeNames.forEach( (entityName) => {
        let ids = gid ? this.group.get (gid) [entityName+'Ids'] : null;

        this [s(entityName)] (ids) . forEach( (entity) => {
          min.x = Math.min( min.x, entity.x );
          min.y = Math.min( min.y, entity.y );
          max.x = Math.max( max.x, entity.x + entity.width );
          max.y = Math.max( max.y, entity.y + entity.height );
        } );
      } );

      return {min, max};
    };

    this.treebreadWorkspace = (activeId = null, toggled = []) => {

      let cursor = null;
      const node = {
        name: 'Workspace',
        toggled: true,
        children: state.db.nets.filter( (net) => !net.subnetId ).map( (net) => {
          let entities = {};

          NodeGroupNames.forEach( (entityName) => {
            entities[entityName] = state.db[ s(entityName) ]
              .filter( (entity) => entity.netId == net.id );
          } );

          const node = {
            id: net.id,
            type: 'net',
            name: net.name,
            toggled: toggled.indexOf(net.id) > -1,
            children: entities.group.map( (group) => {

              const node = {
                id: group.id,
                type: 'group',
                name: group.name,
                toggled: toggled.indexOf(group.id) > -1,
                children: []
              };

              NodeNames.forEach( (entityName) => {
                node.children = node.children.concat(
                  group[entityName + 'Ids'].map( (id) => {
                    const entity = this[entityName].get(id),
                      key = entities[entityName].indexById(id);

                    if (key > -1) {
                      entities[entityName].splice(key, 1);
                    }

                    const node = {
                      id: entity.id,
                      type: entityName,
                      name: entity.name
                    };

                    if (entity.id == activeId) {
                      cursor = node;
                    }

                    return node;
                  } )
                );
              } );

              if (group.id == activeId) {
                cursor = node;
              }

              return node;

            } )
          };

          NodeNames.forEach( (entityName) => {
            node.children = node.children.concat(
              entities[entityName].map( (entity) => {

                const node = {
                  id: entity.id,
                  type: entityName,
                  name: entity.name
                };

                if (entity.id == activeId) {
                  cursor = node;
                }

                return node;
              } )
            );
          } );

          if (net.id == activeId) {
            cursor = node;
          }

          return node;
        } )
      };

      return {tree: node, cursor};
    }
  }
}
