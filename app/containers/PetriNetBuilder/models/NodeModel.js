import Model from '../core/Model';
import Query from '../core/Query';

export default class NodeModel extends Model {

  defaults() {
    this.set({
      name: 'Node name',
      socketIds: [],
      netId: null,
      x: 100,
      y: 50,
      width: 80,
      height: 62,
      r: 25,
      color: '',
    });
  }

  multilineName() {
    return this.multiline('name', Math.round(this.width / 6.5));
  }

  R() {
    return this.r >= 15 ? this.r : 15;
  }

  getSize() {
    const query = Query.instance;
    const { width, height } = this;

    if (query.settings.nodeType() === 'schema') {
      const nameLines = this.multilineName();
      return {
        width: width + (2 * this.R()),
        height: (nameLines.length * 15) + (2 * this.R()),
      };
    }

    return { width, height };
  }
}
