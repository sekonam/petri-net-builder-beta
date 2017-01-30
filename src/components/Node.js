import React, {PropTypes} from 'react';

import Store from '../core/Store.js';
import NodeModel from '../models/PlaceModel.js';
import Sockets from './Sockets.js';

export default class Node extends React.Component {

  render() {
    const {data, setMouseOffset} = this.props,
      methods = Store.instance,
      { x, y, width, height, r } = data;

    return (
      <g className="node" id={data.id}>
        <rect className="node-rect" x={x} y={y}
          width={width + 'px'} height={height + 'px'} rx={r} ry={r}
          style={data.color ? {fill: data.color} : {}}></rect>
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
