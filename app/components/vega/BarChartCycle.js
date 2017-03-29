import React from 'react';
import VegaSampleCycle from '../../containers/VegaSample/VegaSampleCycle';
import { spec, genData } from '../../data/vega/BarChartData';

const gen = (c) => {
  const a = [];
  for (let i = 0; i < c; i += 1) {
    a.push(i);
  }
  return a;
};

const BarChartCycle = () => (
  <div>
    {gen(10).map(
      (i) => (
        <VegaSampleCycle
          key={i}
          spec={spec}
          genData={genData}
          delay={15}
        />
      )
    )}
  </div>
);

export default BarChartCycle;
