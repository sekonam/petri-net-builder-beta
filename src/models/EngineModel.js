import _ from 'lodash';

import EntityFactory from './../core/EntityFactory.js';

export default class EngineModel {

  constructor() {
    this.tables = ['place', 'group', 'action', 'event', 'transition', 'var'];
    this.tables.forEach( (name) => {
      this[name + 's'] = [];
    } );
  }

}
