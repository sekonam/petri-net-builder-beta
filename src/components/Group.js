import React, {PropTypes} from 'react';

import {NodeNames} from '../core/Entities.js';
import Store from '../core/Store.js';
import Query from '../core/Query.js';
import GroupModel from './../models/GroupModel.js';
import NodeModel from '../models/NodeModel.js'
import DragGroup from '../hoc/DragGroup.js';
import Node from './Node.js';
import NodeByType from './NodeByType.js';

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onClick(e) {
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
    const {data, setMouseOffset} = this.props,
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

        return (
          <g className={'group ' + data.typeName}
            onClick={this.onClick}
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

        return (
          <g className={'group ' + data.typeName}
            onClick={this.onClick}
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
    data: PropTypes.instanceOf(GroupModel).isRequired
};

export default DragGroup()(Group);
