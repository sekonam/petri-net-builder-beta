import {
  isFunction,
  isArray,
} from 'lodash';

/*
 * function createSeries(key)
 * @param key Symbol (key of this.data)
 * or
 * createSeries = [{
 *  keys: Symbol (key of this.data),
 *  creator: Function (
 *    @param key Symbol (key of this.data)
 *  ),
 * },]
 */

const EchartModel = (createSeries) => class {
  constructor(data, points) {
    this.data = data;
    this.points = points;
  }

  get series() {
    if (isFunction(createSeries)) {
      return Object.keys(this.data).map(createSeries.bind(this));
    }

    if (isArray(createSeries)) {
      let series = [];
      createSeries.forEach(
        (dataSerie) => {
          series = series.concat(
            dataSerie.keys.map(
              dataSerie.creator.bind(this)
            )
          );
        }
      );
      return series;
    }

    return null;
  }

  get legend() {
    return Object.keys(this.data);
  }
};

export default EchartModel;
