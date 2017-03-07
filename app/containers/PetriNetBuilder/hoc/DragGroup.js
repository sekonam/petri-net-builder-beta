import { NodeNames } from '../core/Entities';
import Store from '../core/Store';
import Query from '../core/Query';
import Drag from './Drag';

export default function DragGroup() {
  return Drag(
    'group',

    function dragParamsInit(data) {
      this.start = {};
      NodeNames.forEach((nodeName) => {
        data[`${nodeName}Ids`].forEach((nid) => {
          const node = Query.instance[nodeName].get(nid);
          this.start[nid] = {
            x: node.x,
            y: node.y,
          };
        });
      });
    },

    function dragParamsChange(data, shift) {
      const diff = Query.instance.viewport.zoom.offset(shift);
      NodeNames.forEach((nodeName) => {
        data[`${nodeName}Ids`].forEach((nid) => {
          Store.instance[nodeName].set(nid, {
            x: this.start[nid].x + diff.x,
            y: this.start[nid].y + diff.y,
          });
        });
      });
    },

    (data) => {
      Store.instance.group.dragging(data.id);
    },

    () => {
      Store.instance.group.dragging(null);
    },

    (data) => {
      Store.instance.group.active(data.id);
    }
  );
}
