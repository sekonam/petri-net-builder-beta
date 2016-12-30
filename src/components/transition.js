import React from 'react';
import StateModel from '../models/state.js';

export default class Transition extends React.Component {
  render() {
    const transition = this.props.data,
      start = transition.start,
      finish = transition.finish,
      drawing = finish.state == null,
      {width, height} = StateModel.default;
    let x1 = start.state.x + width/2,
      y1 = start.state.y + height/2,
      x2 = drawing ? finish.offset.x : finish.state.x + width/2,
      y2 = drawing ? finish.offset.y : finish.state.y + height/2;

      if ( Math.abs(y2 - y1 ) + width/2 > Math.abs(x2 - x1) + height/2 ) {
        const k = y1 > y2 ? 1 : -1;
        y1 -= k * height/2;
        if (! drawing) {
          y2 += k * height/2;
        }
      } else {
        const k = x1 > x2 ? 1 : -1;
        x1 -= k * width/2;
        if (! drawing) {
          x2 += k * width/2;
        }
      }

    return (
      <g className='transition'>
        <line x1={x1} y1={y1} x2={x2} y2={y2} className='transition-line' />
        <circle cx={x2} cy={y2} r='2' className='transition-line' />
      </g>
    );
  }
}
