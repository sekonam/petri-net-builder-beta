import Model from './../core/Model.js';

export default class EventModel extends Model {
  defaults() {
    this.set({
      name: 'Event name'
    });
  }
}
