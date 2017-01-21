import Model from './../core/Model.js';

export default class TransitionModel extends Model {

  defaults() {
    this.set({
      name: 'Transition name',
      startSocketId: null,
      finishSocketId: null
    });
  }
}
