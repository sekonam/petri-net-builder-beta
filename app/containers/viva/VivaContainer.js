import React, { PropTypes, Component } from 'react';
import Viva from 'vivagraphjs';

import './VivaContainer.css';

export default
class VivaContainer extends Component {
  propTypes = {
    m: PropTypes.number,
    n: PropTypes.number,
  };

  componentDidMount() {
    const graph = Viva.Graph.graph();
    const layout = Viva.Graph.Layout.forceDirected(graph, {
      springLength : 10,
      springCoeff : 0.0008,
      dragCoeff : 0.02,
      gravity : -1.2
    });

    const graphics = Viva.Graph.View.svgGraphics();
    graphics.node((node) => (
      Viva.Graph.svg('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', node.data ? node.data : '#00a2e8')
    ));

    const renderer = Viva.Graph.View.renderer(graph, {
      layout     : layout,
      graphics   : graphics,
      container  : this.viva,
      renderLinks : true
    });

    renderer.run();
    this.beginAddNodesLoop(graph);
  }

  beginRemoveNodesLoop(graph) {
    var nodesLeft = [];
    graph.forEachNode((node) => {
      nodesLeft.push(node.id);
    });

    const removeInterval = setInterval(() => {
      const nodesCount = nodesLeft.length;

      if (nodesCount > 0) {
        const nodeToRemove = Math.min(
          (Math.random() * nodesCount) << 0,
          nodesCount - 1,
        );

        graph.removeNode(nodesLeft[nodeToRemove]);
        nodesLeft.splice(nodeToRemove, 1);
      }

       if (nodesCount === 0) {
         clearInterval(removeInterval);
         setTimeout(
           () => this.beginAddNodesLoop(graph),
           100,
         );
      }
    }, 100);
  }

  beginAddNodesLoop(graph) {
    let i = 0;
    let { m, n } = this.props;
    m = m || 10;
    n = n || 20;
    const addInterval = setInterval(() => {
      graph.beginUpdate();

      for (var j = 0; j < m; ++j) {
        const node = i + j * n;
        if (i > 0) { graph.addLink(node, i - 1 + j * n); }
        if (j > 0) { graph.addLink(node, i + (j - 1) * n); }
      }

      i++;
      graph.endUpdate();

      if (i >= n) {
        clearInterval(addInterval);
        setTimeout(
          () => this.beginRemoveNodesLoop(graph),
          3000,
        );
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
