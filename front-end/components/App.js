import React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link
} from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
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
  <nav className="navbar navbar-expand-lg navbar-light">
    <LinkContainer to="/">
      <a className="navbar-brand">VFIS</a>
    </LinkContainer>{" "}
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <DateComponent />
        </li>
        <li className="nav-item">
          <LinkContainer to="/">
            <a className=" nav-link">Map</a>
          </LinkContainer>
        </li>

        <li className="nav-item">
          <LinkContainer to="/table">
            <a className=" nav-link">Table</a>
          </LinkContainer>
        </li>
      </ul>
      <a className="nav-item nav-link" onClick={() => logout()}>
        Logout
      </a>
    </div>
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
