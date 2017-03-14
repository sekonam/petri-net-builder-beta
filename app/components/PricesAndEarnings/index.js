import React from 'react';
import 'echarts/map/js/world';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/PricesAndEarningsData';

const data = { storage, getOption };
const PricesAndEarnings = () => <EchartSample {...data} />;
export default PricesAndEarnings;
