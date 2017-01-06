import React from 'react';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';

import State from './state.js';
import Transition from './transition.js';

import StateModel from '../models/state.js';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transition: null,
      hoverState: null
    };
    this.documentMouseMove = this.documentMouseMove.bind(this);
    this.documentMouseUp = this.documentMouseUp.bind(this);
  }

  componentDidMount() {
    const svgPos = this.svg.getBoundingClientRect();
    this.svgOffset = {
      x: svgPos.left,
      y: svgPos.top
    };
  }

  currentOffset(e) {
    return {
      x: e.pageX - this.svgOffset.x,
      y: e.pageY - this.svgOffset.y
    };
  }

  addTransitionHandler(addTransition) {
    return (stateId, e) => {
      let transition = addTransition();
      transition.start.state = stateId;
      transition.finish.offset = this.currentOffset(e);
      this.setState({ transition });
      document.addEventListener('mousemove', this.documentMouseMove);
      document.addEventListener('click', this.documentMouseUp, true);
    }
  }

  documentMouseMove(e) {
    if (this.state.transition != null) {
      let offset = this.state.transition.finish.offset = this.currentOffset(e),
        states = this.props.store.states;

      let hoverState = null;
      states.forEach( (state) => {
        const hover = state.x <= offset.x
          && offset.x <=state.x + StateModel.default.width
          && state.y <= offset.y
          && offset.y <=state.y + StateModel.default.height
          && state.id != this.state.transition.start.state;
        this.props.methods.state.set(state.id, 'hover', hover);

        if (hover) {
          hoverState = state.id;
        }
      } );

      this.setState({hoverState});
    }
  }

  documentMouseUp(e) {
    if (this.state.transition) {
      if (this.state.hoverState) {
        this.state.transition.finish.state = this.state.hoverState;
      } else {
        this.props.methods.transition.remove(this.state.transition.id);
      }

      document.removeEventListener('mousemove', this.documentMouseMove);
      document.removeEventListener('click', this.documentMouseUp, true);

      this.props.methods.state.each( {hover: false} );

      this.setState({
        transition: null,
        haverState: null
      });
    }

//    e.stopPropagation();
  }

  render() {
    const store = this.props.store,
      methods = this.props.methods,

      stateRects = store.states.cmap( (state, id) => (
        <State data={state} id={state.id} key={id}
          dragHandler={methods.state.drag}
          dragStateId={methods.dragStateId}
          addTransitionHandler={this.addTransitionHandler(methods.transition.add).bind(this)}/>
      ) ),

      transitionArrows = store.transitions.cmap( (transition, id) => (
        <Transition data={transition} key={id}
          editHandler={() => methods.transition.edit(transition.id)}
          stateHandler={methods.state.get} />
      ) );

    return (
      <svg width="800" height="600" ref={ (el) => { this.svg = el; } }>
        {stateRects}
        {transitionArrows}
      </svg>
    );
  }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Context);
