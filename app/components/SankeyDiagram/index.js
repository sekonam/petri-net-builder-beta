import React from 'react';

import EchartSample from '../../containers/EchartSample';
import { storage, getOption } from '../../data/echart/SankeyDiagramData';

const data = { storage, getOption };
const SankeyDiagram = () => <EchartSample {...data} />;

export default SankeyDiagram;
