import React, {PropTypes} from 'react';

import Store from '../core/Store.js';
import Query from '../core/Query.js';
import Sockets from './Sockets.js';

export default class Node extends React.Component {

  render() {
    const {data} = this.props,
      methods = Store.instance,
      query = Query.instance,
      { x, y, width, height, r } = data,
      style = {};

    if (data.color) {
      style.fill = data.color;
    }

    let className = 'node';

    if (query.active.isSet() && data.id == query.active.data.id) {
      className += ' active';
    } else if (query[data.entityName()].selected().has(data.id)) {
      className += ' selected';
    }

    return (
      <g className={className} id={data.id}>
        <rect className="node-rect" style={style} x={x} y={y}
          width={width + 'px'} height={height + 'px'} rx={r} ry={r} />
        <text className="node-txt" x={x} y={y+height}>
          {data.multiline('name', Math.round(width/6.5)).map(
            (line, key) => <tspan dy="1em" x={x} key={data.id + '-' + key}>{line}</tspan>
          )}
        </text>
        <Sockets data={data}/>
      </g>
    );
  }
}

Node.propTypes = {
  data: PropTypes.object.isRequired
};
