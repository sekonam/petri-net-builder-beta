import AirQuality from './components/AirQuality';
import BubbleChart from './components/BubbleChart';
import PricesAndEarnings from './components/PricesAndEarnings';
import AnscombeQuartet from './components/AnscombeQuartet';
import ScatterAqiColor from './components/ScatterAqiColor';
import LargeScatter from './components/LargeScatter';
import AirQuality2 from './components/AirQuality2';
import PunchCard from './components/PunchCard';
import PunchCard2 from './components/PunchCard2';
import ScatterSingleAxis from './components/ScatterSingleAxis';
import DistributionHeightWidth from './components/DistributionHeightWidth';
import WorldPopulation from './components/WorldPopulation';
import RainfallWaterFlow from './components/RainfallWaterFlow';
import AreaChart from './components/AreaChart';
import StackedArea from './components/StackedArea';
import AnimationDelay from './components/AnimationDelay';
import BrushBarChart from './components/BrushBarChart';
import GradientShadow from './components/GradientShadow';
import MultipleYAxes from './components/MultipleYAxes';
import ScatterMapBrush from './components/ScatterMapBrush';
import NegativeBarChart from './components/NegativeBarChart';
import DiskUsage from './components/DiskUsage';
import Funnel from './components/Funnel';
import SankeyDiagram from './components/SankeyDiagram';
import ParallelAqi from './components/ParallelAqi';
import GraphCartesian from './components/GraphCartesian';
import AQIRadarChart from './components/AQIRadarChart';

const EchartsRoutesTest = [
  {
    route: 'air-quality',
    component: AirQuality,
    label: 'Air Quality',
  },
  {
    route: 'bubble-chart',
    component: BubbleChart,
    label: 'Bubble Chart',
  },
  {
    route: 'prices-and-earnings',
    component: PricesAndEarnings,
    label: 'Prices And Earnings',
  },
  {
    route: 'anscombe-quartet',
    component: AnscombeQuartet,
    label: 'Anscombe Quartet',
  },
  {
    route: 'scatter-aqi-color',
    component: ScatterAqiColor,
    label: 'Scatter Aqi Color',
  },
  {
    route: 'large-scatter',
    component: LargeScatter,
    label: 'Large Scatter',
  },
  {
    route: 'air-quality2',
    component: AirQuality2,
    label: 'Air Quality 2',
  },
  {
    route: 'punch-card',
    component: PunchCard,
    label: 'Punch Card',
  },
  {
    route: 'punch-card-line',
    component: PunchCard2,
    label: 'Punch Card Line',
  },
  {
    route: 'scatter-single-axis',
    component: ScatterSingleAxis,
    label: 'Scatter Single Axis',
  },
  {
    route: 'distribution-height-width',
    component: DistributionHeightWidth,
    label: 'Distribution Height Width',
  },
  {
    route: 'world-population',
    component: WorldPopulation,
    label: 'World Population',
  },
  {
    route: 'rainfall-water-flow',
    component: RainfallWaterFlow,
    label: 'Rainfall Water Flow',
  },
  {
    route: 'area-chart',
    component: AreaChart,
    label: 'Area Chart',
  },
  {
    route: 'stacked-area',
    component: StackedArea,
    label: 'Stacked Area',
  },
  {
    route: 'animation-delay',
    component: AnimationDelay,
    label: 'Animation Delay',
  },
  {
    route: 'brush-bar-chart',
    component: BrushBarChart,
    label: 'BrushBar Chart',
  },
  {
    route: 'gradient-shadow',
    component: GradientShadow,
    label: 'Gradient Shadow',
  },
  {
    route: 'multiple-y-axes',
    component: MultipleYAxes,
    label: 'Multiple Y Axes',
  },
  {
    route: 'scatter-map-brush',
    component: ScatterMapBrush,
    label: 'Scatter Map Brush',
  },
  {
    route: 'negative-bar-chart',
    component: NegativeBarChart,
    label: 'Negative Bar Chart',
  },
  {
    route: 'disk-usage',
    component: DiskUsage,
    label: 'Disk Usage',
  },
  {
    route: 'funnel',
    component: Funnel,
    label: 'Funnel',
  },
  {
    route: 'sankey-diagram',
    component: SankeyDiagram,
    label: 'Sankey Diagram',
  },
  {
    route: 'parallel-aqi',
    component: ParallelAqi,
    label: 'Parallel Aqi',
  },
  {
    route: 'graph-cartesian',
    component: GraphCartesian,
    label: 'Graph on Cartesian',
  },
  {
    route: 'aqi-radar-chart',
    component: AQIRadarChart,
    label: 'AQI Radar Chart',
  },
];

export default EchartsRoutesTest;
