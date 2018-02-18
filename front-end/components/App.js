import React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link
} from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions/user";
import {
  userIsAuthenticatedRedir,
  userIsNotAuthenticatedRedir,
  userIsAdminRedir,
  userIsAuthenticated,
  userIsNotAuthenticated
} from "../auth";

import Map from "./Map";
import Table from "./Table";
import LoginComponent from "./Login";
import DateComponent from "./DateComponent";

const Login = userIsNotAuthenticatedRedir(LoginComponent);
const ProtectedMap = userIsAuthenticatedRedir(Map);
const ProtectedTable = userIsAuthenticatedRedir(Table);

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
          <Route exact path="/" component={ProtectedMap} />
          <Route exact path="/table" component={ProtectedTable} />

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
