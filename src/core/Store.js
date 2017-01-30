import _ from 'lodash';

import {EntityFactory, EntityNames, NodeNames, NodeGroupNames} from './Entities.js';
import StorageEngine from './StorageEngine.js';

import EngineModel from '../models/EngineModel.js';
import ViewportModel from '../models/ViewportModel.js';

export default function Store(setState) {
  Store.instance = this;

  const s = (entityName) => entityName + 's';

  const handlerFactory = {

    add: (entityName, callback = null) => (params = null) => (state) => {
      const entity = EntityFactory[entityName]();

      if (params) {
        entity.set(params);
      }

      state.db[ s(entityName) ].push( entity );

      if (callback) {
        callback.call(null, state, entity);
      }

      return state;
    },

    set: (entityName) => (id, params) => (state) => {
      state.db[ s(entityName) ].valueById(id).set(params);
      return state;
    },

    remove: (entityName, callback = null) => (id) => (state) => {
      const data = state.db[ s(entityName) ],
        key = data.indexById(id);

      if (key > -1) {

        ['form', 'active'].forEach( (satatusName) => {
          if (state[satatusName].data && id == state[satatusName].data.id) {
            state[satatusName].data = null;
            state[satatusName].type = null;
          }
        } );

        if (callback) {
          callback.call(null, state, id);
        }

        data.splice(key, 1);
      }

      return state;
    },

    status: (entityName) => (satatusName, id) => (state) => {
      state[satatusName].data = state.db[ s(entityName) ].valueById(id);
      state[satatusName].type = entityName;
      return state;
    },

    edit: (entityName) => (id) => handlerFactory.status (entityName) ('form', id)

  };

  const methods = {};

  for (let key in EntityNames) {
    const entityName = EntityNames[key];
    methods[entityName] = {};

    for (let methodName in handlerFactory) {
      methods[entityName][methodName] = handlerFactory[methodName](entityName);
    }
  }

  NodeNames.forEach( (entityName) => {
    methods[entityName].add = handlerFactory.add( entityName, (state, entity) => {
      entity.netId = state.current.net.id;

      for (let i=0; i<2; i++) {
        methods.socket.add({
          type: i,
          nodeType: entityName,
          nodeId: entity.id
        })(state);
      }

      if (entityName == 'subnet') {
        methods.net.add({
          name: entity.name,
          subnetId: entity.id
        })(state);
      }
    } );
  } );

  methods.socket.add = handlerFactory.add(
    'socket',
    (state, socket) => {
      state.db[ s(socket.nodeType) ]
        .valueById( socket.nodeId )
        .socketIds
        .push( socket.id );
    });

  methods.socket.addForm = (params) => methods.socket.add(
    Object.assign ({
      nodeType: this.state.form.type,
      nodeId: this.state.form.data.id
    }, params)
  );

  methods.net.add = handlerFactory.add( 'net', (state, net) => {
    if (!net.subnetId) {
      state.current.net = net;
    }
  } );

  methods.group.add = handlerFactory.add( 'group', (state, group) => {
    group.netId = state.current.net.id;
    group.name = (group.type ? 'Milestone' : 'Phase') + ' name';
  } );

  NodeNames.forEach( (entityName) => {
    methods[entityName].remove = handlerFactory.remove(entityName, (state, id) => {
      state.db[ s(entityName) ]
        .valueById(id)
        .socketIds
        .forEach( (sid) => {
          state.db.arcs.spliceRecurcive(
            (arc) => (arc.startSocketId == sid || arc.finishSocketId == sid)
          );
        } );

      state.db.groups.forEach( (group) => {
        const key = group[entityName + 'Ids'].indexOf(id);

        if (key > -1) {
          group[entityName + 'Ids'].splice(key, 1);
        }
      } );

      if (entityName == 'subnet') {
        methods.net.remove(
          state.db.nets.find(
            (net) => net.subnetId == id
          ).id
        );
      }
    } );
  } );

  methods.event.remove = handlerFactory.remove('event', (state, eid) => {
    state.db.handlers.forEach( (handler) => {
      const eventKey = handler.events.indexOf(eid);

      if ( eventKey > -1 ) {
        handler.events.splice(eventKey, 1);
      }
    } );
  } );

  methods.socket.remove = handlerFactory.remove( 'socket', (state, sid) => {
    const socket = state.db.sockets.valueById(sid),
      node = state.db[ s(socket.nodeType) ].valueById(socket.nodeId);
    node.socketIds.splice( node.socketIds.indexOf(sid), 1 );

    state.db.arcs.spliceRecurcive(
      (arc) => (arc.startSocketId == sid || arc.finishSocketId == sid)
    );
  } );

  methods.net.remove = handlerFactory.remove( 'net', (state, nid) => {
    NodeGroupNames.forEach( (entityName) => {
      state.db[ s(entityName) ]
        .filter( (entity) => entity.netId == nid )
        .forEach( (entity) => {
          methods[ entityName ].remove(entity.id);
        } );
    } );
  } );

  methods.subnet.enter = (id) => (state) => methods.net.current(
    state.db.nets.find( (net) => net.subnetId == id ).id
  )(state);

  NodeGroupNames.forEach( (entityName) => {
    methods[entityName].active = (id) => (state) => {
      state = methods[entityName] .status('active', id) (state);
      state = methods[entityName] .status('form', id) (state);
      return state;
    };

    methods[entityName].dragging = (id) => (state) => {
      state.dragging[entityName] = id;
      return state;
    };
  } );

  methods.net.current = (id) => (state) => {
    state.current.net = state.db.nets.valueById(id);
    return state;
  };

  methods.arc.startDraw = (socket) => (state) => {
    if (socket.type) {
      let tmpArc = EntityFactory['arc']();
      tmpArc.startSocketId = socket.id;
      state.drawing.arc = tmpArc;
    }

    return state;
  };

  methods.arc.finishDraw = (socket) => (state) => {
    if ( !socket.type && state.drawing.arc) {
      let tmpArc = EntityFactory['arc']( state.drawing.arc );
      tmpArc.finishSocketId = socket.id;
      state.db.arcs.push(tmpArc);
      state.drawing.arc = null;
    }

    return state;
  };

  methods.arc.escapeDraw = () => (state) => {
    if (state.drawing.arc) {
      state.drawing.arc = null;
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
    }

  };

  methods.translate = {
    set: (translateX, translateY) => (state) => {
      state.viewport.translateX = translateX;
      state.viewport.translateY = translateY;
      return state;
    }
  };

  EntityNames.concat(['zoom', 'translate']).forEach( (entityName) => {
    this[entityName] = {};

    Object.getOwnPropertyNames( methods[entityName] ).forEach( (methodName) => {
      this[entityName][methodName] = (...params) => setState(
        methods[entityName][methodName](...params)
      );
    } );

  } );

  this.save = (key, value) => setState( (state) => {
    if (state.form.data) {
      state.form.data.set({ [ key ]: value });
    }
    return state;
  } );

  this.state = {
    db: new EngineModel( StorageEngine.loadFromStorage( 'db' )),
    viewport: new ViewportModel(),
    active: {
      data: null,
      type: null
    },
    form: {
      data: null,
      type: null
    },
    current: {
      net: null
    },
    drawing: {
      arc: null
    },
    dragging: {}
  };

  NodeGroupNames.forEach( (key) => {
    this.state.dragging[key] = null;
  } );

  if (!_.isEmpty( this.state.db.nets) ) {
    methods.net.current(this.state.db.nets[0].id)(this.state);
  }

}
