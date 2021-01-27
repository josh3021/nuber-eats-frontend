import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ApolloError from '../components/common/errors/apollo-error';
import Header from '../components/common/headers/header';
import { useMe } from '../hooks/useMe';
import NotFound from '../pages/404';
import Category from '../pages/client/category';
import RestaurantDetail from '../pages/client/restaurant-detail';
import Restaurants from '../pages/client/restaurants';
import Search from '../pages/client/search';
import ConfirmEmail from '../pages/user/confirm-email';
import UpdateAccount from '../pages/user/update-account';
import { UserRole } from '../__generated__/globalTypes';

function LoggedInRouter() {
  const { data, loading, error } = useMe();
  if (!data || loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  if (error) {
    return <ApolloError errorMessage={error.message} />;
  }
  return (
    <Router>
      <Header />
      <Switch key="client">
        {data.me.role === UserRole.Client && ClientRoutes}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

const ClientRoutes = [
  <Route key="/" exact path="/">
    <Restaurants />
  </Route>,
  <Route key="/restaurant-detail" exact path="/restaurant-detail/:id">
    <RestaurantDetail />
  </Route>,
  <Route key="/confirm-email" exact path="/confirm-email">
    <ConfirmEmail />
  </Route>,
  <Route key="/update-account" exact path="/update-account">
    <UpdateAccount />
  </Route>,
  <Route key="/search" exact path="/search">
    <Search />
  </Route>,
  <Route key="/category" exact path="/category/:slug">
    <Category />
  </Route>,
];

export default LoggedInRouter;
