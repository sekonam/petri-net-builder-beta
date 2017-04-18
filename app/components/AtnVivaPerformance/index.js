import React, { Component } from 'react';
import { TinkerGraph } from 'realine-gremlin';
import Viva from 'vivagraphjs';
import ast from '../../data/ast/NeuralNetOntology.json';

export default
class AtnVegaPerformance extends Component {
  constructor(props) {
    super(props);

    const g = TinkerGraph.open();
    g.io().readGraph(ast);
    const ids = {};
    let counter = 0;

    this.data = {
      nodedata: g.vertices().array.map(
        (v) => {
          const { _id, _label } = v.value;
          const index = counter;
          counter += 1;
          ids[_id] = index;
          return { index, name: _label };
        }
      ),
      linkdata: g.edges().array
        .filter(
          (e) => e.value._inVertex._id in ids && e.value._outVertex._id in ids
        )
        .map(
          (e) => {
            const _id = e.value._id;
            const source = ids[e.value._inVertex._id];
            const target = ids[e.value._outVertex._id];
            const value = Math.round(20 * Math.random());
            return { source, target, value };
          }
        )
    };
  }

  componentDidMount() {
    if (this.viva) {
      const graph = Viva.Graph.graph();
      const graphics = Viva.Graph.View.svgGraphics();
      const renderer = Viva.Graph.View.renderer(graph, {
        graphics,
        container: this.viva,
      });
      renderer.run();

      this.data.nodedata.forEach(
        (node) => graph.addNode(node.index, node.name)
      );

      this.data.linkdata.forEach(
        (link) => graph.addLink(link.source, link.target)
      );
    }
  }

  render() {
    return (
      <div ref={(v) => { this.viva = v; }}></div>
    );
  }
}
