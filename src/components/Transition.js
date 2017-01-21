import React, {PropTypes} from 'react';

import Query from '../core/Query.js';
import TransitionModel from '../models/TransitionModel.js';

export default class Transition extends React.Component {

  socketOffset(place, socket) {
    const query = Query.instance,
      sockets = query.sockets( place.socketIds ).filter( (el) => el.type == socket.type ),
      pos = sockets.indexOf(socket),
      step = place.height / (sockets.length + 1);
    return {
      x: place.x + (socket.type ? place.width : 0),
      y: place.y + step * (pos + 1)
    };
  }

  render() {
    const transition = this.props.data,
      {offset} = this.props,
      query = Query.instance,
      startPlace = query.nodeBySocketId(transition.startSocketId),
      startSocket = query.socket(transition.startSocketId),
      startOffset = this.socketOffset( startPlace, startSocket );

    let finishOffset = offset;

    if (transition.finish.socketId) {
      const finishPlace = query.nodeBySocketId(transition.finishSocketId),
        finishSocket = query.socket(transition.finishSocketId);
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
  editHandler: PropTypes.func.isRequired
};
