import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/AQIRadarChartData';

const data = { storage, getOption };
const AQIRadarChart = () => <EchartSample {...data} />;

export default AQIRadarChart;
