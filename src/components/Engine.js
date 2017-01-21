import React from 'react';
import {Button} from 'react-bootstrap';

import EntityFactory from '../core/EntityFactory.js';

import EngineModel from '../models/EngineModel.js';
import PlaceModel from '../models/PlaceModel.js';
import GroupModel from '../models/GroupModel.js';
import EventModel from '../models/EventModel.js';
import ActionModel from '../models/ActionModel.js';
import TransitionModel from '../models/TransitionModel.js';
import VarModel from '../models/VarModel.js';
import SocketModel from '../models/SocketModel.js';
import ViewportModel from '../models/ViewportModel.js';

import Context from './Context.js';
import PlaceForm from './PlaceForm.js';
import GroupForm from './GroupForm.js';
import EventForm from './EventForm.js';
import ActionForm from './ActionForm.js';
import TransitionForm from './TransitionForm.js';
import VarForm from './VarForm.js';
import LeftMenuBlock from './LeftMenuBlock.js';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);
    localStorage.setItem('store', '');

    const itemTypes = [
        'place',
        'group',
        'event',
        'action',
        'transition',
        'var',
      ];

    this.state = {
      store: new EngineModel( this.loadFromStorage( 'store' ) ),
      modal: {},
      active: {
        transition: null,
        place: null,
        group: null
      },
      viewport: new ViewportModel()
    };

    itemTypes.forEach( (key) => {
      this.state.modal[key] = {
        data: null,
        show: false
      };
    } );

    const customActions = {

      get: (itemType) => (id) => {return this.state.store[itemType + 's'].find(
        (el) => el.id == id
      )},

      set: (itemType) => (id, key, value) => this.saveToState(
        (state) => state.store[itemType + 's'].indexOfId(id),
        { [ key ]: value }
      ),

      each: (itemType) => (params) => this.saveToState(
        (state) => {
          state.store[itemType + 's'].forEach(
            (el) => {
              if (typeof params == 'object' && params) {
                for (let name in params) {
                  el[name] = params[name];
                }
              }
            }
          );
        }
      ),

      add: (itemType) => {
        const storageName = itemType + 's';
        return () => {
          const newItem = EntityFactory[itemType]();
          newItem.defaults();

          this.saveToState(
            (state) => {
              state.store[storageName].push( newItem );
            }
          );
          return newItem;
        }
      },

      edit: (itemType) => {
        const storageName = itemType + 's';
        return (id) => this.saveToState(
          (state) => state.modal[itemType],
          {
            data: this.state.store[storageName].indexOfId(id),
            show: true
          }
        );
      },

      save: (itemType) => (key, value) => this.saveToState(
        (state) => state.modal[itemType].data,
        { [ key ]: value }
      ),

      saveToChild: (itemType) => (subPath) => (key, value) => this.saveToState(
        (state) => {
          let stateNode = state.modal[itemType].data;
          Array.prototype.forEach.call( subPath, (nodeName) => {
            stateNode = (nodeName in stateNode) ? stateNode[nodeName] : statNode;
          });
          return stateNode;
        },
        { [ key ]: value }
      ),

      afterEdit: (itemType) => () => this.saveToState(
        (state) => {
          state.modal[itemType].show = false;
        }
      ),

      remove: (itemType, callback = null) => (id) => {

        this.saveToState(
          (state) => {
            const data = state.store[itemType + 's'],
              key = data.findIndexById(id);

            if (key > -1) {

              if (callback) {
                callback.call(this, state, id);
              }

              data.splice(key, 1);
            }

            return state;
          }
        );

        return id;
      },

      options: (itemType) => () => this.state.store[itemType + 's'].cmap((item) => ({
        'value': item.id,
        'label': item.short('name')
      })),

      selectedOptions: (itemType) => (selectedIds) => selectedIds.cmap((id) => ({
        'value': id,
        'label': this.state.store[itemType + 's'].valueById(id).short('name')
      }))
    };

    this.methods = {};

    for (let key in itemTypes) {
      const itemType = itemTypes[key];
      this.methods[itemType] = {};

      for (let method in customActions) {
        this.methods[itemType][method] = customActions[method](itemType);
      }
    }

    this.methods.place.drag = (id,x,y) => this.saveToState(
      (state) => state.store.places.valueById(id),
      {x,y}
    );

    ['place', 'group'].forEach( (itemType) => {
      this.methods[itemType].active = (id) => {
        this.setState( (prevState, props) => {
          prevState.active[itemType] = id;
          return prevState;
        });
      };
    } );

    this.methods.place.remove = customActions.remove('place', (state, sid) => {
      state.store.places.valueById(sid).sockets.forEach( (socket) => {
        state.store.transitions.spliceRecurcive(
          (transition) => (transition.start.socketId == socket.id || transition.finish.socketId == socket.id)
        );
      } );

      state.store.groups.forEach( (group) => {
        const groupKey = group.placeIds.indexOf(sid);

        if (groupKey > -1) {
          group.placeIds.splice(groupKey, 1);
        }
      } );
    } );

    this.methods.event.remove = customActions.remove('event', (state, eid) => {
      state.store.actions.forEach( (action) => {
        const eventKey = action.events.indexOf(eid);

        if ( eventKey > -1 ) {
          action.events.splice(eventKey, 1);
        }
      } );

/*      state.store.transitions.forEach( (transition) => {

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
    this.methods.transition.edit = (id) => {
      if (!this.state.active.transition) {
        customActions.edit('transition')(id);
      }
    }

    this.methods.socket = {

      add: (nodeId, type) => () => this.saveToState(
        (state) => {
          let socket = new SocketModel;
          socket.type = type;
          socket.nodeId = nodeId;
          state.store.places.valueById(nodeId).sockets.push( socket );
        }
      ),

      get: (nodeId) => (id) => this.state.store.places.valueById(nodeId).sockets.valueById(id),

      set: (nodeId) => (id) => (name, value) => this.saveToState(
        (state) => state.store.places.valueById(nodeId).sockets.valueById(id),
        { name: value }
      ),

      remove: (nodeId) => (id) => () => {
        this.setState( (prevState, props) => {
          const place = prevState.store.places.valueById(nodeId);
          place.sockets.splice( place.sockets.indexById(id), 1 );

          prevState.store.transitions.spliceRecurcive(
            (transition) => (transition.start.socketId == id || transition.finish.socketId == id)
          );

          return prevState;
        } );
      }

    };

    this.methods.transition.addActive = (socket) => {
      if (socket.type) {

        this.setState( (prevState, props) => {
          let activeTransition = new TransitionModel;
          activeTransition.start.socketId = socket.id;
          activeTransition.start.nodeId = socket.nodeId;
          prevState.active.transition = activeTransition;
          return prevState;
        } );

      }
    };

    this.methods.transition.linkActive = (socket) => {
      if ( !socket.type && this.state.active.transition ) {
        this.setState( (prevState, props) => {
          let activeTransition = new TransitionModel( prevState.active.transition );
          activeTransition.finish.socketId = socket.id;
          activeTransition.finish.nodeId = socket.nodeId;
          prevState.store.transitions.push(activeTransition);
          prevState.active.transition = null;
          return prevState;
        } );
      }
    };

    this.methods.transition.removeActive = () => {
      this.setState( (prevState, props) => {
        prevState.active.transition = null;
        return prevState;
      } );
    };

    this.methods.zoom = {

      change: (shift) => () => this.setState( (prevState, props) => {
        prevState.viewport.zoom += prevState.viewport.zoom + shift > 0.1 ? shift : 0;
        return prevState;
      } ),

      set: (zoom) => () => this.setState( (prevState, props) => {
        console.log(this.state.store);
        prevState.viewport.zoom = zoom;
        return prevState;
      } )

    };

    this.methods.translate = {
      set: (translateX, translateY) => this.setState( (prevState, props) => {
        prevState.viewport.translateX = translateX;
        prevState.viewport.translateY = translateY;
        return prevState;
      } )
    };

    for (let itemType in this.methods) {
      for (let method in this.methods[itemType]) {
        this.methods[itemType][method] = this.methods[itemType][method].bind(this);
      }
    }

    this.saveStateToStorage = this.saveStateToStorage.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
  }

  saveToState(statePath, values='') {
    let state;

    this.setState((prevState, props) => {
      state = statePath(prevState);

      if (typeof state == 'object' && typeof values == 'object') {
        for (let key in values) {
          state[key] = values[key];
        }
      }

      return prevState;
    });

    return state;
  }

  anotherSide(sideName) {
    return sideName == 'start' ? 'finish' : 'start';
  }

  loadFromStorage( name ) {
    if (typeof(Storage) !== "undefined") {
      const json = localStorage.getItem( name );

      if (json) {
        return JSON.parse( json );
      }
    }

    return null;
  }

  saveToStorage( name, value ) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem(name, JSON.stringify( value ));
    }
  }

  saveStateToStorage() {
    this.saveToStorage( 'store', this.state.store );
  }

  keyDownHandler(e) {
    if (e.keyCode == 27 && this.state.active.transition) {
      this.methods.transition.removeActive();
    }
  }

  componentDidMount() {
    window.addEventListener( 'beforeunload', this.saveStateToStorage );
    document.body.addEventListener( 'keydown', this.keyDownHandler);
  }

  componentWillUnmount() {
    window.removeEventListener( 'beforeunload', this.saveStateToStorage );
    document.body.removeEventListener( 'keydown', this.keyDownHandler);
  }

  render() {
    const
      modal = this.state.modal,
      store = this.state.store,
      methods = this.methods,
      active = this.state.active,

      leftMenuBlocks = [ 'place', 'group', 'event', 'action', 'var', ].map( (itemType, key) => {
        return (
        <LeftMenuBlock key={key}
          itemName={itemType}
          activeId={itemType == 'place' ? this.state.active.place : ''}
          data={methods[itemType].options()}
          editHandler={methods[itemType].edit}
          addHandler={methods[itemType].add}/>
      )});

    return (
      <div className="engine">
        <div className="left-menu">
          {leftMenuBlocks}
        </div>
        <div className="buttons">
          <span>Zoom:</span>
          <Button onClick={ methods.zoom.change(-0.1) } bsStyle="default">-</Button>
          <Button onClick={ methods.zoom.change(0.1) } bsStyle="default">+</Button>
          <Button onClick={ methods.zoom.set(1) } bsStyle="default">Default</Button>
        </div>
        <Context store={store} viewport={this.state.viewport}
          methods={methods} active={active} />
        { modal.place.show ? <PlaceForm show={modal.place.show}
          data={modal.place.data}
          saveHandler={methods.place.save}
          afterEditHandler={methods.place.afterEdit}
          removeHandler={methods.place.remove}
          socketHandlers={methods.socket}/> : '' }
        { modal.event.show ? <EventForm show={modal.event.show}
          data={modal.event.data}
          saveHandler={methods.event.save}
          afterEditHandler={methods.event.afterEdit}
          removeHandler={methods.event.remove} /> : '' }
        { modal.action.show ? <ActionForm show={modal.action.show}
          data={modal.action.data}
          events={methods.event.options()}
          selectedEvents={methods.event.selectedOptions(modal.action.show ? modal.action.data.events : [])}
          saveHandler={methods.action.save}
          afterEditHandler={methods.action.afterEdit}
          removeHandler={methods.action.remove} /> : '' }
        { modal.transition.show ? <TransitionForm show={modal.transition.show}
          data={modal.transition.data}
          methods={methods.transition} /> : '' }
        { modal.var.show ? <VarForm show={modal.var.show}
          data={modal.var.data}
          methods={methods.var} /> : '' }
        { modal.group.show ? <GroupForm show={modal.group.show}
          data={modal.group.data}
          places={methods.place.options()}
          selectedPlaces={methods.place.selectedOptions(modal.group.show ? modal.group.data.placeIds : [])}
          methods={methods.group} /> : '' }
      </div>
    );
  }

}
