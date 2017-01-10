import Model from './model.js';

export default class GroupModel extends Model {

  constructor(params) {
    super();
    this.init(params, GroupModel.default);
  }

}

GroupModel.default = {
  name: 'Group name',
  states: []
};
