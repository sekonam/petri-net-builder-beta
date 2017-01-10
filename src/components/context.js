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
      },
      mouseDown: null,
      translateX: 0,
      translateY: 0
    };

    this.zoomedOffset = this.zoomedOffset.bind(this);
    this.setMouseOffset = this.setMouseOffset.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
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
      viewport = this.props.viewport,
      w = this.svgWidth(),
      h = this.svgHeight();

    let x = offset.x - svgOffset.x,
      y = offset.y - svgOffset.y;

    return {
      x: w/2 + (x - w/2 - viewport.translateX) / viewport.zoom,
      y: h/2 + (y - h/2 - viewport.translateY) / viewport.zoom
    };
  }

  mouseDownHandler(e) {
    if (!this.props.active.state) {
      this.setState({
        mouseDown: {
          x: e.pageX,
          y: e.pageY
        },
        translateX: this.props.viewport.translateX,
        translateY: this.props.viewport.translateY
      });
    }
  }

  mouseUpHandler(e) {
    this.setState({
      mouseDown: null,
      translateX: 0,
      translateY: 0
    });
  }

  mouseMoveHandler(e) {
    const {active} = this.props;

    if (active.transition) {
      this.setMouseOffset( {
        x: e.pageX,
        y: e.pageY
      } );
    } else if (!active.state && this.state.mouseDown) {
      this.props.methods.translate.set(
        this.state.translateX + e.pageX - this.state.mouseDown.x,
        this.state.translateY + e.pageY - this.state.mouseDown.y
      );
    }
  }

  setMouseOffset( offset ) {
    this.setState( (prevState, props) => {
      prevState.mouseOffset = this.zoomedOffset( {
        x: offset.x,
        y: offset.y
      } );
      return prevState;
    } );
  }

  svgWidth() {
    return Math.max( 0, this.state.documentSize.width - 190 );
  }

  svgHeight() {
    return Math.max( 0, this.state.documentSize.height - 55 );
  }

  render() {
    const { store, methods, active } = this.props,

      states = store.states.cmap( (state, id) => (
        <State data={state} id={state.id} key={id}
          dragHandler={methods.state.drag}
          editHandler={methods.state.edit}
          removeHandler={methods.state.remove}
          zoomedOffset={this.zoomedOffset}
          setMouseOffset={this.setMouseOffset}
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

      activeTransition = active.transition ? (
        <Transition data={active.transition} offset={this.state.mouseOffset}
          editHandler={() => methods.transition.edit(active.transition.id)}
          getHandlers={getHandlers} />
      ) : '',

      groups = store.groups.cmap( (group, key) => {
        if (group.states.length) {
          const BIG_INT = 1000000,
            INDENT = 5;

          let max = {
              x: -BIG_INT,
              y: -BIG_INT
            },
            min = {
              x: BIG_INT,
              y: BIG_INT
            };

            group.states.forEach( (sid) => {
              const state = methods.state.get(sid);
              min.x = Math.min( min.x, state.x );
              min.y = Math.min( min.y, state.y );
              max.x = Math.max( max.x, state.x + state.width );
              max.y = Math.max( max.y, state.y + state.height );
            } );

            return (
              <g className="group" key={key}>
                <rect x={min.x - INDENT} y={min.y - INDENT}
                  width={max.x - min.x + 2 * INDENT} height={max.y - min.y + 2 * INDENT}
                  rx={INDENT} ry={INDENT} className="group-rect"/>
              </g>
            );
          }
      } ),

      viewport = this.props.viewport,
      transform = `translate(${viewport.translateX}px,${viewport.translateY}px) scale(${viewport.zoom})`;

    return (
      <svg width={ this.svgWidth() } height={ this.svgHeight() }
        onMouseMove={this.mouseMoveHandler} onClick={methods.transition.removeActive}
        onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler}
        ref={ (el) => { this.svg = el; } } >
        <g className="diagram-objects" style={{transform}}>
          <circle cx="1" cy="1" r="1" />
          <circle cx={ this.svgWidth() - 1 } cy={ this.svgHeight() - 1 } r="1" />
          <g className="groups">
            {groups}
          </g>
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
