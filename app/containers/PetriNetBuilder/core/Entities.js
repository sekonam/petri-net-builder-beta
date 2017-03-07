import PlaceModel from './../models/PlaceModel';
import TransitionModel from './../models/TransitionModel';
import ExternalModel from './../models/ExternalModel';
import SocketModel from './../models/SocketModel';
import HandlerModel from './../models/HandlerModel';
import EventModel from './../models/EventModel';
import ArcModel from './../models/ArcModel';
import GroupModel from './../models/GroupModel';
import NetModel from './../models/NetModel';
import SubnetModel from './../models/SubnetModel';

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
};

const EntityNames = [
  'place',
  'transition',
  'external',
  'socket',
  'arc',
  'net',
  'subnet',
  'group',
  'handler',
  'event',
];

const NodeNames = [
  'place',
  'subnet',
  'transition',
  'external',
];

const NodeGroupNames = NodeNames.concat('group');

const StatusNames = [
  'active',
  'form',
];

const SideNames = ['top', 'right', 'bottom', 'left'];

const AnotherSide = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

const NodeTypes = [
  'default',
  'schema',
];

const ExternalNodeNames = [
  'place',
];

export {
  EntityNames,
  NodeNames,
  NodeGroupNames,
  EntityFactory,
  StatusNames,
  SideNames,
  AnotherSide,
  NodeTypes,
  ExternalNodeNames,
};
