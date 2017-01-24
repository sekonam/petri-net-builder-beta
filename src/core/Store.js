import _ from 'lodash';

import {EntityFactory, EntityNames} from './Entities.js';
import StorageEngine from './StorageEngine.js';

import EngineModel from '../models/EngineModel.js';
import ViewportModel from '../models/ViewportModel.js';

export default function Store(setState) {
  Store.instance = this;

  this.state = {
    db: new EngineModel( StorageEngine.loadFromStorage( 'db' )),
    viewport: new ViewportModel(),
    active: {},
    form: {
      data: null,
      type: null
    },
    drawing: {
      arc: null
    },
    dragging: {
      place: null,
      subnet: null,
      transition: null,
      group: null
    }
  };

  EntityNames.forEach( (key) => {
    this.state.active[key] = null;
  } );

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

    edit: (entityName) => (id) => (state) => {
      state.form.data = id ? state.db[ s(entityName) ].valueById(id) : null;
      state.form.type = id ? entityName : null;
      return state;
    },

    remove: (entityName, callback = null) => (id) => (state) => {
      const data = state.db[ s(entityName) ],
        key = data.indexById(id);

      if (key > -1) {

        if (state.form.data && id == state.form.data.id) {
          state.form.data = null;
          state.form.type = null;
        }

        if (state.active[entityName] && id == state.active[entityName].id ) {
          state.active[entityName] = null;
        }

        if (callback) {
          callback.call(null, state, id);
        }

        data.splice(key, 1);
      }

      return state;
    },

    active: (entityName) => (id) => (state) => {
      state.active[entityName] = id ? state.db[ s(entityName) ].valueById(id) : null;

      if (id && !state.active[entityName].subnetId) {
        state.form.data = state.db[ s(entityName) ].valueById(id);
        state.form.type = entityName;
      }

      return state;
    }
  };

  const methods = {};

  for (let key in EntityNames) {
    const entityName = EntityNames[key];
    methods[entityName] = {};

    for (let methodName in handlerFactory) {
      methods[entityName][methodName] = handlerFactory[methodName](entityName);
    }
  }

  ['place', 'subnet'].forEach( (entityName) => {
    methods[entityName].add = handlerFactory.add( entityName, (state, entity) => {
      entity.netId = state.active.net.id;

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
      state.active.net = net;
    }
  } );

  methods.group.add = handlerFactory.add( 'group', (state, group) => {
    group.netId = state.active.net.id;
  } );

  ['place', 'subnet'].forEach( (entityName) => {
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
    state.db.actions.forEach( (action) => {
      const eventKey = action.events.indexOf(eid);

      if ( eventKey > -1 ) {
        action.events.splice(eventKey, 1);
      }
    } );

  /*      state.db.arcs.forEach( (arc) => {

      [ 'start', 'finish' ].forEach( (name) => {
        const data = arc[name].events,
          eventKey = data.indexOf(eid);

        if ( eventKey > -1 ) {
          data.splice(eventKey, 1);
        }
      } );

    } );
    */
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
    ['place', 'subnet', 'group'].forEach( (entityName) => {
      state.db[ s(entityName) ]
        .filter( (entity) => entity.netId == nid )
        .forEach( (entity) => {
          methods[ entityName ].remove(entity.id);
        } );
    } );
  } );

  methods.subnet.enter = (id) => (state) => {
    return methods.net.active(
      state.db.nets.find( (net) => net.subnetId == id ).id
    )(state);
  };

  ['place', 'subnet', 'group', ].forEach( (entityName) => {
    methods[entityName].dragging = (id) => (state) => {
      state.dragging[entityName] = id;
      return state;
    };
  } );

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


  if (!_.isEmpty( this.state.db.nets) ) {
    methods.net.active(this.state.db.nets[0].id)(this.state);
  }

}
