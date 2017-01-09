import React from 'react';

import EngineModel from '../models/engine.js';
import StateModel from '../models/state.js';
import EventModel from '../models/event.js';
import ActionModel from '../models/action.js';
import TransitionModel from '../models/transition.js';
import VarModel from '../models/VarModel.js';
import SocketModel from '../models/SocketModel.js';
import ViewportModel from '../models/ViewportModel.js';

import Context from './context.js';
import StateForm from './stateform.js';
import EventForm from './eventform.js';
import ActionForm from './actionform.js';
import TransitionForm from './transitionform.js';
import VarForm from './VarForm.js';
import LeftMenuBlock from './leftmenublock.js';

import {Button} from 'react-bootstrap';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);
//    localStorage.setItem('store', '');

    const itemTypes = [
        'state',
        'event',
        'action',
        'transition',
        'var',
      ],
      itemFactory = {
        'state': () => new StateModel,
        'event': () => new EventModel,
        'action': () => new ActionModel,
        'transition': () => new TransitionModel,
        'var': () => new VarModel
      };

    this.state = {
      store: new EngineModel( this.loadFromStorage( 'store' ) ),
      modal: {},
      active: {
        transition: null,
        state: null
      },
      viewport: new ViewportModel()
    };

    itemTypes.forEach( (key) => {
      this.state.modal[key] = {
        data: itemFactory[key](),
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
          const newItem = itemFactory[itemType]();
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
              data.splice(key, 1);

              if (callback) {
                callback.call(this, state, id);
              }
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
        'label': this.state.store[itemType + 's'].indexOfId(id).short('name')
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

    this.methods.state.drag = (id,x,y) => this.saveToState(
      (state) => state.store.states.indexOfId(id),
      {x,y}
    );

    this.methods.state.active = (id) => {
      this.setState( (prevState, props) => {
        prevState.active.state = id;
        return prevState;
      });
    };

    this.methods.state.optionsForTransition = (sideName) => {
      const transition = this.state.modal.transition;
      let options = this.methods.state.options(),
        splice = [];

      if (transition.show) {
        const anotherSideName = this.anotherSide(sideName);

        for ( let key in options ) {
          if (options[key].value == transition.data[anotherSideName].state)
          {
            options.splice(key,1);
          }
        }
      }

      return options;
    };

    this.methods.state.remove = customActions.remove('state', (state, sid) => {
      state.store.states.valueById(sid).sockets.forEach( (socket) => {
        state.store.transitions.spliceRecurcive(
          (transition) => (transition.start.socket == socket.id || transition.finish.socket == socket.id)
        );
      } );
    } );

    this.methods.event.remove = customActions.remove('event', (state, eid) => {
      state.store.actions.forEach( (action) => {
        const eventKey = action.events.indexOf(eid);

        if ( eventKey > -1 ) {
          action.events.splice(eventKey, 1);
        }
      } );

      state.store.transitions.forEach( (transition) => {

        [ 'start', 'finish' ].forEach( (name) => {
          const data = transition[name].events,
            eventKey = data.indexOf(eid);

          if ( eventKey > -1 ) {
            data.splice(eventKey, 1);
          }
        } );

      } );
    } );

    this.methods.transition.edit = (id) => {
      if (!this.state.active.transition) {
        customActions.edit('transition')(id);
      }
    }

    this.methods.socket = {

      add: (stateId, type) => () => this.saveToState(
        (state) => {
          let socket = new SocketModel;
          socket.type = type;
          socket.state = stateId;
          state.store.states.valueById(stateId).sockets.push( socket );
        }
      ),

      get: (stateId) => (id) => this.state.store.states.valueById(stateId).sockets.valueById(id),

      set: (stateId) => (id) => (name, value) => this.saveToState(
        (state) => state.store.states.valueById(stateId).sockets.valueById(id),
        { name: value }
      ),

      remove: (stateId) => (id) => () => {
        this.setState( (prevState, props) => {
          const state = prevState.store.states.valueById(stateId);
          state.sockets.splice( state.sockets.indexById(id), 1 );

          prevState.store.transitions.spliceRecurcive(
            (transition) => (transition.start.socket == id || transition.finish.socket == id)
          );

          return prevState;
        } );
      }

    };

    this.methods.transition.addActive = (socket) => {
      if (socket.type) {

        this.setState( (prevState, props) => {
          let activeTransition = new TransitionModel;
          activeTransition.start.socket = socket.id;
          activeTransition.start.state = socket.state;
          prevState.active.transition = activeTransition;
          return prevState;
        } );

      }
    };

    this.methods.transition.linkActive = (socket) => {
      if ( !socket.type && this.state.active.transition ) {
        this.setState( (prevState, props) => {
          let activeTransition = new TransitionModel( prevState.active.transition );
          activeTransition.finish.socket = socket.id;
          activeTransition.finish.state = socket.state;
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
//    this.saveToStorage( 'viewport', this.state.viewport );
  }

  componentDidMount() {
    window.addEventListener( 'beforeunload', this.saveStateToStorage.bind(this) );
  }

  render() {
    const
      modal = this.state.modal,
      store = this.state.store,
      methods = this.methods,
      active = this.state.active,

      leftMenuBlocks = [ 'state', 'event', 'action', 'var', ].map( (itemType, key) => {
        return (
        <LeftMenuBlock key={key}
          itemName={itemType}
          activeId={itemType == 'state' ? this.state.active.state : ''}
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
          <Button onClick={ methods.zoom.change(-0.25) } bsStyle="default">-</Button>
          <Button onClick={ methods.zoom.change(0.25) } bsStyle="default">+</Button>
          <Button onClick={ methods.zoom.set(1) } bsStyle="default">Default</Button>
        </div>
        <Context store={store} viewport={this.state.viewport}
          methods={methods} active={active} />
        <StateForm show={modal.state.show}
          data={modal.state.data}
          saveHandler={methods.state.save}
          afterEditHandler={methods.state.afterEdit}
          removeHandler={methods.state.remove}
          socketHandlers={methods.socket}/>
        <EventForm show={modal.event.show}
          data={modal.event.data}
          saveHandler={methods.event.save}
          afterEditHandler={methods.event.afterEdit}
          removeHandler={methods.event.remove} />
        <ActionForm show={modal.action.show}
          data={modal.action.data}
          events={methods.event.options()}
          selectedEvents={methods.event.selectedOptions(modal.action.show ? modal.action.data.events : [])}
          saveHandler={methods.action.save}
          afterEditHandler={methods.action.afterEdit}
          removeHandler={methods.action.remove} />
        <TransitionForm show={modal.transition.show}
          data={modal.transition.data}
          startStates={methods.state.optionsForTransition('start')}
          finishStates={methods.state.optionsForTransition('finish')}
          stateHandler={(id) => store.states.indexOfId(id)}
          events={methods.event.options()}
          selectedStartEvents={methods.event.selectedOptions(modal.transition.show ? modal.transition.data.start.events : [])}
          selectedFinishEvents={methods.event.selectedOptions(modal.transition.show ? modal.transition.data.finish.events : [])}
          saveHandler={methods.transition.save}
          saveToChildHandler={methods.transition.saveToChild}
          afterEditHandler={methods.transition.afterEdit}
          removeHandler={methods.transition.remove} />
        <VarForm show={modal.var.show}
          data={modal.var.data}
          saveHandler={methods.var.save}
          afterEditHandler={methods.var.afterEdit}
          removeHandler={methods.var.remove} />
      </div>
    );
  }

}
