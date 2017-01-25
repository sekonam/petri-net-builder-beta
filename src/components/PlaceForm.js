import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox, Button} from 'react-bootstrap';
import Select from 'react-select';

import Query from '../core/Query.js';
import Store from '../core/Store.js';
import PlaceModel from '../models/PlaceModel.js';
import SocketList from './SocketList.js';

export default class PlaceForm extends React.Component {

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
      methods = Store.instance,
      placeShapes = [
        {
          value: 0,
          label: 'Rectangle'
        },
        {
          value: 7,
          label: 'Rounded Rectangle'
        },
      ];

    return (
        <Form>
          <h3>{'Place: ' + data.name}</h3>
          <FormGroup>
            <ControlLabel>Place Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Place Width</ControlLabel>
            <FormControl type="text" value={data.width}
              onChange={(e) => tmethods.save('width', this.intVal(e.target.value))} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Place Height</ControlLabel>
            <FormControl type="text" value={data.height}
              onChange={(e) =>methods.save('height', this.intVal(e.target.value))} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Transition Color</ControlLabel>
            <FormControl type="text" value={data.color}
              onChange={(e) =>methods.save('color', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Place Shape</ControlLabel><br/>
            <Select value={this.intVal(data.r)} options={placeShapes}
              onChange={(val) => methods.save('r', this.intVal(val.value))} />
          </FormGroup>
          <SocketList data={data.socketIds} />
          <FormGroup className="center">
            <Button onClick={() => methods.place.remove(data.id)}
              bsStyle="danger">Delete</Button>
          </FormGroup>
        </Form>
    );
  }
}

PlaceForm.propTypes = {
  data: PropTypes.instanceOf(PlaceModel).isRequired
};
