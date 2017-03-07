import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Select from 'react-select';

import Store from '../core/Store';
import HandlerModel from '../models/HandlerModel';

export default function HandlerForm(props) {
  const {
    data,
    events,
    selectedEvents,
  } = props;
  const methods = Store.instance;

  return (
    <Form>
      <Button
        onClick={() => methods.handler.remove(data.id)}
        bsStyle="danger" className="btn-sm pull-right"><i className="fa fa-trash"></i></Button>
      <h4 className="margin-medium-bottom text-green no-padding no-margin-top">{`Handler: ${data.name}`}</h4>
      <FormGroup controlId="NameInput" className="form-inline">
        <ControlLabel>Handler Name</ControlLabel>
        <FormControl
          type="text" value={data.name}
          onChange={(e) => methods.save('name', e.target.value)}
        />
      </FormGroup>
      <FormGroup controlId="EventsSelectMultiple" className="form-inline">
        <ControlLabel>Autocall Events</ControlLabel>
        <Select
          multi simpleValue
          value={selectedEvents}
          className="form-control no-border no-padding"
          options={events}
          onChange={(val) => methods.save(
            'events',
            val ? val.split(',') : []
          )}
        />
      </FormGroup>
      <br />
      <FormGroup controlId="CodeTextarea">
        <h5>Javascript Handler Code</h5>
        <FormControl
          componentClass="textarea" placeholder="JavaScript Code Here..."
          value={data.code} onChange={(e) => methods.save('code', e.target.value)}
        />
      </FormGroup>
    </Form>
  );
}

HandlerForm.propTypes = {
  data: PropTypes.instanceOf(HandlerModel).isRequired,
  events: PropTypes.array.isRequired,
  selectedEvents: PropTypes.array.isRequired,
};
