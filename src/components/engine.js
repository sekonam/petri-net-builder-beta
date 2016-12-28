import React from 'react';
import EngineStore from '../store/engine.js';
import State from './state.js';
import LeftMenuBlock from './leftmenublock.js';
import StateForm from './stateform.js'

export default class Engine extends React.Component {

  constructor(props) {
    super(props);
    this.store = new EngineStore;
    this.state = {
      states: [],
      editState: {}
    };
  }

  updateStateStates() {
    this.setState( {
      states: this.store.states.map( (state, key) => ({
        key,
        text: state.name,
        x: state.x,
        y: state.y,
        clickHandler: () => this.editState(state)
      }) )
    } );
  }

  addState() {
    this.store.addState();
    this.updateStateStates();
  }

  editState(state) {
    this.setState({ editState: state });
  }

  editStateCallback() {
    this.setState( {editState: {}} );
    this.updateStateStates();
  }

  saveEditStateValue(key, value) {
    this.setState((prevState, props) => {
      if (key in prevState.editState) {
        prevState.editState[key] = value;
      }

      return prevState;
    });
  }

  render() {

    const stateRects = this.state.states.map( (state, id) => (
      <State x={state.x} y={state.y} key={id}/>
    ) );

    const show = Object.keys(this.state.editState).length != 0;

    return (
      <div className="engine">
        <div className="left-menu">
        <LeftMenuBlock caption='States' data={this.state.states}
          addCaption='Add State' addHandler={this.addState.bind(this)}/>
        </div>
        <svg width="800" height="600">
          {stateRects}
        </svg>
        <StateForm show={show} state={this.state.editState} save={this.saveEditStateValue.bind(this)} callback={this.editStateCallback.bind(this)} />
      </div>
    );
  }

}
