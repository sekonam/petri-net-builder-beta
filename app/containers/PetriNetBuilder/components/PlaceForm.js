import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Select from 'react-select';

import Store from '../core/Store';
import PlaceModel from '../models/PlaceModel';
import SocketList from './SocketList';

export default function PlaceForm(props) {
  const { data } = props;
  const methods = Store.instance;
  const placeShapes = [
    {
      value: 0,
      label: 'Rectangle',
    },
    {
      value: 7,
      label: 'Rounded Rectangle',
    },
  ];

  return (
    <Form>
      <Button
        onClick={() => methods.place.remove(data.id)}
        bsStyle="danger" className="pull-right btn-sm"><i className="fa fa-trash"></i>
      </Button>
      <h4 className="margin-medium-bottom text-green no-padding no-margin-top">{`Place: ${data.name}`}</h4>
      <FormGroup className="form-inline">
        <ControlLabel>Place Name</ControlLabel>
        <FormControl
          type="text"
          value={data.name}
          onChange={(e) => methods.save('name', e.target.value)}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Place Type</ControlLabel>
        <Select
          simpleValue
          value={data.type}
          className="form-control no-border no-padding"
          options={PlaceModel.types.map(
            (val, key) => ({ value: key, label: val })
          )}
          onChange={(val) => methods.save('type', val)}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Transition Color</ControlLabel>
        <FormControl
          type="text"
          value={data.color}
          onChange={(e) => methods.save('color', e.target.value)}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Place Shape</ControlLabel>
        <Select
          simpleValue
          value={data.r}
          className="form-control no-border no-padding"
          options={placeShapes}
          onChange={(val) => methods.save('r', val)}
        />
      </FormGroup>
      <SocketList data={data.socketIds} />
    </Form>
  );
}

PlaceForm.propTypes = {
  data: PropTypes.instanceOf(PlaceModel).isRequired,
};
