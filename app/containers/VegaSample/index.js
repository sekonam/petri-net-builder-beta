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

class VegaSample extends Component {
  constructor(props) {
    super(props);

    this.json = JSON.stringify(this.props.initData);
//    this.redraw = false;
    this.state = {
      data: this.props.initData,
      visibleCode: false,
    };

    this.setJson = ::this.setJson;
    this.updateGraph = ::this.updateGraph;
    this.showCode = ::this.showCode;
  }

  componentDidMount() {
    if (this.vega) {
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

  componentDidUpdate() {
/*    if (this.view) {
      console.log('11111');
      if (0) {
        const { data } = this.state;
        const { view } = this;
        Object.keys(data).forEach((name) => {
          const value = data[name];
          console.log(name, value);
          if (isArray(value)) {
            view.change(
              name,
              vega.changeset()
                .remove()
                .insert(value)
            );
          }
        });
        this.redraw = false;
      }

      this.view.run();
    }*/
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

  setJson(val) {
    this.json = val;
  }

  updateGraph() {
//    this.redraw = true;
    this.setState({ data: JSON.parse(this.json) });
  }

  showCode() {
    this.setState({ visibleCode: true });
  }

  render() {
    const Container = styled.div`
      height: 100%;
      margin-top: 10px;
      overflow: hidden;
    `;
    const Left = styled.div`
      float: left;
      width: 58%;
      margin-right: 2%;
    `;
    const Right = styled.div`
      float:right;
      width:38%
      margin-left: 2%;
    `;
    const CenterBtn = styled.div`
      margin-top: 5px;
      text-align: center;
    `;

    const { visibleCode } = this.state;

    return (
      <Container>
        <Left>
          <div
            id="vega-container"
            ref={(v) => { this.vega = v; }}
          />
        </Left>
        <Right>
          {visibleCode && <CodeMirror
            value={JSON.stringify(this.state.data, undefined, 2)}
            onChange={this.setJson}
            options={{
              lineNumbers: true,
              mode: 'javascript',
            }}
          />}
          <CenterBtn>
            {!visibleCode && <Button onClick={this.showCode}>Edit Data</Button>}
            {visibleCode && <Button onClick={this.updateGraph}>Submit</Button>}
          </CenterBtn>
        </Right>
      </Container>
    );
  }
}

VegaSample.propTypes = {
  initData: PropTypes.object.isRequired,
  buildSpec: PropTypes.func.isRequired,
};

export default VegaSample;
