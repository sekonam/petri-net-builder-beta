import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import Store from '../core/Store';
import SubnetModel from '../models/SubnetModel';
import SocketList from './SocketList';

export default function SubnetForm(props) {
  const { data } = props;
  const methods = Store.instance;

  return (
    <Form>
      <div className="pull-right">
        <Button
          onClick={() => methods.subnet.enter(data.id)}
          bsStyle="default" className="btn-sm margin-right"><i className="fa fa-sign-in"></i></Button>
        <Button
          onClick={() => methods.subnet.remove(data.id)}
          bsStyle="danger" className="btn-sm"><i className="fa fa-trash"></i></Button>
      </div>
      <h4 className="margin-medium-bottom text-green no-padding no-margin-top">{`Subnet: ${data.name}`}</h4>
      <FormGroup className="form-inline">
        <ControlLabel>Subnet Name</ControlLabel>
        <FormControl
          type="text" value={data.name}
          onChange={(e) => methods.save('name', e.target.value)}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Subnet Radius</ControlLabel>
        <FormControl
          type="text" value={data.r}
          onChange={(e) => methods.save('r', e.target.value)}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Subnet Color</ControlLabel>
        <FormControl
          type="text" value={data.color}
          onChange={(e) => methods.save('color', e.target.value)}
        />
      </FormGroup>
      <SocketList data={data.socketIds} />

    </Form>
  );
}

SubnetForm.propTypes = {
  data: PropTypes.instanceOf(SubnetModel).isRequired,
};
