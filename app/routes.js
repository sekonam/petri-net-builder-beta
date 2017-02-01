import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';

export default () => ({
  indexRoute: '/',
  getChildRoutes: (location, cb) => {
    const childRoutes = [
      {
        path: '/',
        component: Home,
      },
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
