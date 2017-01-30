import React, {PropTypes} from 'react';

import SubnetModel from '../models/SubnetModel.js';
import DragNode from '../hoc/DragNode.js';
import Node from './Node.js';

class Subnet extends React.Component {

  render() {
    const {data, setMouseOffset} = this.props;

    return (
      <g className="subnet">
        <Node data={data} setMouseOffset={setMouseOffset} />
      </g>
    );
  }
}

Subnet.propTypes = {
  data: PropTypes.instanceOf(SubnetModel).isRequired,
  setMouseOffset: PropTypes.func.isRequired
};

export default DragNode('subnet')(Subnet);
