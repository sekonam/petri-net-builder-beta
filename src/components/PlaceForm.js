import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox, Button} from 'react-bootstrap';
import Select from 'react-select';

import Query from '../core/Query.js';
import Store from '../core/Store.js';
import PlaceModel from '../models/PlaceModel.js';

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
      query = Query.instance,
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
    let sockets = {
        income: [],
        outcome: []
      };
    data.socketIds.forEach( (sid, key) => {
      const socket = query.socket.get(sid);
      sockets[ socket.typeName ].push(
        <FormGroup key={key} className="container-fluid">
        <div className="row">
          <FormControl className="col-xs-8" type="text" value={socket.name}
            onChange={(e) => methods.socket.set(socket.id, { name: e.target.value } ) } />
          <Button onClick={ () => methods.socket.remove(socket.id) }
            bsStyle="danger" className="col-xs-4">Delete</Button>
            </div>
        </FormGroup>
      );
    } );

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
            <ControlLabel>Place Shape</ControlLabel><br/>
            <Select value={this.intVal(data.r)} options={placeShapes}
              onChange={(val) => methods.save('r', this.intVal(val.value))} />
          </FormGroup>
          <ControlLabel>Income Sockets</ControlLabel>
          {sockets['income']}
          <FormGroup controlId="AddIncomeSocket">
            <Button onClick={ () => methods.socket.addForm({type: 0}) }
              bsStyle="primary">Add Income Socket</Button>
          </FormGroup>
          <ControlLabel>Outcome Sockets</ControlLabel>
          {sockets['outcome']}
          <FormGroup controlId="AddOutcomeSocket">
            <Button onClick={ () => methods.socket.addForm({type: 1}) }
              bsStyle="primary">Add Outcome Socket</Button>
          </FormGroup>
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
