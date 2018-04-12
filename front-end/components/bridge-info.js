import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

export default class BridgeInfo extends PureComponent {
  render() {
    const { info } = this.props;
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
              <td>Bridge Overtopped by (m):</td>
              <td> {info.floodedby} </td>
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
      </div>
    );
  }
}
