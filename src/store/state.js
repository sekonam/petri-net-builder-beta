import Store from './store.js';

export default class StateStore extends Store {
  constructor() {
    super();
    this.init(StateStore.default, ['name', 'start', 'finish',]);

    ['x','y'].forEach((value) => {
      this[value] = StateStore.default[value] + StateStore.count * StateStore.default.step;
    });

    StateStore.count++;
  }

  shortName() {
    return this.name.length < StateStore.maxShortLength ? this.name :
      this.name.substring(0,StateStore.maxShortLength) + '...';
  }
}

StateStore.count = 0;
StateStore.maxShortLength = 18;
StateStore.default = {
  name: 'State name',
  x: 50,
  y: 50,
  step: 10,
  start: false,
  finish: false
};
