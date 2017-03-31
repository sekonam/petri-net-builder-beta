import React, { Component } from 'react';
import { Form, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

import EchartCycledDataUpload from './EchartCycledDataUpload';
import EchartDataUpdate from '../../data/EchartDataUpdate';

const ChartNames = Object.keys(EchartDataUpdate);

const gen = (c) => {
  const a = [];
  for (let i = 0; i < c; i += 1) {
    a.push(i);
  }
  return a;
};

export default
class EchartSampleCatalog extends Component {
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
                  const chart = EchartDataUpdate[chartName];
                  return (
                    <EchartCycledDataUpload
                      key={chartName}
                      options={chart.options}
                      genData={chart.genData}
                      dataOptions={chart.dataOptions}
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
