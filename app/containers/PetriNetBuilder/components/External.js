import React, { PropTypes } from 'react';

import Query from '../core/Query';
import ExternalModel from '../models/ExternalModel';
import DragNode from '../hoc/DragNode';
import Node from './Node';

function External(props) {
  const query = Query.instance;
  const { data } = props;
  const externalNode = query.external.node(data.id);

  if (externalNode) {
    ['name', 'width', 'height', 'r'].forEach(
      (propName) => {
        data[propName] = externalNode[propName];
      }
    );
  }

  return (
    <g className="external">
      <Node data={data} />
    </g>
  );
}

External.propTypes = {
  data: PropTypes.instanceOf(ExternalModel).isRequired,
};

export default DragNode('external')(External);
