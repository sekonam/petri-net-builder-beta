import React, {PropTypes} from 'react';
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
        const {data} = component.props;

        this.timerId = setInterval(
          () => {
            if (monitor.isDragging()) {
              const shift = monitor.getDifferenceFromInitialOffset();
              dragParamsChange.call( this, data, shift );
              component.setState({
                wasDragged: true
              });
            }
          }, 10
        );

        dragParamsInit.call(this, data );
        return {
          id: props.data.id
        };
      },

      endDrag(props, monitor, component) {
        clearInterval(this.timerId);
      }
    };

    function collect(connect, monitor) {
      return {
        connectDragSource: connect.dragSource(),
      }
    }

    return DragSource
      (type, dragSource, collect)
      (class extends React.Component {

        constructor(props) {
          super(props);
          this.state = {
            wasDragged: false
          };
          this.onMouseDown = this.onMouseDown.bind(this);
          this.onMouseUp = this.onMouseUp.bind(this);
          this.onClick = this.onClick.bind(this);
        }

        onMouseDown(e) {
          mouseDownCallback(this.props.data);
        }

        onMouseUp(e) {
          if (this.state.wasDragged) {
            this.setState({
              wasDragged: false
            });
          }
          mouseUpCallback(this.props.data);
        }

        onClick(e) {
          clickCallback(this.props.data);
          e.stopPropagation();
        }

        render() {
          const { connectDragSource, data, setMouseOffset } = this.props;

          return connectDragSource(
            <g onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp}
              onClick={this.onClick}>
              <WrappedComponent data={data} setMouseOffset={setMouseOffset} />
            </g>
          );
        }
      }
    );
  };
};
