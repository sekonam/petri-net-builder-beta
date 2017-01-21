import _ from 'lodash';

import {EntityFactory, EntityNames} from '../core/Entities.js';

export default class EngineModel {

  constructor(params = null) {
    EntityNames.forEach( (name) => {
      const names = name + 's';
      this[names] = [];

      if (params && names in params) {
        params[names].forEach( (entity) => {
          this[names].push( EntityFactory[name](entity) );
        } );
      }
    } );
  }

  entities(name) {
    return this[entityName + 's'];
  }

  get(entityName) {
    return (id) => this.entities(entityName).valueById(id);
  }

  getAll(entityName) {
    return (ids = null) => {
      const entities = this.entities(entityName);

      if (ids) {
        return entities.filter( (entity) => ids.has(entity.id) );
      }

      return entities;
    };
  }

}
