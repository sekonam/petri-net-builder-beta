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
    this.state.svgOffset = {
      x: svgPos.left,
      y: svgPos.top
    };
  }

  currentOffset(e) {
    return {
      x: e.pageX - this.state.svgOffset.x,
      y: e.pageY - this.state.svgOffset.y
    };
  }

  addTransitionHandler(addTransition) {
    return (stateId, e) => {
      let transition = addTransition();
      transition.start.state = this.props.store.states[stateId];
      transition.finish.offset = this.currentOffset(e);
      this.setState({ transition });
      document.addEventListener('mousemove', this.documentMouseMove);
      document.addEventListener('mouseup', this.documentMouseUp);
    }
  }

  documentMouseMove(e) {
    if (this.state.transition != null) {
      let offset = this.state.transition.finish.offset = this.currentOffset(e),
        states = this.props.store.states;

      let hoverState = null;
      states.forEach( (state, id) => {
        const hover = (state.x <= offset.x)
          && (offset.x <=state.x + StateModel.default.width)
          && (state.y <= offset.y)
          && (offset.y <=state.y + StateModel.default.height)
          && id != states.indexOf(this.state.transition.start.state);
        const tmpHoverState = this.props.methods.state.setHover(id, hover);

        if (hover) {
          hoverState = tmpHoverState;
        }
      } );

      this.setState({hoverState});
    }
  }

  documentMouseUp(e) {
    if (this.state.transition != null) {
      if (this.state.hoverState != null) {
        this.state.transition.finish.state = this.state.hoverState;
      } else {
        this.props.methods.transition.remove(this.state.transition);
      }
    }

    document.removeEventListener('mousemove', this.documentMouseMove);
    document.removeEventListener('mouseup', this.documentMouseUp);

    this.props.store.states.forEach( (state, id) => {
      state.hover = false;
    } );

    this.setState({
      transition: null,
      haverState: null
    });
  }

  render() {
    const store = this.props.store,
      methods = this.props.methods,

      stateRects = store.states.cmap( (state, id) => (
        <State data={state} id={id} key={id}
          dragHandler={methods.state.drag}
          dragStateId={methods.dragStateId}
          addTransitionHandler={this.addTransitionHandler(methods.transition.add).bind(this)}/>
      ) ),

      transitionArrows = store.transitions.cmap( (transition, id) => (
        <Transition data={transition} key={id} />
      ) );

    return (
      <svg width="600" height="600" ref={ (svg) => { this.svg = svg; } }>
        {stateRects}
        {transitionArrows}
      </svg>
    );
  }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Context);
