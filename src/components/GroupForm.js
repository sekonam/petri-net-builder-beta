import React from 'react';
import Modal from './modal.js';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

export default class GroupForm extends React.Component {

  render() {
    const {data, methods, states, selectedStates} = this.props;

    return (
      <Modal title={'Group: ' + data.name} show={this.props.show}
        hide={methods.afterEdit} remove={() => { methods.remove(data.id); }}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Group Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <FormGroup controlId="StateSelectMultiple">
            <ControlLabel>States</ControlLabel>
            <Select multi={true} value={selectedStates} options={states}
              onChange={(val) => methods.save('states',
                typeof val == 'undefined' ? [] : val.cmap( (el) => el.value ) )} />
          </FormGroup>
        </Form>
      </Modal>
    );
  }
}
