import Model from './../core/Model';

export default class HandlerModel extends Model {

  defaults() {
    this.set({
      name: 'Handler name',
      events: [],
      code: '',
    });
  }

}
