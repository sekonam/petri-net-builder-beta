import Model from './../core/Model.js';

export default class TransitionModel extends Model {
  constructor(params = null) {
    super();

    if (typeof params == 'object' && params && Object.keys(params).length > 0) {
      this.init(params);
    } else {
      this.genId();
      this.name = 'Transition name';
      this.start = {
        socketId: null,
        nodeId: null,
        condition: ''
      };
      this.finish = {
        socketId: null,
        nodeId: null,
        condition: ''
      };
    }
  }
}
