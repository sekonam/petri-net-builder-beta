import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';
import EchartRoutes from 'components/echart/EchartRoutes';
import { EchartTesterSample } from 'containers/EchartTester';

export default () => ({
  indexRoute: '/',
  getChildRoutes: (location, cb) => {
    const childRoutes = [
      {
        path: '/',
        component: Home,
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
