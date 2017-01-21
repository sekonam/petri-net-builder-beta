import _ from 'lodash';
import MicroEvent from 'microevent';

import ModelArray from './ModelArray.js';
import EntityFactory from './EntityFactory.js';

function Model() {};

  Model.prototype.getId = function() {
    return String.random(15);
  };

  Model.prototype.genId = function() {
    this.id = this.getId();
  };

  Model.prototype.init = function (params, defaults = null) {
    if (!_.isEmpty(params)) {
      this.initEntityDeep(params);
    } else if (!_.isEmpty(defaults)) {
      this.initEntityDeep(defaults);
    }

    if (!this.id) {
      this.genId();
    }
    console.log(params, this);
  };

  Model.prototype.initEntityDeep = function (params) {
    if (typeof(params) == 'object' && !_.isEmpty(params)) {
      for( let name in params) {
        const value = params[name],
          entityName = name.substring(0, name.length - 1);

        if (typeof value == 'object' && value) {
          if ( value.hasOwnProperty('entityName')
            && entityName in EntityFactory
            && name.substring(name.length - 1, name.length) == 's'
          ) {
            this[name] = new ModelArray(entityName, value);

          } else if (name in EntityFactory) {
            this[name] = EntityFactory[name](value);

          } else {
            this[name] = value;//_.cloneDeep(value);
          }

        } else {
          this[name] = value;//_.cloneDeep(value);
        }

//        console.log(name, value, this[name]);
      }
    }
  };

  Model.prototype.set = function (params) {
    if (!_.isEmpty(params)) {
      params.forEach( (val, key) => {
        this[key] = _.cloneDeep(params[key]);
      } );
    }
  };

  Model.prototype.remove = function () {
    this.trigger( 'remove', this.id );
  };

  Model.prototype.short = function (propName, maxLength = Model.maxShortLength) {
    if (propName in this) {
      const prop = this[propName];
      return prop.length < maxLength ? prop : prop.substring(0, maxLength) + '...';
    }

    return '';
  }

Model.maxShortLength = 16;
MicroEvent.mixin(Model);

export default Model;
