import _ from 'lodash';

import Model from '../core/Model.js';
import Query from '../core/Query.js';

export default class NodeModel extends Model {

  defaults() {
    this.set({
      name: 'Node name',
      socketIds: [],
      netId: null
    });
  }

  multilineName() {
    return this.multiline('name', Math.round(this.width/6.5));
  }

  R() {
    return this.r >= 15 ? this.r : 15;
  }

  getSize() {
    const query = Query.instance,
      {width, height} = this;

    if (query.settings.nodeType() == 'schema') {
      const nameLines = this.multilineName();
      return {
        width: width + 2 * this.R(),
        height: nameLines.length * 15 + 2 * this.R()
      };
    }

    return {width, height};
  }
}
