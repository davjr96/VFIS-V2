import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../actions/user";

export class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  };

  onClick = e => {
    e.preventDefault();
    this.props.login({
      user: this.refs.email.value.toLowerCase(),
      pass: this.refs.password.value
    });
  };

  render() {
    return (
      <div className="container form-signin-div">
        <form className="form-signin">
          <h2 className="form-signin-heading">Please sign in</h2>
          <label htmlFor="inputEmail" className="sr-only">
            Email address
          </label>
          <input
            className="input"
            name="email"
            type="email"
            ref="email"
            id="inputEmail"
            className="form-control"
            placeholder="Email address"
            required
            autoFocus
          />
          <label htmlFor="inputPassword" className="sr-only">
            Password
          </label>
          <input
            className="input"
            name="item"
            type="password"
            ref="password"
            id="inputPassword"
            className="form-control"
            placeholder="Password"
            required
          />
          <button
            className="btn btn-lg btn-primary btn-block"
            onClick={this.onClick}
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}
export default connect(null, { login })(LoginContainer);
