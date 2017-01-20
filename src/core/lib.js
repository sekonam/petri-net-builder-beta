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

/*Object.prototype.clone = Array.prototype.clone = function()
{
    if (Object.prototype.toString.call(this) === '[object Array]')
    {
        var clone = [];
        for (var i=0; i<this.length; i++)
            clone[i] = this[i].clone();

        return clone;
    }
    else if (typeof(this)=="object")
    {
        var clone = {};
        for (var prop in this)
            if (this.hasOwnProperty(prop))
                clone[prop] = this[prop].clone();

        return clone;
    }
    else
        return this;
};*/
