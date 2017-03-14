import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/GraphCartesianData';

const data = { storage, getOption };
const GraphCartesian = () => <EchartSample {...data} />;

export default GraphCartesian;
