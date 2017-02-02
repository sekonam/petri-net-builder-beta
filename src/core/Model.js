import _ from 'lodash';

function Model(params = null) {
  if (params) {
    this.set(params);
  } else {
    this.genId();
    this.defaults();
  }
};

Model.prototype.getId = function() {
  return String.random(15);
};

Model.prototype.genId = function() {
  this.id = this.getId();
};

Model.prototype.defaults = function () {};

Model.prototype.set = function (params) {
  if (!_.isEmpty(params)) {
    Object.getOwnPropertyNames(params).forEach( (name) => {
      this[name] = _.cloneDeep(params[name]);
    } );
  }
};

Model.prototype.short = function (propName, maxLength = Model.maxShortLength) {
  if (propName in this) {
    const prop = this[propName];
    return prop.length < maxLength ? prop : prop.substring(0, maxLength) + '...';
  }

  return '';
};

Model.prototype.entityName = function () {
  const constructorName = this.constructor.name;
  return constructorName.substr(0, constructorName.length-5).toLowerCase();
};

Model.maxShortLength = 16;

export default Model;
