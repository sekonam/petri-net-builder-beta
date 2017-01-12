import React, {PropTypes} from 'react';
import Modal from './Modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

import EventModel from '../models/EventModel.js';

export default class EventForm extends React.Component {
  render() {
    return (
      <Modal title={'Event: ' + this.props.data.name} show={this.props.show}
        hide={this.props.afterEditHandler}
        remove={() => { this.props.removeHandler(this.props.data.id); }} >
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Event Name</ControlLabel>
            <FormControl type="text" value={this.props.data.name}
              onChange={(e) => this.props.saveHandler('name', e.target.value)} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}

EventForm.propTypes = {
  data: PropTypes.instanceOf(EventModel).isRequired,
  saveHandler: PropTypes.func.isRequired,
  afterEditHandler: PropTypes.func.isRequired,
  removeHandler: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
