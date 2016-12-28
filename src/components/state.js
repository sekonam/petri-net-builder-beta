import React from 'react';
import { DragSource } from 'react-dnd';
import Types from '../types.js';

const stateSource = {
  beginDrag(props) {
    return {
      name: props.name
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    offset: monitor.getClientOffset()
  }
}

class State extends React.Component {

  render() {
    const { isDragging, connectDragSource, offset, name, x, y } = this.props;
    return connectDragSource(
      <rect className="state" x={x} y={y}>{name}</rect>
    );
  }
}

export default DragSource(Types.STATE, stateSource, collect)(State);
