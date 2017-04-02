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
