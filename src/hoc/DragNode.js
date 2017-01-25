import Store from '../core/Store.js';
import Query from '../core/Query.js';
import Drag from './Drag.js';

export default function DragNode(entityName) {

  return Drag(
    entityName,

    function (data) {
      this.start = {
        x: data.x,
        y: data.y
      };
    },

    function (data, shift) {
      const diff = Query.instance.zoom.offset(shift);
      Store.instance[entityName].set( data.id, {
        x: this.start.x + diff.x,
        y: this.start.y + diff.y
      } );
    },

    function (data) {
      Store.instance[entityName].dragging(data.id);
    },

    function (data) {
      Store.instance[entityName].dragging(null);
    },

    function (data) {
      Store.instance[entityName].edit(data.id);
    }
  );
};
