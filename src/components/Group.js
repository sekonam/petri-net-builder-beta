import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import {NodeNames} from '../core/Entities.js';
import Store from '../core/Store.js';
import Query from '../core/Query.js';
import GroupModel from './../models/GroupModel.js';
import CircleButton from './CircleButton.js';

const groupSource = {

  beginDrag(props, monitor, component) {
    const {data} = component.props,
      methods = Store.instance;

    this.timerId = setInterval(
      () => {
        if (monitor.isDragging()) {
          const diff = monitor.getDifferenceFromInitialOffset(),
            zDiff = component.props.zoomedDiff(diff);

          NodeNames.forEach( (entityName) => {
            data[entityName + 'Ids'].forEach( (pid) => {
              methods[entityName].set( pid, {
                x: this.start[pid].x + zDiff.x,
                y: this.start[pid].y + zDiff.y
              } );
            } );
          } );
        }
      }, 10
    );

    this.start = {};

    NodeNames.forEach( (entityName) => {
      data[entityName + 'Ids'].forEach( (pid) => {
        const entity = Query.instance[entityName].get(pid);
        this.start[pid] = {
          x: entity.x,
          y: entity.y
        };
      } );
    } );

    methods.group.dragging(props.data.id);

    return {
      id: props.data.id
    };
  },

  endDrag(props, monitor, component) {
    clearInterval(this.timerId);
    Store.instance.group.dragging(null);
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
  }
}

class Group extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const {data, connectDragSource} = this.props,
      query = Query.instance;

    if (!query.group.empty(data.id)) {
      const {min, max} = query.minmax(data.id);

      const INDENT = 10, HEADER = 20,
        x = min.x - INDENT,
        y = min.y - INDENT - HEADER,
        w = max.x - min.x + 2 * INDENT,
        h = max.y - min.y + 2 * INDENT + HEADER;

      return connectDragSource(
        <g className="group">
          <rect x={x} y={y} width={w} height={h}
            rx={INDENT} ry={INDENT} className="group-rect"/>
          <g className="header">
            <text x={x+10} y={y+18} className="group-header">{data.name}</text>
            <CircleButton x = {x+w-18} y = {y+15} caption="E"
              clickHandler={() => Store.instance.group.edit(data.id)}/>
          </g>
        </g>
      );
    }

    return null;
  }
}

Group.propTypes = {
    data: PropTypes.instanceOf(GroupModel).isRequired,
    zoomedDiff: PropTypes.func.isRequired
};

export default DragSource('group', groupSource, collect)(Group);
