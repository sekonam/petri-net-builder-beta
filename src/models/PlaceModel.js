import NodeModel from './NodeModel.js';
import SocketModel from './SocketModel.js';

export default class PlaceModel extends NodeModel {

  defaults() {
    super.defaults();

    this.set({
      name: 'Place name',
      width: 100,
      height: 52,
      r: 0
    });

    const init = {
      x: 50,
      y: 50
    }, step = 10;

    [ 'x', 'y' ].forEach( (name) => {
      this[name] = init[name] + PlaceModel.count * 10;
    });

    PlaceModel.count++;
  }

}

PlaceModel.count = 0;
