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
      transition: null,
      place: null,
      group: null
    },
    viewport: new ViewportModel()
  };

  EntityNames.forEach( (key) => {
    this.state.modal[key] = null;
  } );

  const ss = (changeState) => {
    setState( (state) => {
      changeState(state);
      return state;
    } );
  };

  const s = (entityName) => entityName + 's';

  const handlerFactory = {

    add: (entityName, callback = null) => (params = null) => ss( (state) => {
      const entity = EntityFactory[entityName]();

      if (params) {
        entity.set(params);
      }

      state.db[ s(entityName) ].push( entity );

      if (callback) {
        callback.call(null, state, entity);
      }
    } ),

    set: (entityName) => (id, params) => ss( (state) => {
      state.db[ s(entityName) ].valueById(id).set(params);
    } ),

    edit: (entityName) => (id) => ss( (state) => {
      state.modal[entityName] = state.db[ s(entityName) ].valueById(id);
    } ),

    save: (entityName) => (key, value) => ss( (state) => {
      state.modal[entityName].set({ [ key ]: value });
    } ),

    afterEdit: (entityName) => () => ss( (state) => {
      state.modal[entityName] = null;
    } ),

    remove: (entityName, callback = null) => (id) => ss( (state) => {
      const data = state.db[ s(entityName) ],
        key = data.indexById(id);

      if (key > -1) {
        if (callback) {
          callback.call(null, state, id);
        }

        data.splice(key, 1);
      }
    } )
  };

  for (let key in EntityNames) {
    const entityName = EntityNames[key];
    this[entityName] = {};

    for (let methodName in handlerFactory) {
      this[entityName][methodName] = handlerFactory[methodName](entityName);
    }
  }

  ['place', 'group'].forEach( (entityName) => {
    this[entityName].active = (id) => ss( (state) => {
      state.active[entityName] = id;
    } );
  } );

  this.place.remove = handlerFactory.remove('place', (state, pid) => {
    state.db.places.valueById(pid).socketIds.forEach( (sid) => {
      state.db.transitions.spliceRecurcive(
        (transition) => (transition.startSocketId == sid || transition.finishSocketId == sid)
      );
    } );

    state.db.groups.forEach( (group) => {
      const key = group.placeIds.indexOf(pid);

      if (key > -1) {
        group.placeIds.splice(key, 1);
      }
    } );
  } );

  this.event.remove = handlerFactory.remove('event', (state, eid) => {
    state.db.actions.forEach( (action) => {
      const eventKey = action.events.indexOf(eid);

      if ( eventKey > -1 ) {
        action.events.splice(eventKey, 1);
      }
    } );

  /*      state.db.transitions.forEach( (transition) => {

      [ 'start', 'finish' ].forEach( (name) => {
        const data = transition[name].events,
          eventKey = data.indexOf(eid);

        if ( eventKey > -1 ) {
          data.splice(eventKey, 1);
        }
      } );

    } );
    */
  } );

  this.transition.edit = (id) => ss( (state) => {
    if (!state.active.transition) {
      handlerFactory.edit('transition')(id);
    }
  } );

  this.socket.addToPlace = handlerFactory.add( 'socket', (state, socket) => {
    socket.nodeType = 'place';
    socket.nodeId = state.modal.place.id;
    state.db[ s(socket.nodeType) ].valueById(socket.nodeId).socketIds.push( socket.id );
  } );

  this.socket.remove = handlerFactory.remove( 'socket', (state, sid) => {
    const socket = state.db.sockets.valueById(sid),
      node = state.db[ s(socket.nodeType) ].valueById(socket.nodeId);
    node.socketIds.splice( node.socketIds.indexOf(sid), 1 );

    state.db.transitions.spliceRecurcive(
      (transition) => (transition.startSocketId == sid || transition.finishSocketId == sid)
    );
  } );

  this.transition.addActive = (socket) => {
    if (socket.type) {

      ss( (state) => {
        let activeTransition = EntityFactory['transition']();
        activeTransition.startSocketId = socket.id;
        state.active.transition = activeTransition;
      } );

    }
  };

  this.transition.linkActive = (socket) => {
    if ( !socket.type ) {
      ss( (state) => {
        if (state.active.transition) {
          let activeTransition = EntityFactory['transition']( state.active.transition );
          activeTransition.finishsocketId = socket.id;
          state.db.transitions.push(activeTransition);
          state.active.transition = null;
        }
      } );
    }
  };

  this.transition.removeActive = () => {
    ss( (state) => {
      state.active.transition = null;
    } );
  };

  this.zoom = {

    change: (shift) => () => ss( (state) => {
      state.viewport.zoom += state.viewport.zoom + shift > 0.1 ? shift : 0;
    } ),

    set: (zoom) => () => ss( (state) => {
      state.viewport.zoom = zoom;
    } )

  };

  this.translate = {
    set: (translateX, translateY) => ss( (state) => {
      state.viewport.translateX = translateX;
      state.viewport.translateY = translateY;
    } )
  };

}
