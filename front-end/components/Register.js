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
              notificationType: "alert alert-danger"
            });
          } else if (data.status == 400) {
            this.setState({
              notification: true,
              notificationText: "The email is already registered.",
              notificationType: "alert alert-danger"
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
        <div className="container form-signin-div">
          {this.state.notification ? (
            <div className={type} role="alert">
              {message}
            </div>
          ) : null}

          <form
            className=" form-horizontal form-register well"
            onSubmit={this.registerFunc}
            method="post"
          >
            <div className="form-group row margin-bottom required">
              <label className="col-sm-4 col-form-label">Access Code</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon10">
                      <i className="fa fa-key" />
                    </span>
                  </div>
                  <input
                    name="access"
                    type="text"
                    ref="access"
                    id="inputaccess"
                    className="form-control"
                    aria-label="access"
                    aria-describedby="basic-addon10"
                    placeholder="Access"
                    required
                    autoFocus
                  />
                  <p id="basic-addon10" className="text-muted  .form-text">
                    This is provided by the website creators.
                  </p>
                </div>
              </div>
            </div>
            <div className="form-group row margin-bottom required">
              <label className="col-sm-4 col-form-label">Email</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon0">
                      <i className="fa fa-envelope" />
                    </span>
                  </div>
                  <input
                    name="email"
                    type="email"
                    ref="email"
                    id="inputemail"
                    className="form-control"
                    aria-label="Email"
                    aria-describedby="basic-addon0"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom required">
              <label className="col-sm-4 col-form-label ">Password</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon00">
                      <i className="fa fa-key" />
                    </span>
                  </div>
                  <input
                    name="password"
                    type="password"
                    ref="password"
                    id="inputpassword"
                    className="form-control"
                    aria-label="Password"
                    aria-describedby="basic-addon00"
                    placeholder="Password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom required">
              <label className="col-sm-4 col-form-label">First Name</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="fa fa-user" />
                    </span>
                  </div>
                  <input
                    name="first"
                    type="text"
                    ref="first"
                    id="inputFirst"
                    className="form-control"
                    aria-label="First Name"
                    aria-describedby="basic-addon1"
                    placeholder="First Name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom required">
              <label className="col-sm-4 col-form-label">Last Name</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon2">
                      <i className="fa fa-user" />
                    </span>
                  </div>
                  <input
                    name="last"
                    type="text"
                    ref="last"
                    id="inputLast"
                    className="form-control"
                    aria-label="Last Name"
                    aria-describedby="basic-addon2"
                    placeholder="Last Name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom">
              <label className="col-sm-4 col-form-label">Middle Name</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon3">
                      <i className="fa fa-user" />
                    </span>
                  </div>
                  <input
                    name="middle"
                    type="text"
                    ref="middle"
                    id="inputmiddle"
                    className="form-control"
                    aria-label="Middle Name"
                    aria-describedby="basic-addon3"
                    placeholder="Middle Name"
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom">
              <label className="col-sm-4 col-form-label">Organization</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon4">
                      <i className="fa fa-building" />
                    </span>
                  </div>
                  <input
                    name="org"
                    type="text"
                    ref="org"
                    id="inputorg"
                    className="form-control"
                    aria-label="Organization"
                    aria-describedby="basic-addon4"
                    placeholder="Organization"
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom">
              <label className="col-sm-4 col-form-label">Title</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon5">
                      <i className="fa fa-user" />
                    </span>
                  </div>
                  <input
                    name="title"
                    type="text"
                    ref="title"
                    id="inputtitle"
                    className="form-control"
                    aria-label="Title"
                    aria-describedby="basic-addon5"
                    placeholder="Title"
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom">
              <label className="col-sm-4 col-form-label">Subject Area</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon6">
                      <i className="fa fa-book" />
                    </span>
                  </div>
                  <input
                    name="subject"
                    type="text"
                    ref="subject"
                    id="inputsubject"
                    className="form-control"
                    aria-label="Subject Area"
                    aria-describedby="basic-addon6"
                    placeholder="Subject Area"
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom">
              <label className="col-sm-4 col-form-label">Country</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon7">
                      <i className="fa fa-globe" />
                    </span>
                  </div>
                  <input
                    name="country"
                    type="text"
                    ref="country"
                    id="inputcountry"
                    className="form-control"
                    aria-label="Country"
                    aria-describedby="basic-addon7"
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom">
              <label className="col-sm-4 col-form-label">State/Province</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon8">
                      <i className="fa fa-globe" />
                    </span>
                  </div>
                  <input
                    name="state"
                    type="text"
                    ref="state"
                    id="inputstate"
                    className="form-control"
                    aria-label="State/Province"
                    aria-describedby="basic-addon8"
                    placeholder="State/Province"
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom">
              <label className="col-sm-4 col-form-label">Phone</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon9">
                      <i className="fa fa-phone" />
                    </span>
                  </div>
                  <input
                    name="phone"
                    type="text"
                    ref="phone"
                    id="inputphone"
                    className="form-control"
                    aria-label="Phone"
                    aria-describedby="basic-addon9"
                    placeholder="Phone"
                  />
                </div>
              </div>
            </div>

            <div className="form-group row margin-bottom">
              <label className="col-sm-4 col-form-label">Website</label>
              <div className="col-sm-8">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon9">
                      <i className="fa fa-internet-explorer" />
                    </span>
                  </div>
                  <input
                    name="website"
                    type="text"
                    ref="website"
                    id="inputwebsite"
                    className="form-control"
                    aria-label="Website"
                    aria-describedby="basic-addon9"
                    placeholder="Website"
                  />
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-md-4 control-label" />
              <div className="col-md-4">
                <button className="btn btn-lg btn-primary btn-block">
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default connect(null, { login })(RegisterContainer);
