import Model from './Model.js';

export default class ActionModel extends Model {

  constructor(params) {
    super();
    this.init(params, ActionModel.default);
  }

}

ActionModel.default = {
  name: 'Action name',
  events: [],
  code: ''
};
