import Model from './../core/Model';

export default class ArcModel extends Model {

  defaults() {
    this.set({
      startSocketId: null,
      finishSocketId: null,
      color: '',
      dasharray: 'none',
    });
  }
}

export const ARC_LINE_TYPES = {
  none: 'none',
  dashed: '7,5',
  dotted: '2,2',
};
