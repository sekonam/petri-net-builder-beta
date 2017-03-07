import { NodeNames } from '../core/Entities';
import Store from '../core/Store';
import Query from '../core/Query';
import Drag from './Drag';

export default function DragNode(nodeName) {
  return Drag(
    nodeName,

    function dragParamsInit(data) {
      const query = Query.instance;

      if (query[nodeName].isSelected(data.id)) {
        this.start = {};

        NodeNames.forEach((entityName) => {
          if (query[entityName].isSelecting()) {
            const nodeIds = query[entityName].selected();
            query[`${entityName}s`](nodeIds).forEach((node) => {
              this.start[node.id] = {
                x: node.x,
                y: node.y,
              };
            });
          }
        });
      } else {
        this.start = {
          x: data.x,
          y: data.y,
        };
      }
    },

    function dragParamsChange(data, shift) {
      const query = Query.instance;
      const methods = Store.instance;
      const diff = query.viewport.zoom.offset(shift);

      if (query[nodeName].isSelected(data.id)) {
        NodeNames.forEach((entityName) => {
          if (query[entityName].isSelecting()) {
            const nodeIds = query[entityName].selected();
            query[`${entityName}s`](nodeIds).forEach((node) => {
              methods[entityName].set(node.id, {
                x: this.start[node.id].x + diff.x,
                y: this.start[node.id].y + diff.y,
              });
            });
          }
        });
      } else {
        methods[nodeName].set(data.id, {
          x: this.start.x + diff.x,
          y: this.start.y + diff.y,
        });
      }
    },

    (data) => {
      Store.instance[nodeName].dragging(data.id);
    },

    () => {
      Store.instance[nodeName].dragging(null);
    },

    (data) => {
      Store.instance[nodeName].active(data.id);
    }
  );
}
