import NodeModel from './NodeModel.js';
import SocketModel from './SocketModel.js';

export default class TransitionModel extends NodeModel {

  defaults() {
    super.defaults();

    this.set({
      name: 'Transition name',
      
      width: 80,
      height: 62,
      r: 0,
      color: ''
    });

    const init = {
      x: 150,
      y: 50
    }, step = 10;

    [ 'x', 'y' ].forEach( (name) => {
      this[name] = init[name] + TransitionModel.count * 10;
    });

    TransitionModel.count++;
  }

}

TransitionModel.count = 0;
