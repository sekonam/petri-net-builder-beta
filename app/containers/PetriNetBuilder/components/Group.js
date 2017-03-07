import React, { PropTypes } from 'react';

import { NodeNames } from '../core/Entities';
import Store from '../core/Store';
import Query from '../core/Query';
import GroupModel from './../models/GroupModel';
import NodeModel from '../models/NodeModel';
import DragGroup from '../hoc/DragGroup';
import Node from './Node';
import NodeByType from './NodeByType';

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onClick() {
    const methods = Store.instance;
    methods.group.active(this.props.data.id);
  }

  onDoubleClick() {
    const { data } = this.props;
    const methods = Store.instance;

    if (data.type === 0) {
      methods.group.set(data.id, { minimized: !data.minimized });
    }
  }

  render() {
    const { data } = this.props;
    const query = Query.instance;

    if (!query.group.empty(data.id)) {
      const { x, y, width: w, height: h } = query.group.size(data.id);

      if (data.minimized) {
        const node = new NodeModel({
          name: data.name,
          x,
          y,
          width: data.width,
          height: data.height,
          r: data.r,
          socketIds: query.group.externalSocketIds(data.id),
        });

        return (
          <g
            className={`group ${data.typeName}`}
            onClick={this.onClick}
            onDoubleClick={this.onDoubleClick}>
            <Node data={node} />
          </g>
        );
      }

      const entities = [];
      NodeNames.forEach((nodeName) => {
        data[`${nodeName}Ids`].forEach((nodeId) => {
          const node = query[nodeName].get(nodeId);
          entities.push(<NodeByType data={node} key={node.id} />);
        });
      });

      return (
        <g
          className={`group ${data.typeName}`}
          onClick={this.onClick}
          onDoubleClick={this.onDoubleClick}>
          <rect
            x={x} y={y} width={w} height={h}
            rx={data.r} ry={data.r} className="group-rect"
          />
          <g className="header">
            <text x={x + 10} y={y + 18} className="group-header">{data.name}</text>
          </g>
          {entities}
        </g>
      );
    }

    return null;
  }
}

Group.propTypes = {
  data: PropTypes.instanceOf(GroupModel).isRequired,
};

export default DragGroup()(Group);
