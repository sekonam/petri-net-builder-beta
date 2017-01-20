import React, {PropTypes} from 'react';
import {Form, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';
import Select from 'react-select';

import Modal from './Modal.js';

import TransitionModel from '../models/TransitionModel.js';

export default class TransitionForm extends React.Component {

  render() {
    const {data, methods} = this.props;

    return (
      <Modal title={'Transition: ' + data.name} show={this.props.show}
        hide={methods.afterEdit} remove={() => { methods.remove(this.props.data.id); }}>
        <Form>
          <FormGroup controlId="NameInput">
            <ControlLabel>Transition Name</ControlLabel>
            <FormControl type="text" value={data.name}
              onChange={(e) => methods.save('name', e.target.value)} />
          </FormGroup>
          <div className="columns">
            <div className="left-side">
              <FormGroup controlId="ConditionStart">
                <ControlLabel>Income Condition</ControlLabel>
                <FormControl componentClass="textarea" placeholder="JavaScript Code Here..."
                  value={data.start.condition} onChange={
                    (e) => methods.saveToChild(['start'])('condition', e.target.value)
                  } />
              </FormGroup>
            </div>
            <div className="right-side">
              <FormGroup controlId="ConditionFinish">
                <ControlLabel>Outcome Condition</ControlLabel>
                <FormControl componentClass="textarea" placeholder="JavaScript Code Here..."
                  value={data.finish.condition} onChange={
                    (e) => methods.saveToChild(['finish'])('condition', e.target.value)
                  } />
              </FormGroup>

            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

TransitionForm.propTypes = {
  data: PropTypes.instanceOf(TransitionModel).isRequired,
  methods: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired
};
