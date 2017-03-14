import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/GraphWebkitDepData';

const data = { storage, getOption };
const GraphWebkitDep = () => <EchartSample {...data} />;

export default GraphWebkitDep;
