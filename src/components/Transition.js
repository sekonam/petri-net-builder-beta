import React, {PropTypes} from 'react';

import TransitionModel from '../models/TransitionModel.js';

export default class Transition extends React.Component {

  socketOffset(place, socket) {
    const sockets = place.sockets.filter( (el) => el.type == socket.type ),
      pos = sockets.indexOf(socket),
      step = place.height / (sockets.length + 1);
    return {
      x: place.x + (socket.type ? place.width : 0),
      y: place.y + step * (pos + 1)
    };
  }

  render() {
    const transition = this.props.data,
      {getHandlers, offset} = this.props,
      startPlace = getHandlers.place(transition.start.nodeId),
      startSocket = getHandlers.socket(transition.start.nodeId)(transition.start.socketId),
      startOffset = this.socketOffset( startPlace, startSocket );

    let finishOffset = offset;

    if (transition.finish.socketId) {
      const finishPlace = getHandlers.place(transition.finish.nodeId),
        finishSocket = getHandlers.socket(transition.finish.nodeId)(transition.finish.socketId);
      finishOffset = this.socketOffset( finishPlace, finishSocket );
    }

    const a = startOffset, b = finishOffset,
      diff = {
        x: b.x - a.x,
        y: b.y - a.y
      },
      c = {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
      };

    let pathStr = 'M' + a.x + ',' + a.y + ' ';
    pathStr += 'C';
    pathStr += a.x + diff.x / 3 * 2 + ',' + a.y + ' ';
    pathStr += a.x + diff.x / 3 + ',' + b.y + ' ';
    pathStr += b.x + ',' + b.y;

    return (
      <g className='transition' onClick={this.props.editHandler}>
        <path d={pathStr} className='transition-line' />
        <circle cx={c.x} cy={c.y} r='7' className='transition-circle' />
      </g>
    );
  }
}

Transition.propTypes = {
  data: PropTypes.instanceOf(TransitionModel).isRequired,
  offset: PropTypes.object,
  editHandler: PropTypes.func.isRequired,
  getHandlers: PropTypes.object.isRequired
};
