import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/FinanceIndicesData';

const data = { storage, getOption };
const FinanceIndices = () => <EchartSample {...data} />;

export default FinanceIndices;
