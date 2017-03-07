import NodeModel from './NodeModel';

export default class TransitionModel extends NodeModel {

  defaults() {
    super.defaults();

    this.set({
      name: 'Transition name',
      handlerIds: [],
      r: 0,
    });

    const init = {
      x: 175,
      y: 50,
    };

    ['x', 'y'].forEach((name) => {
      this[name] = init[name] + (TransitionModel.count * 10);
    });

    TransitionModel.count += 1;
  }

}

TransitionModel.count = 0;
