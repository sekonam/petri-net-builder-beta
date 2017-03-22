import React from 'react';
import D3Data from '../../data/d3';
import D3Sample from '../../containers/D3Sample';

const AllD3Charts = () => (
  <div className="all-d3-charts">
    {Object.keys(D3Data).map(
      (key) => (
        <div className="d3-chart" key={key}>
          <h2 className="d3-chart-title">{key}</h2>
          <D3Sample {...D3Data[key]} />
        </div>
      )
    )}
  </div>
);

export default AllD3Charts;
