import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';
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
/*      {
        path: 'echarts',
        component: EchartTesterSample,
      },*/
      {
        path: '*',
        status: 404,
        component: NotFound,
      },
    ];
    childRoutes.push();
    cb(null, childRoutes);
  },
  component: App,
});
