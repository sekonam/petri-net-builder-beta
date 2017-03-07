import React, { PropTypes } from 'react';

import Store from '../core/Store';
import SubnetModel from '../models/SubnetModel';
import DragNode from '../hoc/DragNode';
import Node from './Node';

function Subnet(props) {
  const { data } = props;
  const methods = Store.instance;

  return (
    <g className="subnet" onDoubleClick={() => methods.subnet.enter(data.id)}>
      <Node data={data} />
    </g>
  );
}

Subnet.propTypes = {
  data: PropTypes.instanceOf(SubnetModel).isRequired,
};

export default DragNode('subnet')(Subnet);
