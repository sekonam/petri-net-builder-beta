import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/BubbleChartData';

const data = { storage, getOption };
const BubbleChart = () => <EchartSample {...data} />;

export default BubbleChart;
