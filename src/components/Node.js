import React, {PropTypes} from 'react';

import Store from '../core/Store.js';
import Query from '../core/Query.js';
import Sockets from './Sockets.js';

export default class Node extends React.Component {

  render() {
    const {data} = this.props,
      methods = Store.instance,
      query = Query.instance,
      {x, y, r} = data,
      {width, height} = data.getSize();

    let className = 'node';
    if (query.active.isSet() && data.id == query.active.data.id) {
      className += ' active';
    } else if (query[data.entityName()].selected().has(data.id)) {
      className += ' selected';
    }

    const nameLines = data.multilineName().map(
        (line, key) => (<tspan
            dy="15px"
            x={x + width/2}
            textAnchor="middle"
            key={data.id + '-' + key}
          >{line}</tspan>)
      );

    if (query.settings.nodeType() == 'schema') {
      className += ' node-schema';

      return (
        <g className={className} id={data.id}>
          <rect className="node-rect" x={x} y={y}
            width={width + 'px'} height={height + 'px'} rx={r} ry={r} />
          <text className="node-txt" y={y + data.R()}>
            {nameLines}
          </text>
          <Sockets data={data}/>
        </g>
      );
    } else {
      className += ' node-default';

      const style = {};

      if (data.color) {
        style.fill = data.color;
      }

      return (
        <g className={className} id={data.id}>
          <rect className="node-rect" style={style} x={x} y={y}
            width={width + 'px'} height={height + 'px'} rx={r} ry={r} />
          <text className="node-txt" x={x} y={y+height}>
            {nameLines}
          </text>
          <Sockets data={data}/>
        </g>
      );
    }
  }
}

Node.propTypes = {
  data: PropTypes.object.isRequired
};
