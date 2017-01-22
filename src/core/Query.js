import {EntityNames} from './Entities.js';

export default class Query {

  constructor(state) {
    Query.instance = this;

    const s = (name) => name + 's';

    const queryFactory = {

      get: (entityName) => state.db.get(entityName),

      options: (entityName, paramName = 'name') => () => state.db[ s(entityName) ].cmap((item) => ({
        'value': item.id,
        'label': item[paramName]
      })),

      selectedOptions: (entityName, paramName = 'name') => (selectedIds) => selectedIds.cmap((id) => ({
        'value': id,
        'label': state.db[ s(entityName) ].valueById(id)[paramName]
      }))

    };

    for (let key in EntityNames) {
      const entityName = EntityNames[key];
      this[ s(entityName) ] = state.db.getAll( entityName );

      this[entityName] = {};

      for (let methodName in queryFactory) {
        this[entityName][methodName] = queryFactory[methodName](entityName);
      }
    }

    this.nodeBySocketId = (socketId) => {
      const socket = state.db.sockets.valueById(socketId);
      return state.db[ s(socket.nodeType) ].valueById(socket.nodeId);
    };
  }

}
