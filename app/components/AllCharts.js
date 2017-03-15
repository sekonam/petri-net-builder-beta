import React from 'react';
import EchartsRoutes from '../EchartsRoutes';

const AllCharts = () => (
  <div>
    {EchartsRoutes.map(
      (route, key) => <route.component key={key} />
    )}
  </div>
);

export default AllCharts;
