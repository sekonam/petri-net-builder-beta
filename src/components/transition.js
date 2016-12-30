import React from 'react';

export default class Transition extends React.Component {
  render() {
    const transition = this.props.data,
      start = transition.start,
      finish = transition.finish,
      x1 = start.state.x,
      y1 = start.state.y,
      drawing = finish.state == null,
      x2 = drawing ? finish.offset.x : finish.state.x,
      y2 = drawing ? finish.offset.y : finish.state.y,
      a = Math.atan( (y2 - y1) / (x2 - x1) ),
      c = Math.PI / 6,
      b = Math.PI / 2 - a - c,
      l = 10,
      x3 = x2 - l * Math.sin(b),
      y3 = y2 - l * Math.cos(b),
      x4 = x2 - l * Math.cos(2 * c + b),
      y4 = y2 - l * Math.sin(2 * c + b);

    return (
      <g className='transition'>
        <line x1={x1} y1={y1} x2={x2} y2={y2} className='transition-line' />
        <line x1={x2} y1={y2} x2={x3} y2={y3} className='transition-line' />
        <line x1={x2} y1={y2} x2={x4} y2={y4} className='transition-line' />
      </g>
    );
  }
}
