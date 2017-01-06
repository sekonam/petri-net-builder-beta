import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

export default class VarForm extends React.Component {
  render() {
    const {data} = this.props;
    return (
      <Modal title={'Var: ' + data.name} show={this.props.show}
        hide={this.props.afterEditHandler}
        remove={() => { this.props.removeHandler(data.id); }} >
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Variable Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => this.props.saveHandler('name', e.target.value)} />
          </FormGroup>
          <FormGroup controlId="ValueInput">
            <ControlLabel>Variable Value</ControlLabel>
            <FormControl type="text" value={data.value}
              onChange={(e) => this.props.saveHandler('value', e.target.value)} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}
