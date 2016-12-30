String.prototype.ucfirst = function () {
  return this.length ? this.charAt(0).toUpperCase() + this.substr(1) : '';
};
Array.prototype.doHave = function(element) {
  return this.indexOf(element) > -1;
};
