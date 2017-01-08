import Model from './model.js';
//import MicroEvent from 'microevent';

export default class SocketModel extends Model {
  constructor(params = null) {
    super();
    this.init(params, SocketModel.default);
  }

//  remove() {
    //this.trigger('remove', this.id);
  //}

  get typeName() {
    return this.type ? 'outcome' : 'income';
  }
}

//MicroEvent.mixin(SocketModel);

SocketModel.default = {
  name: 'Socket name',
  type: 0 // 0 - input, 1 - output
};
