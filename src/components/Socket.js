import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox} from 'react-bootstrap';

import Store from '../core/Store.js';
import Query from '../core/Query.js';
import SocketModel from '../models/SocketModel.js';

export default class Socket extends React.Component {

  constructor(props) {
    super(props);
    this.socketClick = this.socketClick.bind(this);
  }

  socketClick(e) {
    const {data} = this.props,
      methods = Store.instance;

    if (data.type) {
      methods.arc.startDraw(data);
      this.props.setMouseOffset({
        x: e.pageX,
        y: e.pageY
      });
    } else {
      methods.arc.finishDraw(data);
    }

    e.stopPropagation();
  }

  render() {
    const query = Query.instance,
      {data, socketHandlers} = this.props, W = 5,
      {x, y} = query.socket.offset(data.id);

    let className = 'socket',
      figure = (<rect x={x-W} y={y-W} width={2*W} height={2*W}
        onClick={this.socketClick} />);

    if ( data.type ) {
      className += ' socket-finish';
      figure = <circle cx={x} cy={y} r="5" onClick={this.socketClick}/>;
    }

    return (
      <g className={className}>
        {figure}
      </g>
    );
  }
}

Socket.propTypes = {
  data: PropTypes.instanceOf(SocketModel).isRequired,
  setMouseOffset: PropTypes.func.isRequired
};
