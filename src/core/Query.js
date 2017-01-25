import {EntityNames, NodeNames, NodeGroupNames} from './Entities.js';

export default class Query {

  constructor(state) {
    Query.instance = this;

    const s = (name) => name + 's';

    const queryFactory = {

      get: (entityName) => state.db.get(entityName),
      active: (entityName) => state.active[entityName],

      options: (entityName, paramName = 'name') => () => this[ s(entityName) ]().cmap((item) => ({
        'value': item.id,
        'label': item[paramName]
      })),

      selectedOptions: (entityName, paramName = 'name') => (selectedIds) => selectedIds.cmap((id) => ({
        'value': id,
        'label': state.db[ s(entityName) ].valueById(id)[paramName]
      }))

    };

    for (let key in EntityNames) {
      const entityName = EntityNames[key];
      this[ s(entityName) ] = state.db.getAll( entityName );

      this[entityName] = {};

      for (let methodName in queryFactory) {
        this[entityName][methodName] = queryFactory[methodName](entityName);
      }
    }

    NodeGroupNames.forEach( (entityName) => {

      this[ s(entityName) ] = (ids = null) => {
        if (!state.current.net) return [];

        let entities = state.db[ s(entityName) ].filter(
          (entity) => entity.netId == state.current.net.id
            && (!state.active.data || state.active.data.id != entity.id)
        );

        if (ids) {
          entities = entities.filter( (entity) => ids.has(entity.id) );
        }

        return entities;
      };

      this[entityName].activeOrDragging = (id) => {
        const active = state.active[entityName],
          dragging = state.dragging[entityName];

        if (active && active.id == id) return true;
        if (dragging && dragging == id) return true;

        return false;
      }
    } );

    this.subnet.net = (id) => this.nets.find( (net) => net.subnetId == id );

    this.arc.netId = (id) => {
      const arc = this.arc.get(id),
        socket = this.socket.get(arc.startSocketId),
        node = this[socket.nodeType].get(socket.nodeId);
      return node.netId;
    };

    this.arcs = (ids = null) => {
      if (!state.current.net) return [];

      let entities = state.db.arcs.filter(
        (entity) => this.arc.netId(entity.id) == state.current.net.id
      );

      if (ids) {
        entities = entities.filter( (entity) => ids.has(entity.id) );
      }

      return entities;
    };

    this.group.empty = (id) => {
      let empty = true,
        group = this.group.get(id);

      NodeNames.forEach( (entityName) => {
        empty = empty && !group[entityName + 'Ids'].length;
      } );

      return empty;
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

    this.nodeBySocketId = (socketId) => {
      const socket = state.db.sockets.valueById(socketId);
      return state.db[ s(socket.nodeType) ].valueById(socket.nodeId);
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
