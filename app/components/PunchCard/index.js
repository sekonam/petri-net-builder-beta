import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/PunchCardData';

const data = { storage, getOption };
const PunchCard = () => <EchartSample {...data} />;

export default PunchCard;
