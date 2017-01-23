import {EntityNames} from './Entities.js';

export default class Query {

  constructor(state) {
    Query.instance = this;

    const s = (name) => name + 's';

    const queryFactory = {

      get: (entityName) => state.db.get(entityName),

      options: (entityName, paramName = 'name') => () => this[ s(entityName) ]().cmap((item) => ({
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
      this[ s(entityName) ] = (ids = null) => {
        if (!state.active.net) return [];

        let entities = state.db[ s(entityName) ].filter(
          (entity) => entity.netId == state.active.net.id
        );

        if (ids) {
          entities = entities.filter( (entity) => ids.has(entity.id) );
        }

        return entities;
      };
    } );

    this.arc.netId = (id) => {
      const arc = this.arc.get(id),
        socket = this.socket.get(arc.startSocketId),
        node = this[socket.nodeType].get(socket.nodeId);
      return node.netId;
    };

    this.arcs = (ids = null) => {
      if (!state.active.net) return [];

      let entities = state.db.arcs.filter(
        (entity) => this.arc.netId(entity.id) == state.active.net.id
      );

      if (ids) {
        entities = entities.filter( (entity) => ids.has(entity.id) );
      }

      return entities;
    };

    this.nodeBySocketId = (socketId) => {
      const socket = state.db.sockets.valueById(socketId);
      return state.db[ s(socket.nodeType) ].valueById(socket.nodeId);
    };

    this.treebreadWorkspace = (activeId = null, toggled = []) => {

      let cursor = null;
      const node = {
        name: 'Workspace',
        toggled: true,
        children: state.db.nets.filter( (net) => !net.subNetId ).map( (net) => {

          let places = state.db.places.filter( (place) => place.netId == net.id ),
            groups = state.db.groups.filter( (group) => group.netId == net.id );

          const node = {
            id: net.id,
            type: 'net',
            name: net.name,
            toggled: toggled.indexOf(net.id) > -1,
            children: groups.map( (group) => {

              const node = {
                id: group.id,
                type: 'group',
                name: group.name,
                toggled: toggled.indexOf(group.id) > -1,
                children: group.placeIds.map( (pid) => {

                  const place = this.place.get(pid),
                    key = places.indexById(pid);

                  if (key > -1) {
                    places.splice(key, 1);
                  }

                  const node = {
                    id: place.id,
                    type: 'place',
                    name: place.name
                  };

                  if (place.id == activeId) {
                    cursor = node;
                  }

                  return node;

                } )
              };

              if (group.id == activeId) {
                cursor = node;
              }

              return node;

            } ) . concat( places.map( (place) => {

              const node = {
                id: place.id,
                type: 'place',
                name: place.name
              };

              if (place.id == activeId) {
                cursor = node;
              }

              return node;

            } ) )
          };

          if (net.id == activeId) {
            cursor = node;
          }

          return node;
        } )
      };

      return {tree: node, cursor};
    }
  }
}
