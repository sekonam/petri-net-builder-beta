import React from 'react';

import EngineModel from '../models/engine.js';
import StateModel from '../models/state.js';
import EventModel from '../models/event.js';

import Context from './context.js';
import StateForm from './stateform.js'
import EventForm from './eventform.js'
import LeftMenuBlock from './leftmenublock.js';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);

    const itemTypes = ['state', 'event'],
      itemFactory = {
        'state': () => new StateModel,
        'event': () => new EventModel
      };

    this.state = {
      store: new EngineModel,
      modal: {}
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
        return () => this.saveToState(
          (state) => {
            state.store[storageName].push( itemFactory[itemType]() );
          }
        );
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
      )
    };

    this.methods = {};

    for (let key in itemTypes) {
      const itemType = itemTypes[key];
      for (let method in customActions) {
        const name = method + this.ucfirst(itemType);
        this.methods[name] = customActions[method](itemType);
      }
    }

    this.methods.dragState = (id,x,y) => this.saveToState(
      (state) => state.store.states[id],
      {x,y}
    );

    for (let method in this.methods) {
      this.methods[method] = this.methods[method].bind(this);
    }
  }

  ucfirst(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

  saveToState(statePath, values='') {

    this.setState((prevState, props) => {
      let state = statePath(prevState);

      if (typeof state == 'object' && typeof values == 'object') {
        for (let key in values) {
          state[key] = values[key];
        }
      }

      return prevState;
    });
  }

  getLeftMenuData(data, propName) {
    let leftMenuData = [];
    data.forEach(
      (element, id) => leftMenuData[id] = element.short(propName)
    );
    return leftMenuData;
  }

  render() {
    const modal = this.state.modal,
      store = this.state.store,
      methods = this.methods;

    return (
      <div className="engine">
        <div className="left-menu">
          <LeftMenuBlock caption='States'
            data={this.getLeftMenuData( store.states, 'name' )}
            addCaption='Add State'
            editHandler={methods.editState}
            addHandler={methods.addState}/>
          <LeftMenuBlock caption='Events'
            data={this.getLeftMenuData( store.events, 'name' )}
            addCaption='Add Event'
            editHandler={methods.editEvent}
            addHandler={methods.addEvent}/>
        </div>
        <Context store={store}
          dragStateHandler={methods.dragState}/>
        <StateForm show={modal.state.show}
          data={modal.state.data}
          saveHandler={methods.saveState}
          afterEditHandler={methods.afterEditState} />
        <EventForm show={modal.event.show}
          data={modal.event.data}
          saveHandler={methods.saveEvent}
          afterEditHandler={methods.afterEditEvent} />
      </div>
    );
  }

}
