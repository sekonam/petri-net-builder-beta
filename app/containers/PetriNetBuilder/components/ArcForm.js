import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Select from 'react-select';

import { ucfirst } from '../core/helpers';
import Store from '../core/Store';
import ArcModel, { ARC_LINE_TYPES } from '../models/ArcModel';

export default function ArcForm(props) {
  const { data } = props;
  const methods = Store.instance;
  const dasharrayOptions = [];
  const dashTypeNames = Object.keys(ARC_LINE_TYPES);

  dashTypeNames.forEach((key) => {
    dasharrayOptions.push({
      value: ARC_LINE_TYPES[key],
      label: ucfirst(key),
    });
  });

  return (
    <Form>
      <h4 className="margin-medium-bottom text-green no-padding no-margin-top">Arc</h4>
      <FormGroup controlId="NameInput">
        <ControlLabel>Arc Color</ControlLabel>
        <FormControl
          type="text" value={data.color}
          onChange={(e) => methods.save('color', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Arc Line Type</ControlLabel>
        <Select
          simpleValue
          value={data.dasharray} options={dasharrayOptions}
          onChange={(val) => methods.save(
            'dasharray',
            val || 'none'
          )}
        />
      </FormGroup>
      <FormGroup className="center">
        <Button
          onClick={() => methods.arc.remove(data.id)}
          bsStyle="danger">Delete</Button>
      </FormGroup>
    </Form>
  );
}

ArcForm.propTypes = {
  data: PropTypes.instanceOf(ArcModel).isRequired,
};
