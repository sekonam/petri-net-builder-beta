class Store {
  init(values, keys = null) {
    if (keys == null) {
      keys = Object.keys(values);
    }
    
    keys.forEach( (key) => {
      this[key] = values[key];
    } );
  }
}

export default Store;
