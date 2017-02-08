import Model from './../core/Model.js';

export default class ArcModel extends Model {

  defaults() {
    this.set({
      startSocketId: null,
      finishSocketId: null,
      color: '',
      dasharray: 'none'
    });
  }
}

ArcModel.dasharrays = {
  none: 'none',
  dashed: '7,5',
  dotted: '2,2',
};
