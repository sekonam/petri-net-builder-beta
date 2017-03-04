import React, {
  Component,
  PropTypes,
} from 'react';
import BaseEchart from './BaseEchart';

export class StackedAreaModel {
  constructor(data, points) {
    this.data = data;
    this.points = points;
    this.series = [];
    Object.keys(data).forEach((key) => {
      this.series.push({
        name: key,
        type: 'line',
        stack: 'stack',
        areaStyle: { normal: {} },
        data: data[key],
      });
    });
  }

  getLegendData() {
    return Object.keys(this.data);
  }
}

export class StackedArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      model: new StackedAreaModel(props.data, props.points),
    };
  }

  render() {
    const { title } = this.props;
    const { model } = this.state;
    const options = {
      title: {
        text: title,
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: model.getLegendData(),
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
    return <BaseEchart options={options} />;
  }
}

StackedArea.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  points: PropTypes.array.isRequired,
};
