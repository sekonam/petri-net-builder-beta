import React, {
  Component,
  PropTypes,
} from 'react';
import styled from 'styled-components';
import rd3 from 'react-d3-library';
import { Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

class D3Sample extends Component {

  static propTypes = {
    initData: PropTypes.any.isRequired,
    buildGraph: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.data = this.props.initData;
    this.setData = ::this.setData;
    this.buildGraph = ::this.buildGraph;
    this.showCode = ::this.showCode;
  }

  state = {
    d3: '',
    visibleCode: false,
  };

  componentDidMount() {
    this.buildGraph();
  }

  setData(data) {
    this.data = JSON.parse(data);
  }

  buildGraph() {
    this.setState({
      d3: this.props.buildGraph(this.data),
    });
  }

  showCode() {
    this.setState({ visibleCode: true });
  }

  render() {
    const CenterBtn = styled.div`
      margin-top: 5px;
      text-align: center;
    `;

    const { visibleCode, d3 } = this.state;

    return (
      <div>
        <div>
          <rd3.Component data={d3} />
        </div>
        {visibleCode && <CodeMirror
          value={JSON.stringify(this.data, undefined, 2)}
          onChange={this.setData}
          options={{
            lineNumbers: true,
            mode: 'javascript',
          }}
        />}
        <CenterBtn>
          {visibleCode
            ? <Button onClick={this.buildGraph}>Submit</Button>
            : <Button onClick={this.showCode}>Edit Data</Button>
          }
        </CenterBtn>
      </div>
    );
  }
}

export default D3Sample;
