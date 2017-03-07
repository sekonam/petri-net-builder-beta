import { valueById } from '../core/helpers';
import { EntityFactory, EntityNames } from '../core/Entities';

export default class EngineModel {

  constructor(params = null) {
    EntityNames.forEach((name) => {
      const names = `${name}s`;
      this[names] = [];

      if (params && names in params) {
        params[names].forEach((entity) => {
          this[names].push(EntityFactory[name](entity));
        });
      }
    });
  }

  entities(name) {
    return this[`${name}s`];
  }

  get(entityName) {
    return (id) => valueById(this.entities(entityName), id);
  }

  getAll(entityName) {
    return (ids = null) => {
      const entities = this.entities(entityName);

      if (ids) {
        return entities.filter((entity) => ids.indexOf(entity.id) > -1);
      }

      return entities;
    };
  }

}
