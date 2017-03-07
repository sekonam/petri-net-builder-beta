import NodeModel from './NodeModel';

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
      y: 50,
    };

    ['x', 'y'].forEach((name) => {
      this[name] = init[name] + (ExternalModel.count * 10);
    });

    ExternalModel.count += 1;
  }
}

ExternalModel.count = 0;
