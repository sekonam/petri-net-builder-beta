import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox, Button} from 'react-bootstrap';
import Select from 'react-select';

import Query from '../core/Query.js';
import Store from '../core/Store.js';
import TransitionModel from '../models/TransitionModel.js';
import SocketList from './SocketList.js';

export default class TransitionForm extends React.Component {

  constructor(props) {
    super(props);
    this.intVal = this.intVal.bind(this);
  }

  intVal(val) {
    const int = parseInt(val);
    return int ? int : 0;
  }

  render() {
    const {data} = this.props,
      methods = Store.instance;

    return (
        <Form>
          <h3>{'Transition: ' + data.name}</h3>
          <FormGroup>
            <ControlLabel>Transition Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Transition Color</ControlLabel>
            <FormControl type="text" value={data.color}
              onChange={(e) =>methods.save('color', e.target.value)} />
          </FormGroup>
          <SocketList data={data.socketIds} />
          <FormGroup className="center">
            <Button onClick={() => methods.transition.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

TransitionForm.propTypes = {
  data: PropTypes.instanceOf(TransitionModel).isRequired
};
