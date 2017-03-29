import React from 'react';
import D3Data from '../../data/d3';
import D3Sample from '../../containers/D3Sample';

const arrayGen = (len) => {
  const arr = [];
  for (let i = 0; i < len; i += 1) arr.push(1);
  return arr;
};

const D3MultipleCharts = () => (
  <div className="all-d3-charts">
    {arrayGen(10).map((i) => Object.keys(D3Data).map(
      (key) => (
        <div className="d3-chart" key={i}>
          <h2 className="d3-chart-title">{key}</h2>
          <D3Sample {...D3Data[key]} />
        </div>
      )
    ))}
  </div>
);

export default D3MultipleCharts;
