import NodeModel from './NodeModel';

export default class PlaceModel extends NodeModel {

  defaults() {
    super.defaults();

    this.set({
      name: 'Place name',
      type: 0, // 0 - custom, 1 - start, 2 - finish
    });

    const init = {
      x: 50,
      y: 50,
    };

    ['x', 'y'].forEach((name) => {
      this[name] = init[name] + (PlaceModel.count * 10);
    });

    PlaceModel.count += 1;
  }

  typeLabel() {
    return PlaceModel.types[this.type];
  }

}

PlaceModel.count = 0;
PlaceModel.types = [
  'custom',
  'start',
  'finish',
];
