import React from 'react';
import VegaSample from '../../containers/VegaSample';
import { buildSpec, initData } from '../../data/vega/BarChartData';

const BarChart = () => (
  <VegaSample
    buildSpec={buildSpec}
    initData={initData}
  />
);

export default BarChart;
