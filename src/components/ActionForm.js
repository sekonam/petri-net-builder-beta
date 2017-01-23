import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Select from 'react-select';

import Store from '../core/Store.js';
import ActionModel from '../models/ActionModel.js';

export default class ActionForm extends React.Component {

  remove() {
    const {data} = ths.props,
      methods = Store.instance;
    methods.action.edit(null);
    methods.action.remove(data.id);
  }

  render() {
    const {data, events, selectedEvents} = this.props,
      methods = Store.instance;

    return (
        <Form>
          <h3>{'Action: ' + data.name}</h3>
          <FormGroup controlId="NameInput">
            <ControlLabel>Action Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup controlId="EventsSelectMultiple">
            <ControlLabel>Events To Activate Action</ControlLabel>
            <Select multi={true} value={selectedEvents} options={events}
              onChange={(val) => methods.save('events',
                typeof val == 'undefined' ? [] : val.cmap( (el) => el.value ) )} />
          </FormGroup>
          <FormGroup controlId="CodeTextarea">
            <ControlLabel>Javascript Action Code</ControlLabel>
            <FormControl componentClass="textarea" placeholder="JavaScript Code Here..."
              value={data.code} onChange={(e) => methods.save('code', e.target.value)} />
          </FormGroup>
          <FormGroup className="center">
            <Button onClick={() => methods.action.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

ActionForm.propTypes = {
  data: PropTypes.instanceOf(ActionModel).isRequired,
  events: PropTypes.array.isRequired,
  selectedEvents: PropTypes.array.isRequired
};
