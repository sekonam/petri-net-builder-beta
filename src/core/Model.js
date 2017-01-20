import _ from 'lodash';
import MicroEvent from 'microevent';

import ModelArray from './ModelArray.js';
import EntityFactory from './EntityFactory.js';

class Model {

  getId() {
    return String.random(15);
  }

  genId() {
    this.id = this.getId();
  }

  init(params, defaults = []) {
    if (!_.isEmpty(params)) {
      this.initEntityDeep(params);
    } else if (!_.isEmpty(defaults)) {
      this.initEntityDeep(defaults);
    }

    if (!this.id) {
      this.genId();
    }
  }

  initEntityDeep(params) {
    if (typeof(params) == 'object' && !_.isEmpty(params)) {
      for( let name in params) {
        const value = params[name],
          entityName = name.substring(0, name.length - 1);

        if (value && value.constructor === Array
          && entityName in EntityFactory
          && name.substring(name.length - 1, name.length) == 's'
        ) {
          this[name] = new ModelArray(entityName, value);

        } else if (typeof value == 'object' && name in EntityFactory) {
          this[name] = EntityFactory[name](value);

        } else {
          this[name] = _.cloneDeep(value);
        }
      }
    }
  }

  set(params) {
    if (!_.isEmpty(params)) {
      params.forEach( (val, key) => {
        this[key] = _.cloneDeep(params[key]);
      } );
    }
  }

  remove() {
    this.trigger( 'remove', this.id );
  }

  value(obj, name) {
    if (typeof obj == 'object' && obj && name in obj) {
      return obj[name];
    }

    return null;
  }

  getDefaultValue( name, params, defaultValue ) {
    return this.value(params, name) ? params[name] : defaultValue;
  }

  setPropValue( name, params, defaultValue ) {
    this[name] = this.getDefaultValue( name, params, defaultValue );
  }

  short(propName, maxLength = Model.maxShortLength) {
    if (propName in this) {
      const prop = this[propName];
      return prop.length < maxLength ? prop : prop.substring(0, maxLength) + '...';
    }

    return '';
  }

}

Model.maxShortLength = 16;
MicroEvent.mixin(Model);

export default Model;
