import App from 'containers/App';
import NotFound from 'containers/NotFound';
import Home from 'containers/Home';
import PetriNetBuilder from 'containers/PetriNetBuilder';

export default () => ({
  indexRoute: '/cpn-builder',
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
    ];
    childRoutes.push();
    cb(null, childRoutes);
  },
  component: App,
});
