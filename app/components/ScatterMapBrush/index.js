import React from 'react';
import 'echarts/map/js/china';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption, onMount } from '../../data/echart/ScatterMapBrushData';

const data = { storage, getOption, onMount };
const ScatterMapBrush = () => <EchartSample {...data} />;
export default ScatterMapBrush;
