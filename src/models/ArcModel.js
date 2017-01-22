import Model from './../core/Model.js';

export default class ArcModel extends Model {

  defaults() {
    this.set({
      startSocketId: null,
      finishSocketId: null,
      color: ''
    });
  }
}
