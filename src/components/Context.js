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
import NodeByType from './NodeByType.js';
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

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.wheelHandler = this.wheelHandler.bind(this);
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

  svgOffset(windowOffset) {
    const svgRect = this.svg.getBoundingClientRect();
    return {
      x: windowOffset.x - svgRect.left - window.pageXOffset,
      y: windowOffset.y - svgRect.top - window.pageYOffset
    };
  }

  isSelecting() {
    const query = Query.instance;
    return !query.isDragging()
      && this.state.mouseDown
      && query.selectNodeTypes().length > 0;
  }

  isTranslating() {
    const query = Query.instance;
    return !query.isDragging()
      && this.state.mouseDown
      && query.selectNodeTypes().length == 0;
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

  mouseDownHandler(e) {
    const query = Query.instance;
    if (!query.isDragging()) {
      this.setState({
        mouseOffset: this.svgOffset({
          x: e.pageX,
          y: e.pageY
        }),
        mouseDown: this.svgOffset({
          x: e.pageX,
          y: e.pageY
        }),
        translateX: query.viewport.translateX(),
        translateY: query.viewport.translateY()
      });
    }
  }

  mouseUpHandler(e) {
    const
      methods = Store.instance,
      query = Query.instance;

    if (this.state.mouseDown) {

      if (this.isSelecting()) {
        const
          startOffset = this.state.mouseDown,
          finishOffset = this.state.mouseOffset;

        query.selectNodeTypes().forEach((nodeName) => {
          const selectedNodes = query[nodeName].inRectIds(startOffset, finishOffset);
          methods[nodeName].select(selectedNodes);
        });
      }

      this.setState({
        mouseDown: null,
        translateX: 0,
        translateY: 0
      });
    }
  }

  mouseMoveHandler(e) {
    const query = Query.instance,
      mouseOffset = this.svgOffset({
        x: e.pageX,
        y: e.pageY
      });

    this.setState({ mouseOffset });

    if (this.isTranslating()) {
      Store.instance.translate.set(
        this.state.translateX + mouseOffset.x - this.state.mouseDown.x,
        this.state.translateY + mouseOffset.y - this.state.mouseDown.y
      );
    }
  }

  wheelHandler(e) {
    const methods = Store.instance;
    methods.zoom.change( e.deltaY > 0 ? 0.05 : -0.05 );
    e.preventDefault();
  }

  nodeTag(nodeName, node) {
    switch (nodeName) {
      case 'place':
      case 'subnet':
      case 'transition':
        return <NodeByType type={nodeName} data={node} key={node.id}/>;
      case 'group':
        return <Group data={node} key={node.id}/>;
    }
  }

  drawTactical() {
    const {width, height} = this.state.svgSize,
      INDENT = 10000;
    return (
      <g className="tacktical">
        <circle cx={-INDENT} cy={-INDENT} r="1" />
        <circle cx={width + INDENT} cy={height + INDENT} r="1" />
      </g>
    );
  }

  render() {
    const methods = Store.instance,
      query = Query.instance,
      {width, height} = this.state.svgSize,
      drawingArc = query.arc.drawing(),
      groupsEntityIds = query.groupsEntityIds(),

      groups = query.groupsNotActive()
        .cmap( (group, key) => (
          <Group data={group} key={group.id} />
        ) ),

      transitions = query.transitionsNotActive(null, groupsEntityIds).cmap( (transition) => (
        <Transition data={transition} key={transition.id} />
      ) ),

      subnets = query.subnetsNotActive(null, groupsEntityIds).cmap( (subnet) => (
        <Subnet data={subnet} key={subnet.id} />
      ) ),

      places = query.placesNotActive(null, groupsEntityIds).cmap( (place) => (
        <Place data={place} key={place.id} />
      ) ),

      arcs = query.arcs().cmap( (arc, key) => (
        <Arc data={arc} key={arc.id} />
      ) ),

      viewport = query.viewport,
      transform = `translate(${viewport.translateX()}px,${viewport.translateY()}px) scale(${viewport.zoom.get()})`,
      transformStyle = {
        transform,
        transformOrigin: '50% 50%'
      };

    let topEntities = [];

    if (query.active.isSet()) {
      topEntities.push( this.nodeTag(query.active.type, query.active.data) );
    }

    const selectNodeTypes = query.selectNodeTypes();
    let selection = null;

    if (this.isSelecting()) {

      const mouseDown = this.state.mouseDown,
        mouseOffset = this.state.mouseOffset,
        offset = {
          x: Math.min(mouseDown.x, mouseOffset.x),
          y: Math.min(mouseDown.y, mouseOffset.y)
        },
        size = {
          width: Math.abs(mouseDown.x - mouseOffset.x),
          height: Math.abs(mouseDown.y - mouseOffset.y)
        };

      selection = <rect className="selection"
        x={offset.x} y={offset.y}
        width={size.width} height={size.height} />
    }

    return (
      <svg width={ width } height={ height }
        onMouseMove={this.mouseMoveHandler} onClick={methods.arc.escapeDraw}
        onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler}
        onWheel={this.wheelHandler}
        ref={ (el) => { this.svg = el; } } className="context">
        <g className="diagram-objects" style={{transform}}>
          {this.drawTactical()}
          {drawingArc ? <Arc
            data={drawingArc}
            offset={this.state.mouseOffset}
            center={{x:width/2, y:height/2}}
          /> : ''}
          {arcs}
          {subnets}
          {transitions}
          {places}
          {groups}
          {topEntities}
        </g>
        {selection}
      </svg>
    );
  }
}

Context.propTypes = {};

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Context);
