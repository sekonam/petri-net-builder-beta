import React from 'react';
import 'echarts/map/js/china';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/AirQualityBaiduMapData';

const data = { storage, getOption };
const AirQualityBaiduMap = () => <EchartSample {...data} />;
export default AirQualityBaiduMap;
