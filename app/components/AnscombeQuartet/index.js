import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/AnscombeQuartetData';

const data = { storage, getOption };
const AnscombeQuartet = () => <EchartSample {...data} />;
export default AnscombeQuartet;
