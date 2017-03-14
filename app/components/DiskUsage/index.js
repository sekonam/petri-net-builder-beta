import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/DiskUsageData';

const data = { storage, getOption };
const DiskUsage = () => <EchartSample {...data} />;

export default DiskUsage;
