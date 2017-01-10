import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';
import Types from './types.js';
import StateModel from '../models/state.js';
import Socket from './Socket.js';

const stateSource = {

  beginDrag(props, monitor, component) {
    this.timerId = setInterval(
      () => {
        if (monitor.isDragging()) {
          const initialOffset = monitor.getInitialClientOffset(),
            initialSourceOffset = monitor.getInitialSourceClientOffset(),
            shift = {
              x: initialOffset.x - initialSourceOffset.x,
              y: initialOffset.y - initialSourceOffset.y
            },
            clientOffset = monitor.getClientOffset(),
            sourceOffset = {
              x: clientOffset.x - shift.x,
              y: clientOffset.y - shift.y
            },
            zoomedOffset = component.props.zoomedOffset(sourceOffset);

          component.props.dragHandler(props.id, zoomedOffset.x, zoomedOffset.y);
        }
      }, 10
    );

    component.props.methods.state.active(props.id);

    return {
      id: props.id,
      x0: component.props.data.x,
      y0: component.props.data.y
    };
  },

  endDrag(props, monitor, component) {
    clearInterval(this.timerId);
    component.props.methods.state.active(null);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

class CircleButton extends React.Component {
  render() {
    const {x, y, caption} = this.props,
      className = 'transition-circle' + (caption == 'D' ? ' remove-button' : '');
    return (
      <g className='transition-button' onClick={this.props.clickHandler}>
        <circle className={className} cx={x+4} cy={y} r='9' />
        <text className="transition-text" x={x} y={y+5}>
          {caption}</text>
      </g>
    );
  }
}

class State extends React.Component {

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
      <g className="state">
        <rect className="state-rect" x={x} y={y} id={id}
          width={width + 'px'} height={height + 'px'} rx={r} ry={r}></rect>
        <text className="state-txt" x={x+7} y={y+18}>{this.props.data.short('name', 11)}</text>
        {socketTags}
        <CircleButton clickHandler={(e) => editHandler(id)}
          x={x + width/2 - 16} y={y + height - 17} caption="E"/>
        <CircleButton clickHandler={(e) => removeHandler(id)}
          x={x + width/2 + 8} y={y + height - 17} caption="D"/>
      </g>
    );
  }
}

export default DragSource(Types.STATE, stateSource, collect)(State);
