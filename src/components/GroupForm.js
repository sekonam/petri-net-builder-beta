import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Select from 'react-select';

import Store from '../core/Store.js';
import GroupModel from '../models/GroupModel.js';

export default class GroupForm extends React.Component {

  render() {
    const {data, places, selectedPlaces} = this.props,
      methods = Store.instance;

    return (
        <Form>
          <h3>{'Group: ' + data.name}</h3>
          <FormGroup controlId="NameInput">
            <ControlLabel>Group Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Places</ControlLabel>
            <Select multi={true} value={selectedPlaces} options={places}
              onChange={(val) => methods.save('placeIds',
                typeof val == 'undefined' ? [] : val.cmap( (el) => el.value ) )} />
          </FormGroup>
          <FormGroup className="center">
            <Button onClick={() => methods.group.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

GroupForm.propTypes = {
  data: PropTypes.instanceOf(GroupModel).isRequired,
  methods: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired
};
