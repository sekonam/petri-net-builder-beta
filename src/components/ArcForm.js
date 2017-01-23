import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

import Store from '../core/Store.js';
import ArcModel from '../models/ArcModel.js';

export default class ArcForm extends React.Component {

  render() {
    const {data} = this.props,
      methods = Store.instance;

    return (
        <Form>
          <h3>Arc</h3>
          <FormGroup controlId="NameInput">
            <ControlLabel>Arc Color</ControlLabel>
            <FormControl type="text" value={data.color}
              onChange={(e) => methods.save('color', e.target.value)} />
          </FormGroup>
          <FormGroup className="center">
            <Button onClick={() => methods.arc.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

ArcForm.propTypes = {
  data: PropTypes.instanceOf(ArcModel).isRequired
};
