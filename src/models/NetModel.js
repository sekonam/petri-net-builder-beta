import Model from './../core/Model.js';

export default class NetModel extends Model {

  defaults() {
    this.set({
      name: 'Network name',
      subnetId: null
    });
  }
}
