import React from 'react';
import 'echarts/map/js/china';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/AirQuality2Data';

const data = { storage, getOption };
const AirQuality2 = () => <EchartSample {...data} />;
export default AirQuality2;
