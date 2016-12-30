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
    const {action, saveHandler, events} = this.props,
      actionEventIds = Object.keys(action).length > 0 ? action.events : [],

      eventOptions = events.length > 0 ? events.map( (name, id) => (
        <option value={id} key={id}>{name}</option>
      )) : '';

    return (
      <Modal title={'Action: ' + action.name} show={this.props.show}
        hide={this.props.afterEditHandler}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Action Name</ControlLabel>
            <FormControl type="text" value={action.name}
              onChange={(e) => saveHandler('name', e.target.value)} />
          </FormGroup>
          <FormGroup controlId="EventsSelectMultiple">
            <ControlLabel>Events To Activate Action</ControlLabel>
          </FormGroup>
          <select value={actionEventIds} multiple
            onChange={this.onChangeActionEvents(actionEventIds, saveHandler)}>
            {eventOptions}
          </select>
          <FormGroup controlId="CodeTextarea">
            <ControlLabel>Javascript Action Code</ControlLabel>
            <FormControl componentClass="textarea" placeholder="JavaScript Code Here..."
              value={action.code} onChange={(e) => saveHandler('code', e.target.value)} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}
