import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox} from 'react-bootstrap';

export default class StateForm extends React.Component {
  render() {
    return (
      <Modal title={'State: ' + this.props.data.name} show={this.props.show}
        hide={this.props.afterEditHandler} remove={() => { this.props.removeHandler(this.props.dataId); }}>
        <Form>
          <FormGroup>
            <ControlLabel>State Name</ControlLabel>
            <FormControl type="text" value={this.props.data.name}
              onChange={(e) => this.props.saveHandler('name', e.target.value)} />
          </FormGroup>
          <Checkbox onChange={() => this.props.saveHandler('start', !this.props.data.start)}
            defaultChecked={this.props.data.start}>
            Start State
          </Checkbox>
          <Checkbox onChange={(e) => this.props.saveHandler('finish', !this.props.data.finish)}
            defaultChecked={this.props.data.finish}>
            Finish State
          </Checkbox>
        </Form>
      </Modal>
    );
  }
}
