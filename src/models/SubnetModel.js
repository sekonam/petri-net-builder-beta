import NodeModel from './NodeModel.js';
import SocketModel from './SocketModel.js';

export default class SubnetModel extends NodeModel {

  defaults() {
    super.defaults();

    this.set({
      name: 'Subnet name',
      r: 50
    });

    const init = {
      x: 300,
      y: 10
    }, step = 10;

    [ 'x', 'y' ].forEach( (name) => {
      this[name] = init[name] + SubnetModel.count * 10;
    });

    SubnetModel.count++;
  }

}

SubnetModel.count = 0;
