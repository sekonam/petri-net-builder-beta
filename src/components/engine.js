import React from 'react';
import Context from './context.js';
import StateForm from './stateform.js'
import LeftMenuBlock from './leftmenublock.js';

import EngineStore from '../store/engine.js';
import StateStore from '../store/state.js';

export default class Engine extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      store: new EngineStore,
      modal: {
        state: {
          data: {},
          show: false
        }
      }
    };
    this.lib = {
      state: {
        add: () => this.saveToState(
          (state) => {
            state.store.states.push( new StateStore );
          }
        ),
        edit: (store) => this.saveToState(
          (state) => state.modal.state,
          {
            data: store,
            show: true
          }
        ),
        save: (key, value) => this.saveToState(
          (state) => state.modal.state.data,
          { [ key ]: value }
        ),
        afterEdit: () => this.saveToState(
          (state) => {
            state.modal.state.show = false;
          }
        ),
        drag: (id,x,y) => this.saveToState(
          (state) => state.store.states[id],
          {x,y}
        )
      }
    };

    this.methods = {};

    for (let entity in this.lib) {
      for (let method in this.lib[entity]) {
        const name = method + this.ucfirst(entity);
        this.methods[name] = this.lib[entity][method].bind(this);
      }
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

  render() {
    const stateModal = this.state.modal.state,
      methods = this.methods;
    return (
      <div className="engine">
        <div className="left-menu">
        <LeftMenuBlock caption='States'
          data={this.state.store.states}
          addCaption='Add State'
          editHandler={methods.editState}
          addHandler={methods.addState}/>
        </div>
        <Context store={this.state.store}
          dragStateHandler={methods.dragState}/>
        <StateForm show={stateModal.show}
          state={stateModal.data}
          saveHandler={methods.saveState}
          afterEditHandler={methods.afterEditState} />
      </div>
    );
  }

}
