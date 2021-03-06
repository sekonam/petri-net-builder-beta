import {
  valueById,
  removeById,
  unique,
} from '../core/helpers';

import {
  EntityNames,
  NodeNames,
  NodeGroupNames,
  StatusNames,
  ExternalNodeNames,
} from './Entities';

import Store from './Store';

export default class Query {

  constructor(state) {
    Query.instance = this;
    this.state = state;

    const query = this;
    const s = (name) => `${name}s`;

    StatusNames.forEach((statusName) => {
      this[statusName] = state[statusName];
      this[statusName].isSet = () => state[statusName].data
        && state[statusName].data.netId === state.current.net.id;
    });

    const queryFactory = {

      get: (entityName) => state.db.get(entityName),

      options: (entityName, paramName = 'name') => () => this[s(entityName)]().map((item) => ({
        value: item.id,
        label: item[paramName],
      })),

      selectedOptions: (entityName, paramName = 'name') => (selectedIds) => selectedIds.map((id) => ({
        value: id,
        label: valueById(
          state.db[s(entityName)],
          id
        )[paramName],
      })),

    };

    EntityNames.forEach((entityName) => {
      this[s(entityName)] = state.db.getAll(entityName);

      this[entityName] = {};

      Object.keys(queryFactory).forEach((methodName) => {
        this[entityName][methodName] = queryFactory[methodName](entityName);
      });
    });

    NodeGroupNames.forEach((entityName) => {
      this[entityName].isActive = (id) => {
        if (this.active.isSet() && this.active.data.id === id) return true;
        return false;
      };
    });

    const listFunc = (entityName, condition) => (ids = null, exceptIds = null) => {
      if (!state.current.net) return [];

      let entities = state.db[s(entityName)].filter(condition);

      if (ids) {
        entities = entities.filter((entity) => ids.indexOf(entity.id) > -1);
      }

      if (exceptIds) {
        entities = entities.filter((entity) => exceptIds.indexOf(entity.id) === -1);
      }

      return entities;
    };

    NodeGroupNames.forEach((entityName) => {
      const defaultCondition = (entity) => (
        entity.netId === state.current.net.id &&
        (entityName === 'group' || !this[entityName].minimized(entity.id))
      );

      this[s(entityName)] = listFunc(entityName,
        (entity) => defaultCondition(entity)
      );

      this[`${s(entityName)}NotActive`] = listFunc(entityName,
        (entity) => defaultCondition(entity)
          && !this[entityName].isActive(entity.id)
      );

      this[entityName].inNet = (nid, ids = null, exceptIds = null) => listFunc(
        entityName,
        (entity) => entity.netId === nid
      )(ids, exceptIds);
    });

    NodeNames.forEach((nodeName) => {
      this[nodeName].sockets = (id, type = null) => {
        const sockets = this.sockets(this[nodeName].get(id).socketIds);
        if (type === null) return sockets;
        return sockets.filter((socket) => socket.type === type);
      };

      this[nodeName].arcs = (nid, type = null) => {
        const socketIds = this[nodeName].get(nid).socketIds;
        let condition;

        if (type === 1) {
          condition = (arc) => socketIds.indexOf(arc.startSocketId) > -1;
        } else if (type === 0) {
          condition = (arc) => socketIds.indexOf(arc.finishSocketId) > -1;
        } else {
          condition = (arc) => socketIds.indexOf(arc.startSocketId) > -1
            || socketIds.indexOf(arc.startSocketId) > -1;
        }

        return this.arcs().filter(condition);
      };
    });

    this.arc.netId = (id) => {
      const arc = this.arc.get(id);
      const socket = this.socket.get(arc.startSocketId);
      const node = this[socket.nodeType].get(socket.nodeId);
      return node.netId;
    };

    this.arcs = (ids = null) => {
      if (!state.current.net) return [];

      const minimizedGroups = this.groups().filter((group) => group.minimized);
      let internalArcIds = [];
      minimizedGroups.forEach((group) => {
        internalArcIds = internalArcIds.concat(
          this.group.internalArcs(group.id).map((arc) => arc.id)
        );
      });

      let entities = state.db.arcs.filter(
        (entity) => this.arc.netId(entity.id) === state.current.net.id
          && internalArcIds.indexOf(entity.id) === -1
      );

      if (ids) {
        entities = entities.filter((entity) => ids.indexOf(entity.id) > -1);
      }

      return entities;
    };

    this.external.node = (eid) => {
      const external = this.external.get(eid);

      if (external.nodeId && external.nodeType) {
        return this[external.nodeType].get(external.nodeId);
      }

      return undefined;
    };

    this.external.nodeOptions = (nid) => {
      let nodeOptions = [{
        value: null,
        label: 'None',
      }];

      if (nid) {
        ExternalNodeNames.forEach((nodeName) => {
          const nodes = this[nodeName].inNet(nid);
          nodeOptions = nodeOptions.concat(nodes.map(
            (node) => ({
              value: node.id,
              type: nodeName,
              label: node.name,
            })
          ));
        });
      }

      return nodeOptions;
    };

    this.external.netOptions = () => [{
      value: null,
      label: 'None',
    }].concat(
        this.nets().filter(
          (net) => !state.current.net || net.id !== state.current.net.id
        ).map(
          (net) => ({
            value: net.id,
            label: net.name,
          })
        )
      );


    this.arc.drawing = () => state.drawing.arc.data;

    this.group.nodes = (id) => {
      const nodes = [];
      const group = this.group.get(id);
      NodeNames.forEach((nodeName) => {
        group[`${nodeName}Ids`].forEach((nid) => {
          nodes.push(this[nodeName].get(nid));
        });
      });
      return nodes;
    };

    this.group.socketIds = (id) => {
      let socketIds = [];
      this.group.nodes(id).forEach((node) => {
        socketIds = socketIds.concat(node.socketIds);
      });
      return unique(socketIds);
    };

    this.group.arcs = (id, condition) => (
      state.db.arcs.filter((arc) => (
        condition(arc, this.group.socketIds(id))
      ))
    );

    this.group.externalArcs = (id) => this.group.arcs(id,
      (arc, socketIds) => {
        const isHere = {
          start: socketIds.indexOf(arc.startSocketId) > -1,
          finish: socketIds.indexOf(arc.finishSocketId) > -1,
        };
        return isHere.start !== isHere.finish;
      }
    );

    this.group.internalArcs = (id) => this.group.arcs(id,
      (arc, socketIds) => socketIds.indexOf(arc.startSocketId) > -1
        && socketIds.indexOf(arc.finishSocketId) > -1
    );

    this.group.externalSocketIds = (id) => {
      const socketIds = this.group.socketIds(id);
      const externalArcs = this.group.externalArcs(id);
      const externalSocketIds = [];

      externalArcs.forEach((arc) => {
        if (socketIds.indexOf(arc.startSocketId) > -1) {
          externalSocketIds.push(arc.startSocketId);
        }
        if (socketIds.indexOf(arc.finishSocketId) > -1) {
          externalSocketIds.push(arc.finishSocketId);
        }
      });

      return unique(externalSocketIds);
    };

    this.group.empty = (id) => {
      let empty = true;
      const group = this.group.get(id);

      NodeNames.forEach((entityName) => {
        empty = empty && !group[`${entityName}Ids`].length;
      });

      return empty;
    };

    this.group.size = (id) => {
      const group = this.group.get(id);
      const { min, max } = this.minmax(id);
      const INDENT = 10;
      const HEADER = 20;

      return {
        x: min.x - INDENT,
        y: min.y - INDENT - HEADER,
        width: group.minimized ? group.width : max.x - min.x + (2 * INDENT),
        height: group.minimized ? group.height : max.y - min.y + (2 * INDENT) + HEADER,
      };
    };

    this.group.minimizedList = () => this.groups().filter((group) => group.minimized);

    NodeNames.forEach((nodeName) => {
      this[nodeName].minimized = (id) => (
        this.groups().find(
          (group) => group.minimized && group[`${nodeName}Ids`].indexOf(id) > -1
        )
      );
    });

    this.subnet.net = (id) => this.nets.find((net) => net.subnetId === id);

    this.net.current = () => state.current.net ? state.current.net.id : null;

    this.groupsEntityIds = () => {
      let ids = [];

      NodeNames.forEach((nodeName) => {
        this.groups().forEach((group) => {
          ids = ids.concat(group[`${nodeName}Ids`]);
        });
      });

      return ids;
    };

    this.freeNodes = () => {
      const groups = this.groups();
      const entities = {};
      const ids = {};

      NodeNames.forEach((entityName) => {
        ids[entityName] = [];

        groups.forEach((group) => {
          ids[entityName] = ids[entityName].concat(group[`${entityName}Ids`]);
        });
      });

      NodeNames.forEach((entityName) => {
        entities[s(entityName)] = this[s(entityName)]().filter(
          (entity) => ids[entityName].indexOf(entity.id) === -1
        );
      });

      return entities;
    };

    this.socket.node = (sid) => {
      const socket = valueById(state.db.sockets, sid);

      if (socket) {
        return valueById(
          state.db[s(socket.nodeType)],
          socket.nodeId
        );
      }

      return undefined;
    };

    this.socket.side = (id) => this.socketsBySide[id];

    this.socket.location = (sid) => {
      const socket = this.socket.get(sid);
      const node = this.socket.node(sid);
      const group = this[socket.nodeType].minimized(node.id);

      if (group) {
        return {
          data: group,
          type: 'group',
        };
      }

      return {
        data: node,
        type: socket.nodeType,
      };
    };

    this.socket.locationOffset = (sid) => {
      const { data, type } = this.socket.location(sid);

      if (type === 'group') {
        return this.group.size(data.id);
      }

      const { x, y, width, height } = data;
      return { x, y, width, height };
    };

    this.socketsBySideStruct = () => {
      const typeNames = {
        income: 'left',
        outcome: 'right',
      };
      const socketSides = {};
      const socketArcLength = {};
      const MAX_LENGTH = 10000000;

      const addSocketSide = (sid) => {
        const socket = this.socket.get(sid);
        socketSides[socket.id] = typeNames[socket.typeName];
        socketArcLength[socket.id] = MAX_LENGTH;
      };

      NodeNames.forEach((nodeName) => {
        this[s(nodeName)]().forEach(
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
        x: r.x + (r.width / 2),
        y: r.y + (r.height / 2),
      });
      const distance = (p1, p2) => Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));

      this.arcs().forEach((arc) => {
        const start = this.socket.locationOffset(arc.startSocketId);
        const finish = this.socket.locationOffset(arc.finishSocketId);
        const { x: x1, y: y1 } = calcRectCenter(start);
        const { x: x2, y: y2 } = calcRectCenter(finish);
        const avg = {};

        ['width', 'height'].forEach((dim) => {
          avg[dim] = (start[dim] + finish[dim]) / 2;
        });

        const hOrV = Math.abs(y2 - y1) + (avg.width / 2) > Math.abs(x2 - x1) + (avg.height / 2);
        const dist = distance(start, finish);

        if (dist < socketArcLength[arc.startSocketId]) {
          socketArcLength[arc.startSocketId] = dist;

          if (hOrV) {
            socketSides[arc.startSocketId] = y1 > y2 ? 'top' : 'bottom';
          } else {
            socketSides[arc.startSocketId] = x1 > x2 ? 'left' : 'right';
          }
        }

        if (dist < socketArcLength[arc.finishSocketId]) {
          socketArcLength[arc.finishSocketId] = dist;

          if (hOrV) {
            socketSides[arc.finishSocketId] = y1 > y2 ? 'bottom' : 'top';
          } else {
            socketSides[arc.finishSocketId] = x1 > x2 ? 'right' : 'left';
          }
        }
      });

      return socketSides;
    };

    this.socket.offset = (id) => {
      const node = this.socket.node(id);
      const side = this.socketsBySide[id];
      const location = this.socket.location(id);
      const socketIds = location.type === 'group'
        ? this.group.externalSocketIds(location.data.id)
        : node.socketIds;
      const sideSockets = socketIds.filter((sid) => this.socketsBySide[sid] === side);
      const position = sideSockets.indexOf(id);
      const count = sideSockets.length;

      const { x, y } = this.socket.locationOffset(id);
      let { width, height } = this.socket.locationOffset(id);
      let step = 0;

      if (NodeNames.indexOf(location.type) > -1 && this.settings.nodeType() === 'schema') {
        const nodeSize = node.getSize();
        width = nodeSize.width;
        height = nodeSize.height;
      }

      switch (side) {
        case 'top':
          step = width / (count + 1);
          return {
            x: x + (step * (position + 1)),
            y,
          };
        case 'right':
          step = height / (count + 1);
          return {
            x: x + width,
            y: y + (step * (position + 1)),
          };
        case 'bottom':
          step = width / (count + 1);
          return {
            x: x + (step * (position + 1)),
            y: y + height,
          };
        case 'left':
          step = height / (count + 1);
          return {
            x,
            y: y + (step * (position + 1)),
          };
        default:
          return null;
      }
    };

    this.minmax = (gid = null) => {
      const BIG_INT = 1000000;

      const max = {
        x: -BIG_INT,
        y: -BIG_INT,
      };
      const min = {
        x: BIG_INT,
        y: BIG_INT,
      };

      NodeNames.forEach((entityName) => {
        let entities = this[s(entityName)]();

        if (gid) {
          const ids = this.group.get(gid)[`${entityName}Ids`];
          entities = state.db[s(entityName)].filter(
            (node) => node.netId === state.current.net.id
              && ids.indexOf(node.id) > -1
          );
        }

        entities.forEach((entity) => {
          min.x = Math.min(min.x, entity.x);
          min.y = Math.min(min.y, entity.y);
          max.x = Math.max(max.x, entity.x + entity.width);
          max.y = Math.max(max.y, entity.y + entity.height);
        });
      });

      return { min, max };
    };

    this.avg = (gid = null) => {
      const { min, max } = this.minmax(gid);
      return {
        x: (min.x + max.x) / 2,
        y: (min.y + max.y) / 2,
      };
    };

    NodeNames.forEach((nodeName) => {
      this[nodeName].isSelecting = () => state.select.types[nodeName];

      this[nodeName].inRectIds = (startOffset, finishOffset) => {
        const startOffset0 = this.viewport.offset(startOffset);
        const finishOffset0 = this.viewport.offset(finishOffset);
        const selectionOffsets = {
          min: {
            x: Math.min(startOffset0.x, finishOffset0.x),
            y: Math.min(startOffset0.y, finishOffset0.y),
          },
          max: {
            x: Math.max(startOffset0.x, finishOffset0.x),
            y: Math.max(startOffset0.y, finishOffset0.y),
          },
        };

        return this[s(nodeName)]().filter(
          (node) => {
            const nodeOffsets = {
              min: {
                x: node.x,
                y: node.y,
              },
              max: {
                x: node.x + node.width,
                y: node.y + node.height,
              },
            };

            let inRange = true;
            ['x', 'y'].forEach((dim) => {
              inRange = inRange &&
                selectionOffsets.max[dim] >= nodeOffsets.min[dim] &&
                nodeOffsets.max[dim] >= selectionOffsets.min[dim];
            });

            return inRange;
          }
        ).map(
          (node) => node.id
        );
      };

      this[nodeName].selected = () => state.select.data[nodeName];

      this[nodeName].isSelected = (id) => {
        const data = state.select.data[nodeName];

        if (data) {
          return data.indexOf(id) > -1;
        }

        return false;
      };
    });

    this.selectNodeTypes = () => (
      NodeNames.filter((nodeName) => this[nodeName].isSelecting())
    );

    this.isDragging = () => {
      let dragging = false;

      Object.keys(state.dragging).forEach((name) => {
        if (state.dragging[name]) {
          dragging = true;
        }
      });

      return dragging;
    };

    this.arrangement = {

      startNode() {
        let startNode = null;
        const minIncomeArcs = {
          node: null,
          count: 10000000,
        };
        const freeNodes = query.freeNodes();

        NodeNames.forEach((nodeName) => {
          if (!startNode) {
            freeNodes[s(nodeName)].forEach((node) => {
              if (!startNode) {
                const incomeArcs = query[nodeName].arcs(node.id, 0);
                const outcomeArcs = query[nodeName].arcs(node.id, 1);

                if (incomeArcs.length === 0 && outcomeArcs.length > 0) {
                  startNode = node;
                } else if (incomeArcs.length < minIncomeArcs.count
                  && outcomeArcs.length > 0
                ) {
                  minIncomeArcs.node = node;
                  minIncomeArcs.count = incomeArcs.length;
                }
              }
            });
          }
        });

        if (startNode) return startNode;
        if (minIncomeArcs.node) return minIncomeArcs.node;

        for (let i = 0; i < NodeNames.length; i += 1) {
          const nodeName = NodeNames[i];
          const nodes = query[s(nodeName)]();

          if (nodes.length > 0) {
            return nodes[0];
          }
        }

        return null;
      },

      algorithms: {
        default: {
          init: () => {
            this.init = {
              x: 50,
              y: 50,
            };
            this.current = {
              x: 50,
              y: 50,
            };
            this.step = {
              x: 150,
              y: 120,
            };
          },

          position: (nodes) => {
            const methods = Store.instance;
            const { x: dx, y: dy } = this.step;
            nodes.forEach((node) => {
              const group = query[node.entityName()].minimized(node.id);

              if (group) {
                const { x, y } = query.group.size(group.id);
                NodeNames.forEach((nodeName) => {
                  group[`${nodeName}Ids`].forEach((nid) => {
                    const n = query[nodeName].get(nid);
                    methods[nodeName].set(nid, {
                      x: n.x + this.current.x - x,
                      y: n.y + this.current.y - y,
                    });
                  });
                });
              } else {
                methods[node.entityName()].set(node.id, {
                  x: this.current.x,
                  y: this.current.y,
                });
              }

              this.current.y += dy;
            });
            this.current.x += dx;
            this.current.y = this.init.y;
          },
        },
      },

      set(algorithm = 'default') {
        if (algorithm in this.algorithms) {
          const startNode = this.startNode();

          if (startNode) {
            let nodes = [startNode];
            let allNodes = [];

            NodeNames.forEach((nodeName) => {
              allNodes = allNodes.concat(
                state.db[s(nodeName)].filter(
                  (node) => node.netId === state.current.net.id
                )
              );
            });

            const iterateNode = (node) => {
              const group = query[node.entityName()]
                .minimized(node.id);
              const socketIds = group
                ? query.group.externalSocketIds(group.id)
                : node.socketIds;

              return query.arcs().filter(
                (arc) => socketIds.indexOf(arc.startSocketId) > -1
              ).map(
                (arc) => query.socket.node(arc.finishSocketId)
              ).filter(
                (n) => valueById(allNodes, n.id)
              );
            };

            const cleanAllNodes = (node) => {
              const group = query[node.entityName()].minimized(node.id);

              if (group) {
                NodeNames.forEach((nodeName) => {
                  group[`${nodeName}Ids`].forEach((nid) => {
                    removeById(allNodes, nid);
                  });
                });
              } else {
                removeById(allNodes, node.id);
              }
            };

            this.algorithms[algorithm].init();

            while (nodes.length > 0) {
              nodes.forEach(cleanAllNodes);

              this.algorithms[algorithm].position(nodes);

              let newNodes = [];
              nodes.map(iterateNode).forEach((nodesPart) => {
                newNodes = newNodes.concat(nodesPart);
              });

              nodes = unique(newNodes);
            }

            this.algorithms[algorithm].position(allNodes);
          }
        }
      },

    };

    this.viewport = {
      zoom: {
        get: () => state.viewport.zoom,
        offset: (diff) => ({
          x: diff.x / state.viewport.zoom,
          y: diff.y / state.viewport.zoom,
        }),
      },

      translateX: () => state.viewport.translateX,
      translateY: () => state.viewport.translateY,

      offset: (pos) => {
        const center = state.viewport.center;
        return {
          x: ((pos.x - center.x - state.viewport.translateX) / state.viewport.zoom) + center.x,
          y: ((pos.y - center.y - state.viewport.translateY) / state.viewport.zoom) + center.y,
        };
      },
    };

    this.settings = {
      nodeType: () => state.settings.nodeType,
    };

    this.socketsBySide = null;
    this.updateSocketsBySide = () => {
      this.socketsBySide = this.socketsBySideStruct();
    };
  }
}
