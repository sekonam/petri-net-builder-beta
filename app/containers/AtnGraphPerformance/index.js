import React, { Component } from 'react';
import { TinkerGraph } from 'realine-gremlin';
import ast from '../../data/ast/NeuralNetOntology.json';
import spec from '../../data/vega/spec/ForceDirectedLayout.json';
import VegaContainer from '../VegaSample/VegaContainer';

export default
class AtnGraphPerformance extends Component {
  state = {
    component: 'vega',
  };

  constructor(props) {
    super(props);

    const g = TinkerGraph.open();
    g.io().readGraph(ast);
    const ids = [];

    this.data = {
      nodedata: g.vertices().array.map(
        (v) => {
          const { _id, _label } = v.value;
          ids.push(_id);
          return { _id, index: _id, name: _label };
        }
      ),
      linkdata: g.edges().array
        .filter(
          (e) => (
            ids.indexOf(e.value._inVertex._id) > -1
            && ids.indexOf(e.value._outVertex._id) > -1
          )
        )
        .map(
          (e) => {
            const _id = e.value._id;
            const source = e.value._inVertex._id;
            const target = e.value._outVertex._id;
            const value = Math.round(20 * Math.random());
            return { _id, source, target, value };
          }
        )
    };

    console.log(this.data);
  }

  render() {
    return (
      <VegaContainer
        spec={spec}
        data={this.data}
        renderer={'svg'}
        ref={(v) => { this.vega = v; }} />
    );
  }
}
