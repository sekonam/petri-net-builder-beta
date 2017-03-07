import React, { PropTypes } from 'react';
import { DragSource } from 'react-dnd';

export default function Drag(
  type,
  dragParamsInit,
  dragParamsChange,
  mouseDownCallback,
  mouseUpCallback,
  clickCallback
) {
  return (WrappedComponent) => {
    const dragSource = {

      beginDrag(props, monitor, component) {
        const { data } = component.props;

        this.timerId = setInterval(
          () => {
            if (monitor.isDragging()) {
              const shift = monitor.getDifferenceFromInitialOffset();
              dragParamsChange.call(this, data, shift);
              component.setState({
                wasDragged: true,
              });
            }
          }, 10
        );

        dragParamsInit.call(this, data);
        return {
          id: props.data.id,
        };
      },

      endDrag() {
        clearInterval(this.timerId);
      },
    };

    function collect(connect) {
      return {
        connectDragSource: connect.dragSource(),
      };
    }

    class DragComponent extends React.Component {

      constructor(props) {
        super(props);
        this.state = {
          wasDragged: false,
        };
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onClick = this.onClick.bind(this);
      }

      onMouseDown() {
        mouseDownCallback(this.props.data);
      }

      onMouseUp() {
        if (this.state.wasDragged) {
          this.setState({
            wasDragged: false,
          });
        }
        mouseUpCallback(this.props.data);
      }

      onClick(e) {
        clickCallback(this.props.data);
        e.stopPropagation();
      }

      render() {
        const {
          connectDragSource,
          data,
        } = this.props;

        return connectDragSource(
          <g
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onClick={this.onClick}>
            <WrappedComponent data={data} />
          </g>
        );
      }
    }

    DragComponent.propTypes = {
      connectDragSource: PropTypes.func.isRequired,
      data: PropTypes.object.isRequired,
    };

    return DragSource(type, dragSource, collect)(DragComponent);
  };
}
