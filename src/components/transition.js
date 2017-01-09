import React from 'react';
import StateModel from '../models/state.js';

export default class Transition extends React.Component {

  socketOffset(state, socket) {
    const sockets = state.sockets.filter( (el) => el.type == socket.type ),
      pos = sockets.indexOf(socket),
      step = state.height / (sockets.length + 1);
    return {
      x: state.x + (socket.type ? state.width : 0),
      y: state.y + step * (pos + 1)
    };
  }

  render() {
    const transition = this.props.data,
      {getHandlers, offset} = this.props,
      startState = getHandlers.state(transition.start.state),
      startSocket = getHandlers.socket(transition.start.state)(transition.start.socket),
      startOffset = this.socketOffset( startState, startSocket );

    let finishOffset = offset;

    if (transition.finish.socket) {
      const finishState = getHandlers.state(transition.finish.state),
        finishSocket = getHandlers.socket(transition.finish.state)(transition.finish.socket);
      finishOffset = this.socketOffset( finishState, finishSocket );
    }

    const a = startOffset, b = finishOffset,
      diff = {
        x: b.x - a.x,
        y: b.y - a.y
      };

    let pathStr = 'M' + a.x + ',' + a.y + ' ';
    pathStr += 'C';
    pathStr += a.x + diff.x / 3 * 2 + ',' + a.y + ' ';
    pathStr += a.x + diff.x / 3 + ',' + b.y + ' ';
    pathStr += b.x + ',' + b.y;

    return (
      <g className='transition' onClick={this.props.editHandler}>
        <path d={pathStr} className='transition-line' />
        <circle cx={b.x} cy={b.y} r='2' className='transition-line' />
      </g>
    );
  }
}
