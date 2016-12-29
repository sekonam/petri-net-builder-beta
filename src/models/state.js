import Model from './model.js';
import {PropTypes} from 'react';

export default class StateModel extends Model {
  constructor() {
    super();
    this.init(StateModel.default, ['name', 'start', 'finish',]);

    ['x','y'].forEach((value) => {
      this[value] = StateModel.default[value] + StateModel.count * StateModel.default.step;
    });

    StateModel.count++;
  }

  shortName() {
    return this.short('name');
  }
}

StateModel.propTypes = {

};

StateModel.count = 0;
StateModel.maxShortLength = 18;
StateModel.default = {
  name: 'State name',
  x: 50,
  y: 50,
  step: 10,
  start: false,
  finish: false
};
