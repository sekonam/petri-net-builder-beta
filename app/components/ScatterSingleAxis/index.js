import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/ScatterSingleAxisData';

const data = { storage, getOption };
const ScatterSingleAxis = () => <EchartSample {...data} />;

export default ScatterSingleAxis;
