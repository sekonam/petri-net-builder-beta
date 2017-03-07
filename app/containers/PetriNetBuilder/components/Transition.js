import React, { PropTypes } from 'react';

import TransitionModel from '../models/TransitionModel';
import DragNode from '../hoc/DragNode';
import Node from './Node';

function Transition(props) {
  const { data } = props;

  return (
    <g className="transition">
      <Node data={data} />
    </g>
  );
}

Transition.propTypes = {
  data: PropTypes.instanceOf(TransitionModel).isRequired,
};

export default DragNode('transition')(Transition);
