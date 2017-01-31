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
    const data = this.props.data,
      {offset} = this.props,
      query = Query.instance,
      startPlace = query.socket.nodeId(data.startSocketId),
      startSocket = query.socket.get(data.startSocketId),
      startOffset = this.socketOffset( startPlace, startSocket );

    let finishOffset = offset;

    if (data.finishSocketId) {
      const finishPlace = query.socket.nodeId(data.finishSocketId),
        finishSocket = query.socket.get(data.finishSocketId);
      finishOffset = this.socketOffset( finishPlace, finishSocket );
    }

    const a = startOffset, b = finishOffset,
      diff = {
        x: 100,//Math.min( 200, Math.abs(b.x - a.x) ),
        y: 0
      },
      c = {
        x: a.x + diff.x,
        y: a.y + diff.y
      },
      d = {
        x: b.x - diff.x,
        y: b.y - diff.y
      };

    const pathStr = `M${a.x} ${a.y} C ${c.x} ${c.y}, ${d.x} ${d.y}, ${b.x} ${b.y}`;

    return (
      <g className='arc' onClick={this.props.editHandler}>
        <path d={pathStr} className='arc-line' style={data.color ? {stroke: data.color} : {}} />
      </g>
    );
  }
}

Arc.propTypes = {
  data: PropTypes.instanceOf(ArcModel).isRequired,
  offset: PropTypes.object,
  editHandler: PropTypes.func.isRequired
};
