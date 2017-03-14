import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/StackedAreaData';

const data = { storage, getOption };
const StackedArea = () => <EchartSample {...data} />;

export default StackedArea;
