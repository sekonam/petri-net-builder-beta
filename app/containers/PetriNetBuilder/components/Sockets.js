import React, { PropTypes } from 'react';

import Query from '../core/Query';
import NodeModel from '../models/NodeModel';
import Socket from './Socket';

export default function Sockets(props) {
  const { data } = props;
  const query = Query.instance;

  const sockets = query
    .sockets(data.socketIds)
    .map((socket) => (
      <Socket data={socket} key={socket.id} />
    ));

  return (
    <g className="sockets">
      {sockets}
    </g>
  );
}

Sockets.propTypes = {
  data: PropTypes.instanceOf(NodeModel).isRequired,
};
