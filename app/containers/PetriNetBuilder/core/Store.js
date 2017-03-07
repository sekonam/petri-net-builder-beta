import _ from 'lodash';

import {
  EntityFactory,
  EntityNames,
  NodeNames,
  NodeGroupNames,
} from './Entities';

import {
  indexById,
  valueById,
  spliceRecurcive,
} from '../core/helpers';

import StorageEngine from './StorageEngine';
import EngineModel from '../models/EngineModel';
import ViewportModel from '../models/ViewportModel';

export default function Store(setState) {
  Store.instance = this;

  const s = (entityName) => `${entityName}s`;

  const handlerFactory = {

    add: (entityName, callback = null) => (params = null) => (state) => {
      if (entityName === 'net' || state.current.net) {
        const entity = EntityFactory[entityName]();
        state.db[s(entityName)].push(entity);

        if (params) {
          entity.set(params);
        }

        if (callback) {
          callback.call(null, state, entity);
        }
      }

      return state;
    },

    set: (entityName) => (id, params) => (state) => {
      valueById(
        state.db[s(entityName)],
        id
      ).set(params);
      return state;
    },

    remove: (entityName, callback = null) => (id) => (state) => {
      const data = state.db[s(entityName)];
      const key = indexById(data, id);

      if (key > -1) {
        [
          'form',
          'active',
        ].forEach((satatusName) => {
          if (state[satatusName].data && id === state[satatusName].data.id) {
            state[satatusName].data = null;
            state[satatusName].type = null;
          }
        });

        if (callback) {
          callback.call(null, state, id);
        }

        data.splice(key, 1);
      }

      return state;
    },

    status: (entityName) => (satatusName, id) => (state) => {
      state[satatusName].data = valueById(
        state.db[s(entityName)],
        id
      );
      state[satatusName].type = entityName;
      return state;
    },

    edit: (entityName) => (id) => handlerFactory.status(entityName)('form', id),

  };

  const methods = {};

  EntityNames.forEach((entityName) => {
    methods[entityName] = {};

    Object.keys(handlerFactory).forEach((methodName) => {
      methods[entityName][methodName] = handlerFactory[methodName](entityName);
    });
  });

  NodeNames.forEach((entityName) => {
    methods[entityName].add = handlerFactory.add(entityName, (state, entity) => {
      entity.netId = state.current.net.id;

      for (let i = 0; i < 2; i += 1) {
        methods.socket.add({
          type: i,
          nodeType: entityName,
          nodeId: entity.id,
        })(state);
      }

      if (entityName === 'subnet') {
        methods.net.add({
          name: entity.name,
          subnetId: entity.id,
        })(state);

        const subnetNet = state.db.nets.find((net) => net.subnetId === entity.id);
        if (subnetNet) {
          methods.place.add({ type: 1 })(state);
          state.db.places[state.db.places.length - 1].netId = subnetNet.id;

          methods.place.add({ type: 2, x: 400 })(state);
          state.db.places[state.db.places.length - 1].netId = subnetNet.id;
        }
      }
    });
  });

  methods.socket.add = handlerFactory.add(
    'socket',
    (state, socket) => {
      valueById(
        state.db[s(socket.nodeType)],
        socket.nodeId
      ).socketIds
        .push(socket.id);
    });

  methods.socket.addForm = (params) => methods.socket.add(
    Object.assign({
      nodeType: this.state.form.type,
      nodeId: this.state.form.data.id,
    }, params)
  );

  methods.net.add = handlerFactory.add('net', (state, net) => {
    if (!net.subnetId) {
      state.current.net = net;
    }
  });

  methods.group.add = handlerFactory.add('group', (state, group) => {
    group.netId = state.current.net.id;
    group.name = `${group.type ? 'Milestone' : 'Phase'} name`;
  });

  NodeNames.forEach((entityName) => {
    methods[entityName].remove = handlerFactory.remove(entityName, (state, id) => {
      const socketIds = valueById(
        state.db[s(entityName)],
        id
      ).socketIds;

      socketIds.forEach((sid) => methods.socket.remove(sid)(state));

      socketIds.forEach((sid) => {
        spliceRecurcive(
          state.db.arcs,
          (arc) => (arc.startSocketId === sid || arc.finishSocketId === sid)
        );
      });


      state.db.groups.forEach((group) => {
        const key = group[`${entityName}Ids`].indexOf(id);

        if (key > -1) {
          group[`${entityName}Ids`].splice(key, 1);
        }
      });

      if (entityName === 'subnet') {
        methods.net.remove(
          state.db.nets.find(
            (net) => net.subnetId === id
          ).id
        )(state);
      }
    });
  });

  methods.event.remove = handlerFactory.remove('event', (state, eid) => {
    state.db.handlers.forEach((handler) => {
      const eventKey = handler.events.indexOf(eid);

      if (eventKey > -1) {
        handler.events.splice(eventKey, 1);
      }
    });
  });

  methods.socket.remove = handlerFactory.remove('socket', (state, sid) => {
    const socket = valueById(
      state.db.sockets,
      sid
    );
    const node = valueById(
      state.db[s(socket.nodeType)],
      socket.nodeId
    );
    node.socketIds.splice(
      node.socketIds.indexOf(sid),
      1
    );

    spliceRecurcive(
      state.db.arcs,
      (arc) => (arc.startSocketId === sid || arc.finishSocketId === sid)
    );
  });

  methods.net.remove = handlerFactory.remove('net', (state, nid) => {
    NodeGroupNames.forEach((entityName) => {
      state.db[s(entityName)]
        .filter((entity) => entity.netId === nid)
        .forEach((entity) => {
          methods[entityName].remove(entity.id)(state);
        });
    });
  });

  methods.subnet.enter = (id) => (state) => methods.net.current(
    state.db.nets.find((net) => net.subnetId === id).id
  )(state);

  NodeGroupNames.forEach((entityName) => {
    methods[entityName].active = (id) => (state) => {
      methods[entityName].status('active', id)(state);
      methods[entityName].status('form', id)(state);
      return state;
    };

    methods[entityName].dragging = (id) => (state) => {
      state.dragging[entityName] = id;
      return state;
    };
  });

  methods.net.current = (id) => (state) => {
    state.current.net = valueById(
      state.db.nets,
      id
    );
    return state;
  };

  methods.arc.startDraw = (sid) => (state) => {
    const socket = valueById(
      state.db.sockets,
      sid
    );
    if (socket.type) {
      const tmpArc = EntityFactory.arc();
      tmpArc.startSocketId = socket.id;
      state.drawing.arc.data = tmpArc;
    }

    return state;
  };

  methods.arc.finishDraw = (sid) => (state) => {
    const socket = valueById(
      state.db.sockets,
      sid
    );
    const startNodeType = valueById(
      state.db.sockets,
      state.drawing.arc.data.startSocketId
    ).nodeType;
    let acceptableFinishNodeTypes = [];

    if (startNodeType === 'transition' || startNodeType === 'subnet') {
      acceptableFinishNodeTypes = [
        'place',
        'external',
      ];
    } else if (startNodeType === 'place' || startNodeType === 'external') {
      acceptableFinishNodeTypes = [
        'transition',
        'subnet',
      ];
    }

    if (!socket.type
      && acceptableFinishNodeTypes.indexOf(socket.nodeType) > -1
      && state.drawing.arc.data
    ) {
      const tmpArc = EntityFactory.arc(state.drawing.arc.data);
      tmpArc.finishSocketId = socket.id;
      state.db.arcs.push(tmpArc);
      state.drawing.arc.data = null;
    } else {
      methods.arc.escapeDraw()(state);
    }

    return state;
  };

  methods.arc.escapeDraw = () => (state) => {
    if (state.drawing.arc.data) {
      state.drawing.arc.data = null;
    }

    return state;
  };

  methods.zoom = {

    change: (shift) => (state) => {
      state.viewport.zoom += state.viewport.zoom + shift > 0.1 ? shift : 0;
      return state;
    },

    set: (zoom) => (state) => {
      state.viewport.zoom = zoom;
      return state;
    },

    setCenter: (offset) => (state) => {
      state.viewport.center.x = offset.x;
      state.viewport.center.y = offset.y;
      return state;
    },

  };

  methods.translate = {
    set: (translateX, translateY) => (state) => {
      state.viewport.translateX = translateX;
      state.viewport.translateY = translateY;
      return state;
    },
  };

  NodeNames.forEach((nodeName) => {
    methods[nodeName].setSelect = (value) => (state) => {
      state.select.types[nodeName] = value;
      return state;
    };

    methods[nodeName].select = (ids) => (state) => {
      state.select.data[nodeName] = ids;
      return state;
    };
  });

  methods.settings = {
    setNodeType: (nodeType) => (state) => {
      state.settings.nodeType = nodeType;
      return state;
    },
  };

  EntityNames.concat([
    'zoom',
    'translate',
    'settings',
  ]).forEach((entityName) => {
    this[entityName] = {};

    Object.getOwnPropertyNames(methods[entityName]).forEach((methodName) => {
      this[entityName][methodName] = (...params) => setState(
        methods[entityName][methodName](...params)
      );
    });
  });

  this.save = (key, value) => setState((state) => {
    if (state.form.data) {
      state.form.data.set({ [key]: value });
    }
    return state;
  });

  this.storage = {
    init: (dbParams = null) => {
      const state = {
        db: new EngineModel(dbParams),
        viewport: new ViewportModel(),
        active: {
          data: null,
          type: null,
        },
        form: {
          data: null,
          type: null,
        },
        current: {
          net: null,
        },
        drawing: {
          arc: {
            data: null,
          },
        },
        dragging: {},
        select: {
          types: {},
          data: {},
        },
        settings: {
          nodeType: 'default',
        },
      };

      NodeGroupNames.forEach((key) => {
        state.dragging[key] = null;
      });

      NodeNames.forEach((nodeName) => {
        state.select.types[nodeName] = false;
        state.select.data[nodeName] = [];
      });

      if (!_.isEmpty(state.db.nets)) {
        methods.net.current(state.db.nets[0].id)(state);
      }

      return state;
    },

    clear: () => setState((state) => {
      methods.place.active(null)(state);
      methods.place.edit(null)(state);
      state.current.net = null;
      methods.arc.escapeDraw()(state);
      NodeGroupNames.forEach((key) => {
        state.dragging[key] = null;
      });
      NodeNames.forEach((nodeName) => {
        state.select.types[nodeName] = false;
        state.select.data[nodeName] = [];
      });
      methods.zoom.set(1)(state);
      methods.translate.set(0, 0)(state);
      [
        'net',
        'event',
        'handler',
      ].forEach((entityName) => {
        while (!_.isEmpty(state.db[s(entityName)])) {
          const eid = state.db[s(entityName)][0].id;
          methods[entityName].remove(eid)(state);
        }
      });
      return state;
    }),
  };

  this.state = this.storage.init(StorageEngine.loadFromStorage('db'));
}
