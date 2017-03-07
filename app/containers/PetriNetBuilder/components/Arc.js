import React, { PropTypes } from 'react';

import { AnotherSide } from '../core/Entities';
import Store from '../core/Store';
import Query from '../core/Query';
import ArcModel from '../models/ArcModel';

const PIVOT_SHIFT = 40;

export default class Arc extends React.Component {

  pivot(p, side, shift = PIVOT_SHIFT) {
    switch (side) {
      case 'top': return {
        x: p.x,
        y: p.y - shift,
      };
      case 'right': return {
        x: p.x + shift,
        y: p.y,
      };
      case 'bottom': return {
        x: p.x,
        y: p.y + shift,
      };
      case 'left': return {
        x: p.x - shift,
        y: p.y,
      };
      default: return p;
    }
  }

  render() {
    const query = Query.instance;
    const methods = Store.instance;
    const { data, offset, center } = this.props;
    const startOffset = query.socket.offset(data.startSocketId);
    const startSide = query.socket.side(data.startSocketId);

    let finishOffset;
    let finishSide;

    if (data.finishSocketId) {
      finishOffset = query.socket.offset(data.finishSocketId);
      finishSide = query.socket.side(data.finishSocketId);
    } else {
      finishOffset = query.viewport.offset(offset, center);
      finishSide = AnotherSide[startSide];
    }

    const a = startOffset;
    const b = finishOffset;
    const minDistance = Math.sqrt(2) * PIVOT_SHIFT;
    const distance = (p1, p2) => Math.sqrt(((p1.x - p2.x) ** 2) + ((p1.y - p2.y) ** 2));

    if (distance(a, b) > 0) {
      let c = this.pivot(startOffset, startSide);
      let d = this.pivot(finishOffset, finishSide);
      let path = '';

      if (distance(a, b) < minDistance) {
        path = `M${a.x} ${a.y} L ${b.x} ${b.y}`;
        c = a;
        d = b;
      } else {
        path = `M${a.x} ${a.y} C ${c.x}, ${c.y} ${d.x}, ${d.y} ${b.x}, ${b.y}`;

        const vals = {
          left: 0,
          right: 1,
          top: 10,
          bottom: 11,
        };
        const k = Math.abs(vals[startSide] - vals[finishSide]) === 1 ? 1 / 2 : 3 / 4;

        c = this.pivot(startOffset, startSide, k * PIVOT_SHIFT);
        d = this.pivot(finishOffset, finishSide, k * PIVOT_SHIFT);
      }

      const avg = (p1, p2) => ({
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      });
      const sign = (v) => v > 0 ? 1 : -1;
      const e = avg(c, d);
      const tangent = {
        x: d.x - c.x,
        y: d.y - c.y,
      };
      const markerLineShift = 10;
      const f = { x: e.x, y: e.y };

      if (Math.abs(tangent.x) > Math.abs(tangent.y)) {
        f.x += sign(tangent.x) * markerLineShift;
        f.y += (f.x - e.x) * tangent.y / tangent.x;
      } else {
        f.y += sign(tangent.y) * markerLineShift;
        f.x += (f.y - e.y) * tangent.x / tangent.y;
      }

      return (
        <g
          className="arc" onClick={() => {
            if (!offset) methods.arc.edit(data.id);
          }}>
          <defs>
            <marker
              className="arc-marker" id={`arrow-${data.id}`} viewBox="0 0 10 10"
              refX="1" refY="5" markerWidth="4" markerHeight="4" orient="auto"
              style={data.color ? { fill: data.color, stroke: data.color } : {}}>
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          <g className="arc-line" style={data.color ? { stroke: data.color } : {}}>
            <path d={path} style={{ strokeDasharray: data.dasharray }} />
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
  offset: PropTypes.object,
  center: PropTypes.object,
};
