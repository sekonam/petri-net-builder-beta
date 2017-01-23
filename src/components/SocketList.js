import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox, Button} from 'react-bootstrap';
import Select from 'react-select';

import Query from '../core/Query.js';
import Store from '../core/Store.js';

export default class SocketList extends React.Component {

  render() {
    const {data} = this.props,
      methods = Store.instance,
      query = Query.instance;
    let sockets = {
        income: [],
        outcome: []
      };
    data.forEach( (sid, key) => {
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
        <div>
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
        </div>
    );
  }
}

SocketList.propTypes = {
  data: PropTypes.array.isRequired
};
