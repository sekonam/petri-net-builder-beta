import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';
import Types from './types.js';
import StateModel from '../models/state.js';

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

    return {
      id: props.id,
      x0: component.props.data.x,
      y0: component.props.data.y
    };
  },

  endDrag(props, monitor, component) {
    clearInterval(this.timerId);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

class State extends React.Component {

  render() {
    const { connectDragSource, id, data: { x, y }, addTransitionHandler} = this.props;

    return connectDragSource(
      <g>
        <rect className="state" x={x} y={y} id={id}
          width={StateModel.default.width + 'px'} height={StateModel.default.height + 'px'}></rect>
        <text className="state-txt" fontSize='16' x={x+10} y={y+25}>{this.props.data.shortName()}</text>
        <text className="state-transition-create" fontSize='16' x={x+180} y={y+25}
          onClick={(e) => addTransitionHandler(id, e) }>T</text>
      </g>
    );
  }
}

export default DragSource(Types.STATE, stateSource, collect)(State);
