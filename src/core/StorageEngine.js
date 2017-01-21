const StorageEngine = {
  loadFromStorage: function ( name ) {
    if (typeof(Storage) !== "undefined") {
      const json = localStorage.getItem( name );

      if (json) {
        return JSON.parse( json );
      }
    }

    return null;
  },

  saveToStorage: function ( name, value ) {
    if (typeof(Storage) !== "undefined") {
      localStorage.setItem(name, JSON.stringify( value ));
    }
  }
};

export default StorageEngine;
