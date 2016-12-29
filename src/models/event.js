import Model from './model.js';

export default class EventModel extends Model {
  constructor() {
    super();
    this.init(EventModel.default);
  }
}

EventModel.default = {
  name: 'Event name'
};
