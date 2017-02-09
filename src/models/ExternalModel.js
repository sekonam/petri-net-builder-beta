import NodeModel from './NodeModel.js';
import SocketModel from './SocketModel.js';

export default class ExternalModel extends NodeModel {

  defaults() {
    super.defaults();

    this.set({
      name: 'External name',
      nodeNetId: null,
      nodeId: null,
      nodeType: 'place',
    });

    const init = {
      x: 425,
      y: 50
    }, step = 10;

    [ 'x', 'y' ].forEach( (name) => {
      this[name] = init[name] + ExternalModel.count * 10;
    });

    ExternalModel.count++;
  }
}

ExternalModel.count = 0;
