import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox} from 'react-bootstrap';

import SocketModel from '../models/SocketModel.js';

export default class Socket extends React.Component {

  constructor(props) {
    super(props);
    this.socketClick = this.socketClick.bind(this);
  }

  socketClick(e) {
    const {data, transitionHandlers} = this.props;

    if (data.type) {
      transitionHandlers.addActive(data);
      this.props.setMouseOffset({
        x: e.pageX,
        y: e.pageY
      });
    } else {
      transitionHandlers.linkActive(data);
    }

    e.stopPropagation();
  }

  render() {
    const {data, x, y, socketHandlers} = this.props;
    let className = 'socket';

    if ( data.type ) {
      className += ' socket-finish';
    }

    return (
      <g className={className}>
        <circle cx={x} cy={y} r="5" onClick={this.socketClick}/>
      </g>
    );
  }
}

Socket.propTypes = {
  data: PropTypes.instanceOf(SocketModel).isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  transitionHandlers: PropTypes.object.isRequired,
  setMouseOffset: PropTypes.func.isRequired
};
