import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel, Checkbox, Button} from 'react-bootstrap';
import Select from 'react-select';

import Modal from './Modal.js';

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
    const {data, socketHandlers} = this.props,
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
    data.sockets.forEach( (socket, key) => {
      sockets[ socket.typeName ].push(
        <FormGroup key={key} className="row">
          <FormControl className="col-xs-8" type="text" value={socket.name}
            onChange={(e) => socketHandlers.set(data.id)(socket.id)( 'name', e.target.value ) } />
          <Button onClick={ socketHandlers.remove(data.id)(socket.id) }
            bsStyle="danger" className="col-xs-4">Delete</Button>
        </FormGroup>
      );
    } );

    return (
      <Modal title={'Place: ' + data.name} show={this.props.show}
        hide={this.props.afterEditHandler} remove={() => { this.props.removeHandler(data.id); }}>
        <Form>
          <FormGroup>
            <ControlLabel>Place Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => this.props.saveHandler('name', e.target.value)} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Place Width</ControlLabel>
            <FormControl type="text" value={data.width}
              onChange={(e) => this.props.saveHandler('width', this.intVal(e.target.value))} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Place Height</ControlLabel>
            <FormControl type="text" value={data.height}
              onChange={(e) => this.props.saveHandler('height', this.intVal(e.target.value))} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Place Shape</ControlLabel><br/>
            <Select value={this.intVal(data.r)} options={placeShapes}
              onChange={(val) => this.props.saveHandler('r', this.intVal(val.value))} />
          </FormGroup>
          <Checkbox onChange={() => this.props.saveHandler('start', !data.start)}
            defaultChecked={data.start}>
            Start Place
          </Checkbox>
          <Checkbox onChange={(e) => this.props.saveHandler('finish', !data.finish)}
            defaultChecked={data.finish}>
            Finish Place
          </Checkbox>
          <div className="columns sockets">
            <div className="left-side container">
              <ControlLabel>Income Sockets</ControlLabel>
              {sockets['income']}
              <FormGroup controlId="AddIncomeSocket">
              <Button onClick={ socketHandlers.add(data.id, 0) }
                bsStyle="primary">Add Income Socket</Button>
              </FormGroup>
            </div>
            <div className="right-side container">
              <ControlLabel>Outcome Sockets</ControlLabel>
              {sockets['outcome']}
              <FormGroup controlId="AddOutcomeSocket">
              <Button onClick={ socketHandlers.add(data.id, 1) }
                bsStyle="primary">Add Outcome Socket</Button>
              </FormGroup>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

PlaceForm.propTypes = {
  data: PropTypes.instanceOf(PlaceModel).isRequired,
  saveHandler: PropTypes.func.isRequired,
  afterEditHandler: PropTypes.func.isRequired,
  removeHandler: PropTypes.func.isRequired,
  socketHandlers: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired
};
