import React, { PropTypes } from 'react';

import Place from './Place';
import Transition from './Transition';
import Subnet from './Subnet';
import External from './External';

export default function NodeByType(props) {
  const { data } = props;
  const type = data.entityName();

  switch (type) {
    case 'place':
      return <Place data={data} key={data.id} />;
    case 'subnet':
      return <Subnet data={data} key={data.id} />;
    case 'transition':
      return <Transition data={data} key={data.id} />;
    case 'external':
      return <External data={data} key={data.id} />;
    default:
      return null;
  }
}

NodeByType.propTypes = {
  data: PropTypes.object.isRequired,
};
