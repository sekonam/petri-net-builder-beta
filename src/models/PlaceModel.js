import NodeModel from './NodeModel.js';
import SocketModel from './SocketModel.js';

export default class PlaceModel extends NodeModel {

  defaults() {
    super.defaults();

    this.set({
      name: 'Place name',
      type: 0, // 0 - custom, 1 - start, 2 - finish
      width: 80,
      height: 62,
      r: 25,
      color: ''
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

  typeLabel() {
    return PlaceModel.types[this.type];
  }

}

PlaceModel.count = 0;
PlaceModel.types = ['custom', 'start', 'finish', ];
