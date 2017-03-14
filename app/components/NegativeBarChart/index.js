import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/NegativeBarChartData';

const data = { storage, getOption };
const NegativeBarChart = () => <EchartSample {...data} />;

export default NegativeBarChart;
