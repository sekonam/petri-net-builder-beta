import React, {PropTypes} from 'react';

import Query from '../core/Query.js';
import Store from '../core/Store.js';
import NodeModel from '../models/NodeModel.js';
import Socket from './Socket.js';

export default class Sockets extends React.Component {

  render() {
    const {data, setMouseOffset} = this.props,
      methods = Store.instance,
      query = Query.instance,
      { x, y, width, height, r } = data,
      typeNames = [ 'income', 'outcome' ];

    let sockets = {
        income: [],
        outcome: []
      },
      socketTags = [];

    if (data.socketIds.length) {
      data.socketIds.forEach( (sid) => {
        const socket = query.socket.get(sid);
        sockets[socket.typeName].push( socket );
      } );
    }

    typeNames.forEach( (typeName) => {
      const step = height / ( sockets[typeName].length + 1 );

      socketTags = socketTags.concat(
        sockets[typeName].cmap( (socket, key) => (
          <Socket data={socket} key={typeName + key}
            x={ x + ( socket.type ? width : 0 ) }
            y={ y + ( key + 1 ) * step }
            setMouseOffset={setMouseOffset} />
        ) )
      );
    } );

    return (
      <g className="sockets">
        {socketTags}
      </g>
    );
  }
}

Sockets.propTypes = {
  data: PropTypes.instanceOf(NodeModel).isRequired,
  setMouseOffset: PropTypes.func.isRequired
};
