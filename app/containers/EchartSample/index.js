import { isFunction } from 'lodash';
import React, {
  Component,
  PropTypes,
} from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import ReactEcharts from 'echarts-for-react';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

class EchartSample extends Component {
  constructor(props) {
    super(props);
    this.storage = this.props.storage;
    this.json = JSON.stringify(this.storage);
    this.state = {
      option: this.props.getOption(this.storage),
    };
    this.setJson = ::this.setJson;
    this.setOption = ::this.setOption;
  }

  componentDidMount() {
    this.doUpdate();
  }

  componentDidUpdate() {
    this.doUpdate();
  }

  setJson(val) {
    this.json = val;
  }

  setOption() {
    const storage = JSON.parse(this.json);
    Object.keys(this.storage).forEach((key) => {
      this.storage[key] = storage[key];
    });
    this.setState({ option: this.props.getOption(this.storage) });
  }

  doUpdate() {
    const { onMount } = this.props;
    const echart = this.echart.getEchartsInstance();

    if (isFunction(onMount)) {
      onMount(echart, this.storage);
    }
  }

  render() {
    const Container = styled.div`
      height: 100%;
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

    return (
      <Container>
        <Left>
          <ReactEcharts
            option={this.state.option || {}}
            ref={(echart) => { this.echart = echart; }}
          />
        </Left>
        <Right>
          <CodeMirror
            value={JSON.stringify(this.storage, undefined, 2)}
            onChange={this.setJson}
            options={{
              lineNumbers: true,
              mode: 'javascript',
            }}
          />
          <CenterBtn>
            <Button onClick={this.setOption}>Submit</Button>
          </CenterBtn>
        </Right>
      </Container>
    );
  }
}

EchartSample.propTypes = {
  storage: PropTypes.object.isRequired,
  getOption: PropTypes.func.isRequired,
  onMount: PropTypes.func,
};

export default EchartSample;
