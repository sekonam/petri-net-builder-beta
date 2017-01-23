import Model from './../core/Model.js';

export default class ActionModel extends Model {

  defaults() {
    this.set({
      name: 'Action name',
      events: [],
      code: ''
    });
  }

}
