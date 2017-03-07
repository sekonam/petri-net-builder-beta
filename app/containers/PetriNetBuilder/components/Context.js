import React from 'react';
import TouchBackend from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';

import Store from '../core/Store';
import Query from '../core/Query';

import Place from './Place';
import Transition from './Transition';
import Subnet from './Subnet';
import External from './External';
import NodeByType from './NodeByType';
import Arc from './Arc';
import Group from './Group';

class Context extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svgSize: {
        width: 0,
        height: 0,
      },

      // drawing Arc offset
      mouseOffset: {
        x: 0,
        y: 0,
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

  componentDidMount() {
    this.timerId = setInterval(() => {
      const svgSize = this.svgSize();

      if (svgSize.width !== this.state.svgSize.width) {
        this.setSvgSize();
      }
    }, 5);
    window.addEventListener('resize', this.setSvgSize);
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
    window.removeEventListener('resize', this.setSvgSize);
  }

  setSvgSize() {
    const svgSize = this.svgSize();
    this.setState({ svgSize });
    Store.instance.zoom.setCenter({
      x: svgSize.width / 2,
      y: svgSize.height / 2,
    });
  }

  svgSize() {
    const scrollShift = document.documentElement.clientHeigh
      && document.documentElement.clientHeigh !== document.documentElement.scrollHeight ? 15 : 0;
    return {
      width: Math.max(0, document.documentElement.clientWidth - 185 - 255 - scrollShift),
      height: Math.max(0, document.documentElement.clientHeight - 55),
    };
  }

  svgOffset(windowOffset) {
    const svgRect = this.svg.getBoundingClientRect();
    return {
      x: windowOffset.x - svgRect.left - window.pageXOffset,
      y: windowOffset.y - svgRect.top - window.pageYOffset,
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
      && query.selectNodeTypes().length === 0;
  }

  mouseDownHandler(e) {
    const query = Query.instance;
    if (!query.isDragging()) {
      this.setState({
        mouseOffset: this.svgOffset({
          x: e.pageX,
          y: e.pageY,
        }),
        mouseDown: this.svgOffset({
          x: e.pageX,
          y: e.pageY,
        }),
        translateX: query.viewport.translateX(),
        translateY: query.viewport.translateY(),
      });
    }
  }

  mouseUpHandler() {
    const methods = Store.instance;
    const query = Query.instance;

    if (this.state.mouseDown) {
      if (this.isSelecting()) {
        const startOffset = this.state.mouseDown;
        const finishOffset = this.state.mouseOffset;
        const { width, height } = this.state.svgSize;
        const center = { x: width / 2, y: height / 2 };

        query.selectNodeTypes().forEach((nodeName) => {
          const selectedNodes = query[nodeName].inRectIds(startOffset, finishOffset, center);
          methods[nodeName].select(selectedNodes);
        });
      }

      this.setState({
        mouseDown: null,
        translateX: 0,
        translateY: 0,
      });
    }
  }

  mouseMoveHandler(e) {
    const mouseOffset = this.svgOffset({
      x: e.pageX,
      y: e.pageY,
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
    methods.zoom.change(e.deltaY > 0 ? 0.05 : -0.05);
    e.preventDefault();
  }

  nodeTag(node) {
    if (node.entityName() === 'group') {
      return <Group data={node} key={node.id} />;
    }

    return <NodeByType data={node} key={node.id} />;
  }

  drawTactical() {
    const { width, height } = this.state.svgSize;
    const INDENT = 10000;

    return (
      <g className="tacktical">
        <circle cx={-INDENT} cy={-INDENT} r="1" />
        <circle cx={width + INDENT} cy={height + INDENT} r="1" />
      </g>
    );
  }

  render() {
    const methods = Store.instance;
    const query = Query.instance;
    const { width, height } = this.state.svgSize;
    const drawingArc = query.arc.drawing();
    const groupsEntityIds = query.groupsEntityIds();

    const groups = query
      .groupsNotActive()
      .map(
        (group) => (
          <Group data={group} key={group.id} />
        )
      );

    const transitions = query
      .transitionsNotActive(null, groupsEntityIds)
      .map(
        (transition) => (
          <Transition data={transition} key={transition.id} />
        )
      );

    const subnets = query
      .subnetsNotActive(null, groupsEntityIds)
      .map(
        (subnet) => (
          <Subnet data={subnet} key={subnet.id} />
        )
      );

    const places = query
      .placesNotActive(null, groupsEntityIds)
      .map(
        (place) => (
          <Place data={place} key={place.id} />
        )
      );

    const externals = query
      .externalsNotActive(null, groupsEntityIds)
      .map(
        (node) => (
          <External data={node} key={node.id} />
        )
      );

    const arcs = query
      .arcs()
      .map(
        (arc) => (
          <Arc data={arc} key={arc.id} />
        )
      );

    const viewport = query.viewport;
    const transform = `translate(
      ${viewport.translateX()}px,
      ${viewport.translateY()}px)
    scale(${viewport.zoom.get()})
    `;

    const topEntities = [];

    if (query.active.isSet()) {
      topEntities.push(this.nodeTag(query.active.data));
    }

    let selection = null;

    if (this.isSelecting()) {
      const mouseDown = this.state.mouseDown;
      const mouseOffset = this.state.mouseOffset;
      const offset = {
        x: Math.min(mouseDown.x, mouseOffset.x),
        y: Math.min(mouseDown.y, mouseOffset.y),
      };
      const size = {
        width: Math.abs(mouseDown.x - mouseOffset.x),
        height: Math.abs(mouseDown.y - mouseOffset.y),
      };

      selection = (<rect
        className="selection"
        x={offset.x} y={offset.y}
        width={size.width} height={size.height}
      />);
    }

    return (
      <svg
        width={width} height={height}
        onMouseMove={this.mouseMoveHandler} onClick={methods.arc.escapeDraw}
        onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler}
        onWheel={this.wheelHandler}
        ref={(el) => { this.svg = el; }} className="context">
        <g className="diagram-objects" style={{ transform }}>
          {this.drawTactical()}
          {drawingArc ? <Arc
            data={drawingArc}
            offset={this.state.mouseOffset}
            center={{ x: width / 2, y: height / 2 }}
          /> : null}
          {arcs}
          {subnets}
          {transitions}
          {externals}
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
