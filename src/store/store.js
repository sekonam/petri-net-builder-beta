import MicroEvent from 'microevent';

class Store {
  init(values) {
    Object.keys(values).forEach( (key) => {
      this[key] = values[key];
    } );
  }
}

MicroEvent.mixin(Store);

export default Store;
