import React, { Component } from 'react';
import Viva from 'vivagraphjs';

import './style.css';

export default
class GraphInsideGraph extends Component {
  constructor(props) {
    super(props);
    this.groupSize = 42;
    this.placeNode = ::this.placeNode;
  }

  componentDidMount() {
    const graph = Viva.Graph.graph();
    const graphics = Viva.Graph.View.svgGraphics();
    const renderer = Viva.Graph.View.renderer(graph, {
      graphics,
      container: this.viva,
    });
    renderer.run();
    graphics.node(
      this.createGroupUI()
    ).placeNode(this.placeNode);
    this.defineArrow(
      graphics.getSvgRoot()
    );
    graphics.link(
      () =>
        // Notice the Triangle marker-end attribe:
         Viva.Graph.svg('path')
          .attr('stroke', 'gray')
          .attr('marker-end', 'url(#Triangle)')
    ).placeLink(
      this.placeArrow()
    );
    graph.addNode('complete', 'complete');
    graph.addNode('path', 'path');
    graph.addNode('ladder', 'ladder');
    graph.addLink('path', 'ladder');
    graph.addLink('ladder', 'complete');
  }

  defineArrow(svgRoot) {
    const marker = createMarker('Triangle');
    marker.append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z');

    const defs = svgRoot.append('defs');
    defs.append(marker);

    function createMarker(id) {
      return Viva.Graph.svg('marker')
        .attr('id', id)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', '10')
        .attr('refY', '5')
        .attr('markerUnits', 'strokeWidth')
        .attr('markerWidth', '10')
        .attr('markerHeight', '5')
        .attr('orient', 'auto');
    }
  }

  createGroupUI() {
    /**
     * This is imperative construction of svg tree:
     *
     * <g width='groupSize' height='groupSize'>
     *   <rect id='group+nodeId'></rect>
     * </g>
     */
    return (node) => {
      const g = Viva.Graph.svg('g')
        .attr('width', this.groupSize)
        .attr('height', this.groupSize);
      const rect = Viva.Graph.svg('rect');
      rect.attr('width', this.groupSize)
        .attr('height', this.groupSize)
        .attr('id', `group${node.id}`)
        .attr('fill', 'transparent')
        .attr('rx', '2').attr('ry', '2')
        .attr('stroke', '#d3d3d3');
      g.append(rect); // rect is used only for visual boundaries

      this.createNestedGraph(g, node);
      return g;
    };
  }

  createNestedGraph(container, node) {
    const graphics = Viva.Graph.View.svgGraphics();
    const createGraph = Viva.Graph.generator()[node.data];
    const graph = createGraph(10);
    const renderer = Viva.Graph.View.renderer(graph, {
      graphics,
      container,
      interactive: false,
    });
    renderer.run();

    const svgRoot = graphics.getSvgRoot();
    svgRoot.attr('viewBox', '-57 -23 100 102')
      .attr('width', '42')
      .attr('height', '42');

    graphics.endRender = () => {
      const bbox = svgRoot.getBBox();
      const padding = bbox.width * 0.1;
      const x = bbox.x - padding;
      const y = bbox.y - padding;
      const w = bbox.width + (2 * padding);
      const h = bbox.height + (2 * padding);
      svgRoot.attr('viewBox', `${x} ${y} ${w} ${h}`);
    };
  }

  placeNode(nodeUI, pos) {
    const x = pos.x - (this.groupSize / 2);
    const y = pos.y - (this.groupSize / 2);
    nodeUI.attr('transform', `translate(${x},${y})`);
  }

  placeArrow() {
    const geom = Viva.Graph.geom();

    return (linkUI, fromPos, toPos) => {
      const toNodeSize = this.groupSize;
      const fromNodeSize = this.groupSize;

      const from = geom.intersectRect(
        // rectangle:
        fromPos.x - (fromNodeSize / 2), // left
        fromPos.y - (fromNodeSize / 2), // top
        fromPos.x + (fromNodeSize / 2), // right
        fromPos.y + (fromNodeSize / 2), // bottom
        // segment:
        fromPos.x,
        fromPos.y,
        toPos.x,
        toPos.y,
      ) || fromPos; // if no intersection found - return center of the node

      const to = geom.intersectRect(
        // rectangle:
        toPos.x - (toNodeSize / 2), // left
        toPos.y - (toNodeSize / 2), // top
        toPos.x + (toNodeSize / 2), // right
        toPos.y + (toNodeSize / 2), // bottom
        // segment:
        toPos.x,
        toPos.y,
        fromPos.x,
        fromPos.y,
      ) || toPos; // if no intersection found - return center of the node

      linkUI.attr('d', `M${from.x},${from.y}L${to.x},${to.y}`);
    };
  }

  render() {
    return (
      <div
        id="VivaContainer"
        ref={
          (viva) => {
            this.viva = viva;
          }
        }>
      </div>
    );
  }
}
