import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';
import PetriNetBuilder from './containers/PetriNetBuilder';
import EchartsRoutes from './EchartsRoutes';
import AllCharts from './components/AllCharts';

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
