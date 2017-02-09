import React, {PropTypes} from 'react';

import Query from '../core/Query.js';
import ExternalModel from '../models/ExternalModel.js';
import DragNode from '../hoc/DragNode.js';
import Node from './Node.js';

class External extends React.Component {

  render() {
    const
      query = Query.instance,
      {data} = this.props,
      externalNode = query.external.node(data.id);

    let className = 'external';
    if (externalNode) {
      ['name','width','height','r',].forEach(
        (propName) => {
          data[propName] = externalNode[propName];
        }
      );
    }

    return (
      <g className={className}>
        <Node data={data} />
      </g>
    );
  }
}

External.propTypes = {
  data: PropTypes.instanceOf(ExternalModel).isRequired
};

export default DragNode('external')(External);
