import React, { PropTypes } from 'react';
import ReactEcharts from 'echarts-for-react';
// import Charts from 'rc-echarts';

export default function BaseEchart({ options }) {
  return <ReactEcharts option={options} />;
  // return <Charts options={options} />;
}

BaseEchart.propTypes = {
  options: PropTypes.array.isRequired,
};
