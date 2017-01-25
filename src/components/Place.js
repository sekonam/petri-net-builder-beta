import React, {PropTypes} from 'react';

import Query from '../core/Query.js';
import Store from '../core/Store.js';
import PlaceModel from '../models/PlaceModel.js';
import DragNode from '../hoc/DragNode.js';

import Socket from './Socket.js';
import CircleButton from './CircleButton.js';

class Place extends React.Component {

  render() {
    const {data} = this.props,
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
            setMouseOffset={this.props.setMouseOffset} />
        ) )
      );
    } );

    return (
      <g className="state place" id={data.id}>
        <rect className="state-rect" x={x} y={y}
          width={width + 'px'} height={height + 'px'} rx={r} ry={r}></rect>
        <text className="state-txt" x={x+7} y={y+25}>{this.props.data.short('name', 11)}</text>
        {socketTags}
        <CircleButton clickHandler={(e) => { methods.place.remove(data.id); e.stopPropagation(); }}
          x={x + width/2} y={y + height - 17} caption="D"/>
      </g>
    );
  }
}

Place.propTypes = {
  data: PropTypes.instanceOf(PlaceModel).isRequired,
  setMouseOffset: PropTypes.func.isRequired
};

export default DragNode('place')(Place);
