import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

export default class StateForm extends React.Component {
  render() {
    return (
      <Modal title={this.props.state.name} show={this.props.show} hide={this.props.afterEditHandler}>
        <Form>
          <FormGroup>
            <ControlLabel>State Name</ControlLabel>
            <FormControl type="text" value={this.props.state.name}
              onChange={(e) => this.props.saveHandler('name', e.target.value)} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}
