import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import Types from './Types.js';
import StateModel from '../models/StateModel.js';

import Socket from './Socket.js';
import CircleButton from './CircleButton.js';

const stateSource = {

  beginDrag(props, monitor, component) {
    const {data, methods} = component.props;

    this.timerId = setInterval(
      () => {
        if (monitor.isDragging()) {
          const diff = monitor.getDifferenceFromInitialOffset(),
            zDiff = component.props.zoomedDiff(diff);

          component.props.dragHandler(props.data.id, this.start.x + zDiff.x, this.start.y + zDiff.y);
        }
      }, 10
    );

    this.start = {
      x: data.x,
      y: data.y
    };
    methods.state.active(props.data.id);

    return {
      id: props.data.id
    };
  },

  endDrag(props, monitor, component) {
    clearInterval(this.timerId);
    component.props.methods.state.active(null);
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

class State extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      wasDragged: false
    };
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler (e) {
    if (this.state.wasDragged) {
      this.setState({
        wasDragged: false
      });
    } else {
/*      this.props.contextSetState({
        clickedState: this.props.data.id
      });*/
      this.props.methods.state.edit(this.props.data.id);
    }
  }

  render() {
    const { connectDragSource, id, data,
      removeHandler, editHandler, methods} = this.props,
      { x, y, width, height, r } = data,
      typeNames = [ 'income', 'outcome' ];

    let sockets = {
        income: [],
        outcome: []
      },
      socketTags = [];

    data.sockets.forEach( (socket) => {
      sockets[socket.typeName].push( socket );
    } );

    typeNames.forEach( (typeName) => {
      const step = height / ( sockets[typeName].length + 1 );

      socketTags = socketTags.concat(
        sockets[typeName].cmap( (socket, key) => (
          <Socket data={socket} key={typeName + key}
            x={ x + ( socket.type ? width : 0 ) }
            y={ y + ( key + 1 ) * step }
            transitionHandlers={methods.transition}
            setMouseOffset={this.props.setMouseOffset} />
        ) )
      );
    } );

    return connectDragSource(
      <g className="state" id={id} onClick={this.clickHandler}>
        <rect className="state-rect" x={x} y={y}
          width={width + 'px'} height={height + 'px'} rx={r} ry={r}></rect>
        <text className="state-txt" x={x+7} y={y+18}>{this.props.data.short('name', 11)}</text>
        {socketTags}
        <CircleButton clickHandler={(e) => { editHandler(id); e.stopPropagation(); }}
          x={x + width/2 - 16} y={y + height - 17} caption="E"/>
        <CircleButton clickHandler={(e) => { removeHandler(id); e.stopPropagation(); }}
          x={x + width/2 + 8} y={y + height - 17} caption="D"/>
      </g>
    );
  }
}

export default DragSource(Types.STATE, stateSource, collect)(State);
