import React, {
  PropTypes,
} from 'react';
import EchartComponent from '../utils/EchartComponent';
import StackedAreaModel from '../models/StackedAreaModel';

export default function StackedArea({ model, title }) {
  const options = {
    title: {
      text: title,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: model.legend,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: model.points,
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: model.series,
  };
  return <EchartComponent options={options} />;
}

StackedArea.propTypes = {
  title: PropTypes.string.isRequired,
  model: PropTypes.instanceOf(StackedAreaModel).isRequired,
};
