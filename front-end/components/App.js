import React from "react";
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Link,
  Redirect
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
import Detail from "./Detail";

import Table from "./Table";
import LoginComponent from "./Login";
import DateComponent from "./DateComponent";
import UnitComponent from "./UnitComponent";
import AreaComponent from "./areaComponent";

import RegisterComponent from "./Register";
import Alert from "./Alert";

const Login = userIsNotAuthenticatedRedir(LoginComponent);
const ProtectedMap = userIsAuthenticatedRedir(Map);
const ProtectedDetail = userIsAuthenticatedRedir(Detail);
const ProtectedTable = userIsAuthenticatedRedir(Table);
const ProtectedAlert = userIsAuthenticatedRedir(Alert);

const LoginOnlyNav = userIsAuthenticated(({ user, logout }) => (
  <nav className="navbar">
    <LinkContainer to="/">
      <div className="navbar-brand">
        <a className="navbar-item">VFIS</a>
      </div>
    </LinkContainer>
    <div className="navbar-menu">
      <div className="navbar-start">
        {user.area == "VA" ? (
          <div className="nav-item">
            <DateComponent />
          </div>
        ) : null}
        <LinkContainer to="/">
          <a className="navbar-item">Map</a>
        </LinkContainer>
        {user.area == "VA" ? (
          <LinkContainer to="/table">
            <a className="navbar-item">Table</a>
          </LinkContainer>
        ) : null}
        {user.area == "VA" ? (
          <div className="navbar-item has-dropdown is-hoverable">
            <p className="navbar-link">Utilities</p>
            <div className="navbar-dropdown is-boxed">
              <a className="navbar-item" href={"/api/kml/" + user.date}>
                Download KML
              </a>
            </div>
          </div>
        ) : null}
      </div>
      <div className="navbar-end">
        <div className="navbar-item is-right">
          Area: <AreaComponent />
        </div>
        <div className="navbar-item is-right">
          <UnitComponent />
        </div>
        <div className="navbar-item has-dropdown is-hoverable is-right">
          <span className="navbar-link">
            <i className="fas fa-user" />
          </span>
          <div className="navbar-dropdown is-boxed is-right">
            <LinkContainer to="/alert">
              <a className="navbar-item">Register for Alerts</a>
            </LinkContainer>
            <a className="navbar-item" onClick={() => logout()}>
              Logout
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
));

function App({ user, logout }) {
  return (
    <Router>
      <div>
        <LoginOnlyNav user={user} logout={logout} />
        <div>
          <Route exact path="/" component={ProtectedMap} />
          <Route exact path="/table" component={ProtectedTable} />
          <Route exact path="/alert" component={ProtectedAlert} />
          <Route path="/timeseries/:id" component={ProtectedDetail} />

          <Route path="/login" component={Login} />
          <Route
            exact
            path="/register"
            render={() =>
              user.data != null ? <Redirect to="/" /> : <RegisterComponent />
            }
          />
        </div>
      </div>
    </Router>
  );
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(
  mapStateToProps,
  { logout }
)(App);
