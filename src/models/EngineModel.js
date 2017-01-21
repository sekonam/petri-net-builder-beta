import _ from 'lodash';

import Model from './../core/Model.js';
import ModelArray from './../core/ModelArray.js';
import EntityFactory from './../core/EntityFactory.js';

export default class EngineModel extends Model {
  constructor(store = null) {
    super();
    ['place', 'group', 'action', 'event', 'transition', 'var'].forEach( (name) => {
      const names = name + 's',
        defaults = !_.isEmpty(store) && names in store ? store[names] : null;
      this[names] = new ModelArray( name, defaults );
    } );
  }
}
