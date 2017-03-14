import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/AreaChartData';

const data = { storage, getOption };
const AreaChart = () => <EchartSample {...data} />;

export default AreaChart;
