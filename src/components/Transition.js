import React, {PropTypes} from 'react';

import TransitionModel from '../models/TransitionModel.js';
import DragNode from '../hoc/DragNode.js';
import Node from './Node.js';

class Transition extends React.Component {

  render() {
    const {data} = this.props;

    return (
      <g className="transition">
        <Node data={data} />
      </g>
    );
  }
}

Transition.propTypes = {
  data: PropTypes.instanceOf(TransitionModel).isRequired
};

export default DragNode('transition')(Transition);
