import React from 'react';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

import Modal from './Modal.js';

export default class TransitionForm extends React.Component {

  render() {
    const {data, startStates, finishStates, events, selectedStartEvents, selectedFinishEvents,
      saveHandler, saveToChildHandler, stateHandler} = this.props;

      /*              <FormGroup controlId="TransitionStateSelectStart">
                      <ControlLabel>Start State</ControlLabel><br/>
                      <Select value={data.start.state} options={startStates}
                        onChange={(val) => saveToChildHandler(['start'])('state', val.value)} />
                    </FormGroup>*/
                    /*              <FormGroup controlId="TransitionStateSelectFinish">
                                    <ControlLabel>Finish State</ControlLabel><br/>
                                    <Select value={data.finish.state} options={finishStates}
                                      onChange={(val) => saveToChildHandler(['finish'])('state', val.value)} />
                                  </FormGroup>*/
    return (
      <Modal title={'Transition: ' + data.name} show={this.props.show}
        hide={this.props.afterEditHandler} remove={() => { this.props.removeHandler(this.props.data.id); }}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Transition Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => saveHandler('name', e.target.value)} />
          </FormGroup>
          <div className="columns">
            <div className="left-side">
              <FormGroup controlId="TransitionEventsSelectStart">
                <ControlLabel>Income Events</ControlLabel><br/>
                <Select multi={true} value={selectedStartEvents} options={events}
                  onChange={(val) => saveToChildHandler(['start'])('events',
                    val.cmap( (el) => el.value ) )} />
              </FormGroup>
              <FormGroup controlId="ConditionStart">
                <ControlLabel>Income Condition</ControlLabel>
                <FormControl componentClass="textarea" placeholder="JavaScript Code Here..."
                  value={data.start.condition} onChange={(e) => saveToChildHandler(['start'])('condition', e.target.value)} />
              </FormGroup>
            </div>
            <div className="right-side">
              <FormGroup controlId="TransitionEventsSelectFinish">
                <ControlLabel>Outcome Events</ControlLabel><br/>
                <Select multi={true} value={selectedFinishEvents} options={events}
                  onChange={(val) => saveToChildHandler(['finish'])('events',
                    val.cmap( (el) => el.value ) )} />
              </FormGroup>
              <FormGroup controlId="ConditionFinish">
                <ControlLabel>Outcome Condition</ControlLabel>
                <FormControl componentClass="textarea" placeholder="JavaScript Code Here..."
                  value={data.finish.condition} onChange={(e) => saveToChildHandler(['finish'])('condition', e.target.value)} />
              </FormGroup>

            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}
