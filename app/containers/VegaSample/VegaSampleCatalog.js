import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';

import VegaSampleCycle from './VegaSampleCycle';
import VegaCharts from '../../data/vega';

const ChartNames = Object.keys(VegaCharts);

const gen = (c) => {
  const a = [];
  for (let i = 0; i < c; i += 1) {
    a.push(i);
  }
  return a;
};

export default
class VegaSampleCatalog extends Component {
  static rendererValues = [
    'canvas',
    'svg',
  ];

  constructor(props) {
    super(props);
    this.state = {
      renderer: VegaSampleCatalog.rendererValues[0],
      delay: 1000,
      graphics: [],
      amount: 1,
    };
    this.setState = ::this.setState;
  }

  rendererOptions() {
    return VegaSampleCatalog.rendererValues.map(
      (renderer) => ({
        value: renderer,
        label: renderer,
      })
    );
  }

  render() {
    return (
      <div>
        <Form>
          <FormGroup className="form-inline">
            <ControlLabel>Renderer</ControlLabel>
            <Select
              simpleValue
              value={this.state.renderer}
              className="form-control"
              options={this.rendererOptions()}
              onChange={(renderer) => this.setState({ renderer })}
            />
          </FormGroup>
          <FormGroup className="form-inline">
            <ControlLabel>Amount</ControlLabel>
            <FormControl
              type="text"
              value={this.state.amount}
              onChange={(e) => this.setState({ amount: e.target.value })}
            />
          </FormGroup>
          <FormGroup className="form-inline">
            <ControlLabel>Frequency(ms)</ControlLabel>
            <FormControl
              type="text"
              value={this.state.delay}
              onChange={(e) => this.setState({ delay: parseInt(e.target.value, 10) })}
            />
          </FormGroup>
        </Form>
        {gen(this.state.amount).map(
          (i) => (
            <div key={i}>
              {ChartNames.map(
                (chartName) => {
                  const vegaChart = VegaCharts[chartName];
                  return (
                    <VegaSampleCycle
                      key={chartName}
                      spec={vegaChart.spec}
                      genData={vegaChart.genData}
                      delay={this.state.delay}
                      renderer={this.state.renderer}
                    />
                  );
                }
              )}
            </div>
          )
        )}
      </div>
    );
  }
}
