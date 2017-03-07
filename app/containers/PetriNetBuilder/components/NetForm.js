import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import Store from '../core/Store';
import NetModel from '../models/NetModel';

export default function NetForm(props) {
  const { data } = props;
  const methods = Store.instance;
  return (
    <Form>
      <Button
        onClick={() => methods.net.remove(data.id)}
        bsStyle="danger" className="pull-right btn-sm"><i className="fa fa-trash"></i></Button>
      <h4 className="margin-medium-bottom text-green no-padding no-margin-top">{`Net: ${data.name}`}</h4>
      <FormGroup controlId="NameInput" className="form-inline">
        <ControlLabel>Net Name</ControlLabel>
        <FormControl
          type="text" value={data.name}
          onChange={(e) => methods.save('name', e.target.value)}
        />
      </FormGroup>
    </Form>
  );
}

NetForm.propTypes = {
  data: PropTypes.instanceOf(NetModel).isRequired,
};
