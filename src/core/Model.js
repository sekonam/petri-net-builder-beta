import _ from 'lodash';
import MicroEvent from 'microevent';

class Model {

  getId() {
    return String.random(15);
  }

  genId() {
    this.id = this.getId();
  }

  init(params, defaults = []) {
    if (!_.isEmpty(params)) {
      _.defaultsDeep(this, params);
    } else if (!_.isEmpty(defaults)) {
      _.defaultsDeep(this, defaults);
    }

    if (!this.id) {
      this.genId();
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
