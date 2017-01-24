import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox, Button} from 'react-bootstrap';
import Select from 'react-select';

import Query from '../core/Query.js';
import Store from '../core/Store.js';
import SubnetModel from '../models/SubnetModel.js';
import SocketList from './SocketList.js';

export default class SubnetForm extends React.Component {

  constructor(props) {
    super(props);
    this.intVal = this.intVal.bind(this);
  }

  intVal(val) {
    const int = parseInt(val);
    return int ? int : 0;
  }

  render() {
    const {data} = this.props,
      methods = Store.instance;

    return (
        <Form>
          <h3>{'Subnet: ' + data.name}</h3>
          <FormGroup>
            <ControlLabel>Subnet Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Subnet Radius</ControlLabel>
            <FormControl type="text" value={data.r}
              onChange={(e) => tmethods.save('r', this.intVal(e.target.value))} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Subnet Color</ControlLabel>
            <FormControl type="text" value={data.color}
              onChange={(e) =>methods.save('color', e.target.value)} />
          </FormGroup>
          <SocketList data={data.socketIds} />
          <FormGroup className="center">
          <Button onClick={() => methods.subnet.enter(data.id)}
            bsStyle="primary">Enter</Button>
          <Button onClick={() => methods.subnet.remove(data.id)}
            bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

SubnetForm.propTypes = {
  data: PropTypes.instanceOf(SubnetModel).isRequired
};
