import Model from './../core/Model.js';

export default class SocketModel extends Model {

  defaults() {
    this.set({
      name: 'Socket name',
      type: 0, // 0 - input, 1 - output
      nodeId: null
    });
  }

  get typeName() {
    return this.type ? 'outcome' : 'income';
  }
}
