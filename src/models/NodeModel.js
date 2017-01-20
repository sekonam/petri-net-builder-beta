import _ from 'lodash';

import Model from './../core/Model.js';
import ModelArray from './../core/ModelArray.js';

export default class NodeModel extends Model {

  constructor(params = null) {
    super();
    this.init(params, NodeModel.default);
    
    if (_.isEmpty(params)) {
      for (let i=0; i<2; i++) {
        this.sockets.add({
          type: i,
          node: this.id
        });
      }
    }
  }

}

NodeModel.default = {
  name: 'Node name',
  sockets: new ModelArray('socket')
};
