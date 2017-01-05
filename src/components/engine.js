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
        data: {},
        show: false
      };
    } );

    const customActions = {
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
            data: this.state.store[storageName][id],
            show: true
          }
        );
      },
      save: (itemType) => (key, value) => this.saveToState(
        (state) => state.modal[itemType].data,
        { [ key ]: value }
      ),
      afterEdit: (itemType) => () => this.saveToState(
        (state) => {
          state.modal[itemType].show = false;
        }
      ),
      remove: (itemType) => (item) => {
        let id = false;

        this.saveToState(
          (state) => {
            id = state.store[itemType + 's'].indexOf(item);
            if (id > -1) {
              delete state.store[itemType + 's'][id];
            }
            return state;
          }
        );

        return id > -1;
      }
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

    this.methods.state.setHover = (id, hover) => this.saveToState(
        (state) => state.store.states[id],
        {hover}
      );

    this.methods.dragStateId = (id) => {
      this.setState({
      dragStateId: id
    });};

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

  getKeyValueHash(data, propName) {
    let leftMenuData = [];
    data.forEach(
      (element, id) => leftMenuData[id] = element.short(propName)
    );
    return leftMenuData;
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
          data={modal.state.data}
          saveHandler={methods.state.save}
          afterEditHandler={methods.state.afterEdit} />
        <EventForm show={modal.event.show}
          data={modal.event.data}
          saveHandler={methods.event.save}
          afterEditHandler={methods.event.afterEdit} />
        <ActionForm show={modal.action.show}
          data={modal.action.data}
          events={this.getKeyValueHash( store.events, 'name' )}
          saveHandler={methods.action.save}
          afterEditHandler={methods.action.afterEdit} />
        <TransitionForm show={modal.transition.show}
          data={modal.transition.data}
          states={this.getKeyValueHash( store.states, 'name' )}
          events={this.getKeyValueHash( store.events, 'name' )}
          actions={this.getKeyValueHash( store.actions, 'name' )}
          saveHandler={methods.transition.save}
          afterEditHandler={methods.transition.afterEdit} />
      </div>
    );
  }

}
