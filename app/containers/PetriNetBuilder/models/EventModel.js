import Model from '../core/Model';

export default class EventModel extends Model {
  defaults() {
    this.set({
      name: 'Event name',
    });
  }
}
