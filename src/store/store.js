class Store {
  init(values) {
    Object.keys(values).forEach( (key) => {
      this[key] = values[key];
    } );
  }
}

export default Store;
