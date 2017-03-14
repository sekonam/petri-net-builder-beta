import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/LifeExpectancyData';

const data = { storage, getOption };
const LifeExpectancy = () => <EchartSample {...data} />;

export default LifeExpectancy;
