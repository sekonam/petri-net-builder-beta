import _ from 'lodash';

import Model from './../core/Model.js';

export default class NodeModel extends Model {

  defaults() {
    this.set({
      name: 'Node name',
      socketIds: []
    });

/*    for (let i=0; i<2; i++) {
      const socket   this.sockets.add({
          type: i,
          nodeId: this.id
        });
      }*/
  }

}
