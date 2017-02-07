import {NodeNames} from '../core/Entities.js';
import Store from '../core/Store.js';
import Query from '../core/Query.js';
import Drag from './Drag.js';

export default function DragNode(nodeName) {

  return Drag(
    nodeName,

    function (data) {
      const query = Query.instance;

      if (query[nodeName].isSelected(data.id)) {
        this.start = {};

        NodeNames.forEach( (nodeName) => {
          if (query[nodeName].isSelecting()) {
            const nodeIds = query[nodeName].selected();
            query[nodeName + 's']( nodeIds ).forEach( (node) => {
              this.start[node.id] = {
                x: node.x,
                y: node.y
              };
            } );
          }
        } );

      } else {
        this.start = {
          x: data.x,
          y: data.y
        };
      }
    },

    function (data, shift) {
      const query = Query.instance,
        methods = Store.instance,
        diff = query.viewport.zoom.offset(shift);

      if (query[nodeName].isSelected(data.id)) {
        NodeNames.forEach( (nodeName) => {
          if (query[nodeName].isSelecting()) {
            const nodeIds = query[nodeName].selected();
            query[nodeName + 's']( nodeIds ).forEach( (node) => {
              methods[nodeName].set( node.id, {
                x: this.start[node.id].x + diff.x,
                y: this.start[node.id].y + diff.y
              } );
            } );
          }
        } );

      } else {
        methods[nodeName].set( data.id, {
          x: this.start.x + diff.x,
          y: this.start.y + diff.y
        } );
      }
    },

    function (data) {
      Store.instance[nodeName].dragging(data.id);
    },

    function (data) {
      Store.instance[nodeName].dragging(null);
    },

    function (data) {
      Store.instance[nodeName].active(data.id);
    }
  );
};
