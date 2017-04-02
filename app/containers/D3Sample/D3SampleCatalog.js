import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import D3ChartCycled from './D3ChartCycled';
import D3CycledData from '../../data/d3/D3CycledData';

const ChartNames = Object.keys(D3CycledData);

const gen = (c) => {
  const a = [];
  for (let i = 0; i < c; i += 1) {
    a.push(i);
  }
  return a;
};

export default
class D3SampleCatalog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delay: 1000,
      amount: 1,
    };
    this.setState = ::this.setState;
  }

  render() {
    return (
      <div>
        <Form>
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
                  const chart = D3CycledData[chartName];
                  return (
                    <D3ChartCycled
                      key={chartName}
                      genData={chart.genData}
                      createChart={chart.createChart}
                      delay={this.state.delay}
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
