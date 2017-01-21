import PlaceModel from './../models/PlaceModel.js';
import SocketModel from './../models/SocketModel.js';
import ActionModel from './../models/ActionModel.js';
import EventModel from './../models/EventModel.js';
import TransitionModel from './../models/TransitionModel.js';
import VarModel from './../models/VarModel.js';
import GroupModel from './../models/GroupModel.js';

const EntityFactory = {
  place: (params) => new PlaceModel,
  socket: (params) => new SocketModel,
  action: (params) => new ActionModel,
  event: (params) => new EventModel,
  transition: (params) => new TransitionModel,
  'var': (params) => new VarModel,
  group: (params) => new GroupModel
};

export default EntityFactory;
