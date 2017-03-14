import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/LargeScatterData';

const data = { storage, getOption };
const LargeScatter = () => <EchartSample {...data} />;

export default LargeScatter;
