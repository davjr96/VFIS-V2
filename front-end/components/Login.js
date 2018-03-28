import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../actions/user";
import { LinkContainer } from "react-router-bootstrap";
import base64 from "base-64";

export class LoginContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.loginFunc = this.loginFunc.bind(this);

    this.state = {
      notification: false,
      notificationText: "",
      notificationType: ""
    };
  }

  loginFunc(e) {
    e.preventDefault();
    let headers = new Headers();

    headers.append(
      "Authorization",
      "Basic " +
        base64.encode(
          this.refs.email.value.toLowerCase() + ":" + this.refs.password.value
        )
    );

    fetch("/api/login", {
      method: "GET",
      headers: headers
    })
      .then(
        function(response) {
          if (response.status == 200) {
            this.props.login({
              user: this.refs.email.value.toLowerCase(),
              pass: this.refs.password.value
            });
          } else {
            this.setState({
              notification: true,
              notificationText: "The username or password is incorrect.",
              notificationType: "alert alert-danger"
            });
          }
        }.bind(this)
      )
      .catch(function(ex) {
        console.log(ex);
      });
  }

  render() {
    const message = this.state.notificationText;
    const type = this.state.notificationType;
    return (
      <div className="container form-signin-div">
        {this.state.notification ? (
          <div className={type} role="alert">
            {message}
          </div>
        ) : null}
        <form className="form-signin" onSubmit={this.loginFunc} method="post">
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
          <button className="btn btn-lg btn-primary btn-block">Login</button>
          <LinkContainer to="/register">
            <a>Register</a>
          </LinkContainer>
        </form>
      </div>
    );
  }
}
export default connect(null, { login })(LoginContainer);
