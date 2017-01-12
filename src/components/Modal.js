import React, {PropTypes} from 'react';
import {Modal, Button} from 'react-bootstrap';

export default class ModalDialog extends React.Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.hide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => {
            this.props.remove();
            this.props.hide();
          }} bsStyle="danger">Delete</Button>
          <Button onClick={this.props.hide}>Close</Button>
        </Modal.Footer>

      </Modal>
    );
  }
}

Modal.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  hide: PropTypes.func,
  remove: PropTypes.func
};
