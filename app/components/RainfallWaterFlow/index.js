import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/RainfallWaterFlowData';

const data = { storage, getOption };
const RainfallWaterFlow = () => <EchartSample {...data} />;

export default RainfallWaterFlow;
