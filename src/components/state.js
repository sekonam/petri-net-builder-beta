import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';
import Types from '../types.js';

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
      x0: component.props.x,
      y0: component.props.y
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
    const { connectDragSource, id, x, y} = this.props;

    return connectDragSource(
      <rect className="state" x={x} y={y} id={id} />
    );
  }
}

export default DragSource(Types.STATE, stateSource, collect)(State);
