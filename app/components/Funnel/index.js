import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/FunnelData';

const data = { storage, getOption };
const Funnel = () => <EchartSample {...data} />;

export default Funnel;
