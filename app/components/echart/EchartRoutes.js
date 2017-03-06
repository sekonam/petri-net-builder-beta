import StackedAreaExample from './StackedAreaExample';
import DownloadStatisticExample from './DownloadStatisticExample';

const EchartRoutes = [
  {
    route: 'stackedarea',
    label: 'Stacked Area',
    component: StackedAreaExample,
  },
  {
    route: 'statistic',
    label: 'Statistic',
    component: DownloadStatisticExample,
  },
];

export default EchartRoutes;
