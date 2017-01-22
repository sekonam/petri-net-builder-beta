import React, {PropTypes} from 'react';

export default class CircleButton extends React.Component {
  render() {
    const {x, y, caption} = this.props,
      className = 'circle' + (caption == 'D' ? ' remove-button' : '');
    return (
      <g className='circle-button' onClick={this.props.clickHandler}>
        <circle className={className} cx={x+4} cy={y} r='9' />
        <text className="circle-button-text" x={x-1} y={y+5}>
          {caption}</text>
      </g>
    );
  }
}

CircleButton.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  caption: PropTypes.string,
  clickHandler: PropTypes.func.isRequired
};
