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

Array.prototype.has = function (value) {
  return this.indexOf(value) > -1;
};

Array.prototype.cmap = function(f) {
  return this.length == 0 ? this : this.map(f);
};

Array.prototype.indexById = function (id) {
  return this.findIndex( (el) => el.id == id );
};

Array.prototype.valueById = function (id) {
  return this.find( (el) => el.id == id );
};

Array.prototype.removeById = function (id) {
  const key = this.indexById(id);
  if (key > -1) this.splice(key, 1);
};

Array.prototype.spliceRecurcive = function (findFunc) {
  let count = 0;

  for( let key = this.findIndex(findFunc); key > -1; key = this.findIndex(findFunc) ) {
    this.splice( key, 1 );
    count ++;
  }

  return count;
};

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};

Object.equals = function( x, y ) {
  if ( x === y ) return true;
    // if both x and y are null or undefined and exactly the same

  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
    // if they are not strictly equal, they both need to be Objects

  if ( x.constructor !== y.constructor ) return false;
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.

  for ( var p in x ) {
    if ( ! x.hasOwnProperty( p ) ) continue;
      // other properties were tested using x.constructor === y.constructor

    if ( ! y.hasOwnProperty( p ) ) return false;
      // allows to compare x[ p ] and y[ p ] when set to undefined

    if ( x[ p ] === y[ p ] ) continue;
      // if they have the same strict value or identity then they are equal

    if ( typeof( x[ p ] ) !== "object" ) return false;
      // Numbers, Strings, Functions, Booleans must be strictly equal

    if ( ! Object.equals( x[ p ],  y[ p ] ) ) return false;
      // Objects and Arrays must be tested recursively
  }

  for ( p in y ) {
    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) return false;
      // allows x[ p ] to be set to undefined
  }
  return true;
}

/*
* Recurcively copies list of properties {props} from {from} to {where}
*/
export function copyPropsR( where, from, props ) {

  if (typeof where == 'object' && typeof from == 'object') {
    if ( where.constructor == Array ) {
      if (from.constructor == Array)
        for (let key in where) {
          if (from[key]) {
            copyPropsR(where[key], from[key], props);
          }
        }

    } else if (where.constructor == Object) {
      if (from.constructor == Object)
        Object.getOwnPropertyNames(where).forEach( (propName) => {
          if (from[propName]) {
            if (props.indexOf(propName) > -1) {
              where[key] = from[key];
            } else {
              copyPropsR(where[key], from[key], props);
            }
          }
        } );

    }
  }
}
