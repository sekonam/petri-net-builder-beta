import Model from './model.js';
import {PropTypes} from 'react';

export default class StateModel extends Model {

  constructor(params) {
    super();
    this.init(StateModel.default, [
      'name',
      'start',
      'finish',
      'width',
      'height',
      'hover',
    ]);

    [ 'name', 'start', 'finish' ].forEach( (name) => {
      this.setPropValue( name, params, StateModel.default[name] );
    } );

    [ 'x', 'y' ].forEach( (name) => {
      this.setPropValue( name, params,
        StateModel.default[name] + StateModel.count * StateModel.default.step );
    });

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
  x: 50,
  y: 50,
  step: 10,
  start: false,
  finish: false,
  width: 200,
  height: 40,
  hover: false
};
