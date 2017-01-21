import _ from 'lodash';

import EntityFactory from './../core/EntityFactory.js';

export default class EngineModel {

  constructor(params = null) {
    this.tables = ['place', 'group', 'action', 'event', 'transition', 'var'];
    this.tables.forEach( (name) => {
      const names = name + 's';
      this[names] = [];

      if (params && names in params) {
        params[names].forEach( (entity) => {
          this[names].push( EntityFactory[name](entity) );
        } );
      }
    } );
  }

}
