import PlaceModel from './../models/PlaceModel.js';
import SocketModel from './../models/SocketModel.js';
import ActionModel from './../models/ActionModel.js';
import EventModel from './../models/EventModel.js';
import TransitionModel from './../models/TransitionModel.js';
import VarModel from './../models/VarModel.js';
import GroupModel from './../models/GroupModel.js';

const EntityFactory = {
    place: (params) => new PlaceModel(params),
    socket: (params) => new SocketModel(params),
    action: (params) => new ActionModel(params),
    event: (params) => new EventModel(params),
    transition: (params) => new TransitionModel(params),
    'var': (params) => new VarModel(params),
    group: (params) => new GroupModel(params)
  },
  EntityNames = ['place', 'socket', 'group', 'action', 'event', 'transition', 'var'];

export { EntityNames, EntityFactory };
