import React, {PropTypes} from 'react';

import Query from '../core/Query.js';
import NodeModel from '../models/NodeModel.js';
import Socket from './Socket.js';

export default class Sockets extends React.Component {

  render() {
    const {data} = this.props,
      query = Query.instance;

    const sockets = query.sockets(data.socketIds).map( (socket) => (
      <Socket data={socket} key={socket.id}/>
    ) );;

    return (
      <g className="sockets">
        {sockets}
      </g>
    );
  }
}

Sockets.propTypes = {
  data: PropTypes.instanceOf(NodeModel).isRequired
};
