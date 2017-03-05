import React, {
  PropTypes,
} from 'react';
import EchartComponent from '../utils/EchartComponent';
import DownloadStatisticModel from '../models/DownloadStatisticModel';

export default function DownloadStatistic({ model, title, builderAll, watermarkText }) {
  const sum = (object) => Object.keys(object)
    .reduce(
      (all, key) => all + object[key],
      0,
    );
  const downloadCount = sum(model.data.download);
  const themeCount = sum(model.data.theme);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 100;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.08;
  ctx.font = '20px Microsoft Yahei';
  ctx.translate(50, 50);
  ctx.rotate(-Math.PI / 4);
  ctx.fillText(watermarkText || 'Realine', 0, 0);

  const options = {
    backgroundColor: {
      type: 'pattern',
      image: canvas,
      repeat: 'repeat',
    },
    tooltip: {},
    title: [
      {
        text: title,
        subtext: `Amount ${builderAll}`,
        x: '25%',
        textAlign: 'center',
      },
      {
        text: 'Downloads',
        subtext: `Amount ${downloadCount}`,
        x: '75%',
        textAlign: 'center',
      },
      {
        text: 'Themes',
        subtext: `Amount ${themeCount}`,
        x: '75%',
        y: '50%',
        textAlign: 'center',
      }],
    grid: [{
      top: 50,
      width: '50%',
      bottom: '45%',
      left: 10,
      containLabel: true,
    }, {
      top: '55%',
      width: '50%',
      bottom: 0,
      left: 10,
      containLabel: true,
    }],
    xAxis: [{
      type: 'value',
      max: builderAll,
      splitLine: {
        show: false,
      },
    }, {
      type: 'value',
      max: builderAll,
      gridIndex: 1,
      splitLine: {
        show: false,
      },
    }],
    yAxis: [{
      type: 'category',
      data: Object.keys(model.data.chart),
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
      splitLine: {
        show: false,
      },
    }, {
      gridIndex: 1,
      type: 'category',
      data: Object.keys(model.data.component),
      axisLabel: {
        interval: 0,
        rotate: 30,
      },
      splitLine: {
        show: false,
      },
    }],
    series: [{
      type: 'bar',
      stack: 'chart',
      z: 3,
      label: {
        normal: {
          position: 'right',
          show: true,
        },
      },
      data: Object.values(model.data.chart),
    }, {
      type: 'bar',
      stack: 'chart',
      silent: true,
      itemStyle: {
        normal: {
          color: '#eee',
        },
      },
      data: Object.keys(model.data.chart).map(
            (key) => builderAll - model.data.chart[key]
          ),
    }, {
      type: 'bar',
      stack: 'component',
      xAxisIndex: 1,
      yAxisIndex: 1,
      z: 3,
      label: {
        normal: {
          position: 'right',
          show: true,
        },
      },
      data: Object.values(model.data.component),
    }, {
      type: 'bar',
      stack: 'component',
      silent: true,
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        normal: {
          color: '#eee',
        },
      },
      data: Object.keys(model.data.component).map(
            (key) => builderAll - model.data.component[key]
          ),
    }, {
      type: 'pie',
      radius: [0, '30%'],
      center: ['75%', '25%'],
      data: Object.keys(model.data.download).map(
            (key) => ({
              name: key.replace('.js', ''),
              value: model.data.download[key],
            })
          ),
    }, {
      type: 'pie',
      radius: [0, '30%'],
      center: ['75%', '75%'],
      data: Object.keys(model.data.theme).map(
            (key) => ({
              name: key.replace('.js', ''),
              value: model.data.theme[key],
            })
          ),
    },
    ],
  };
  return <EchartComponent options={options} />;
}

DownloadStatistic.propTypes = {
  title: PropTypes.string.isRequired,
  model: PropTypes.instanceOf(DownloadStatisticModel).isRequired,
  builderAll: PropTypes.number.isRequired,
  watermarkText: PropTypes.string,
};
