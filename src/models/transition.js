import Model from './model.js';

export default class TransitionModel extends Model {
  constructor(startState) {
    super();
    this.name = 'Transition name';
    this.start = {
      state: startState,
      events: [],
      condition: ''
    };
    this.finish = {
      offset: null,
      state: null,
      events: [],
      condition: ''
    };
  }
}
