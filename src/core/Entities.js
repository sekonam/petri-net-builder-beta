import PlaceModel from './../models/PlaceModel.js';
import TransitionModel from './../models/TransitionModel.js';
import SocketModel from './../models/SocketModel.js';
import HandlerModel from './../models/HandlerModel.js';
import EventModel from './../models/EventModel.js';
import ArcModel from './../models/ArcModel.js';
import GroupModel from './../models/GroupModel.js';
import NetModel from './../models/NetModel.js';
import SubnetModel from './../models/SubnetModel.js';

const EntityFactory = {
    place: (params) => new PlaceModel(params),
    transition: (params) => new TransitionModel(params),
    socket: (params) => new SocketModel(params),
    net: (params) => new NetModel(params),
    subnet: (params) => new SubnetModel(params),
    handler: (params) => new HandlerModel(params),
    event: (params) => new EventModel(params),
    arc: (params) => new ArcModel(params),
    group: (params) => new GroupModel(params)
  },
  EntityNames = ['place', 'transition', 'socket', 'arc', 'net', 'subnet', 'group', 'handler', 'event'],
  NodeNames = ['place', 'subnet', 'transition',],
  NodeGroupNames = ['place', 'subnet', 'transition', 'group',],
  StatusNames = ['active', 'form', ],
  SocketSides = ['top', 'right', 'bottom', 'left', ];

export { EntityNames, NodeNames, NodeGroupNames, EntityFactory, StatusNames, SocketSides };
