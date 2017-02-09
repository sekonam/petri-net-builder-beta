import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Select from 'react-select';

import {ExternalNodeNames} from '../core/Entities.js';
import Query from '../core/Query.js';
import Store from '../core/Store.js';
import ExternalModel from '../models/ExternalModel.js';
import SocketList from './SocketList.js';

export default class ExternalForm extends React.Component {

  constructor(props) {
    const query = Query.instance,
      {data} = props;
    super(props);
    this.state = {
      nodeOptions: query.external.nodeOptions(data.id),
    };
    this.selectNetId = this.selectNetId.bind(this);
    this.selectNodeId = this.selectNodeId.bind(this);
  }

  selectNetId(el) {
    const {data} = this.props,
      query = Query.instance,
      methods = Store.instance,
      netId = el ? el.value : null;

    methods.save('nodeNetId', netId);
    this.setState({
      nodeOptions: query.external.nodeOptions(netId),
    });
  }

  selectNodeId(el) {
    const
      methods = Store.instance,
      {data} = this.props,
      value = el ? el.value : null,
      type = el ? el.type : undefined;
    methods.external.set(data.id, {
      nodeId: value,
      nodeType: type,
    });
  }

  render() {
    const {data} = this.props,
      methods = Store.instance,
      query = Query.instance;

    return (
        <Form>
          <h3>{'External Node'}</h3>
          <FormGroup>
            <ControlLabel>External Net</ControlLabel><br/>
            <Select value={data.nodeNetId}
              options={query.external.netOptions()}
              onChange={(el) => this.selectNetId(el)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>External Node</ControlLabel><br/>
            <Select value={data.nodeId} options={this.state.nodeOptions}
              onChange={(el) => this.selectNodeId(el)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>External Color</ControlLabel>
            <FormControl type="text" value={data.color}
              onChange={(e) =>methods.save('color', e.target.value)} />
          </FormGroup>
          <SocketList data={data.socketIds} />
          <FormGroup className="center">
            <Button onClick={() => methods.external.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

ExternalForm.propTypes = {
  data: PropTypes.instanceOf(ExternalModel).isRequired
};
