import React, {PropTypes} from 'react';

import Place from './Place.js';
import Transition from './Transition.js';
import Subnet from './Subnet.js';

export default class NodeByType extends React.Component {
  render() {
    const {type, data} = this.props;
    switch (type) {
      case 'place':
        return (
          <Place data={data} key={data.id} />
        );
        break;
      case 'subnet':
        return (
          <Subnet data={data} key={data.id} />
        );
        break;
      case 'transition':
        return (
          <Transition data={data} key={data.id} />
        );
        break;
    }
    return null;
  }
}

NodeByType.propTypes = {
    data: PropTypes.object.isRequired
};
