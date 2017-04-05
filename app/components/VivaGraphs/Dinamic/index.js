import React, { PropTypes, Component } from 'react';
import Viva from 'vivagraphjs';

import './style.css';

class Dinamic extends Component {
  constructor(props) {
    super(props);
    this.beginAddNodesLoop = :: this.beginAddNodesLoop;
    this.beginRemoveNodesLoop = :: this.beginRemoveNodesLoop;
  }

  componentDidMount() {
    this.graph = Viva.Graph.graph();
    const layout = Viva.Graph.Layout.forceDirected(this.graph, {
      springLength: 10,
      springCoeff: 0.0008,
      dragCoeff: 0.02,
      gravity: -1.2,
    });

    const graphics = Viva.Graph.View.svgGraphics();
    graphics.node((node) => (
      Viva.Graph.svg('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', node.data ? node.data : '#00a2e8')
    ));

    const renderer = Viva.Graph.View.renderer(this.graph, {
      layout,
      graphics,
      container: this.viva,
      renderLinks: true,
    });

    renderer.run();
    this.beginAddNodesLoop();
  }

  beginRemoveNodesLoop() {
    const nodesLeft = [];
    this.graph.forEachNode((node) => {
      nodesLeft.push(node.id);
    });

    const removeInterval = setInterval(() => {
      const nodesCount = nodesLeft.length;

      if (nodesCount > 0) {
        const nodeToRemove = Math.min(
          Math.random(Math.random() * nodesCount),
          nodesCount - 1,
        );

        this.graph.removeNode(nodesLeft[nodeToRemove]);
        nodesLeft.splice(nodeToRemove, 1);
      }

      if (nodesCount === 0) {
        clearInterval(removeInterval);
        setTimeout(this.beginAddNodesLoop, 100);
      }
    }, 100);
  }

  beginAddNodesLoop() {
    let i = 0;
    let { m, n } = this.props;
    m = m || 10;
    n = n || 20;
    const addInterval = setInterval(() => {
      this.graph.beginUpdate();

      for (let j = 0; j < m; j += 1) {
        const node = i + (j * n);
        if (i > 0) { this.graph.addLink(node, i - 1 + (j * n)); }
        if (j > 0) { this.graph.addLink(node, i + ((j - 1) * n)); }
      }

      i += 1;
      this.graph.endUpdate();

      if (i >= n) {
        clearInterval(addInterval);
        setTimeout(this.beginRemoveNodesLoop, 3000);
      }
    }, 100);
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

Dinamic.propTypes = {
  m: PropTypes.number,
  n: PropTypes.number,
};

export default Dinamic;
