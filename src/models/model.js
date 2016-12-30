class Model {
  init(values, keys = null) {
    if (keys == null) {
      keys = Object.keys(values);
    }

    keys.forEach( (key) => {
      this[key] = values[key];
    } );
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
