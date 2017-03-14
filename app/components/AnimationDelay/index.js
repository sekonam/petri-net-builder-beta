import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/AnimationDelayData';

const data = { storage, getOption };
const AnimationDelay = () => <EchartSample {...data} />;

export default AnimationDelay;
