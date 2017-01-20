import NodeModel from './NodeModel.js';
import SocketModel from './SocketModel.js';

export default class PlaceModel extends NodeModel {

  constructor(params = null) {
    super(params);
    this.init(params, PlaceModel.default);

    if (!params) {
      [ 'x', 'y' ].forEach( (name) => {
        this[name] = PlaceModel.default[name] + PlaceModel.count * 10;
      });
    }

    PlaceModel.count++;
  }

}

PlaceModel.count = 0;
PlaceModel.default = {
  name: 'Place name',
  x: 50,
  y: 50,
  width: 100,
  height: 52,
  r: 0
};
