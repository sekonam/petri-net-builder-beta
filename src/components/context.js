import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import State from './state.js';

class Context extends React.Component {

  render() {
    const states = this.props.store.states,
      stateRects = states.length == 0 ? [] : this.props.store.states.map( (state, id) => (
        <State x={state.x} y={state.y} key={id}/>
      ) );

    return (
      <svg width="800" height="600">
        {stateRects}
      </svg>
    );
  }
}

export default DragDropContext(HTML5Backend)(Context);
