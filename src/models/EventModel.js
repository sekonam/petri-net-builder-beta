import Model from './Model.js';

export default class EventModel extends Model {
  constructor(params = null) {
    super();
    this.init(params, EventModel.default);
  }
}

EventModel.default = {
  name: 'Event name'
};
