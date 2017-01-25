import Model from './../core/Model.js';

export default class HandlerModel extends Model {

  defaults() {
    this.set({
      name: 'Handler name',
      events: [],
      code: ''
    });
  }

}
