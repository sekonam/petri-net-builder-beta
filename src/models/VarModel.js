import Model from './../core/Model.js';

export default class VarModel extends Model {
  defaults() {
    this.set({
      name: 'var',
      params: ''
    });
  }
}
