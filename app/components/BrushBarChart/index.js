import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/BrushBarChartData';

const data = { storage, getOption };
const BrushBarChart = () => <EchartSample {...data} />;

export default BrushBarChart;
