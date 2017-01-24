import PlaceModel from './../models/PlaceModel.js';
import SocketModel from './../models/SocketModel.js';
import ActionModel from './../models/ActionModel.js';
import EventModel from './../models/EventModel.js';
import ArcModel from './../models/ArcModel.js';
import GroupModel from './../models/GroupModel.js';
import NetModel from './../models/NetModel.js';
import SubnetModel from './../models/SubnetModel.js';

const EntityFactory = {
    place: (params) => new PlaceModel(params),
    socket: (params) => new SocketModel(params),
    net: (params) => new NetModel(params),
    subnet: (params) => new SubnetModel(params),
    action: (params) => new ActionModel(params),
    event: (params) => new EventModel(params),
    arc: (params) => new ArcModel(params),
    group: (params) => new GroupModel(params)
  },
  EntityNames = ['place', 'socket', 'arc', 'net', 'subnet', 'group', 'action', 'event'],
  NodeNames = ['place', 'subnet',];

export { EntityNames, NodeNames, EntityFactory };
