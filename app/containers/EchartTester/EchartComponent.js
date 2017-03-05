import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
// import Charts from 'rc-echarts';

export default function EchartComponent({ options }) {
  return <ReactEcharts option={options} />;
  // return <Charts options={options} />;
}

EchartComponent.propTypes = {
  options: PropTypes.object.isRequired,
};
