import React, {PropTypes} from 'react';

import Query from '../core/Query.js';
import Store from '../core/Store.js';
import DragNode from '../hoc/DragNode.js';
import SubnetModel from '../models/SubnetModel.js';

import Socket from './Socket.js';
import CircleButton from './CircleButton.js';

class Subnet extends React.Component {

  constructor(props) {
    super(props);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  onMouseUp(e) {
    Store.instance.subnet.edit(this.props.data.id);
  }

  render() {
    const methods = Store.instance,
      query = Query.instance,
      {data} = this.props,
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
      <g className="state subnet" id={data.id}>
        <rect className="state-rect" x={x} y={y}
          width={width + 'px'} height={height + 'px'} rx={r} ry={r}
          style={data.color ? {fill: data.color} : {}}></rect>
        <text className="state-txt" x={x+7} y={y+21}>{this.props.data.short('name', Math.round(data.width/10))}</text>
        {socketTags}
        <CircleButton clickHandler={(e) => { methods.subnet.enter(data.id); e.stopPropagation(); }}
          x={x + width/2 - 16} y={y + height - 17} caption="E"/>
        <CircleButton clickHandler={(e) => { methods.subnet.remove(data.id); e.stopPropagation(); }}
          x={x + width/2 + 8} y={y + height - 17} caption="D"/>
      </g>
    );
  }
}

Subnet.propTypes = {
  data: PropTypes.instanceOf(SubnetModel).isRequired,
  setMouseOffset: PropTypes.func.isRequired
};

export default DragNode('subnet')(Subnet);
