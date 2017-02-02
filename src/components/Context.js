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

    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.setSvgSize = this.setSvgSize.bind(this);
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

  canChangeTranslate() {
    const {dragging} = this.props;

    for (let name in dragging) {
      if (dragging[name]) return false;
    }

    return true;
  }

  mouseDownHandler(e) {
    if (this.canChangeTranslate()) {
      const query = Query.instance;
      this.setState({
        mouseOffset: {
          x: e.pageX,
          y: e.pageY
        },
        mouseDown: {
          x: e.pageX,
          y: e.pageY
        },
        translateX: query.viewport.translateX(),
        translateY: query.viewport.translateY()
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
    const {drawing} = this.props;

    if (drawing.arc.data) {
      this.setState( {
        mouseOffset: {
          x: e.pageX,
          y: e.pageY
        }
      } );
    } else if (this.canChangeTranslate() && this.state.mouseDown) {
      Store.instance.translate.set(
        this.state.translateX + e.pageX - this.state.mouseDown.x,
        this.state.translateY + e.pageY - this.state.mouseDown.y
      );
    }
  }

  nodeTag(entityName, entity) {
    switch (entityName) {
      case 'place':
        return (
          <Place data={entity} key={entity.id} />
        );
        break;
      case 'subnet':
        return (
          <Subnet data={entity} key={entity.id} />
        );
        break;
      case 'transition':
        return (
          <Transition data={entity} key={entity.id} />
        );
        break;
      case 'group':
        return (
          <Group data={entity} key={entity.id}/>
        );
        break;
    }
  }

  render() {
    const { drawing } = this.props,
      methods = Store.instance,
      query = Query.instance,
      {width, height} = this.state.svgSize,
      groupsEntityIds = query.groupsEntityIds(),

      groups = query.groupsNotActive()
        .cmap( (group, key) => (
          <Group data={group} key={group.id} />
        ) ),

      transitions = query.transitionsNotActive(null, groupsEntityIds)
        .cmap( (transition, key) => (
          <Transition data={transition} key={transition.id} />
        ) ),

      subnets = query.subnetsNotActive(null, groupsEntityIds).cmap( (subnet, key) => (
        <Subnet data={subnet} key={subnet.id} />
      ) ),

      places = query.placesNotActive(null, groupsEntityIds).cmap( (place, key) => (
        <Place data={place} key={place.id} />
      ) ),

      arcs = query.arcs().cmap( (arc, key) => (
        <Arc data={arc} key={arc.id} />
      ) ),

      drawingArc = drawing.arc.data ? (
        <Arc data={drawing.arc.data} offset={query.arc.drawingOffset(this.state.mouseOffset)} />
      ) : '',

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

    return (
      <svg width={ width } height={ height }
        onMouseMove={this.mouseMoveHandler} onClick={methods.arc.escapeDraw}
        onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler}
        onWheel={ (e) => methods.zoom.change( e.deltaY > 0 ? 0.05 : -0.05 ) }
        ref={ (el) => { this.svg = el; } } className="context" >
        <g className="diagram-objects" style={{transform}}>
            {drawingArc}
            {arcs}
            {subnets}
            {transitions}
            {places}
            {groups}
            {topEntities}
        </g>
      </svg>
    );
  }
}

Context.propTypes = {
  drawing: PropTypes.object.isRequired
};

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(Context);
