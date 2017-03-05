import EchartModel from '../utils/EchartModel';

const StackedAreaModel = EchartModel(
  function createSeries(key) {
    return {
      name: key,
      type: 'line',
      stack: 'stack',
      areaStyle: { normal: {} },
      data: this.data[key],
    };
  },
/*  [
    {
      keys: ['First', 'Second'],
      creator: function createSeries1(key) {
        return {
          name: key,
          type: 'line',
          stack: 'stack',
          areaStyle: { normal: {} },
          data: this.data[key],
        };
      },
    },
    {
      keys: ['Third', 'Fourth', 'Fifth'],
      creator: function createSeries2(key) {
        return {
          name: key,
          type: 'line',
          stack: 'stack',
          itemStyle: {
            normal: {
              color: '#eee'
            }
          },
          areaStyle: { normal: {} },
          data: this.data[key],
        };
      },
    },
  ],
  */
);

export default StackedAreaModel;
