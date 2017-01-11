import Model from './Model.js';

import {PropTypes} from 'react';

export default class VarModel extends Model {
  constructor(params = null) {
    super();
    this.init(params, VarModel.default);
  }
}

VarModel.default = {
  name: 'var',
  value: ''
};
