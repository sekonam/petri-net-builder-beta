import Store from './store.js';
import StateStore from './state.js';

export default class EngineStore extends Store {
  constructor() {
    super();
    this.states = [];
  }

  addState() {
    return this.states.push( new StateStore );
  };

}
