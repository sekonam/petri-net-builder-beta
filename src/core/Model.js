import _ from 'lodash';

function Model() {
  this.genId();
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
    params.forEach( (val, key) => {
    this[key] = _.cloneDeep(params[key]);
    } );
  }
};

Model.prototype.short = function (propName, maxLength = Model.maxShortLength) {
  if (propName in this) {
    const prop = this[propName];
    return prop.length < maxLength ? prop : prop.substring(0, maxLength) + '...';
  }

  return '';
}

Model.maxShortLength = 16;

export default Model;
