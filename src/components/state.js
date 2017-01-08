import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';
import Types from './types.js';
import StateModel from '../models/state.js';
import Socket from './Socket.js';

const stateSource = {
  beginDrag(props, monitor, component) {
    this.timerId = setInterval(
      () => {
        if (monitor.isDragging()) {
          const item = monitor.getItem(),
            offset = monitor.getClientOffset(),
            initialOffset = monitor.getInitialClientOffset(),
            x = item.x0 + offset.x - initialOffset.x,
            y = item.y0 + offset.y - initialOffset.y;
          component.props.dragHandler(props.id, x, y);
        }
      }, 10
    );

    component.props.dragStateId(props.id);

    return {
      id: props.id,
      x0: component.props.data.x,
      y0: component.props.data.y
    };
  },

  endDrag(props, monitor, component) {
    clearInterval(this.timerId);
    component.props.dragStateId(null);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

class CircleButton extends React.Component {
  render() {
    const {x, y} = this.props;
    return (
      <g className='transition-button' onClick={this.props.clickHandler}>
        <circle className="transition-circle" cx={x+4} cy={y} r='9' />
        <text className="transition-text" x={x} y={y+5}>
          {this.props.caption}</text>
      </g>
    );
  }
}

class State extends React.Component {

  render() {
    const { connectDragSource, id, data: { x, y },
      addTransitionHandler, removeHandler, editHandler} = this.props;

    return connectDragSource(
      <g className="state">
        <rect className="state-rect" x={x} y={y} id={id}
          width={StateModel.default.width + 'px'} height={StateModel.default.height + 'px'}></rect>
        <text className="state-txt" x={x+7} y={y+18}>{this.props.data.short('name', 11)}</text>
        <CircleButton clickHandler={(e) => addTransitionHandler(id, e)}
          x={x+25} y={y+35} caption="T"/>
        <CircleButton clickHandler={(e) => editHandler(id)}
          x={x+47} y={y+35} caption="E"/>
        <CircleButton clickHandler={(e) => removeHandler(id)}
          x={x+69} y={y+35} caption="D"/>
      </g>
    );
  }
}

export default DragSource(Types.STATE, stateSource, collect)(State);
