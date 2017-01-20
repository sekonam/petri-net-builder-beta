import _ from 'lodash';
import Model from './Model.js';
import EntityFactory from './EntityFactory.js';

function ModelArray(entityName, params = []) {
  Array.call(this);
  this.entityName = entityName;

  if (!_.isEmpty(params)) {
    params.forEach( (param) => this.add(param) );
  }
}

ModelArray.prototype = Object.create( Array.prototype );

  /*
  * usefull standart function updates
  */

ModelArray.prototype.map = function (f) {
  return this.length ? Array.prototype.map.call(this, f) : this;
}

  /*
  * Model array functions
  */

  ModelArray.prototype.indexById = function (id) {
    return this.findIndex( (el) => el.id == id );
  };

  ModelArray.prototype.valueById = function (id) {
    return this.find( (el) => el.id == id );
  };

  ModelArray.prototype.removeById = function (id) {
    return this.splice( this.indexById(id), 1 );
  };

  ModelArray.prototype.add = function (params = null) {
    const entity = EntityFactory[this.entityName](params);
    entity.bind( 'remove', (id) => this.removeById(id) );
    return this.push( entity );
  };

module.exports = ModelArray;
