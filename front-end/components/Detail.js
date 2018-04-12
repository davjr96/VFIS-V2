import React, { Component } from "react";
import { connect } from "react-redux";
import base64 from "base-64";
import "../node_modules/react-vis/dist/style.css";
import moment from "moment";

import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Area,
  linearGradient,
  ComposedChart,
  Line,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import "whatwg-fetch";

class Detail extends Component {
  constructor(props) {
    super(props);
    this.loadtimeseries = this.loadtimeseries.bind(this);
    this.state = {
      series: [],
      display: true,
      construction: {}
    };
  }

  loadtimeseries(date, construction) {
    let headers = new Headers();

    headers.append(
      "Authorization",
      "Basic " + base64.encode(this.props.authData.token + ":x")
    );

    fetch("/api/timeseries?date=" + date + "&construction=" + construction, {
      method: "GET",
      headers: headers
    })
      .then(
        function(response) {
          if (response.status == 200) {
            this.setState({ display: true });
            return response.json();
          } else {
            this.setState({ display: false });
          }
        }.bind(this)
      )
      .then(json => {
        this.setState({
          series: json
        });
      })
      .catch(function(ex) {
        console.log("parsing failed", ex);
      });
  }

  componentDidMount() {
    const { info } = this.props.location.state;
    console.log(info);
    this.setState({
      construction: info
    });
    this.loadtimeseries(
      this.props.date,
      this.props.location.pathname.split("/")[2]
    );
  }

  componentWillReceiveProps(nextProps) {
    this.loadtimeseries(
      nextProps.date,
      nextProps.location.pathname.split("/")[2]
    );
  }
  render() {
    const display = this.state.display;
    const info = this.state.construction;
    return (
      <section className="section">
        <div className="container has-text-centered	">
          <h1 className="title"> {info.roadname}</h1>
        </div>

        <div className="container">
          <table className="table is-narrow">
            <tbody>
              <tr>
                <td>Stream Crossed: </td>
                <td> {info.stream}</td>
              </tr>
              <tr>
                <td>Bridge Elevation (m): </td>
                <td> {info.roadelev} </td>
              </tr>
              <tr>
                <td>
                  <b>Forecasted Overtopping Results from Model</b>
                </td>
              </tr>
              <tr>
                <td>Maximum Water Level (m):</td>
                <td> {info.maxwl}</td>
              </tr>
              <tr>
                <td>Bridge Overtopped by (m):</td>
                <td> {info.floodedby} </td>
              </tr>
              <tr>
                <td>Overtopping Starting Date/Time:</td>
                <td>{info.start_date} </td>
              </tr>
              <tr>
                <td>Overtopping Ending Date/Time:</td>
                <td> {info.end_date} </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="container has-text-centered	">
          <h1 className="title"> Time Series Graph</h1>
        </div>
        {display ? (
          <ResponsiveContainer width="95%" height={500}>
            <ComposedChart data={this.state.series}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="x"
                domain={["auto", "auto"]}
                name="Time"
                tickFormatter={unixTime =>
                  moment
                    .utc(unixTime, "YYYYMMDD-HHmmss")
                    .local()
                    .format("MMMM Do YYYY, h a")
                }
              />
              <YAxis domain={["auto", "auto"]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend verticalAlign="top" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="y"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorUv)"
                name="Water Level"
              />
              <Line
                type="monotone"
                dataKey="roadelev"
                dot={false}
                stroke="#ff0000"
                name="Road Elevation"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="container">
            <div className="notification">
              <article className="message is-primary is-danger">
                <div className="message-body">
                  <h1> No Time Series Values available for this dataset </h1>
                </div>
              </article>
            </div>
          </div>
        )}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  date: state.user.date,
  authData: state.user.data
});

export default connect(mapStateToProps)(Detail);
