import {EntityNames, NodeNames, NodeGroupNames, StatusNames, SideNames} from './Entities.js';
import Store from './Store.js';

export default class Query {

  constructor(state) {
    Query.instance = this;
    this.state = state;

    const query = this,
      s = (name) => name + 's';

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
      const defaultCondition = (entity) => (
        entity.netId == state.current.net.id &&
        (entityName == 'group' || !this[entityName].minimized(entity.id))
      );

      this[ s(entityName) ] = listFunc( entityName,
        (entity) => defaultCondition(entity)
      );

      this[ s(entityName) + 'NotActive' ] = listFunc( entityName,
        (entity) => defaultCondition(entity)
          && !this[entityName].isActive(entity.id)
      );
    } );

    NodeNames.forEach( (nodeName) => {
      this[nodeName].sockets = (id, type = null) => {
        let sockets = this.sockets( this[nodeName] .get(id) .socketIds );
        if (type === null) return sockets;
        return sockets.filter( (socket) => socket.type == type );
      }

      this[nodeName].arcs = (nid, type = null) => {
        const socketIds = this[nodeName].get(nid).socketIds;
        let condition;

        if (type == 1) {
          condition = (arc) => socketIds.has(arc.startSocketId);
        } else if(type == 0) {
          condition = (arc) => socketIds.has(arc.finishSocketId);
        } else {
          condition = (arc) => socketIds.has(arc.startSocketId)
            || socketIds.has(arc.startSocketId);
        }

        return this.arcs().filter(condition);
      }
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

    this.arc.drawingOffset = (mouseOffset) => this.viewport.zoom.offset({
      x: mouseOffset.x - state.drawing.arc.startOffset.x,
      y: mouseOffset.y - state.drawing.arc.startOffset.y
    });

    this.arc.drawing = () => state.drawing.arc.data;

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

    this.group.minimizedList = () => this.groups().filter( (group) => group.minimized );

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

    this.socket.node = (sid) => {
      const socket = state.db.sockets.valueById(sid);

      if (socket) {
        return state.db[ s(socket.nodeType) ].valueById(socket.nodeId);
      }

      return undefined;
    };

    this.socket.side = (id) => this.socketsBySide[id];

    this.socket.location = (sid) => {
      const socket = this.socket.get(sid),
        node = this.socket.node(sid),
        group = this[socket.nodeType].minimized(node.id);

      if (group) {
        return {
          data: group,
          type: 'group'
        };
      }

      return {
        data: node,
        type: socket.nodeType
      };
    };

    this.socket.locationOffset = (sid) => {
      const {data, type} = this.socket.location(sid);

      if (type == 'group') {
        return this.group.size(data.id);
      }

      const {x, y, width, height} = data;
      return {x, y, width, height};
    };

    this.socketsBySideStruct = () => {
      const typeNames = {
          income: 'left',
          outcome: 'right'
        },
        socketSides = {},
        socketArcLength = {},
        MAX_LENGTH = 10000000,

        addSocketSide = (sid) => {
          const socket = this.socket.get(sid);
          socketSides[socket.id] = typeNames[ socket.typeName ];
          socketArcLength[socket.id] = MAX_LENGTH;
        };

      NodeNames.forEach((nodeName) => {
        this[ s(nodeName) ]() . forEach(
          (node) => node.socketIds.forEach(
            (sid) => addSocketSide(sid)
          )
        );
      });

      this.group.minimizedList().forEach(
        (group) => this.group.externalSocketIds(group.id).forEach(
          (sid) => addSocketSide(sid)
        )
      );

      const calcRectCenter = (r) => ({
          x: r.x + r.width/2,
          y: r.y + r.height/2
        }),
        distance = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

      this.arcs().forEach( (arc) => {
        const
          start = this.socket.locationOffset(arc.startSocketId),
          finish = this.socket.locationOffset(arc.finishSocketId),
          {x:x1, y:y1} = calcRectCenter(start),
          {x:x2, y:y2} = calcRectCenter(finish);

        let avg = {};
        ['width', 'height'].forEach( (dim) => {
          avg[dim] = (start[dim] + finish[dim]) / 2;
        } );

        const
          hOrV = Math.abs(y2 - y1 ) + avg.width/2 > Math.abs(x2 - x1) + avg.height/2,
          dist = distance(start, finish);

        if (dist < socketArcLength[ arc.startSocketId ]) {
          socketArcLength[ arc.startSocketId ] = dist;

          if ( hOrV ) {
            socketSides[ arc.startSocketId ] = y1 > y2 ? 'top' : 'bottom';
          } else {
            socketSides[ arc.startSocketId ] = x1 > x2 ? 'left' : 'right';
          }
        }

        if (dist < socketArcLength[ arc.finishSocketId ]) {
          socketArcLength[ arc.finishSocketId ] = dist;

          if ( hOrV ) {
            socketSides[ arc.finishSocketId ] = y1 > y2 ? 'bottom' : 'top';
          } else {
            socketSides[ arc.finishSocketId ] = x1 > x2 ? 'right' : 'left';
          }
        }
      } );

      return socketSides;
    };

    this.socket.offset = (id) => {
      const side = this.socketsBySide[id],
        location = this.socket.location(id),
        socketIds = location.type == 'group'
          ? this.group.externalSocketIds(location.data.id)
          : this.socket.node(id).socketIds,
        sideSockets = socketIds.filter( (sid) => this.socketsBySide[sid] == side ),
        {x, y, width, height} = this.socket.locationOffset(id),
        position = sideSockets.indexOf(id),
        count = sideSockets.length;
      let step = 0;

      switch (side) {
        case 'top':
          step = width / (count + 1);
          return {
            x: x + step * (position + 1),
            y
          };
        case 'right':
          step = height / (count + 1);
          return {
            x: x + width,
            y: y + step * (position + 1)
          };
        case 'bottom':
          step = width / (count + 1);
          return {
            x: x + step * (position + 1),
            y: y + height
          };
        case 'left':
          step = height / (count + 1);
          return {
            x: x,
            y: y + step * (position + 1)
          };
      }
      return null;
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
        let entities = state.db[s(entityName)];

        if (gid) {
          const ids = this.group.get(gid)[entityName+'Ids'];
          entities = entities.filter( (entity) => ids.has(entity.id) );
        }

        entities.forEach( (entity) => {
          min.x = Math.min( min.x, entity.x );
          min.y = Math.min( min.y, entity.y );
          max.x = Math.max( max.x, entity.x + entity.width );
          max.y = Math.max( max.y, entity.y + entity.height );
        } );
      } );

      return {min, max};
    };

    NodeNames.forEach( (nodeName) => {
      this[nodeName].select = () => state.select.types[nodeName];
    } );

    this.selectNodeTypes = () => (
      NodeNames.filter( (nodeName) => this[nodeName].select() )
    );

    this.arrangement = {

      startNode: function () {
        let startNode = null,
          minIncomeArcs = {
            node: null,
            count: 10000000
          },
          freeNodes = query.freeNodes();

        NodeNames.forEach( (nodeName) => {
          if (!startNode) {
            freeNodes[s(nodeName)].forEach( (node) => {
              if (!startNode) {
                const
                  incomeArcs = query[nodeName].arcs(node.id, 0),
                  outcomeArcs = query[nodeName].arcs(node.id, 1);
                if (incomeArcs.length == 0 && outcomeArcs.length > 0) {
                  startNode = node;
                } else if (incomeArcs.length < minIncomeArcs.count
                  && outcomeArcs.length > 0
                ) {
                  minIncomeArcs.node = node;
                  minIncomeArcs.count = incomeArcs.length;
                }
              }
            } );
          }
        } );

        if (startNode) return startNode;
        if (minIncomeArcs.node) return minIncomeArcs.node;
        return null;
      },

      algorithms: {
        default: {
          init: () => {
            this.init = {
              x: 50,
              y: 50
            };
            this.current = {
              x: 50,
              y: 50
            };
            this.step = {
              x: 150,
              y: 120
            };
          },

          position: (nodes) => {
            const methods = Store.instance;
            let {x:dx, y:dy} = this.step;
            nodes.forEach( (node, key) => {
              const group = query [node.entityName()] .minimized(node.id);

              if (group) {
                const {x, y, width: w, height: h} = query.group.size(group.id);
                NodeNames.forEach( (nodeName) => {
                  group [nodeName + 'Ids'] .forEach((nid) => {
                    const node = query[nodeName].get(nid);
                    methods[nodeName].set(nid, {
                      x: node.x + this.current.x - x,
                      y: node.y + this.current.y - y
                    });
                  });
                } );

              } else {
                methods [node.entityName()] .set( node.id, {
                  x: this.current.x,
                  y: this.current.y
                } );
              }

              this.current.y += dy;
            } );
            this.current.x += dx;
            this.current.y = this.init.y;
          }
        }
      },

      set: function (algorithm = 'default') {
        if (algorithm in this.algorithms) {
          const startNode = this.startNode();

          if (startNode) {
            const minimizedGroups = state.db.groups.filter(
              (group) => group.netId == state.current.net.id && group.minimized
            );
            let nodes = [startNode],
              allNodes = [];

            NodeNames.forEach( (nodeName) => {
              allNodes = allNodes.concat(
                state.db[ s(nodeName) ].filter(
                  (node) => node.netId == state.current.net.id
                )
              );
            } );

            this.algorithms[algorithm].init();

            while (nodes.length > 0) {
              nodes.forEach( (node) => {
                const group = query [node.entityName()] .minimized(node.id);

                if (group) {
                  NodeNames.forEach( (nodeName) => {
                    group [nodeName + 'Ids'] .forEach((nid) => {
                      allNodes.removeById(nid);
                    });
                  } );
                } else {
                  allNodes.removeById(node.id);
                }
              } );

              this.algorithms[algorithm].position(nodes);

              let newNodes = [];
              nodes.forEach( (node) => {
                const group = query [node.entityName()] .minimized(node.id),
                  socketIds = group ? query.group.externalSocketIds(group.id) : node.socketIds;

                newNodes = newNodes.concat(
                  query.arcs().filter(
                    (arc) => socketIds.has(arc.startSocketId)
                  ).map(
                    (arc) => query.socket.node(arc.finishSocketId)
                  ).filter(
                    (node) => allNodes.valueById(node.id)
                  )
                );
              } );
              nodes = newNodes.unique();
            }

            this.algorithms[algorithm].position(allNodes);
          }
        }
      }

    };

    this.viewport = {
      zoom: {
        get: () => state.viewport.zoom,
        offset: (diff) => ({
          x: diff.x / state.viewport.zoom,
          y: diff.y / state.viewport.zoom
        })
      },

      translateX: () => state.viewport.translateX,
      translateY: () => state.viewport.translateY
    };

    this.socketsBySide = null;
    this.updateSocketsBySide = () => {
      this.socketsBySide = this.socketsBySideStruct();
    };

  }
}
