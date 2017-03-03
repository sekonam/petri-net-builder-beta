import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';
import EchartExamples from 'modules/echart';

export default () => ({
  indexRoute: '/',
  getChildRoutes: (location, cb) => {
    const childRoutes = [
      {
        path: '/',
        component: Home,
      },
    ].concat(
      EchartExamples.map(
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
