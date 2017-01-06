import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

export default class EventForm extends React.Component {
  render() {
    return (
      <Modal title={'Event: ' + this.props.data.name} show={this.props.show}
        hide={this.props.afterEditHandler}
        remove={() => { this.props.removeHandler(this.props.dataId); }} >
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
