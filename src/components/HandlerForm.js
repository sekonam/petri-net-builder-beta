import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Select from 'react-select';

import Store from '../core/Store.js';
import HandlerModel from '../models/HandlerModel.js';

export default class HandlerForm extends React.Component {

  remove() {
    const {data} = ths.props,
      methods = Store.instance;
    methods.handler.edit(null);
    methods.handler.remove(data.id);
  }

  render() {
    const {data, events, selectedEvents} = this.props,
      methods = Store.instance;

    return (
        <Form>
          <h3>{'Handler: ' + data.name}</h3>
          <FormGroup controlId="NameInput">
            <ControlLabel>Handler Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup controlId="EventsSelectMultiple">
            <ControlLabel>Events To Activate Handler</ControlLabel>
            <Select multi={true} value={selectedEvents} options={events}
              onChange={(val) => methods.save('events',
                typeof val == 'undefined' ? [] : val.cmap( (el) => el.value ) )} />
          </FormGroup>
          <FormGroup controlId="CodeTextarea">
            <ControlLabel>Javascript Handler Code</ControlLabel>
            <FormControl componentClass="textarea" placeholder="JavaScript Code Here..."
              value={data.code} onChange={(e) => methods.save('code', e.target.value)} />
          </FormGroup>
          <FormGroup className="center">
            <Button onClick={() => methods.handler.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

HandlerForm.propTypes = {
  data: PropTypes.instanceOf(HandlerModel).isRequired,
  events: PropTypes.array.isRequired,
  selectedEvents: PropTypes.array.isRequired
};
