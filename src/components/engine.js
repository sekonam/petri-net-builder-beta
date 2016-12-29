import React from 'react';

import EngineModel from '../models/engine.js';
import StateModel from '../models/state.js';
import EventModel from '../models/event.js';
import ActionModel from '../models/action.js';

import Context from './context.js';
import StateForm from './stateform.js'
import EventForm from './eventform.js'
import ActionForm from './actionform.js'
import LeftMenuBlock from './leftmenublock.js';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);

    const itemTypes = ['state', 'event', 'action',],
      itemFactory = {
        'state': () => new StateModel,
        'event': () => new EventModel,
        'action': () => new ActionModel
      };

    this.state = {
      itemTypes: itemTypes,
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
      this.methods[itemType] = {};

      for (let method in customActions) {
        this.methods[itemType][method] = customActions[method](itemType);
      }
    }

    this.methods.state.drag = (id,x,y) => this.saveToState(
      (state) => state.store.states[id],
      {x,y}
    );

    itemTypes.forEach( (itemType) => {
      for (let method in this.methods[itemType]) {
        this.methods[itemType][method] = this.methods[itemType][method].bind(this);
      }
    } );
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
    const
      modal = this.state.modal,
      store = this.state.store,
      methods = this.methods,

      leftMenuBlocks = this.state.itemTypes.map( (itemType, id) => (
        <LeftMenuBlock key={id}
          itemName={itemType}
          data={this.getLeftMenuData( store[itemType + 's'], 'name' )}
          editHandler={methods[itemType].edit}
          addHandler={methods[itemType].add}/>
      ));

    return (
      <div className="engine">
        <div className="left-menu">
          {leftMenuBlocks}
        </div>
        <Context store={store}
          dragStateHandler={methods.state.drag}/>
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
          saveHandler={methods.action.save}
          afterEditHandler={methods.action.afterEdit} />
      </div>
    );
  }

}
