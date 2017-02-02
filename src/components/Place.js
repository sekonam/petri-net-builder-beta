import React, {PropTypes} from 'react';

import PlaceModel from '../models/PlaceModel.js';
import DragNode from '../hoc/DragNode.js';
import Node from './Node.js';

class Place extends React.Component {

  render() {
    const {data} = this.props;

    return (
      <g className="place">
        <Node data={data} />
      </g>
    );
  }
}

Place.propTypes = {
  data: PropTypes.instanceOf(PlaceModel).isRequired
};

export default DragNode('place')(Place);
