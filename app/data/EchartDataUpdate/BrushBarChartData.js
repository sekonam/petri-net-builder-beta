const genData = () => {
  var xAxisData = [];
  var data1 = [];
  var data2 = [];
  var data3 = [];
  var data4 = [];

  for (var i = 0; i < 10; i++) {
    xAxisData.push('Class' + i);
    data1.push((Math.random() * 2).toFixed(2));
    data2.push(-Math.random().toFixed(2));
    data3.push((Math.random() * 5).toFixed(2));
    data4.push((Math.random() + 0.3).toFixed(2));
  }

  return { xAxisData, data1, data2, data3, data4 };
};

const data = genData();

const options = {
    legend: {
        data: ['bar', 'bar2', 'bar3', 'bar4'],
        align: 'left',
        left: 10
    },
    brush: {
        toolbox: ['rect', 'polygon', 'lineX', 'lineY', 'keep', 'clear'],
        xAxisIndex: 0
    },
    toolbox: {
        feature: {
            magicType: {
                type: ['stack', 'tiled']
            },
            dataView: {}
        }
    },
    tooltip: {},
    yAxis: {
        inverse: true,
        splitArea: {show: false}
    },
    xAxis: {
        data: data.xAxisData,
        name: 'X Axis',
        silent: false,
        axisLine: {onZero: true},
        splitLine: {show: false},
        splitArea: {show: false}
    },
    grid: {
        left: 100
    },
    visualMap: {
        type: 'continuous',
        dimension: 1,
        text: ['High', 'Low'],
        inverse: true,
        itemHeight: 200,
        calculable: true,
        min: -2,
        max: 6,
        top: 60,
        left: 10,
        inRange: {
            colorLightness: [0.4, 0.8]
        },
        outOfRange: {
        },
        controller: {
            inRange: {
            }
        }
    },
    animation: false,
    series: [
        {
            name: 'bar',
            type: 'bar',
            stack: 'one',
            data: data.data1
        },
        {
            name: 'bar2',
            type: 'bar',
            stack: 'one',
            data: data.data2
        },
        {
            name: 'bar3',
            type: 'bar',
            stack: 'two',
            data: data.data3
        },
        {
            name: 'bar4',
            type: 'bar',
            stack: 'two',
            data: data.data4
        }
    ]
};

const dataOptions = (data) => ({
  xAxis: {
      data: data.xAxisData,
      name: 'X Axis',
      silent: false,
      axisLine: {onZero: true},
      splitLine: {show: false},
      splitArea: {show: false}
  },
  series: [
      {
          name: 'bar',
          type: 'bar',
          stack: 'one',
          data: data.data1
      },
      {
          name: 'bar2',
          type: 'bar',
          stack: 'one',
          data: data.data2
      },
      {
          name: 'bar3',
          type: 'bar',
          stack: 'two',
          data: data.data3
      },
      {
          name: 'bar4',
          type: 'bar',
          stack: 'two',
          data: data.data4
      }
  ]
});

export { genData, options, dataOptions };
