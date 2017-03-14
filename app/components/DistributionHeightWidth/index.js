import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/DistributionHeightWidthData';

const data = { storage, getOption };
const DistributionHeightWidth = () => <EchartSample {...data} />;

export default DistributionHeightWidth;
