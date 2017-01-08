import React from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox} from 'react-bootstrap';

export default class Socket extends React.Component {
  render() {
    const {data, x, y} = this.props;
    return (
      <g className="socket">
        <circle cx={x} cy={y} r="4" />
      </g>
    );
  }
}
