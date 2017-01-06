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
    if ( typeof params != 'undefined') {
      Object.keys(params).forEach( (name) => {
        this[name] = name in params ? params[name] : null;
      } );

      if (!this.id) {
        this.genId();
      }
    }
  }

  value(obj, name) {
    if (typeof obj != 'undefined') {
      return name in obj ? obj[name] : null;
    }

    return null;
  }

  short(propName, maxLength = Model.maxShortLength) {
    if (propName in this) {
      const prop = this[propName];
      return prop.length < maxLength ? prop : prop.substring(0, maxLength) + '...';
    }

    return '';
  }

}

Model.maxShortLength = 20;

export default Model;
