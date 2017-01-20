import Model from './../core/Model.js';
import EntityFactory from './../core/EntityFactory.js';
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
      entities.forEach( (name) => {
        if (typeof store[name +'s'] != 'undefined') {
          store[name +'s'].forEach( (item) => {
            this[name +'s'].push( EntityFactory[name](item) );
          } );
        }
      } );
    }
  }
}
