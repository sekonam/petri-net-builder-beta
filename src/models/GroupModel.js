import Model from './../core/Model.js';

export default class GroupModel extends Model {

  defaults() {
    this.set({
      placeIds: [],
      transitionIds: [],
      subnetIds: [],
      netId: null,
      type: 0, // 0 - phase, 1 - milestone
      minimized: false,
      width: 100,
      height: 60,
      r: 15
    });

  }

  get typeName() { return this.type ? 'milestone' : 'phase'; }

}
