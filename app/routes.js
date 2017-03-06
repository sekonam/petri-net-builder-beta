import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';
import EchartRoutes from './components/echart/EchartRoutes';
import { EchartTesterSample } from './containers/EchartTester';
import PetriNetBuilder from './containers/PetriNetBuilder';

export default () => ({
  indexRoute: '/',
  getChildRoutes: (location, cb) => {
    const childRoutes = [
      {
        path: '/',
        component: Home,
      },
      {
        path: 'cpn_builder',
        component: PetriNetBuilder,
      },
      {
        path: 'echarts',
        component: EchartTesterSample,
      },
    ].concat(
      EchartRoutes.map(
        (example) => ({
          path: example.route,
          component: example.component,
        })
      ),
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
