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
      display: true
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

    return (
      <div className="container-fluid">
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
          <h1> No Time Series Values available for this dataset </h1>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  date: state.user.date,
  authData: state.user.data
});

export default connect(mapStateToProps)(Detail);
