import React, { Component } from "react";
import { Link } from "react-router-dom";
import base64 from "base-64";
import "whatwg-fetch";
import { connect } from "react-redux";

class BridgeInfo extends Component {
  constructor(props) {
    super(props);
    this.addAlert = this.addAlert.bind(this);
  }

  addAlert(x) {
    let headers = new Headers();

    headers.append(
      "Authorization",
      "Basic " + base64.encode(this.props.authData.token + ":x"),
      ("Content-Type": "application/json")
    );
    fetch("/api/alerts", {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ constructions: x }),
      json: true
    }).then(
      function(response) {
        console.log(response);
      }.bind(this)
    );
  }

  render() {
    const { info, units } = this.props;

    const id = Math.trunc(this.props.info.fedid);
    return (
      <div>
        <h4>{info.roadname}</h4>
        <table className="table is-bordered is-striped is-narrow">
          <tbody>
            <tr>
              <td>Stream Crossed: </td>
              <td> {info.stream}</td>
            </tr>
            <tr>
              <td>
                <b>Forecasted Overtopping Results from Model</b>
              </td>
            </tr>
            <tr>
              <td>Bridge Overtopped by:</td>
              <td> {(parseFloat(info.floodedby) || 0) * parseFloat(units)} </td>
            </tr>
            <tr>
              <td>Overtopping Starting Date/Time:</td>
              <td> Coming Soon </td>
            </tr>
            <tr>
              <td>Overtopping Ending Date/Time:</td>
              <td> Coming Soon </td>
            </tr>
          </tbody>
        </table>
        <Link to={{ pathname: `/timeseries/${id}` }} className="button is-link">
          Details
        </Link>
        <button
          className="button is-link is-pulled-right"
          onClick={e => this.addAlert([id])}
        >
          Register for Email alerts
        </button>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  date: state.user.date,
  units: state.user.units,
  authData: state.user.data
});
export default connect(mapStateToProps)(BridgeInfo);
