import {NodeNames} from '../core/Entities.js';
import Store from '../core/Store.js';
import Query from '../core/Query.js';
import Drag from './Drag.js';

export default function DragGroup() {

  return Drag(
    'group',

    function (data) {
      this.start = {};
      NodeNames.forEach( (nodeName) => {
        data[nodeName + 'Ids'].forEach( (nid) => {
          const node = Query.instance[nodeName].get(nid);
          this.start[nid] = {
            x: node.x,
            y: node.y
          };
        } );
      } );
    },

    function (data, shift) {
      const diff = Query.instance.viewport.zoom.offset(shift);
      NodeNames.forEach( (nodeName) => {
        data[nodeName + 'Ids'].forEach( (nid) => {
          Store.instance[nodeName].set( nid, {
            x: this.start[nid].x + diff.x,
            y: this.start[nid].y + diff.y
          } );
        } );
      } );
    },

    function (data) {
      Store.instance['group'].dragging(data.id);
    },

    function (data) {
      Store.instance['group'].dragging(null);
    },

    function (data) {
      Store.instance['group'].active(data.id);
    }
  );
};
