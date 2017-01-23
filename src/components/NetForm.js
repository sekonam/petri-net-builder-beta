import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

import Store from '../core/Store.js';
import NetModel from '../models/NetModel.js';

export default class NetForm extends React.Component {
  render() {
    const {data} = this.props,
      methods = Store.instance;
    return (
        <Form>
          <h3>{'Net: ' + data.name}</h3>
          <FormGroup controlId="NameInput">
            <ControlLabel>Net Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup className="center">
            <Button onClick={() => methods.net.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

NetForm.propTypes = {
  data: PropTypes.instanceOf(NetModel).isRequired
};
