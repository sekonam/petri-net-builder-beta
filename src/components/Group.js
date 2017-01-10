import React from 'react';
import { DragSource } from 'react-dnd';

import Types from './types.js';
import CircleButton from './CircleButton.js';

const groupSource = {

  beginDrag(props, monitor, component) {
    const {data, methods} = component.props;

    this.timerId = setInterval(
      () => {
        if (monitor.isDragging()) {
          const diff = monitor.getDifferenceFromInitialOffset(),
            zDiff = component.props.zoomedDiff(diff);

          data.states.forEach( (sid) => {
            const state = methods.state.get(sid);
            methods.state.drag( sid, this.start[sid].x + zDiff.x, this.start[sid].y + zDiff.y );
          } );
        }
      }, 10
    );

    this.start = {};

    data.states.forEach( (sid) => {
      const state = methods.state.get(sid);
      this.start[sid] = {
        x: state.x,
        y: state.y
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

    if (data.states.length) {
      const BIG_INT = 1000000,
        INDENT = 10,
        HEADER = 20;

      let max = {
          x: -BIG_INT,
          y: -BIG_INT
        },
        min = {
          x: BIG_INT,
          y: BIG_INT
        };

      data.states.forEach( (sid) => {
        const state = methods.state.get(sid);
        min.x = Math.min( min.x, state.x );
        min.y = Math.min( min.y, state.y );
        max.x = Math.max( max.x, state.x + state.width );
        max.y = Math.max( max.y, state.y + state.height );
      } );

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
  }
}

export default DragSource(Types.GROUP, groupSource, collect)(Group);
