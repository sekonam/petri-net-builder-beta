String.prototype.ucfirst = function () {
  return this.length ? this.charAt(0).toUpperCase() + this.substr(1) : '';
};

String.random = function (count) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

Array.prototype.cmap = function(f) {
  return this.length == 0 ? this : this.map(f);
};

// outdated - wrong function name
// replaced by valueById
Array.prototype.indexOfId = function (id) {
  return this.find( (el) => el.id == id );
};

// outdated - wrong function name
// replaced by indexById
Array.prototype.findIndexById = function (id) {
  return this.findIndex( (el) => el.id == id );
};

Array.prototype.indexById = function (id) {
  return this.findIndex( (el) => el.id == id );
};

Array.prototype.valueById = function (id) {
  return this.find( (el) => el.id == id );
};

Array.prototype.spliceRecurcive = function (findFunc) {
  let count = 0;

  for( let key = this.findIndex(findFunc); key > -1; key = this.findIndex(findFunc) ) {
    this.splice( key, 1 );
    count ++;
  }

  return count;
};
