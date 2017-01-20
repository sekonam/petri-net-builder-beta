import _ from 'lodash';
import Model from './Model.js';
import EntityFactory from './EntityFactory.js';

export default class ModelArray extends Array {

  /*
  * usefull standart function updates
  */

  map(f) {
    return this.length ? super.map(f) : this;
  }

  /*
  * Model array functions
  */

  constructor(entityName, params = []) {
    super();
    this.entityName = entityName;

    if (!_.isEmpty(params))
  }

  indexById(id) {
    return this.findIndex( (el) => el.id == id );
  }

  valueById(id) {
    return this.find( (el) => el.id == id );
  }

  removeById(id) {
    return this.splice( this.indexById(id), 1 );
  }

  add(params = null) {
    const entity = EntityFactory[this.entityName](params);
    entity.bind( 'remove', (id) => this.removeById(id) );
    return this.push( entity );
  }

}
