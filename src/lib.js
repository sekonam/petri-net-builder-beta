String.prototype.ucfirst = function () {
  return this.length ? this.charAt(0).toUpperCase() + this.substr(1) : '';
};
Array.prototype.doHave = function(element) {
  return this.indexOf(element) > -1;
};
Array.prototype.cmap = function(f) {
  return this.length == 0 ? this : this.map(f);
};
String.random = function (count) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < count; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
Array.prototype.indexOfId = function (id) {
  return this.find( (el) => el.id == id );
};
Array.prototype.findIndexById = function (id) {
  return this.findIndex( (el) => el.id == id );
};
Array.prototype.spliceRecurcive = function (findFunc) {
  let count = 0;

  for( let key = this.findIndex(findFunc); key > -1; key = this.findIndex(findFunc) ) {
    this.splice( key, 1 );
    count ++;
  }

  return count;
}
