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

class State extends React.Component {

  render() {
    const { connectDragSource, id, data: { x, y }, addTransitionHandler} = this.props;

    return connectDragSource(
      <g className="state">
        <rect className="state-rect" x={x} y={y} id={id}
          width={StateModel.default.width + 'px'} height={StateModel.default.height + 'px'}></rect>
        <text className="state-txt" fontSize='16' x={x+10} y={y+25}>{this.props.data.shortName()}</text>
        <g className='transition-create' onClick={(e) => addTransitionHandler(id, e) }>
          <circle className="transition-create-circle" cx={x+184} cy={y+18} r='12' />
          <text className="transition-create-text" fontSize='16' x={x+180} y={y+25}>T</text>
        </g>
      </g>
    );
  }
}

export default DragSource(Types.STATE, stateSource, collect)(State);
