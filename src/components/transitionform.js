import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

export default class TransitionForm extends React.Component {
  onChangeActionEvents(actionEventIds, saveHandler) {
    return (e) => {
        const value = parseInt(e.target.value),
          key = actionEventIds.indexOf(value);
        if (key>-1) {
          delete actionEventIds[key];
        } else {
          actionEventIds.push(value);
        }
        saveHandler('events', actionEventIds);
      }
  }

  render() {
    const {data, saveHandler, events} = this.props,
      transitionEventIds = ['start', 'finish'].map(
        (key) => Object.keys(data).length > 0 ? data[key].events : []
      ),

      eventOptions = events.length > 0 ? events.map( (name, id) => (
        <option value={id} key={id}>{name}</option>
      )) : '';

    return (
      <Modal title={'Transition: ' + data.name} show={this.props.show}
        hide={this.props.afterEditHandler}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Transition Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => saveHandler('name', e.target.value)} />
          </FormGroup>
          <div class="columns">
            <div class="left-side">
              <FormGroup controlId="TransitionEventsSelectStart">
                <ControlLabel>Events Come In Transition</ControlLabel>
                <select value={transitionEventIds['start']} multiple
                  onChange={this.onChangeActionEvents(transitionEventIds['start'], saveHandler)}>
                  {eventOptions}
                </select>
              </FormGroup>
            </div>
            <div class="right-side">

            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}
