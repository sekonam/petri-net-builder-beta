import React, {PropTypes} from 'react';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';

import {StatusNames, NodeNames} from '../core/Entities.js';
import Store from '../core/Store.js';
import Query from '../core/Query.js';

import EngineModel from './../models/EngineModel.js';
import ViewportModel from './../models/ViewportModel.js';

import Place from './Place.js';
import Transition from './Transition.js';
import Subnet from './Subnet.js';
import Arc from './Arc.js';
import Group from './Group.js';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svgSize: {
        width: 0,
        height: 0
      },

      // drawing Arc offset
      mouseOffset: {
        x: 0,
        y: 0
      },

      // tracking board
      mouseDown: null,
      translateX: 0,
      translateY: 0,
    };

    this.zoomedOffset = this.zoomedOffset.bind(this);
    this.zoomedDiff = this.zoomedDiff.bind(this);
    this.setMouseOffset = this.setMouseOffset.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.hideDimLayer = this.hideDimLayer.bind(this);
    this.setSvgSize = this.setSvgSize.bind(this);
  }

  svgSize() {
    const scrollShift = document.documentElement.clientHeigh
      && document.documentElement.clientHeigh != document.documentElement.scrollHeight ? 15 : 0;
    return {
      width: Math.max( 0, document.documentElement.clientWidth - 185 - 255 - scrollShift ),
      height: Math.max( 0, document.documentElement.clientHeight - 55 )
    };
  }

  setSvgSize() {
    this.setState({ svgSize: this.svgSize() });
  }

  componentDidMount() {
    this.timerId = setInterval( () => {
      const svgSize = this.svgSize();

      if ( svgSize.width != this.state.svgSize.width ) {
        this.setSvgSize();
      }

    }, 5);
    window.addEventListener('resize', this.setSvgSize);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
    window.removeEventListener('resize', this.setSvgSize);
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
      { width: w, height: h } = this.svgSize();

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
    const {dragging} = this.props;

    for (let name in dragging) {
      if (dragging[name]) return false;
    }

    return true;
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
    if (this.state.mouseDown) {
      this.setState({
        mouseDown: null,
        translateX: 0,
        translateY: 0
      });
    }
  }

  mouseMoveHandler(e) {
    const {drawing, viewport} = this.props;

    if (drawing.arc) {
      this.setMouseOffset( {
        x: e.pageX,
        y: e.pageY
      } );
    } else if (this.canChangeTranslate() && this.state.mouseDown) {
      Store.instance.translate.set(
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

  hideDimLayer(e) {
    e.stopPropagation();
  }

  drawTactical() {
    const { min, max } = Query.instance.minmax(),
      { width: w, height: h } = this.state.svgSize,
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

  nodeTag(entityName, entity) {
    switch (entityName) {
      case 'place':
        return (
          <Place data={entity} key={entity.id} setMouseOffset={this.setMouseOffset} />
        );
        break;
      case 'subnet':
        return (
          <Subnet data={entity} key={entity.id} setMouseOffset={this.setMouseOffset} />
        );
        break;
      case 'transition':
        return (
          <Transition data={entity} key={entity.id} setMouseOffset={this.setMouseOffset} />
        );
        break;
      case 'group':
        return (
          <Group data={entity} zoomedDiff={this.zoomedDiff} key={entity.id}
             setMouseOffset={this.setMouseOffset}/>
        );
        break;
    }
  }

  render() {
    const { drawing } = this.props,
      methods = Store.instance,
      query = Query.instance,
      {width, height} = this.state.svgSize,
      groupEntityIds = query.groupEntityIds(),

      groups = query.groupsNotActive()
        .cmap( (group, key) => (
          <Group data={group} zoomedDiff={this.zoomedDiff}
            key={group.id} setMouseOffset={this.setMouseOffset} />
        ) ),

      transitions = query.transitionsNotActive(null, groupEntityIds)
        .cmap( (transition, key) => (
          <Transition data={transition} key={transition.id} setMouseOffset={this.setMouseOffset} />
        ) ),

      subnets = query.subnetsNotActive(null, groupEntityIds).cmap( (subnet, key) => (
        <Subnet data={subnet} key={subnet.id} setMouseOffset={this.setMouseOffset} />
      ) ),

      places = query.placesNotActive(null, groupEntityIds).cmap( (place, key) => (
        <Place data={place} key={place.id} setMouseOffset={this.setMouseOffset} />
      ) ),

      arcs = query.arcs().cmap( (arc, key) => (
        <Arc data={arc} key={arc.id} editHandler={() => methods.arc.edit(arc.id)} />
      ) ),

      drawingArc = drawing.arc ? (
        <Arc data={drawing.arc} offset={this.state.mouseOffset} editHandler={() => {}} />
      ) : '',

      viewport = this.props.viewport,
      transform = `translate(${viewport.translateX}px,${viewport.translateY}px) scale(${viewport.zoom})`,
      transformStyle = {
        transform,
        transformOrigin: '50% 50%'
      };

    let topEntities = [];

    if (query.active.isSet()) {
      topEntities.push( this.nodeTag(query.active.type, query.active.data) );
    }

    let dimLayerStyles = {
        display: 'none'
      };

    if (false) {
      dimLayerStyles = {};
    }

    return (
      <svg width={ width } height={ height }
        onMouseMove={this.mouseMoveHandler} onClick={methods.arc.escapeDraw}
        onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler}
        onWheel={ (e) => methods.zoom.change( e.deltaY > 0 ? 0.05 : -0.05 ) }
        ref={ (el) => { this.svg = el; } } className="context" >
        <g className="diagram-objects" style={{transform}}>
            {groups}
            {drawingArc}
            {arcs}
            {subnets}
            {transitions}
            {places}
            {topEntities}
        </g>
        <rect x="0" y="0" width={width} height={height}
          className="dim-layer" style={dimLayerStyles}
          onClick={this.hideDimLayer} />
      </svg>
    );
  }
}

Context.propTypes = {
  viewport: PropTypes.instanceOf(ViewportModel).isRequired,
  drawing: PropTypes.object.isRequired
};

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Context);
