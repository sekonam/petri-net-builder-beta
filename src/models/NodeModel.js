import _ from 'lodash';

import Model from './../core/Model.js';

export default class NodeModel extends Model {

  defaults() {
    this.set({
      name: 'Node name',
      socketIds: [],
      netId: null
    });
  }

}
