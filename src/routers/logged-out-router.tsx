import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import NotFound from '../pages/404';
import CreateAccount from '../pages/create-account';
import Login from '../pages/login';

function LoggedOutRouter() {
  return (
    <Router>
      <Switch>
        <Route exact path="/create-account">
          <CreateAccount />
        </Route>
        <Route exact path="/">
          <Login />
        </Route>
        <Route>
          <NotFound />
        </Route>
        <Redirect to="/login" />
      </Switch>
    </Router>
  );
}

export default LoggedOutRouter;
