import Model from './model.js';
import StateModel from './state.js';
import ActionModel from './action.js';
import EventModel from './event.js';
import TransitionModel from './transition.js';

export default class EngineModel extends Model {
  constructor(store = null) {
    super();
    const entities = ['state', 'action', 'event', 'transition'];
    entities.forEach( (name) => { this[name + 's'] = []; } );

    if (store != null) {
      const entityFactories = {
        state: (params) => new StateModel(params),
        action: (params) => new ActionModel(params),
        event: (params) => new EventModel(params),
        transition: (params) => new TransitionModel(params)
      };

      entities.forEach( (name) => {
        if (typeof store[name +'s'] != 'undefined') {
          store[name +'s'].forEach( (item) => {
            this[name +'s'].push( entityFactories[name](item) );
          } );
        }
      } );
    }
  }
}
