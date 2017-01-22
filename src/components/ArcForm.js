import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

import Modal from './Modal.js';

import ArcModel from '../models/ArcModel.js';

export default class ArcForm extends React.Component {

  render() {
    const {data, methods} = this.props;

    return (
      <Modal title='Arc' show={this.props.show}
        hide={methods.afterEdit} remove={() => { methods.remove(this.props.data.id); }}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Arc Color</ControlLabel>
            <FormControl type="text" value={data.color}
              onChange={(e) => methods.save('color', e.target.value)} />
          </FormGroup>
          <div className="columns">
            <div className="left-side">
            </div>
            <div className="right-side">
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

ArcForm.propTypes = {
  data: PropTypes.instanceOf(ArcModel).isRequired,
  methods: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired
};
