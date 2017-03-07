import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

import Store from '../core/Store';
import EventModel from '../models/EventModel';

export default function EventForm(props) {
  const { data } = props;
  const methods = Store.instance;
  return (
    <Form>
      <Button
        onClick={() => methods.event.remove(data.id)}
        bsStyle="danger" className="btn-sm pull-right"><i className="fa fa-trash"></i></Button>
      <h4 className="margin-medium-bottom text-green no-padding no-margin-top">{`Event: ${data.name}`}</h4>
      <FormGroup controlId="NameInput" className="form-inline">
        <ControlLabel>Event Name</ControlLabel>
        <FormControl
          type="text" value={data.name}
          onChange={(e) => methods.save('name', e.target.value)}
        />
      </FormGroup>
    </Form>
  );
}

EventForm.propTypes = {
  data: PropTypes.instanceOf(EventModel).isRequired,
};
