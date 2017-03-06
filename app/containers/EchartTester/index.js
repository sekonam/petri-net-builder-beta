import React, {
  Component,
  PropTypes,
} from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import EchartComponent from './EchartComponent';
import echarts from '../../assets/js/echarts.min';
import codes from './codes';
import calcOptions from './calcOptions';

import '../../assets/js/world';
import '../../assets/js/china';

window.echarts = echarts;

class EchartTester extends Component {
  constructor(props) {
    super(props);
    this.setCode(props.code);
    this.state = {
      options: this.checkCode(),
    };
    this.setCode = ::this.setCode;
    this.setOptions = ::this.setOptions;
  }

  setCode(code) {
    this.code = code;
  }

  setOptions() {
    const options = this.checkCode();

    if (options) {
      this.setState({ options });
    }
  }

  checkCode() {
    if (this.code) {
      return calcOptions(this.code);
/*      const codeFunction = new Function(`${code};
        return options || option;`);
      return codeFunction();*/
    }

    return null;
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

    return (<Container>
      <Left>
        <EchartComponent
          options={this.state.options || {}}
        />
      </Left>
      <Right>
        <CodeMirror
          value={this.code || ''}
          onChange={this.setCode}
          options={{
            lineNumbers: true,
            mode: 'javascript',
          }}
        />
        <CenterBtn>
          <Button onClick={this.setOptions}>Submit</Button>
        </CenterBtn>
      </Right>
    </Container>);
  }
}

EchartTester.propTypes = {
  code: PropTypes.string,
};

export default EchartTester;

export function EchartTesterSample() {
  return (<div>
    {codes.map((code, key) => {
      if (code) {
        return <EchartTester code={code} key={key} />;
      }
      return null;
    })}
  </div>);
}
