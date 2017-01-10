import Model from './model.js';
import SocketModel from './SocketModel.js';
import {PropTypes} from 'react';

export default class StateModel extends Model {

  constructor(params = null) {
    super();
    this.setPropValue( 'id', params, this.getId() );

    [ 'name', 'width', 'height', 'start', 'finish', 'hover' ].forEach( (name) => {
      this.setPropValue( name, params, StateModel.default[name] );
    } );

    [ 'x', 'y' ].forEach( (name) => {
      this.setPropValue( name, params,
        StateModel.default[name] + StateModel.count * StateModel.default.step );
    });

    this.sockets = [];

    if (!params) {
      for (let i=0; i<2; i++) {
        let socket = new SocketModel;
        socket.type = i;
        socket.state = this.id;
        this.sockets.push(socket);
      }
    }

    if (typeof params == 'object' && params) {
      if ('sockets' in params) {
        params.sockets.forEach(
          (socketParams) => this.sockets.push( new SocketModel( socketParams ) )
        );
      }
    }

    StateModel.count++;
  }

}

StateModel.count = 0;
StateModel.maxShortLength = 18;
StateModel.default = {
  name: 'State name',
  sockets: [],
  finish: false,
  x: 50,
  y: 50,
  width: 100,
  height: 52,
  r: 0,
  step: 10,
  hover: false
};
