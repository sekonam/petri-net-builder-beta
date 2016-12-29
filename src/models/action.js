import Model from './model.js';

export default class ActionModel extends Model {
  constructor() {
    super();
    this.init(ActionModel.default);
  }
}

ActionModel.default = {
  name: 'Action name',
  events: [],
  code: ''
};
