import Model from './../core/Model.js';

export default class ViewportModel extends Model {

  defaults() {
    this.set({
      translateX: 0,
      translateY: 0,
      zoom: 1,
      center: {x:0, y:0}
    });
  }

}
