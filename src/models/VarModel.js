import Model from './Model.js';

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
