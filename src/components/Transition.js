import React, {PropTypes} from 'react';

import TransitionModel from '../models/TransitionModel.js';

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
      },
      c = {
        x: (a.x + b.x) / 2,
        y: (a.y + b.y) / 2
      };

    let pathStr = 'M' + a.x + ',' + a.y + ' ';
    pathStr += 'C';
    pathStr += a.x + diff.x / 3 * 2 + ',' + a.y + ' ';
    pathStr += a.x + diff.x / 3 + ',' + b.y + ' ';
    pathStr += b.x + ',' + b.y;

    return (
      <g className='transition' onClick={this.props.editHandler}>
        <path d={pathStr} className='transition-line' />
        <circle cx={c.x} cy={c.y} r='7' className='transition-circle' />
      </g>
    );
  }
}

Transition.propTypes = {
  data: PropTypes.instanceOf(TransitionModel).isRequired,
  offset: PropTypes.object,
  editHandler: PropTypes.func.isRequired,
  getHandlers: PropTypes.object.isRequired
};
