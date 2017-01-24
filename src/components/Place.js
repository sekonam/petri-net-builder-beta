import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import Query from '../core/Query.js';
import Store from '../core/Store.js';
import Types from './Types.js';
import PlaceModel from '../models/PlaceModel.js';

import Socket from './Socket.js';
import CircleButton from './CircleButton.js';

const placeSource = {

  beginDrag(props, monitor, component) {
    const {data} = component.props,
      methods = Store.instance;

    this.timerId = setInterval(
      () => {
        if (monitor.isDragging()) {
          const diff = monitor.getDifferenceFromInitialOffset(),
            zDiff = component.props.zoomedDiff(diff);

          methods.place.set( props.data.id, {
            x: this.start.x + zDiff.x,
            y: this.start.y + zDiff.y
          } );
        }
      }, 10
    );

    this.start = {
      x: data.x,
      y: data.y
    };
    methods.place.dragging(props.data.id);

    return {
      id: props.data.id
    };
  },

  endDrag(props, monitor, component) {
    clearInterval(this.timerId);
    Store.instance.place.dragging(null);
    component.setState({
      wasDragged: true
    });
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

class Place extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wasDragged: false
    };
    this.clickHandler = this.clickHandler.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  clickHandler (e) {
    if (this.state.wasDragged) {
      this.setState({
        wasDragged: false
      });
    } else {
      Store.instance.place.edit(this.props.data.id);
    }
  }

  onMouseDown(e) {
    Store.instance.subnet.dragging(this.props.data.id);
  }

  render() {
    const { connectDragSource, id, data} = this.props,
      methods = Store.instance,
      { x, y, width, height, r } = data,
      typeNames = [ 'income', 'outcome' ],
      query = Query.instance;

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

    return connectDragSource(
      <g className="state" id={id} onClick={this.clickHandler}
        onMouseDown={this.onMouseDown}>
        <rect className="state-rect" x={x} y={y}
          width={width + 'px'} height={height + 'px'} rx={r} ry={r}></rect>
        <text className="state-txt" x={x+7} y={y+25}>{this.props.data.short('name', 11)}</text>
        {socketTags}
        <CircleButton clickHandler={(e) => { methods.place.remove(id); e.stopPropagation(); }}
          x={x + width/2} y={y + height - 17} caption="D"/>
      </g>
    );
  }
}

Place.propTypes = {
  data: PropTypes.instanceOf(PlaceModel).isRequired,
  id: PropTypes.string.isRequired,
  zoomedDiff: PropTypes.func.isRequired,
  setMouseOffset: PropTypes.func.isRequired
};

export default DragSource(Types.PLACE, placeSource, collect)(Place);
