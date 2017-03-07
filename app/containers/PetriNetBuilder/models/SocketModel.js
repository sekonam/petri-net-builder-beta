import Model from './../core/Model';

export default class SocketModel extends Model {

  defaults() {
    this.set({
      name: 'Socket name',
      type: 0, // 0 - input, 1 - output
      nodeId: null,
      nodeType: 'place',
    });
  }

  get typeName() {
    return this.type ? 'outcome' : 'income';
  }
}
