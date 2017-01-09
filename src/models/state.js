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

    if (typeof params == 'object' && params) {
      if ('sockets' in params) {
        params.sockets.forEach(
          (socketParams) => this.sockets.push( new SocketModel( socketParams ) )
        );
      }
    }

    StateModel.count++;
  }

  setPropValue( name, params, defaultValue ) {
    this[name] = this.value(params, name) != null ? params[name] : defaultValue;
  }

}

StateModel.count = 0;
StateModel.maxShortLength = 18;
StateModel.default = {
  name: 'State name',
  sockets: [],
  x: 50,
  y: 50,
  step: 10,
  start: false,
  finish: false,
  width: 100,
  height: 52,
  hover: false
};
