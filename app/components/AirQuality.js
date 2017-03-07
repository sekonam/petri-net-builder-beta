import React from 'react';
import 'echarts/map/js/china';

import EchartSample from '../containers/EchartSample';
import { storage, getOption } from '../data/echart/AirQualityData';

const data = { storage, getOption };
const AirQuality = () => <EchartSample {...data} />;
export default AirQuality;
