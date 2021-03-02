import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ApolloError from '../components/common/errors/apollo-error';
import Header from '../components/common/headers/header';
import { useMe } from '../hooks/useMe';
import NotFound from '../pages/404';
import Category from '../pages/client/category';
import RestaurantDetail from '../pages/client/restaurant-detail';
import Restaurants from '../pages/client/restaurants';
import Search from '../pages/client/search';
import DashBoardPage from '../pages/delivery/dashboard';
import OrderPage from '../pages/order';
import CreateDish from '../pages/owner/create-dish';
import CreateRestuarnt from '../pages/owner/create-restaurant';
import MyRestaurant from '../pages/owner/my-restaurant';
import MyRestaurants from '../pages/owner/my-restaurants';
import ConfirmEmail from '../pages/user/confirm-email';
import UpdateAccount from '../pages/user/update-account';
import { UserRole } from '../__generated__/globalTypes';

interface IRouteProps {
  path: string;
  component: JSX.Element;
  exact?: boolean;
}

const commonRoutes: IRouteProps[] = [
  {
    path: '/confirm-email',
    component: <ConfirmEmail />,
    exact: true,
  },
  {
    path: '/update-account',
    component: <UpdateAccount />,
    exact: true,
  },
  {
    path: '/order/:id',
    component: <OrderPage />,
    exact: true,
  },
];

const clientRoutes: IRouteProps[] = [
  {
    path: '/',
    component: <Restaurants />,
    exact: true,
  },
  {
    path: '/restaurant-detail/:id',
    component: <RestaurantDetail />,
    exact: true,
  },
  {
    path: '/search',
    component: <Search />,
    exact: true,
  },
  {
    path: '/category',
    component: <Category />,
    exact: true,
  },
];

const ownerRoutes: IRouteProps[] = [
  {
    path: '/',
    component: <MyRestaurants />,
    exact: true,
  },
  {
    path: '/restaurant-detail/:id',
    component: <MyRestaurant />,
    exact: true,
  },
  {
    path: '/create-restaurant',
    component: <CreateRestuarnt />,
    exact: true,
  },
  {
    path: '/restaurant-detail/:id/create-dish',
    component: <CreateDish />,
    exact: true,
  },
];

const deliveryRoutes: IRouteProps[] = [
  {
    path: '/',
    component: <DashBoardPage />,
    exact: true,
  },
];

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
      <Switch>
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact={route.exact}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          ownerRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact={route.exact}>
              {route.component}
            </Route>
          ))}
        {data.me.role === UserRole.Delivery &&
          deliveryRoutes.map((route) => (
            <Route key={route.path} path={route.path} exact={route.exact}>
              {route.component}
            </Route>
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} exact={route.exact}>
            {route.component}
          </Route>
        ))}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default LoggedInRouter;
