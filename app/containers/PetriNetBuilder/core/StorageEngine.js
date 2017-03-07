const StorageEngine = {
  loadFromStorage(name) {
    if (typeof (Storage) !== 'undefined') {
      const json = localStorage.getItem(name);

      if (json) {
        return JSON.parse(json);
      }
    }

    return null;
  },

  saveToStorage(name, value) {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem(name, JSON.stringify(value));
    }
  },
};

export default StorageEngine;
