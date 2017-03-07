import React, { PropTypes } from 'react';

import PlaceModel from '../models/PlaceModel';
import DragNode from '../hoc/DragNode';
import Node from './Node';

function Place(props) {
  const { data } = props;
  let className = 'place';

  if (data.type > 0) {
    const type = data.typeLabel();
    className += ` ${type}-place`;
  }

  return (
    <g className={className}>
      <Node data={data} />
    </g>
  );
}

Place.propTypes = {
  data: PropTypes.instanceOf(PlaceModel).isRequired,
};

export default DragNode('place')(Place);
