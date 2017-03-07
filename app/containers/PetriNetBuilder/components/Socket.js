import React, { PropTypes } from 'react';

import Store from '../core/Store';
import Query from '../core/Query';
import SocketModel from '../models/SocketModel';

export default class Socket extends React.Component {

  constructor(props) {
    super(props);
    this.socketClick = this.socketClick.bind(this);
  }

  socketClick(e) {
    const { data } = this.props;
    const methods = Store.instance;
    const query = Query.instance;

    if (data.type) {
      methods.arc.startDraw(data.id);
      e.stopPropagation();
    } else if (query.arc.drawing()) {
      methods.arc.finishDraw(data.id);
      e.stopPropagation();
    }
  }

  render() {
    const query = Query.instance;
    const { data } = this.props;
    const W = 5;
    const { x, y } = query.socket.offset(data.id);

    let className = 'socket';
    let figure = (<rect
      x={x - W}
      y={y - W}
      width={2 * W}
      height={2 * W}
      onClick={this.socketClick}
    />);

    if (data.type) {
      className += ' socket-finish';
      figure = <circle cx={x} cy={y} r="5" onClick={this.socketClick} />;
    }

    if (!data.type && query.arc.drawing()) {
      className += ' socket-in-drawing-mode';
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
};
