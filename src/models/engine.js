import Model from './model.js';
import StateModel from './state.js';
import ActionModel from './action.js';

export default class EngineModel extends Model {
  constructor(store = null) {
    super();
    const entities = ['states', 'actions', 'events', 'transitions'];
    entities.forEach( (name) => { this[name] = []; } );

    if (store != null) {
      if (typeof store.states != 'undefined') {
        store.states.forEach( (state, id) => {
          this.states[id] = new StateModel(state);
        } );
      }

      if (typeof store.actions != 'undefined') {
        console.log(store.actions);
        store.actions.forEach( (action, id) => {
          this.actions[id] = new ActionModel(action);
        } );
      }
    }
  }
}
