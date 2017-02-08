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

Model.prototype.multiline = function (propName, maxLength = Model.maxShortLength) {
  if (propName in this) {
    const prop = this[propName];

    if (prop.length < maxLength) {
      return [prop];
    } else {

      const words = prop.split(/\s+/);
      let lines = [],
        line = '';

      words.forEach( (word) => {
        if (line.length + word.length + 1 > maxLength && line.length > 0) {
          lines.push(line);
          line = '';
        }

        line += word + ' ';
      } );

      if (line.length > 0) {
        lines.push(line);
      }

      return lines;
    }
  }

  return [];
};

Model.prototype.entityName = function () {
  const constructorName = this.constructor.name;
  return constructorName.substr(0, constructorName.length-5).toLowerCase();
};

Model.maxShortLength = 16;

export default Model;
