import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Select from 'react-select';

import Store from '../core/Store';
import GroupModel from '../models/GroupModel';

export default function GroupForm(props) {
  const {
    data,
    places,
    selectedPlaces,
    transitions,
    selectedTransitions,
    subnets,
    selectedSubnets,
  } = props;
  const methods = Store.instance;

  return (
    <Form>
      <Button
        onClick={() => methods.group.remove(data.id)}
        bsStyle="danger"
        className="btn-sm pull-right">
        <i className="fa fa-trash"></i>
      </Button>
      <h4 className="margin-medium-bottom text-green no-padding no-margin-top">
        { `${data.type ? 'Milestone' : 'Phase'}: ${data.name}`}
      </h4>
      <FormGroup controlId="NameInput" className="form-inline">
        <ControlLabel>Group Name</ControlLabel>
        <FormControl
          type="text" value={data.name}
          onChange={(e) => methods.save('name', e.target.value)}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Places</ControlLabel>
        <Select
          multi simpleValue
          value={selectedPlaces}
          className="form-control no-border no-padding"
          options={places}
          onChange={(val) => {
            methods.save(
            'placeIds',
            val ? val.split(',') : []
          );
          }}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Transitions</ControlLabel>
        <Select
          multi simpleValue
          value={selectedTransitions}
          className="form-control no-border no-padding"
          options={transitions}
          onChange={(val) => methods.save(
            'transitionIds',
            val ? val.split(',') : []
          )}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Subnets</ControlLabel>
        <Select
          multi simpleValue
          value={selectedSubnets}
          className="form-control no-border no-padding"
          options={subnets}
          onChange={(val) => methods.save(
            'subnetIds',
            val ? val.split(',') : []
          )}
        />
      </FormGroup>
    </Form>
  );
}

GroupForm.propTypes = {
  data: PropTypes.instanceOf(GroupModel).isRequired,
  places: PropTypes.array.isRequired,
  selectedPlaces: PropTypes.array.isRequired,
  transitions: PropTypes.array.isRequired,
  selectedTransitions: PropTypes.array.isRequired,
  subnets: PropTypes.array.isRequired,
  selectedSubnets: PropTypes.array.isRequired,
};
