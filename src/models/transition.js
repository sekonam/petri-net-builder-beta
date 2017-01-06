import Model from './model.js';

export default class TransitionModel extends Model {
  constructor(params) {
    super();

    if (typeof params == 'object' && Object.keys(params).length > 0) {
      this.initProps(params);
    } else {
      this.name = 'Transition name';
      this.start = {
        state: null,
        events: [],
        condition: ''
      };
      this.finish = {
        offset: null,
        state: null,
        events: [],
        condition: ''
      };
    }
  }
}
