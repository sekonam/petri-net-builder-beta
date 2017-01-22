import PlaceModel from './../models/PlaceModel.js';
import SocketModel from './../models/SocketModel.js';
import ActionModel from './../models/ActionModel.js';
import EventModel from './../models/EventModel.js';
import ArcModel from './../models/ArcModel.js';
import VarModel from './../models/VarModel.js';
import GroupModel from './../models/GroupModel.js';

const EntityFactory = {
    place: (params) => new PlaceModel(params),
    socket: (params) => new SocketModel(params),
    action: (params) => new ActionModel(params),
    event: (params) => new EventModel(params),
    arc: (params) => new ArcModel(params),
    'var': (params) => new VarModel(params),
    group: (params) => new GroupModel(params)
  },
  EntityNames = ['place', 'socket', 'group', 'action', 'event', 'arc', 'var'];

export { EntityNames, EntityFactory };
