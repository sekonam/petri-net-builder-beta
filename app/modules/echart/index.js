import React from 'react';
import { StackedArea } from './StackedArea';

const EchartExamples = [
  {
    route: 'stackedarea',
    label: 'Stacked Area',
    component: StackedAreaExample,
  },
];

export default EchartExamples;

export function StackedAreaExample() {
  const data = {
    First: [120, 132, 101, 134, 90, 230, 210],
    Second: [220, 182, 191, 234, 290, 330, 310],
    Third: [150, 232, 201, 154, 190, 330, 410],
    Fourth: [320, 332, 301, 334, 390, 330, 320],
    Fifth: [820, 932, 901, 934, 1290, 1330, 1320],
  };
  const points = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'];
  return (<StackedArea
    title="Stack Area Example"
    data={data}
    points={points}
  />);
}
