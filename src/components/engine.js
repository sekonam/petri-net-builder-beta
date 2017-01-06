import React from 'react';

import EngineModel from '../models/engine.js';
import StateModel from '../models/state.js';
import EventModel from '../models/event.js';
import ActionModel from '../models/action.js';
import TransitionModel from '../models/transition.js';

import Context from './context.js';
import StateForm from './stateform.js';
import EventForm from './eventform.js';
import ActionForm from './actionform.js';
import TransitionForm from './transitionform.js';
import LeftMenuBlock from './leftmenublock.js';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);

    const itemTypes = [
        'state',
        'event',
        'action',
        'transition',
      ],
      itemFactory = {
        'state': () => new StateModel,
        'event': () => new EventModel,
        'action': () => new ActionModel,
        'transition': () => new TransitionModel
      };

    this.state = {
      itemTypes: itemTypes,
      store: new EngineModel,
      modal: {},
      leftMenuItems: [
        'state',
        'event',
        'action',
      ],
      dragStateId: null
    };

    itemTypes.forEach( (key) => {
      this.state.modal[key] = {
        id: null,
        data: itemFactory[key](),
        show: false
      };
    } );

    const customActions = {

      get: (itemType) => (id) => this.state.store[itemType + 's'][id],

      set: (itemType) => (id, key, value) => this.saveToState(
        (state) => state.store[itemType + 's'][id],
        { [ key ]: value }
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
            id,
            data: this.state.store[storageName][id],
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
            delete state.store[itemType + 's'][id];

            if (callback) {
              callback.call(this, state, id);
            }

            return state;
          }
        );

        return id;
      },

      options: (itemType) => () => this.state.store[itemType + 's'].cmap((item, id) => ({
        'value': id,
        'label': item.short('name')
      })),

      selectedOptions: (itemType) => (selectedIds) => {console.log(selectedIds,this.state.store.events);return selectedIds.cmap((id) => ({
        'value': id,
        'label': this.state.store[itemType + 's'][id].short('name')
      }))}
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
      (state) => state.store.states[id],
      {x,y}
    );

/*    this.methods.state.setHover = (id, hover) => this.saveToState(
      (state) => state.store.states[id],
      {hover}
    );*/

    this.methods.dragStateId = (id) => {
      this.setState({
      dragStateId: id
    });};

    const pevStateOptions = this.methods.state.options;
    this.methods.state.options = (sideName) => {
      const transition = this.state.modal.transition;
      let options = pevStateOptions(),
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
      state.store.transitions.forEach( (transition, tid) => {
        if (transition.start.state == sid || transition.finish.state == sid) {
          state.store.transitions.splice(tid, 1);
        }
      } );
    } );

    this.methods.event.remove = customActions.remove('event', (state, eid) => {
      console.log(state.store.actions);
      state.store.actions.forEach( (action, aid) => {
        const eventKey = action.events.indexOf(eid);

console.log(action, eventKey);
        if ( eventKey > -1 ) {
          console.log('sdfsd',action.events.splice(eventKey, 1));
          console.log(action);
        }
      } );
    } );

    itemTypes.forEach( (itemType) => {
      for (let method in this.methods[itemType]) {
        this.methods[itemType][method] = this.methods[itemType][method].bind(this);
      }
    } );

    this.methods.dragStateId = this.methods.dragStateId.bind(this);
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

  getKeyValueHash(data, propName) {
    let leftMenuData = [];
    data.forEach(
      (element, id) => leftMenuData[id] = element.short(propName)
    );
    return leftMenuData;
  }

  componentDidMount() {
    if (typeof(Storage) !== "undefined") {
//      localStorage.setItem('store', '');
      const jsonStore = localStorage.getItem( 'store' );

      if (jsonStore) {
        const store = JSON.parse( jsonStore );
        this.setState( (prevState, props) => ({ store: new EngineModel(store) }) );
      }
    }

    window.addEventListener( 'beforeunload', this.componentWillUnmount.bind(this) );
  }

  componentWillUnmount() {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem('store', JSON.stringify(this.state.store));
    }

    window.removeEventListener( 'beforeunload', this.componentWillUnmount.bind(this) );
  }

  render() {
    const
      modal = this.state.modal,
      store = this.state.store,
      methods = this.methods,

      leftMenuBlocks = this.state.leftMenuItems.map( (itemType, id) => (
        <LeftMenuBlock key={id}
          itemName={itemType}
          activeId={itemType == 'state' ? this.state.dragStateId : ''}
          data={this.getKeyValueHash( store[itemType + 's'], 'name' )}
          editHandler={methods[itemType].edit}
          addHandler={methods[itemType].add}/>
      ));

    return (
      <div className="engine">
        <div className="left-menu">
          {leftMenuBlocks}
        </div>
        <Context store={store} methods={methods} />
        <StateForm show={modal.state.show}
          dataId={modal.state.id}
          data={modal.state.data}
          saveHandler={methods.state.save}
          afterEditHandler={methods.state.afterEdit}
          removeHandler={methods.state.remove} />
        <EventForm show={modal.event.show}
          dataId={modal.event.id}
          data={modal.event.data}
          saveHandler={methods.event.save}
          afterEditHandler={methods.event.afterEdit}
          removeHandler={methods.event.remove} />
        <ActionForm show={modal.action.show}
          dataId={modal.action.id}
          data={modal.action.data}
          events={methods.event.options()}
          selectedEvents={methods.event.selectedOptions(modal.action.show ? modal.action.data.events : [])}
          saveHandler={methods.action.save}
          afterEditHandler={methods.action.afterEdit}
          removeHandler={methods.action.remove} />
        <TransitionForm show={modal.transition.show}
          dataId={modal.transition.id}
          data={modal.transition.data}
          startStates={methods.state.options('start')}
          finishStates={methods.state.options('finish')}
          stateHandler={(id) => store.states[id]}
          events={methods.event.options()}
          selectedStartEvents={methods.event.selectedOptions(modal.transition.show ? modal.transition.data.start.events : [])}
          selectedFinishEvents={methods.event.selectedOptions(modal.transition.show ? modal.transition.data.finish.events : [])}
          saveHandler={methods.transition.save}
          saveToChildHandler={methods.transition.saveToChild}
          afterEditHandler={methods.transition.afterEdit}
          removeHandler={methods.transition.remove} />
      </div>
    );
  }

}
