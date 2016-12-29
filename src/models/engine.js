import Model from './model.js';

export default class EngineModel extends Model {
  constructor() {
    super();
    this.states = [];
    this.actions = [];
    this.events = [];
  }

}
