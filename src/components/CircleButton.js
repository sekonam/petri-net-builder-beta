import React from 'react';

export default class CircleButton extends React.Component {
  render() {
    const {x, y, caption} = this.props,
      className = 'transition-circle' + (caption == 'D' ? ' remove-button' : '');
    return (
      <g className='transition-button' onClick={this.props.clickHandler}>
        <circle className={className} cx={x+4} cy={y} r='9' />
        <text className="transition-text" x={x-1} y={y+5}>
          {caption}</text>
      </g>
    );
  }
}
