import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';

import Store from '../core/Store.js';
import EventModel from '../models/EventModel.js';

export default class EventForm extends React.Component {
  render() {
    const {data} = this.props,
      methods = Store.instance;
    return (
        <Form>
          <h3>{'Event: ' + data.name}</h3>
          <FormGroup controlId="NameInput">
            <ControlLabel>Event Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup className="center">
            <Button onClick={() => methods.event.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

EventForm.propTypes = {
  data: PropTypes.instanceOf(EventModel).isRequired
};
