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
    super(props);
    this.state = {
      nodeOptions: [this.emptyOption()],
    };
    this.selectNetId = this.selectNetId.bind(this);
  }

  emptyOption() {
    return {
      value:null,
      label:'None'
    };
  }

  optionsAddEmpty(options) {
    return [this.emptyOption()].concat(options);
  }

  selectNetId(netId) {
    const
      query = Query.instance,
      methods = Store.instance,
      {data} = this.props;

    methods.save('nodeNetId', netId)

    let
      nodeOptions = [this.emptyOption()];
    if (data.nodeNetId) {
      const nid = data.nodeNetId;

      ExternalNodeNames.forEach( (nodeName) => {
        const nodes = query[nodeName].inNet(nid);
        nodeOptions = nodeOptions.concat(nodes.map(
          (node) => ({
            value: node.id,
            type: nodeName,
            label: node.name,
          })
        ));
      } );
    }
    this.setState({ nodeOptions });
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
              options={this.optionsAddEmpty( query.net.options() )}
              onChange={(el) => this.selectNetId(el.value)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>External Node</ControlLabel><br/>
            <Select value={data.nodeId} options={this.state.nodeOptions}
              onChange={(el) => methods.external.set(data.id, {
                nodeId: el.value,
                nodeType: el.type,
              })} />
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
