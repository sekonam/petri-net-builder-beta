import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/PunchCard2Data';

const data = { storage, getOption };
const PunchCard2 = () => <EchartSample {...data} />;

export default PunchCard2;
