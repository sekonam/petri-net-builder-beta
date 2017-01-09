class Model {

  getId() {
    return String.random(15);
  }

  genId() {
    this.id = this.getId();
  }

  init(params, defaults) {
    if (typeof params == 'object' && params && Object.keys(params).length > 0) {
      this.initProps(params);
    } else {
      this.initProps(defaults);
    }
  }

  initProps(params) {
    if ( typeof params == 'object' && params) {
      Object.keys(params).forEach( (name) => {
        this[name] = name in params ? params[name] : null;
      } );

      if (!this.id) {
        this.genId();
      }
    }
  }

  value(obj, name) {
    if (typeof obj == 'object' && obj) {
      return name in obj ? obj[name] : null;
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

export default Model;
