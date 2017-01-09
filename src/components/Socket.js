import React from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox} from 'react-bootstrap';

export default class Socket extends React.Component {

  constructor(props) {
    super(props);
    this.socketClick = this.socketClick.bind(this);
  }

  socketClick(e) {
    const {data, transitionHandlers} = this.props;

    if (data.type) {
      transitionHandlers.addActive(data);
      e.stopPropagation();
    } else {
      transitionHandlers.linkActive(data);
    }
  }

  render() {
    const {data, x, y, socketHandlers} = this.props;
    let className = 'socket';

    if ( data.type ) {
      className += ' socket-finish';
    }

    return (
      <g className={className}>
        <circle cx={x} cy={y} r="7" onClick={this.socketClick}/>
      </g>
    );
  }
}
