import Model from './model.js';

export default class ActionModel extends Model {

  constructor(params) {
    super();

    if (typeof params == 'object' && Object.keys(params).length > 0) {
      this.init(params);
    } else {
      this.init(ActionModel.default);
    }
  }

}

ActionModel.default = {
  name: 'Action name',
  events: [],
  code: ''
};
