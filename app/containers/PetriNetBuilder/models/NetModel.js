import Model from './../core/Model';

export default class NetModel extends Model {

  defaults() {
    this.set({
      name: 'Network name',
      subnetId: null,
    });
  }
}
