import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/MultipleYAxesData';

const data = { storage, getOption };
const MultipleYAxes = () => <EchartSample {...data} />;

export default MultipleYAxes;
