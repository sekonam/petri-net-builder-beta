import React from 'react';
import VegaSampleCycle from '../../containers/VegaSample/VegaSampleCycle';
import { buildSpec, genData } from '../../data/vega/BarChartData';

const BarChartCycle = () => (
  <VegaSampleCycle
    buildSpec={buildSpec}
    genData={genData}
  />
);

export default BarChartCycle;
