import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/ParallelAqiData';

const data = { storage, getOption };
const ParallelAqi = () => <EchartSample {...data} />;

export default ParallelAqi;
