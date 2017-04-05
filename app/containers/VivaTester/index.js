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

export default
class VivaTester extends Component {
  constructor(props) {
    super(props);
    this.setState = :: this.setState;
  }

  state = {
    startVerticesCount: 100,
    edgesPerVertice: 3,
    delay: 100,
    addVerticesCount: 1,
    maxVerticesCount: 1000,
    layout: 'constant',
  };

  render() {
    const intStateFields = {
      startVerticesCount: 'Init Vertices Count',
      edgesPerVertice: 'Edges Count on a Vertice',
      delay: 'Delay(ms)',
      addVerticesCount: 'Adding Vertices Count',
      maxVerticesCount: 'Maximum Vertices Count',
    };
    return (
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
    );
  }
}
