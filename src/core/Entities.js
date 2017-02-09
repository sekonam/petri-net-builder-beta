import PlaceModel from './../models/PlaceModel.js';
import TransitionModel from './../models/TransitionModel.js';
import ExternalModel from './../models/ExternalModel.js';
import SocketModel from './../models/SocketModel.js';
import HandlerModel from './../models/HandlerModel.js';
import EventModel from './../models/EventModel.js';
import ArcModel from './../models/ArcModel.js';
import GroupModel from './../models/GroupModel.js';
import NetModel from './../models/NetModel.js';
import SubnetModel from './../models/SubnetModel.js';

const EntityFactory = {
    net: (params) => new NetModel(params),
    place: (params) => new PlaceModel(params),
    transition: (params) => new TransitionModel(params),
    external: (params) => new ExternalModel(params),
    subnet: (params) => new SubnetModel(params),
    socket: (params) => new SocketModel(params),
    arc: (params) => new ArcModel(params),
    group: (params) => new GroupModel(params),
    handler: (params) => new HandlerModel(params),
    event: (params) => new EventModel(params),
  },
  EntityNames = ['place', 'transition', 'external', 'socket', 'arc', 'net', 'subnet', 'group', 'handler', 'event'],
  NodeNames = ['place', 'subnet', 'transition', 'external',],
  NodeGroupNames = NodeNames.concat('group'),
  StatusNames = ['active', 'form', ],
  SideNames = ['top', 'right', 'bottom', 'left', ],
  AnotherSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  },
  NodeTypes = ['default', 'schema',],
  ExternalNodeNames = ['place',];

export {
  EntityNames,
  NodeNames,
  NodeGroupNames,
  EntityFactory,
  StatusNames,
  SideNames,
  AnotherSide,
  NodeTypes,
  ExternalNodeNames
};
