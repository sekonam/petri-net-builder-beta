import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/ThemeRiverData';

const data = { storage, getOption };
const ThemeRiver = () => <EchartSample {...data} />;

export default ThemeRiver;
