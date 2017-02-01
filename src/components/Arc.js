import React, {PropTypes} from 'react';

import Query from '../core/Query.js';
import ArcModel from '../models/ArcModel.js';

export default class Arc extends React.Component {

  socketOffset(socket, node, group) {
    const query = Query.instance;
    let socketIds = node.socketIds,
      size = node;

    if (group) {
      socketIds = query.group.externalSocketIds(group.id);
      size = query.group.size(group.id);
    }

    const sockets = query.sockets( socketIds ).filter( (el) => el.type == socket.type ),
      pos = sockets.indexOf(socket),
      step = size.height / (sockets.length + 1);

    return {
      x: size.x + (socket.type ? size.width : 0),
      y: size.y + step * (pos + 1)
    };
  }

  render() {
    const data = this.props.data,
      {offset} = this.props,
      query = Query.instance,
      startOffset = query.socket.offset(data.startSocketId),
      startSide = query.socket.side(data.startSocketId);

    let finishOffset = offset,
      finishSide = 'left';

    if (data.finishSocketId) {
      finishOffset = query.socket.offset(data.finishSocketId);
      finishSide = query.socket.side(data.finishSocketId)
    }

    const a = startOffset,
      b = finishOffset,
      maxShift = 10,
      minDiff = 100,
      genDiff = (side) => side == 'left' || side == 'right'
        ? {x: minDiff, y: 0}
        : {x: 0, y: minDiff},
      avg = (v1, v2) => (v1 + v2) / 2;
    let diffA = genDiff(startSide),
      diffB = genDiff(finishSide),
      pathStr,
      tangentLen = {
        x: b.x - a.x - avg(diffA.x, diffB.x),
        y: b.y - a.y - avg(diffA.y, diffB.y)
      };

    if (tangentLen.x <= minDiff / 2 && tangentLen.y <= minDiff / 2
      && tangentLen.x >= -minDiff && tangentLen.y >= -minDiff
    ) {
      pathStr = `M${a.x} ${a.y} L ${b.x} ${b.y}`;
      diffA = diffB = { x: 0, y:0 };
    } else {
      const c = {
          x: a.x + (startSide == 'left' ? -1 : 1 ) * diffA.x,
          y: a.y + (startSide == 'top' ? -1 : 1 ) * diffA.y
        },
        d = {
          x: b.x - (finishSide == 'left' ? 1 : -1 ) * diffB.x,
          y: b.y - (finishSide == 'top' ? 1 : -1 ) * diffB.y
        };
      pathStr = `M${a.x} ${a.y} C ${c.x} ${c.y}, ${d.x} ${d.y}, ${b.x} ${b.y}`;
    }

    tangentLen = {
        x: b.x - a.x - avg(diffA.x, diffB.x),
        y: b.y - a.y - avg(diffA.y, diffB.y)
      };
    const lineStart = {
        x: a.x + diffA.x/2 + tangentLen.x/2,
        y: a.y + diffA.y/2 + tangentLen.y/2
      };

    let lineEnd = {
        x: lineStart.x,
        y: lineStart.y
      };

    const sign = (v) => v >= 0 ? 1 : -1,
      kx = sign(tangentLen.x),
      ky = sign(tangentLen.y);

    if (Math.abs(tangentLen.x) > Math.abs(tangentLen.y)) {
      lineEnd.x += kx * maxShift;
      lineEnd.y += ky * maxShift * Math.abs(tangentLen.y / tangentLen.x);
    } else {
      lineEnd.x += kx * maxShift * Math.abs(tangentLen.x / tangentLen.y);
      lineEnd.y += ky * maxShift;
    }

    return (
      <g className='arc' onClick={this.props.editHandler}>
        <defs>
          <marker className='arc-marker' id={'arrow-' + data.id} viewBox="0 0 10 10"
            refX="1" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" />
          </marker>
        </defs>
        <g className='arc-line' style={data.color ? {stroke: data.color} : {}}>
          <path d={pathStr} />
          <line markerStart={`url(#arrow-${data.id})`}
            x1={lineStart.x} y1={lineStart.y} x2={lineEnd.x} y2={lineEnd.y} />
        </g>
      </g>
    );
  }
}

Arc.propTypes = {
  data: PropTypes.instanceOf(ArcModel).isRequired,
  offset: PropTypes.object,
  editHandler: PropTypes.func.isRequired
};
