import React, {PropTypes} from 'react';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';

import EngineModel from './../models/EngineModel.js';
import ViewportModel from './../models/ViewportModel.js';
import GroupModel from './../models/GroupModel.js';

import Place from './Place.js';
import Transition from './Transition.js';
import Group from './Group.js';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documentSize: {
        width: 0,
        height: 0
      },

      // active transition build
      mouseOffset: {
        x: 0,
        y: 0
      },

      // tracking board
      mouseDown: null,
      translateX: 0,
      translateY: 0,

      // show selected state dim everyone else
      clickedPlace: null
    };

    this.zoomedOffset = this.zoomedOffset.bind(this);
    this.zoomedDiff = this.zoomedDiff.bind(this);
    this.setMouseOffset = this.setMouseOffset.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.hideDimLayer = this.hideDimLayer.bind(this);
  }

  componentDidMount() {
    this.setState( {
      documentSize: {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
      }
    } );
  }

  fullElementOffset(element) {
    const rect = element.getBoundingClientRect(),
      scrollX = window.pageXOffset || document.documentElement.scrollLeft,
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
    return {
      x: scrollX + rect.left,
      y: scrollY + rect.top
    };
  }

  zoomedOffset(offset) {
    const svgOffset = this.fullElementOffset(this.svg),
      x = offset.x - svgOffset.x,
      y = offset.y - svgOffset.y,
      viewport = this.props.viewport,
      w = this.svgWidth(),
      h = this.svgHeight()

    return {
      x: w/2 + (x - w/2 - viewport.translateX) / viewport.zoom,
      y: h/2 + (y - h/2 - viewport.translateY) / viewport.zoom
    };
  }

  zoomedDiff(diff) {
    const viewport = this.props.viewport;

    return {
      x: diff.x / viewport.zoom,
      y: diff.y / viewport.zoom
    };
  }

  canChangeTranslate() {
    const {active} = this.props;
    return !active.place && !active.group && !this.state.clickedPlace;
  }

  mouseDownHandler(e) {
    if (this.canChangeTranslate()) {
      this.setState({
        mouseDown: {
          x: e.pageX,
          y: e.pageY
        },
        translateX: this.props.viewport.translateX,
        translateY: this.props.viewport.translateY
      });
    }
  }

  mouseUpHandler(e) {
    if (this.canChangeTranslate() && this.state.mouseDown) {
      this.setState({
        mouseDown: null,
        translateX: 0,
        translateY: 0
      });
    }
  }

  mouseMoveHandler(e) {
    const {active, viewport} = this.props;

    if (active.transition) {
      this.setMouseOffset( {
        x: e.pageX,
        y: e.pageY
      } );
    } else if (this.canChangeTranslate() && this.state.mouseDown) {
      this.props.methods.translate.set(
        this.state.translateX + e.pageX - this.state.mouseDown.x,
        this.state.translateY + e.pageY - this.state.mouseDown.y
      );
    }
  }

  setMouseOffset( offset ) {
    this.setState( (prevState, props) => {
      prevState.mouseOffset = this.zoomedOffset( {
        x: offset.x,
        y: offset.y
      } );
      return prevState;
    } );
  }

  svgWidth() {
    return Math.max( 0, this.state.documentSize.width - 190 );
  }

  svgHeight() {
    return Math.max( 0, this.state.documentSize.height - 55 );
  }

  hideDimLayer(e) {
    this.setState({
      clickedPlace: null
    });

    e.stopPropagation();
  }

  drawTactical() {
    const { store, methods } = this.props,
      { min, max } = GroupModel.findMinMax( store.places ),
      w = this.svgWidth(),
      h = this.svgHeight(),
      indents = {
        x: Math.max( Math.abs( Math.min( 0, min.x ) ), Math.max( 0, max.x - w ) ),
        y: Math.max( Math.abs( Math.min( 0, min.y ) ), Math.max( 0, max.y - h ) )
      }
    return (
      <g>
        <circle cx={ -indents.x + 1 } cy={ -indents.y + 1 } r="1" className="tactical"/>
        <circle cx={ w + indents.x - 1 } cy={ h + indents.y - 1 } r="1" className="tactical"/>
      </g>
    );
  }

  render() {
    const { store, methods, active } = this.props,

      places = store.places.cmap( (place, key) => (
        <Place data={place} id={place.id} key={key}
          zoomedDiff={this.zoomedDiff}
          setMouseOffset={this.setMouseOffset}
          contextSetState={this.setState.bind(this)}
          store={store}
          methods={methods} />
      ) ),

      getHandlers = {
        place: methods.place.get,
        socket: methods.socket.get
      },

      transitions = store.transitions.cmap( (transition, key) => (
        <Transition data={transition} key={key}
          editHandler={() => methods.transition.edit(transition.id)}
          getHandlers={getHandlers} />
      ) ),

      activeTransition = active.transition ? (
        <Transition data={active.transition} offset={this.state.mouseOffset}
          editHandler={() => methods.transition.edit(active.transition.id)}
          getHandlers={getHandlers} />
      ) : '',

      groups = store.groups.cmap( (group, key) => (
        <Group data={group} methods={methods} zoomedDiff={this.zoomedDiff} key={key} />
      ) ),

      viewport = this.props.viewport,
      transform = `translate(${viewport.translateX}px,${viewport.translateY}px) scale(${viewport.zoom})`,
      transformStyle = {
        transform,
        transformOrigin: '50% 50%'
      };

    let dimLayerStyles = {
        display: 'none'
      };

    if (this.state.clickedPlace) {
      dimLayerStyles = {};
    }

    return (
      <svg width={ this.svgWidth() } height={ this.svgHeight() }
        onMouseMove={this.mouseMoveHandler} onClick={methods.transition.removeActive}
        onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler}
        onWheel={ (e) => methods.zoom.change( e.deltaY > 0 ? 0.25 : -0.25 )() }
        ref={ (el) => { this.svg = el; } } >
        <g className="diagram-objects" style={{transform}}>
          {this.drawTactical()}
          <g className="groups">
            {groups}
          </g>
          <g className="transitions">
            {transitions}
          {activeTransition}
          </g>
          <g className="states">
            {places}
          </g>
        </g>
        <rect x="0" y="0" width={ this.svgWidth() } height={ this.svgHeight() }
          className="dim-layer" style={dimLayerStyles}
          onClick={this.hideDimLayer} />
      </svg>
    );
  }
}

Context.propTypes = {
  store: PropTypes.instanceOf(EngineModel).isRequired,
  viewport: PropTypes.instanceOf(ViewportModel).isRequired,
  methods: PropTypes.object.isRequired,
  active: PropTypes.object.isRequired
};

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Context);
