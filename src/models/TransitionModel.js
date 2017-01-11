import Model from './Model.js';

import {PropTypes} from 'react';

export default class TransitionModel extends Model {
  constructor(params = null) {
    super();

    if (typeof params == 'object' && params && Object.keys(params).length > 0) {
      this.initProps(params);
    } else {
      this.genId();
      this.name = 'Transition name';
      this.start = {
        socket: null,
        state: null,
        events: [],
        condition: ''
      };
      this.finish = {
        socket: null,
        state: null,
        events: [],
        condition: ''
      };
    }
  }
}
