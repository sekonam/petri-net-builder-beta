import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox} from 'react-bootstrap';

export default class StateForm extends React.Component {
  checked(value) {
    return value ? 'checked' : '';
  }
  render() {
    const finishChecked = this.props.state.finish == true ? 'checked' : '',
      startChecked = this.props.state.start == true ? 'checked' : '';

    return (
      <Modal title={this.props.state.name} show={this.props.show} hide={this.props.afterEditHandler}>
        <Form>
          <FormGroup>
            <ControlLabel>State Name</ControlLabel>
            <FormControl type="text" value={this.props.state.name}
              onChange={(e) => this.props.saveHandler('name', e.target.value)} />
          </FormGroup>
          <Checkbox onChange={() => this.props.saveHandler('start', !this.props.state.start)}
            defaultChecked={this.props.state.start}>
            Start State
          </Checkbox>
          <Checkbox onChange={(e) => this.props.saveHandler('finish', !this.props.state.finish)}
            defaultChecked={this.props.state.finish}>
            Finish State
          </Checkbox>
        </Form>
      </Modal>
    );
  }
}
