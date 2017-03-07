import NodeModel from './NodeModel';

export default class SubnetModel extends NodeModel {

  defaults() {
    super.defaults();

    this.set({
      name: 'Subnet name',
    });

    const init = {
      x: 300,
      y: 50,
    };

    ['x', 'y'].forEach((name) => {
      this[name] = init[name] + (SubnetModel.count * 10);
    });

    SubnetModel.count += 1;
  }

}

SubnetModel.count = 0;
