import React, { PropTypes } from 'react';

import Query from '../core/Query';
import Sockets from './Sockets';

export default function Node(props) {
  const { data } = props;
  const query = Query.instance;
  const { x, y, r } = data;
  const { width, height } = data.getSize();
  let className = 'node';

  if (query.active.isSet() && data.id === query.active.data.id) {
    className += ' active';
  } else if (query[data.entityName()].selected().indexOf(data.id) > -1) {
    className += ' selected';
  }

  const nameLines = data
    .multilineName()
    .map(
      (line, key) => (
        <tspan
          dy="15px"
          x={x + (width / 2)}
          textAnchor="middle"
          key={`${data.id}-${key}`}>
          {line}
        </tspan>
      )
    );

  if (query.settings.nodeType() === 'schema') {
    className += ' node-schema';

    return (
      <g className={className} id={data.id}>
        <rect
          className="node-rect" x={x} y={y}
          width={`${width}px`} height={`${height}px`} rx={r} ry={r}
        />
        <text className="node-txt" y={y + data.R()}>
          {nameLines}
        </text>
        <Sockets data={data} />
      </g>
    );
  }

  className += ' node-default';
  const style = {};

  if (data.color) {
    style.fill = data.color;
  }

  return (
    <g className={className} id={data.id}>
      <rect
        className="node-rect" style={style} x={x} y={y}
        width={`${width}px`} height={`${height}px`} rx={r} ry={r}
      />
      <text className="node-txt" x={x} y={y + height}>
        {nameLines}
      </text>
      <Sockets data={data} />
    </g>
  );
}

Node.propTypes = {
  data: PropTypes.object.isRequired,
};
