import React, {PropTypes} from 'react';
import { DragSource } from 'react-dnd';

export default function Drag(type,
  dragParamsInit,
  dragParamsChange,
  dragStartCallback,
  dragEndCallback
) (WrappedComponent) {
  const dragSource = {

    beginDrag(props, monitor, component) {
      const {data} = component.props;

      this.timerId = setInterval(
        () => {
          if (monitor.isDragging()) {
            const diff = monitor.getDifferenceFromInitialOffset();
            dragParamsChange.call( this, data, shift );

  /*        zDiff = component.props.zoomedDiff(diff);
            methods.subnet.set( props.data.id, {
              x: this.start.x + zDiff.x,
              y: this.start.y + zDiff.y
            } );*/
          }
        }, 10
      );

  /*    this.start = {
        x: data.x,
        y: data.y
      };
      methods.subnet.dragging(props.data.id);*/
      dragParamsInit.call(this, data );

      return {
        id: props.data.id
      };
    },

    endDrag(props, monitor, component) {
      clearInterval(this.timerId);
      component.setState({
        wasDragged: true
      });
    }
  };

  function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
    }
  }

  class DragComponent extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        wasDragged: false
      };
      this.onClick = this.onClick.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);
    }

    onClick(e) {
      if (this.state.wasDragged) {
        this.setState({
          wasDragged: false
        });
      }
    }

    onMouseDown(e) {
/*      Store.instance.subnet.dragging(this.props.data.id);*/
      dragStartCallback(this.props.data);
    }

    onMouseUp(e) {
      dragEndCallback(this.props.data);
    }

    render() {
      const { connectDragSource, data, ...otherProps} = this.props;

      return connectDragSource(
        <WrappedComponent data={data}
          {...otherProps}
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        />
      );
    }
  }

  DragComponent.propTypes = {
    data: PropTypes.object.isRequired
  };

  return DragSource(type, dragSource, collect)(DragComponent);
};
