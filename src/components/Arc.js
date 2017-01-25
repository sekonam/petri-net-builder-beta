import React, {PropTypes} from 'react';

import Query from '../core/Query.js';
import ArcModel from '../models/ArcModel.js';

export default class Arc extends React.Component {

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
    const arc = this.props.data,
      {offset} = this.props,
      query = Query.instance,
      startPlace = query.socket.nodeId(arc.startSocketId),
      startSocket = query.socket.get(arc.startSocketId),
      startOffset = this.socketOffset( startPlace, startSocket );

    let finishOffset = offset;

    if (arc.finishSocketId) {
      const finishPlace = query.socket.nodeId(arc.finishSocketId),
        finishSocket = query.socket.get(arc.finishSocketId);
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
      <g className='arc' onClick={this.props.editHandler}>
        <path d={pathStr} className='arc-line' style={arc.color ? {stroke: arc.color} : {}} />
      </g>
    );
  }
}

Arc.propTypes = {
  data: PropTypes.instanceOf(ArcModel).isRequired,
  offset: PropTypes.object,
  editHandler: PropTypes.func.isRequired
};
