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
      documentSize: {
        width: 0,
        height: 0
      },
      mouseOffset: {
        x: 0,
        y: 0
      }
    };
    this.zoomedOffset = this.zoomedOffset.bind(this);
  }

  componentDidMount() {
    this.setState( {
      documentSize: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    } );
  }

  fullElementOffset(element) {
    const rect = element.getBoundingClientRect(),
      scrollX = window.pageXOffset || document.documentElement.scrollLeft,
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
    return {
      x: scrollX + rect.left,
      y: scrollY + rect.top
    };
  }

  zoomedOffset(offset) {
    const svgOffset = this.fullElementOffset(this.svg),
      zoom = this.props.viewport.zoom,
      w = this.svgWidth(),
      h = this.svgHeight();

    let x = offset.x - svgOffset.x,
      y = offset.y - svgOffset.y;

    return {
      x: w/2 + (x - w/2) / zoom,
      y: h/2 + (y - h/2) / zoom
    };
  }

  mouseMoveHandler(e) {
    if (this.props.transition) {
      const x = e.pageX,
        y = e.pageY;

      this.setState( (prevState, props) => {
        prevState.mouseOffset = this.zoomedOffset( { x, y } );
        return prevState;
      } );
    }
  }

  svgWidth() {
    return Math.max( 0, this.state.documentSize.width - 190 );
  }

  svgHeight() {
    return Math.max( 0, this.state.documentSize.height - 55 );
  }

  render() {
    const store = this.props.store,
      methods = this.props.methods,

      states = store.states.cmap( (state, id) => (
        <State data={state} id={state.id} key={id}
          dragHandler={methods.state.drag}
          dragStateId={methods.dragStateId}
          editHandler={methods.state.edit}
          removeHandler={methods.state.remove}
          zoomedOffset={this.zoomedOffset}
          methods={methods}/>
      ) ),

      getHandlers = {
        state: methods.state.get,
        socket: methods.socket.get
      },

      transitions = store.transitions.cmap( (transition, id) => (
        <Transition data={transition} key={id}
          editHandler={() => methods.transition.edit(transition.id)}
          getHandlers={getHandlers} />
      ) ),

      activeTransition = this.props.transition ? (
        <Transition data={this.props.transition} offset={this.state.mouseOffset}
          editHandler={() => methods.transition.edit(this.props.transition.id)}
          getHandlers={getHandlers} />
      ) : '',

      viewport = this.props.viewport,
      transform = `translate( ${viewport.translateX}, ${viewport.translateY} ) scale(${viewport.zoom})`;

    return (
      <svg width={ this.svgWidth() } height={ this.svgHeight() }
        onMouseMove={this.mouseMoveHandler.bind(this)} onClick={methods.transition.removeActive}
        ref={ (el) => { this.svg = el; } } >
        <g className="diagram-objects" style={{transform}}>
          <circle cx="1" cy="1" r="1" />
          <circle cx={ this.svgWidth() - 1 } cy={ this.svgHeight() - 1 } r="1" />
          <g className="transitions">
            {transitions}
          {activeTransition}
          </g>
          <g className="states">
            {states}
          </g>
        </g>
      </svg>
    );
  }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Context);
