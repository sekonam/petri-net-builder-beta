import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';

import Types from './Types.js';
import GroupModel from './../models/GroupModel.js';
import CircleButton from './CircleButton.js';

const groupSource = {

  beginDrag(props, monitor, component) {
    const {data, methods} = component.props;

    this.timerId = setInterval(
      () => {
        if (monitor.isDragging()) {
          const diff = monitor.getDifferenceFromInitialOffset(),
            zDiff = component.props.zoomedDiff(diff);

          data.placeIds.forEach( (sid) => {
            const place = methods.place.get(sid);
            methods.place.drag( sid, this.start[sid].x + zDiff.x, this.start[sid].y + zDiff.y );
          } );
        }
      }, 10
    );

    this.start = {};

    data.placeIds.forEach( (sid) => {
      const place = methods.place.get(sid);
      this.start[sid] = {
        x: place.x,
        y: place.y
      };
    } );

    methods.group.active(props.data.id);

    return {
      id: props.data.id
    };
  },

  endDrag(props, monitor, component) {
    clearInterval(this.timerId);
    component.props.methods.group.active(null);
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
    const {data, methods , connectDragSource} = this.props;

    if (data.placeIds.length) {
      const INDENT = 10,
        HEADER = 20,
        placeIds = data.placeIds.cmap( (sid) => methods.place.get(sid) ),
        {min, max} = GroupModel.findMinMax(placeIds);

      const x = min.x - INDENT,
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
              clickHandler={() => methods.group.edit(data.id)}/>
          </g>
        </g>
      );
    }

    return null;
  }
}

Group.propTypes = {
    data: PropTypes.instanceOf(GroupModel).isRequired,
    methods: PropTypes.object.isRequired,
    zoomedDiff: PropTypes.func.isRequired
};

export default DragSource(Types.GROUP, groupSource, collect)(Group);
