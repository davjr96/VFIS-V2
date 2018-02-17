import React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link
} from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/user";
import { LinkContainer } from "react-router-bootstrap";
import {
  userIsAuthenticatedRedir,
  userIsNotAuthenticatedRedir,
  userIsAdminRedir,
  userIsAuthenticated,
  userIsNotAuthenticated
} from "../auth";

import Map from "./Map";
import LoginComponent from "./Login";
import DateComponent from "./DateComponent";

const Login = userIsNotAuthenticatedRedir(LoginComponent);
const Protected = userIsAuthenticatedRedir(Map);

const LoginOnlyNav = userIsAuthenticated(({ logout }) => (
  <nav className="navbar navbar-dark bg-primary">
    <DateComponent />
    <Link className="navbar-item btn-light btn" to="/">
      Map
    </Link>
    <Link className="navbar-item btn-light btn" to="/table">
      Table
    </Link>
    <a className="navbar-item btn-light btn" onClick={() => logout()}>
      Logout
    </a>
  </nav>
));

function App({ user, logout }) {
  return (
    <Router>
      <div>
        <LoginOnlyNav logout={logout} />
        <div>
          <Route exact path="/" component={Protected} />
          <Route path="/login" component={Login} />
        </div>
      </div>
    </Router>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { logout })(App);
