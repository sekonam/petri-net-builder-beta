import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';
import PetriNetBuilder from './containers/PetriNetBuilder';
import EchartsRoutes from './EchartsRoutes';
import AllCharts from './containers/AllCharts';
import AllD3Charts from './components/AllD3Charts';
import D3MultipleCharts from './components/AllD3Charts/D3MultipleCharts';
import VegaBarChart from './components/vega/BarChart';
import VegaBarChartCycle from './components/vega/BarChartCycle';
import VegaSampleCatalog from './containers/VegaSample/VegaSampleCatalog';
import EchartSampleCatalog from './containers/EchartSample/EchartSampleCatalog';
import D3SampleCatalog from './containers/D3Sample/D3SampleCatalog';
import Dinamic from './components/VivaGraphs/Dinamic';
import GraphInsideGraph from './components/VivaGraphs/GraphInsideGraph';
import VivaTester from './containers/VivaTester';
import StormSample1 from './components/StormDiagram/Sample1';
import StormSample2 from './components/StormDiagram/Sample2';
import StormSample3 from './components/StormDiagram/Sample3';
import StormSample4 from './components/StormDiagram/Sample4';
import AtnVegaPerformance from './components/AtnVegaPerformance';
import AtnVivaPerformance from './components/AtnVivaPerformance';
import PdfOverlay from 'components/PdfOverlay';

export default () => ({
  indexRoute: '/',
  getChildRoutes: (location, cb) => {
    const childRoutes = [
      {
        path: '/',
        component: Home,
      },
      {
        path: 'cpn-builder',
        component: PetriNetBuilder,
      },
      {
        path: 'all-charts',
        component: AllCharts,
      },
      {
        path: 'all-d3-charts',
        component: AllD3Charts,
      },
      {
        path: 'multiple-d3-charts',
        component: D3MultipleCharts,
      },
      {
        path: 'vega-bar-chart',
        component: VegaBarChart,
      },
      {
        path: 'vega-bar-chart-cycle',
        component: VegaBarChartCycle,
      },
      {
        path: 'vega-catalog-cycle',
        component: VegaSampleCatalog,
      },
      {
        path: 'echart-catalog-cycle',
        component: EchartSampleCatalog,
      },
      {
        path: 'd3-catalog-cycle',
        component: D3SampleCatalog,
      },
      {
        path: 'viva-dinamic',
        component: Dinamic,
      },
      {
        path: 'viva-gig',
        component: GraphInsideGraph,
      },
      {
        path: 'viva-tester',
        component: VivaTester,
      },
      {
        path: 'storm-sample-1',
        component: StormSample1,
      },
      {
        path: 'storm-sample-2',
        component: StormSample2,
      },
      {
        path: 'storm-sample-3',
        component: StormSample3,
      },
      {
        path: 'storm-sample-4',
        component: StormSample4,
      },
      {
        path: 'atn-vega-performance',
        component: AtnVegaPerformance,
      },
      {
        path: 'atn-viva-performance',
        component: AtnVivaPerformance,
      },
      {
        path: '/pdf-overlay-sample',
        component: PdfOverlay,
      },
    ].concat(
      EchartsRoutes.map((conf) => ({
        path: conf.route,
        component: conf.component,
      })),
      {
        path: '*',
        status: 404,
        component: NotFound,
      },
    );
    childRoutes.push();
    cb(null, childRoutes);
  },
  component: App,
});
