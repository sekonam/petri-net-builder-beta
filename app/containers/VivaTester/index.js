import React, { Component } from 'react';
import Viva from 'vivagraphjs';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
} from 'react-bootstrap';
import Select from 'react-select';

const Layouts = [
  'constant',
  'forceDirected',
];

const LayoutOptions = Layouts.map(
  (name) => ({
    value: name,
    label: name,
  })
);

// const rand = (max) => Math.floor(Math.random() * max);

export default
class VivaTester extends Component {
  constructor(props) {
    super(props);
    this.setState = :: this.setState;
  }

  state = {
    lengthNodesCount: 20,
    heightNodesCount: 20,
    delay: 100,
    addNodesCount: 1,
    maxNodesCount: 1000,
    layout: 'constant',
  };

  componentDidMount() {
    this.graphics = Viva.Graph.View.svgGraphics();
    this.createGraph = Viva.Graph.generator();
    this.updateGraph();
  }

  componentDidUpdate() {
    if (this.timerId) clearInterval(this.timerId);
    if (this.renderer) this.renderer.dispose();
    if (this.graph) this.graph.clear();
    this.updateGraph();
  }

  updateGraph() {
    if (this.viva) {
      const state = this.state;

      const graph = this.graph = this.createGraph.grid(
        state.lengthNodesCount,
        state.heightNodesCount,
      );
//      graph.forEachNode(console.log);return null;
      this.nodeCount = state.lengthNodesCount * state.heightNodesCount;

      const layout = Viva.Graph.Layout[state.layout](graph);
      this.renderer = Viva.Graph.View.renderer(graph, {
        layout,
        graphics: this.graphics,
        container: this.viva,
      });
      this.renderer.run();

      this.timerId = setInterval(
        () => {
          const g = this.graph;
//          g.beginUpdate();

          for (let i = 0; i < state.addNodesCount; i += 1) {
            const id = this.nodeCount + i;
            g.addNode(id);

/*            for (let j = 0; j < Math.min(5, state.lengthNodesCount); j += 1) {
              const toId = rand(this.nodeCount);
              console.log(toId, id);
              g.addLink(toId, id);
            }*/
          }

          this.nodeCount += state.addNodesCount;
//          g.endUpdate();
        },
        state.delay,
      );
    }
  }

  render() {
    const intStateFields = {
      lengthNodesCount: 'Init Nodes Count',
      heightNodesCount: 'Links Count on a Node',
      delay: 'Delay(ms)',
      addNodesCount: 'Adding Nodes Count',
//      maxNodesCount: 'Maximum Nodes Count',
    };
    return (
      <div>
        <Form>
          {Object.keys(intStateFields).map(
            (name) => (
              <FormGroup className="form-inline" key={name}>
                <ControlLabel>{intStateFields[name]}</ControlLabel>
                <FormControl
                  type="text"
                  value={this.state[name]}
                  onChange={(e) => this.setState({ [name]: e.target.value })}
                />
              </FormGroup>
            )
          )}
          <FormGroup className="form-inline">
            <ControlLabel>Layout Type</ControlLabel>
            <Select
              simpleValue
              value={this.state.layout}
              className="form-control"
              options={LayoutOptions}
              onChange={(layout) => this.setState({ layout })}
            />
          </FormGroup>
        </Form>
        <div ref={(viva) => { this.viva = viva; }}></div>
      </div>
    );
  }
}
