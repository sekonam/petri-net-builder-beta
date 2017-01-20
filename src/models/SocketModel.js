import Model from './../core/Model.js';

export default class SocketModel extends Model {
  constructor(params = null) {
    super();
    this.init(params, SocketModel.default);
  }

  get typeName() {
    return this.type ? 'outcome' : 'income';
  }
}

SocketModel.default = {
  name: 'Socket name',
  type: 0, // 0 - input, 1 - output
  node: null
};
