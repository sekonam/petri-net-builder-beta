import React from 'react';
import Graphs from './index';

export default () => (
  <div className="viva-catalog">
    {Object.keys(Graphs).map(
      (name) => {
        const Graph = Graphs[name];
        return (
          <div className="viva-graph" key={name}>
            <h2>{name}</h2>
            <Graph />
          </div>
        );
      }
    )}
  </div>
);
