import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Modal from './Modal.js';

import VarModel from '../models/VarModel.js';

export default class VarForm extends React.Component {
  render() {
    const {data, methods} = this.props;
    return (
      <Modal title={'Var: ' + data.name} show={this.props.show}
        hide={methods.afterEdit}
        remove={() => { methods.remove(data.id); }} >
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Variable Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup controlId="ValueInput">
            <ControlLabel>Variable Value</ControlLabel>
            <FormControl type="text" value={data.value}
              onChange={(e) => methods.save('value', e.target.value)} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}

VarForm.propTypes = {
  data: PropTypes.instanceOf(VarModel).isRequired,
  methods: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired
};
