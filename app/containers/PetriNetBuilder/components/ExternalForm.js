import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Select from 'react-select';

import Query from '../core/Query';
import Store from '../core/Store';
import ExternalModel from '../models/ExternalModel';
import SocketList from './SocketList';

export default class ExternalForm extends React.Component {

  constructor(props) {
    const query = Query.instance;
    const { data } = props;
    super(props);
    this.state = {
      nodeOptions: query.external.nodeOptions(data.nodeNetId),
    };
    this.selectNetId = this.selectNetId.bind(this);
    this.selectNodeId = this.selectNodeId.bind(this);
  }

  selectNetId(netId) {
    const query = Query.instance;
    const methods = Store.instance;

    methods.save('nodeNetId', netId);
    this.setState({
      nodeOptions: query.external.nodeOptions(netId),
    });
  }

  selectNodeId(value) {
    const methods = Store.instance;
    const { data } = this.props;

    let type = this.state.nodeOptions.find((e) => e.value === value);
    if (type) {
      type = type.type;
    }

    methods.external.set(data.id, {
      nodeId: value,
      nodeType: type,
    });
  }

  render() {
    const { data } = this.props;
    const methods = Store.instance;
    const query = Query.instance;

    return (
      <Form>
        <Button
          onClick={() => methods.external.remove(data.id)}
          bsStyle="danger" className="btn-sm pull-right"><i className="fa fa-trash"></i></Button>
        <h4 className="margin-medium-bottom text-green no-padding no-margin-top">{'External Node'}</h4>
        <FormGroup className="form-inline">
          <ControlLabel>External Net</ControlLabel>
          <Select
            simpleValue
            value={data.nodeNetId}
            className="form-control no-border no-padding"
            options={query.external.netOptions()}
            onChange={(el) => this.selectNetId(el)}
          />
        </FormGroup>
        <FormGroup className="form-inline">
          <ControlLabel>External Node</ControlLabel>
          <Select
            simpleValue
            value={data.nodeId}
            className="form-control no-border no-padding"
            options={this.state.nodeOptions}
            onChange={(el) => this.selectNodeId(el)}
          />
        </FormGroup>
        <FormGroup className="form-inline">
          <ControlLabel>External Color</ControlLabel>
          <FormControl
            type="text" value={data.color}
            onChange={(e) => methods.save('color', e.target.value)}
          />
        </FormGroup>
        <SocketList data={data.socketIds} />
      </Form>
    );
  }
}

ExternalForm.propTypes = {
  data: PropTypes.instanceOf(ExternalModel).isRequired,
};
