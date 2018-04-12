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
            response.json().then(
              function(data) {
                this.props.login({
                  token: data.token
                });
              }.bind(this)
            );
          } else {
            this.setState({
              notification: true,
              notificationText: "The username or password is incorrect.",
              notificationType: "notification is-danger"
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
      <section className="hero is-success is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <div className="column is-4 is-offset-4">
              <h3 className="title has-text-grey">Login</h3>
              <p className="subtitle has-text-grey">Please login to proceed.</p>
              <div className="box">
                {this.state.notification ? (
                  <div className={type}>{message}</div>
                ) : null}
                <form onSubmit={this.loginFunc} method="post">
                  <div className="field">
                    <div className="control">
                      <input
                        className="input is-large"
                        name="email"
                        type="email"
                        ref="email"
                        id="inputEmail"
                        placeholder="Email address"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <input
                        className="input is-large"
                        name="item"
                        type="password"
                        ref="password"
                        id="inputPassword"
                        placeholder="Password"
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <div className="control">
                      <button className="button is-block is-info is-large is-fullwidth">
                        Login
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <p className="has-text-grey">
                <LinkContainer to="/register">
                  <a>Register</a>
                </LinkContainer>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default connect(null, { login })(LoginContainer);
