import Model from './model.js';

export default class ViewportModel extends Model {
  constructor(params = null) {
    super();
    this.init(params, ViewportModel.default);
  }
}

ViewportModel.default = {
  translateX: 0,
  translateY: 0,
  zoom: 1
};
