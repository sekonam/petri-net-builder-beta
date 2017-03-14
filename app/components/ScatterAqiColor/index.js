import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/ScatterAqiColorData';

const data = { storage, getOption };
const ScatterAqiColor = () => <EchartSample {...data} />;

export default ScatterAqiColor;
