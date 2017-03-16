import { isObject } from 'lodash';
import React, {
  Component,
  PropTypes,
} from 'react';
import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import CodeMirror from 'react-codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css';

import Datamap from '../Datamap';

class DatamapSample extends Component {
  constructor(props) {
    super(props);
    this.json = JSON.stringify(this.props.storage);
    this.state = {
      storage: this.props.storage,
    };
    this.setJson = ::this.setJson;
    this.setOption = ::this.setOption;
  }

  setJson(val) {
    this.json = val;
  }

  setOption() {
    this.setState((prevState) => {
      const storage = JSON.parse(this.json);
      const newStorage = {};
      Object.keys(prevState.storage).forEach((key) => {
        newStorage[key] = storage[key];
      });
      return { storage: newStorage };
    });
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

    const { storage } = this.state;

    if (!this.state.storage.style) {
      storage.style = {};
    }

    if (!this.state.storage.style.height) {
      storage.style.height = '300px';
    }

    const { callbacks } = this.props;
    if (isObject(callbacks)) {
      Object.keys(callbacks).forEach((key) => {
        storage[key] = callbacks[key];
      });
    }

    return (
      <Container>
        <Left>
          <Datamap {...storage} />
        </Left>
        <Right>
          <CodeMirror
            value={JSON.stringify(this.state.storage, undefined, 2)}
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

DatamapSample.propTypes = {
  storage: PropTypes.object.isRequired,
  callbacks: PropTypes.object,
};

export default DatamapSample;
