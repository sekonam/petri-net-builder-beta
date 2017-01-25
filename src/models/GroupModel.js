import Model from './../core/Model.js';

export default class GroupModel extends Model {

  defaults() {
    this.set({
      placeIds: [],
      transitionIds: [],
      subnetIds: [],
      netId: null,
      type: 0 // 0 - phase, 1 - milestone
    });

  }

  get typeName() { return this.type ? 'milestone' : 'phase'; }

}

/*GroupModel.findMinMax = function(items) {
  const BIG_INT = 1000000;

  let max = {
      x: -BIG_INT,
      y: -BIG_INT
    },
    min = {
      x: BIG_INT,
      y: BIG_INT
    };

  items.forEach( (item) => {
    min.x = Math.min( min.x, item.x );
    min.y = Math.min( min.y, item.y );
    max.x = Math.max( max.x, item.x + item.width );
    max.y = Math.max( max.y, item.y + item.height );
  } );

  return {min, max};
};*/
