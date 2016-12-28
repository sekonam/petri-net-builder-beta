import React from 'react';

export default class State extends React.Component {

  render() {
    return (
      <rect className="state" x={this.props.x} y={this.props.y} />
    );
  }
}
