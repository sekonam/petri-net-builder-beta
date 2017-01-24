import Store from '../core/Store.js';
import Query from '../core/Query.js';
import Drag from './Drag.js';

export default function DragNode(entityType) {
  const methods = Store.instance,
    query = Query.instance;

  return Drag(entityType,
    function (data) {
      this.start = {
        x: data.x,
        y: data.y
      };
    },

    function (data, shift) {
      diff = query.zoom.offset(shift);
      methods[entityType].set( data.id, {
        x: this.start.x + diff.x,
        y: this.start.y + diff.y
      } );
    },

    (data) => methods[entityType].dragging(data.id),

    (data) => methods[entityType].dragging(null)
  );
};
