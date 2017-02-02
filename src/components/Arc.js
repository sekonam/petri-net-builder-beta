import React, {PropTypes} from 'react';

import Store from '../core/Store.js';
import Query from '../core/Query.js';
import ArcModel from '../models/ArcModel.js';

export default class Arc extends React.Component {

  pivot(p, side, shift = Arc.pivotShift) {
    switch (side) {
      case 'top': return {
        x: p.x,
        y: p.y - shift
      };
      case 'right': return {
        x: p.x + shift,
        y: p.y
      };
      case 'bottom': return {
        x: p.x,
        y: p.y + shift
      };
      case 'left': return {
        x: p.x - shift,
        y: p.y
      };
      default: return p;
    }
  }

  render() {
    const query = Query.instance,
      methods = Store.instance,
      data = this.props.data,
      {offset} = this.props,
      startOffset = query.socket.offset(data.startSocketId),
      startSide = query.socket.side(data.startSocketId);

    let finishOffset,
      finishSide = 'right';

    if (data.finishSocketId) {
      finishOffset = query.socket.offset(data.finishSocketId);
      finishSide = query.socket.side(data.finishSocketId)
    } else {
      finishOffset = {
        x: startOffset.x + offset.x,
        y: startOffset.y + offset.y
      };
    }

    const
      a = startOffset,
      b = finishOffset,
      minDistance = Math.sqrt(2) * Arc.pivotShift,
      distance = (p1, p2) => Math.sqrt(Math.pow(p1.x-p2.x, 2) + Math.pow(p1.y-p2.y, 2));

    if (distance(a, b) > 0) {
      let
        c = this.pivot(startOffset, startSide),
        d = this.pivot(finishOffset, finishSide),
        path = '';

      if (distance(a, b) < minDistance) {
        path = `M${a.x} ${a.y} L ${b.x} ${b.y}`;
        c = a;
        d = b;
      } else {
        path = `M${a.x} ${a.y} C ${c.x}, ${c.y} ${d.x}, ${d.y} ${b.x}, ${b.y}`;

        const vals = {
          left:0,
          right:1,
          top:10,
          bottom:11
        },
        k = Math.abs(vals[startSide] - vals[finishSide]) == 1 ? 1/2 : 3/4;

        c = this.pivot(startOffset, startSide, k*Arc.pivotShift);
        d = this.pivot(finishOffset, finishSide, k*Arc.pivotShift);
      }

      const
        avg = (p1, p2) => ({
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2
        }),
        sign = (v) => v > 0 ? 1 : -1,
        e = avg(c, d),
        tangent = {
          x: d.x - c.x,
          y: d.y - c.y
        },
        markerLineShift = 10,
        f = {x:e.x, y:e.y};

      if (Math.abs(tangent.x) > Math.abs(tangent.y)) {
        f.x += sign(tangent.x) * markerLineShift;
        f.y += (f.x - e.x) * tangent.y / tangent.x;
      } else {
        f.y += sign(tangent.y) * markerLineShift;
        f.x += (f.y - e.y) * tangent.x / tangent.y;
      }

      return (
        <g className='arc' onClick={() => {
          if (!offset) methods.arc.edit(data.id);
        }}>
          <defs>
            <marker className='arc-marker' id={'arrow-' + data.id} viewBox="0 0 10 10"
              refX="1" refY="5" markerWidth="4" markerHeight="4" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <g className='arc-line' style={data.color ? {stroke: data.color} : {}}>
            <path d={path} />
            <line markerStart={`url(#arrow-${data.id})`} x1={e.x} y1={e.y} x2={f.x} y2={f.y} />
          </g>
        </g>
      );
    }
    return null;
  }
}

Arc.propTypes = {
  data: PropTypes.instanceOf(ArcModel).isRequired,
  offset: PropTypes.object
};
Arc.pivotShift = 100;
