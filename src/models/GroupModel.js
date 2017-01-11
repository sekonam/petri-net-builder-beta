import Model from './model.js';

export default class GroupModel extends Model {

  constructor(params) {
    super();
    this.init(params, GroupModel.default);
  }

}

GroupModel.findMinMax = function(items) {
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
};

GroupModel.default = {
  name: 'Group name',
  states: []
};
