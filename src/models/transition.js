import Model from './model.js';

export default class TransitionModel extends Model {
  constructor(startState) {
    super();
    this.name = 'Transition name';
    this.start = {
      state: startState,
      events: [],
      actions: []
    };
    this.finish = {
      offset: null,
      state: null,
      events: [],
      actions: []
    };
  }
}
