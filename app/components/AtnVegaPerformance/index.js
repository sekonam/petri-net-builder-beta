import React, { Component } from 'react';
import { TinkerGraph } from 'realine-gremlin';
import ast from '../../data/ast/NeuralNetOntology.json';
import spec from '../../data/vega/spec/ForceDirectedLayout.json';
import VegaContainer from '../../containers/VegaSample/VegaContainer';

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
            const source = ids[e.value._inVertex._id];
            const target = ids[e.value._outVertex._id];
            const value = Math.round(20 * Math.random());
            return { source, target, value };
          }
        ),
    };
  }

  render() {
    return (
      <VegaContainer
        spec={spec}
        data={this.data}
        renderer={'svg'}
        ref={(v) => { this.vega = v; }}
      />
    );
  }
}
