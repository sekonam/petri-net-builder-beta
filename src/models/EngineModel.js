import Model from './Model.js';
import StateModel from './StateModel.js';
import ActionModel from './ActionModel.js';
import EventModel from './EventModel.js';
import TransitionModel from './TransitionModel.js';
import VarModel from './VarModel.js';
import GroupModel from './GroupModel.js';

export default class EngineModel extends Model {
  constructor(store = null) {
    super();
    const entities = ['state', 'group', 'action', 'event', 'transition', 'var',];
    entities.forEach( (name) => { this[name + 's'] = []; } );

    if (store != null) {
      const entityFactories = {
        state: (params) => new StateModel(params),
        action: (params) => new ActionModel(params),
        event: (params) => new EventModel(params),
        transition: (params) => new TransitionModel(params),
        'var': (params) => new VarModel(params),
        group: (params) => new GroupModel(params)
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
