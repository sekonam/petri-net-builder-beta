import { isArray } from 'lodash';
import React, {
  Component,
  PropTypes,
} from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import * as vega from 'vega';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

class VegaSampleCycle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.genData(),
    };
    this.updateGraph = ::this.updateGraph;
  }

  componentDidMount() {
    this.timerId = setInterval(
      this.updateGraph,
      15
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  componentDidUpdate() {
    if (this.vega) {
      if (this.view) {
        this.view.finalize();
      }

      this.view = new vega.View(
        vega.parse(
          this.props.buildSpec(
            this.state.data
          )
        )
      )
        .renderer('canvas')  // set renderer (canvas or svg)
        .initialize(this.vega) // initialize view within parent DOM container
        .hover()             // enable hover encode set processing
        .run();
    }
  }

  updateGraph() {
    this.setState({ data: this.props.genData() });
  }

  render() {
    return (
      <div
        id="vega-container"
        ref={(vega) => { this.vega = vega; }}
      />
    );
  }
}

VegaSampleCycle.propTypes = {
  buildSpec: PropTypes.func.isRequired,
  genData: PropTypes.func.isRequired,
};

export default VegaSampleCycle;
