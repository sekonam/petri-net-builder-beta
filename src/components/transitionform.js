import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

export default class TransitionForm extends React.Component {

  render() {
    const {data, startStates, finishStates, events, selectedStartEvents, selectedFinishEvents,
      saveHandler, saveToChildHandler, stateHandler} = this.props;

    return (
      <Modal title={'Transition: ' + data.name} show={this.props.show}
        hide={this.props.afterEditHandler}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Transition Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => saveHandler('name', e.target.value)} />
          </FormGroup>
          <div className="columns">
            <div className="left-side">
              <FormGroup controlId="TransitionStateSelectStart">
                <ControlLabel>Start State</ControlLabel><br/>
                <Select value={data.start} options={startStates}
                  onChange={(val) => saveToChildHandler(['start'])('state', val.value)} />
              </FormGroup>
              <FormGroup controlId="TransitionEventsSelectStart">
                <ControlLabel>Income Events</ControlLabel><br/>
                <Select multi={true} value={selectedStartEvents} options={events}
                  onChange={(val) => saveToChildHandler(['start'])('events',
                    val.cmap( (el) => el.value ) )} />
              </FormGroup>
            </div>
            <div className="right-side">

            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}
