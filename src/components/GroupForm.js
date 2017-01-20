import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

import Modal from './Modal.js';

import GroupModel from '../models/GroupModel.js';

export default class GroupForm extends React.Component {

  render() {
    const {data, methods, places, selectedPlaces} = this.props;

    return (
      <Modal title={'Group: ' + data.name} show={this.props.show}
        hide={methods.afterEdit} remove={() => { methods.remove(data.id); }}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Group Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Places</ControlLabel>
            <Select multi={true} value={selectedPlaces} options={places}
              onChange={(val) => methods.save('places',
                typeof val == 'undefined' ? [] : val.cmap( (el) => el.value ) )} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}

GroupForm.propTypes = {
  data: PropTypes.instanceOf(GroupModel).isRequired,
  methods: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired
};
