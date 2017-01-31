import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import {NodeNames} from '../core/Entities.js';
import Store from '../core/Store.js';
import Query from '../core/Query.js';
import GroupModel from './../models/GroupModel.js';
import NodeModel from '../models/NodeModel.js'
import Node from './Node.js';
import NodeByType from './NodeByType.js';

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
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onMouseUp(e) {
    const methods = Store.instance;
    methods.group.active(this.props.data.id);
  }

  onDoubleClick(e) {
    const {data} = this.props,
      methods = Store.instance;
    if (data.type == 0) {
      methods.group.set(data.id, {minimized: !data.minimized});
    }
  }

  render() {
    const {data, connectDragSource, setMouseOffset} = this.props,
      query = Query.instance,
      methods = Store.instance;

    if (!query.group.empty(data.id)) {
      const {x, y, width: w, height: h} = query.group.size(data.id);

      if (data.minimized) {
        const node = new NodeModel({
            name: data.name,
            x, y,
            width: data.width,
            height: data.height,
            r: data.r,
            socketIds: query.group.externalSocketIds(data.id)
          });

        return connectDragSource(
          <g className={'group ' + data.typeName}
            onClick={this.onMouseUp}
            onDoubleClick={this.onDoubleClick}>
            <Node data={node} setMouseOffset={setMouseOffset} />
          </g>
        );

      } else {
        let entities = [];

        NodeNames.forEach( (nodeName) => {
          data[nodeName + 'Ids'].forEach( (nodeId) => {
            const node = query[nodeName].get(nodeId);
            entities.push( <NodeByType type={nodeName} data={node}
              key={node.id} setMouseOffset={setMouseOffset} /> );
          } );
        } );

        return connectDragSource(
          <g className={'group ' + data.typeName}
            onClick={this.onMouseUp}
            onDoubleClick={this.onDoubleClick}>
            <rect x={x} y={y} width={w} height={h}
              rx={data.r} ry={data.r} className="group-rect"/>
            <g className="header">
              <text x={x+10} y={y+18} className="group-header">{data.name}</text>
            </g>
            {entities}
            {this.props.children}
          </g>
        );
      }
    }

    return null;
  }
}

Group.propTypes = {
    data: PropTypes.instanceOf(GroupModel).isRequired,
    zoomedDiff: PropTypes.func.isRequired
};

export default DragSource('group', groupSource, collect)(Group);
