import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

export default class ActionForm extends React.Component {
  render() {
    return (
      <Modal title={'Action: ' + this.props.data.name} show={this.props.show} hide={this.props.afterEditHandler}>
        <Form>
          <FormGroup>
            <ControlLabel>Action Name</ControlLabel>
            <FormControl type="text" value={this.props.data.name}
              onChange={(e) => this.props.saveHandler('name', e.target.value)} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}
