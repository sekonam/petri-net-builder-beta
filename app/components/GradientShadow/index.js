import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/GradientShadowData';

const data = { storage, getOption };

const GradientShadow = () => <EchartSample {...data} />;

export default GradientShadow;
