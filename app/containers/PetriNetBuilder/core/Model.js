import _ from 'lodash';
import { randStr } from '../core/helpers';

class Model {
  constructor(params = null) {
    if (params) {
      this.set(params);
    } else {
      this.genId();
      this.defaults();
    }
  }

  getId() {
    return randStr(15);
  }

  genId() {
    this.id = this.getId();
  }

  defaults() {}

  set(params) {
    if (!_.isEmpty(params)) {
      Object.getOwnPropertyNames(params).forEach((name) => {
        this[name] = _.cloneDeep(params[name]);
      });
    }
  }

  short(propName, maxLength = Model.maxShortLength) {
    if (propName in this) {
      const prop = this[propName];
      return prop.length < maxLength ? prop : `${prop.substring(0, maxLength)}...`;
    }

    return '';
  }

  multiline(propName, maxLength = Model.maxShortLength) {
    if (propName in this) {
      const prop = this[propName];

      if (prop.length < maxLength) {
        return [prop];
      }

      const words = prop.split(/\s+/);
      const lines = [];
      let line = '';

      words.forEach((word) => {
        if (line.length + word.length + 1 > maxLength && line.length > 0) {
          lines.push(line);
          line = '';
        }

        line += `${word} `;
      });

      if (line.length > 0) {
        lines.push(line);
      }

      return lines;
    }

    return [];
  }

  entityName() {
    const constructorName = this.constructor.name;
    return constructorName.substr(0, constructorName.length - 5).toLowerCase();
  }
}

Model.maxShortLength = 16;

export default Model;
