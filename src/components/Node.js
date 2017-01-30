import React, {PropTypes} from 'react';

import Store from '../core/Store.js';
import Query from '../core/Query.js';
import NodeModel from '../models/PlaceModel.js';
import Sockets from './Sockets.js';

export default class Node extends React.Component {

  render() {
    const {data, setMouseOffset} = this.props,
      methods = Store.instance,
      query = Query.instance,
      { x, y, width, height, r } = data,
      style = {};

    if (data.color) {
      style.fill = data.color;
    }

    if (query.active.isSet() && data.id == query.active.data.id) {
      style.strokeWidth = '2px';
    }

    return (
      <g className="node" id={data.id}>
        <rect className="node-rect" style={style} x={x} y={y}
          width={width + 'px'} height={height + 'px'} rx={r} ry={r} />
        <text className="node-txt" x={x} y={y+height+12}>{this.props.data.short('name', Math.round(width/6.5))}</text>
        <Sockets data={data} setMouseOffset={setMouseOffset} />
      </g>
    );
  }
}

Node.propTypes = {
  data: PropTypes.object.isRequired,
  setMouseOffset: PropTypes.func.isRequired
};
