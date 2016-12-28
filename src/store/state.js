import Store from './store.js';

export default class StateStore extends Store {
  constructor() {
    super();
    this.name = StateStore.default.name;

    ['x','y'].forEach((value) => {
      this[value] = StateStore.default[value] + StateStore.count * StateStore.default.step;
    });

    StateStore.count++;
  }
}

StateStore.count = 0;
StateStore.default = {
  name: 'State name',
  x: 50,
  y: 50,
  step: 10
};
