import React, { PropTypes } from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import Select from 'react-select';

import Store from '../core/Store';
import TransitionModel from '../models/TransitionModel';
import SocketList from './SocketList';

export default function TransitionForm(props) {
  const {
    data,
    handlers,
    selectedHandlers,
  } = props;
  const methods = Store.instance;

  return (
    <Form>
      <Button
        onClick={() => methods.transition.remove(data.id)}
        bsStyle="danger" className="btn-sm pull-right"><i className="fa fa-trash"></i></Button>
      <h4 className="margin-medium-bottom text-green no-padding no-margin-top">{`Transition: ${data.name}`}</h4>
      <FormGroup className="form-inline">
        <ControlLabel>Transition Name</ControlLabel>
        <FormControl
          type="text" value={data.name}
          onChange={(e) => methods.save('name', e.target.value)}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Handlers List</ControlLabel>
        <Select
          multi simpleValue
          value={selectedHandlers}
          options={handlers}
          className="form-control no-border no-padding"
          onChange={(val) => methods.save(
            'handlerIds',
            val ? val.split(',') : []
          )}
        />
      </FormGroup>
      <FormGroup className="form-inline">
        <ControlLabel>Transition Color</ControlLabel>
        <FormControl
          type="text" value={data.color}
          onChange={(e) => methods.save('color', e.target.value)}
        />
      </FormGroup>
      <SocketList data={data.socketIds} />
    </Form>
  );
}

TransitionForm.propTypes = {
  data: PropTypes.instanceOf(TransitionModel).isRequired,
  handlers: PropTypes.array.isRequired,
  selectedHandlers: PropTypes.array.isRequired,
};
