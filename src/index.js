import React from 'react';
import ReactDOM from 'react-dom';
import Engine from './components/engine.js';
import Modal from './components/modal.js';

const rootNode = document.getElementById('root');
Modal.rootNode = rootNode;

ReactDOM.render(
  <Engine/>,
  rootNode
);
