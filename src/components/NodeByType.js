import React, {PropTypes} from 'react';

import Place from './Place.js';
import Transition from './Transition.js';
import Subnet from './Subnet.js';
import External from './External.js';

export default class NodeByType extends React.Component {
  render() {
    const {data} = this.props,
      type = data.entityName();
    switch (type) {
      case 'place':
        return <Place data={data} key={data.id} />;
      case 'subnet':
        return <Subnet data={data} key={data.id} />;
      case 'transition':
        return <Transition data={data} key={data.id} />;
      case 'external':
        return <External data={data} key={data.id} />;
    }
    return null;
  }
}

NodeByType.propTypes = {
    data: PropTypes.object.isRequired
};
