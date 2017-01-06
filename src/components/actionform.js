import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

export default class ActionForm extends React.Component {

  render() {
    const {data, saveHandler, events, selectedEvents} = this.props;

    return (
      <Modal title={'Action: ' + data.name} show={this.props.show}
        hide={this.props.afterEditHandler} remove={() => { this.props.removeHandler(this.props.data.id); }}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Action Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => saveHandler('name', e.target.value)} />
          </FormGroup>
          <FormGroup controlId="EventsSelectMultiple">
            <ControlLabel>Events To Activate Action</ControlLabel>
            <Select multi={true} value={selectedEvents} options={events}
              onChange={(val) => saveHandler('events',
                typeof val == 'undefined' ? [] : val.cmap( (el) => el.value ) )} />
          </FormGroup>
          <FormGroup controlId="CodeTextarea">
            <ControlLabel>Javascript Action Code</ControlLabel>
            <FormControl componentClass="textarea" placeholder="JavaScript Code Here..."
              value={data.code} onChange={(e) => saveHandler('code', e.target.value)} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}
