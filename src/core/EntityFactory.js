import StateModel from './../models/StateModel.js';
import ActionModel from './../models/ActionModel.js';
import EventModel from './../models/EventModel.js';
import TransitionModel from './../models/TransitionModel.js';
import VarModel from './../models/VarModel.js';
import GroupModel from './../models/GroupModel.js';

const EntityFactory = {
  state: (params) => new StateModel(params),
  action: (params) => new ActionModel(params),
  event: (params) => new EventModel(params),
  transition: (params) => new TransitionModel(params),
  'var': (params) => new VarModel(params),
  group: (params) => new GroupModel(params)
};

export default EntityFactory;
