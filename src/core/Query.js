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

    ['place', 'group',].forEach( (entityName) => {
      this[ s(entityName) ] = (ids) => {
        let entities = state.db[ s(entityName) ];

        if (state.active.net) {
          entities = entities.filter( (entity) => entity.netId == state.active.net );
        }

        if (ids) {
          entities = entities.filter( (entity) => ids.has(entity.id) );
        }

        return entities;
      };
    } );

    this.nodeBySocketId = (socketId) => {
      const socket = state.db.sockets.valueById(socketId);
      return state.db[ s(socket.nodeType) ].valueById(socket.nodeId);
    };

    this.treebreadWorkspace = () => {
      return {
        name: 'Workspace',
        toggled: true,
        children: state.db.nets.filter( (net) => !net.subNetId ).map( (net) => {

          let places = state.db.places.filter( (place) => place.netId == net.id ),
            groups = state.db.groups.filter( (group) => group.netId == net.id );

          return {
            id: net.id,
            type: 'net',
            name: net.name,
            children: groups.map( (group) => {

              return {
                id: group.id,
                type: 'group',
                name: group.name,
                children: group.placeIds.map( (pid) => {
                  const place = this.place.get(pid),
                    key = places.indexById(pid);

                  if (key > -1) {
                    places.splice(key, 1);
                  }

                  return {
                    id: place.id,
                    type: 'place',
                    name: place.name
                  }
                } )
              }
            } ) . concat( places.map( (place) => ({
              id: place.id,
              type: 'place',
              name: place.name
            }) ) )
          };
        } )
      };
    }
  }
}
