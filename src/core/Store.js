import {EntityFactory, EntityNames} from './Entities.js';
import StorageEngine from './StorageEngine.js';

import EngineModel from '../models/EngineModel.js';
import ViewportModel from '../models/ViewportModel.js';

export default function Store(setState) {
  Store.instance = this;

  this.state = {
    db: new EngineModel(StorageEngine.loadFromStorage( 'db' )),
    modal: {},
    active: {
      place: null,
      arc: null,
      net: null,
      group: null
    },
    viewport: new ViewportModel()
  };

  EntityNames.forEach( (key) => {
    this.state.modal[key] = null;
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
      state.modal[entityName] = state.db[ s(entityName) ].valueById(id);
      return state;
    },

    save: (entityName) => (key, value) => (state) => {
      state.modal[entityName].set({ [ key ]: value });
      return state;
    },

    afterEdit: (entityName) => () => (state) => {
      state.modal[entityName] = null;
      return state;
    },

    remove: (entityName, callback = null) => (id) => (state) => {
      const data = state.db[ s(entityName) ],
        key = data.indexById(id);

      if (key > -1) {
        if (callback) {
          callback.call(null, state, id);
        }

        data.splice(key, 1);
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

  methods.place.add = handlerFactory.add( 'place', (state, place) => {
    for (let i=0; i<2; i++) {
      methods.socket.add({
        type: i,
        nodeType: 'place',
        nodeId: place.id
      })(state);
    }
  } );

  methods.socket.add = handlerFactory.add( 'socket', (state, socket) => {
    state.db[ s(socket.nodeType) ].valueById(socket.nodeId).socketIds.push( socket.id );
  } );

  methods.socket.addToPlace = (params) => methods.socket.add( Object.assign({
    nodeType: 'place',
    nodeId: this.state.modal.place.id
  }, params));

  methods.net.add = handlerFactory.add( 'net', (state, net) => {
    state.active.net = net.id;
  } );

  methods.place.remove = handlerFactory.remove('place', (state, pid) => {
    state.db.places.valueById(pid).socketIds.forEach( (sid) => {
      state.db.arcs.spliceRecurcive(
        (arc) => (arc.startSocketId == sid || arc.finishSocketId == sid)
      );
    } );

    state.db.groups.forEach( (group) => {
      const key = group.placeIds.indexOf(pid);

      if (key > -1) {
        group.placeIds.splice(key, 1);
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

  ['place', 'group', 'net'].forEach( (entityName) => {
    methods[entityName].active = (id) => (state) => {
      state.active[entityName] = id;
      return state;
    };
  } );

  methods.arc.addActive = (socket) => (state) => {
    if (socket.type) {
      let activeArc = EntityFactory['arc']();
      activeArc.startSocketId = socket.id;
      state.active.arc = activeArc;
    }

    return state;
  };

  methods.arc.linkActive = (socket) => (state) => {
    if ( !socket.type && state.active.arc) {
      let activeArc = EntityFactory['arc']( state.active.arc );
      activeArc.finishSocketId = socket.id;
      state.db.arcs.push(activeArc);
      state.active.arc = null;
    }

    return state;
  };

  methods.arc.removeActive = () => (state) => {
    if (state.active.arc) {
      state.active.arc = null;
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

}
