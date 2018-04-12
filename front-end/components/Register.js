import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../actions/user";

import "whatwg-fetch";

export class RegisterContainer extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.registerFunc = this.registerFunc.bind(this);
    this.state = {
      notification: false,
      notificationText: "",
      notificationType: ""
    };
  }

  registerFunc(e) {
    e.preventDefault();
    var user = {};
    user["email"] = this.refs.email.value;
    user["access"] = this.refs.access.value;

    user["password"] = this.refs.password.value;
    user["first_name"] = this.refs.first.value;
    user["middle_name"] = this.refs.middle.value;
    user["last_name"] = this.refs.last.value;
    user["organization"] = this.refs.org.value;
    user["title"] = this.refs.title.value;
    user["subject_areas"] = this.refs.subject.value;
    user["country"] = this.refs.country.value;
    user["state_province"] = this.refs.state.value;
    user["phone_number"] = this.refs.phone.value;
    user["website"] = this.refs.website.value;
    fetch("/api/user", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
      .then(
        function(data) {
          if (data.status == 201) {
            data.json().then(
              function(response) {
                this.props.login({
                  token: response.token
                });
              }.bind(this)
            );
          } else if (data.status == 401) {
            this.setState({
              notification: true,
              notificationText: "The access code is incorrect.",
              notificationType: "notification is-danger"
            });
          } else if (data.status == 400) {
            this.setState({
              notification: true,
              notificationText: "The email is already registered.",
              notificationType: "notification is-danger"
            });
          }
        }.bind(this)
      )
      .catch(function(error) {
        console.log("Request failure: ", error);
      });
  }
  render() {
    const message = this.state.notificationText;
    const type = this.state.notificationType;

    return (
      <div>
        <section className="hero is-success is-fullheight">
          <div className="hero-body">
            <div className="container has-text-centered">
              <div className="column is-6 is-offset-3">
                <div className="box">
                  {this.state.notification ? (
                    <div className={type}>{message}</div>
                  ) : null}

                  <form onSubmit={this.registerFunc} method="post">
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Access Code</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control is-expanded has-icons-left">
                            <input
                              name="access"
                              type="text"
                              ref="access"
                              id="inputaccess"
                              className="input is-info"
                              aria-label="access"
                              aria-describedby="basic-addon10"
                              placeholder="Access Code"
                              required
                              autoFocus
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-key" />
                            </span>
                          </p>
                          <p className="help">
                            This is provided by the website creators.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Email</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="email"
                              type="email"
                              ref="email"
                              id="inputemail"
                              className="input is-info"
                              aria-label="Email"
                              aria-describedby="basic-addon0"
                              placeholder="Email"
                              required
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-envelope" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Password</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="password"
                              type="password"
                              ref="password"
                              id="inputpassword"
                              className="input is-info"
                              aria-label="Password"
                              aria-describedby="basic-addon00"
                              placeholder="Password"
                              required
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-key" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">First Name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="first"
                              type="text"
                              ref="first"
                              id="inputFirst"
                              className="input is-info"
                              aria-label="First Name"
                              aria-describedby="basic-addon1"
                              placeholder="First Name"
                              required
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-user" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Last Name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="last"
                              type="text"
                              ref="last"
                              id="inputLast"
                              className="input is-info"
                              aria-label="Last Name"
                              aria-describedby="basic-addon2"
                              placeholder="Last Name"
                              required
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-user" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Middle Name</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="middle"
                              type="text"
                              ref="middle"
                              id="inputmiddle"
                              className="input"
                              aria-label="Middle Name"
                              aria-describedby="basic-addon3"
                              placeholder="Middle Name"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-user" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Organization</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="org"
                              type="text"
                              ref="org"
                              id="inputorg"
                              className="input"
                              aria-label="Organization"
                              aria-describedby="basic-addon4"
                              placeholder="Organization"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-building" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Title</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="title"
                              type="text"
                              ref="title"
                              id="inputtitle"
                              className="input"
                              aria-label="Title"
                              aria-describedby="basic-addon5"
                              placeholder="Title"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-user" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Subject Area</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="subject"
                              type="text"
                              ref="subject"
                              id="inputsubject"
                              className="input"
                              aria-label="Subject Area"
                              aria-describedby="basic-addon6"
                              placeholder="Subject Area"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-book" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Country</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="country"
                              type="text"
                              ref="country"
                              id="inputcountry"
                              className="input"
                              aria-label="Country"
                              aria-describedby="basic-addon7"
                              placeholder="Country"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-globe" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">State/Province</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="state"
                              type="text"
                              ref="state"
                              id="inputstate"
                              className="input"
                              aria-label="State/Province"
                              aria-describedby="basic-addon8"
                              placeholder="State/Province"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-globe" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Phone</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="phone"
                              type="text"
                              ref="phone"
                              id="inputphone"
                              className="input"
                              aria-label="Phone"
                              aria-describedby="basic-addon9"
                              placeholder="Phone"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-phone" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Website</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control has-icons-left">
                            <input
                              name="website"
                              type="text"
                              ref="website"
                              id="inputwebsite"
                              className="input"
                              aria-label="Website"
                              aria-describedby="basic-addon9"
                              placeholder="Website"
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-internet-explorer" />
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <div className="control">
                        <button className="button is-link  is-block is-info is-large is-fullwidth">
                          Register
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
export default connect(null, { login })(RegisterContainer);
