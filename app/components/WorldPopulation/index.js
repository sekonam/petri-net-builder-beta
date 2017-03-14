import React from 'react';
import 'echarts/map/js/world';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/WorldPopulationData';

const data = { storage, getOption };
const WorldPopulation = () => <EchartSample {...data} />;
export default WorldPopulation;
