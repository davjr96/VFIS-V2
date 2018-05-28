import React, { Component } from "react";
import { connect } from "react-redux";
import base64 from "base-64";
import moment from "moment";
import { withRouter } from "react-router-dom";
import createReactClass from "create-react-class";
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
    this.loadBridge = this.loadBridge.bind(this);

    this.state = {
      series: [],
      display: false,
      construction: {}
    };
  }

  loadtimeseries(date, construction) {
    const { units } = this.props;

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
            return [{ x: 0, y: 0, roadelev: 0 }];
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

  loadBridge(date, construction) {
    let headers = new Headers();

    headers.append(
      "Authorization",
      "Basic " + base64.encode(this.props.authData.token + ":x")
    );

    fetch("/api/bridges/" + date + "?construction=" + construction, {
      method: "GET",
      headers: headers
    })
      .then(function(response) {
        return response.json();
      })
      .then(json => {
        this.setState({
          construction: json
        });
      })
      .catch(function(ex) {
        console.log("parsing failed", ex);
      });
  }

  componentDidMount() {
    this.loadBridge(this.props.date, this.props.match.params.id);
    this.loadtimeseries(this.props.date, this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.loadBridge(nextProps.date, nextProps.match.params.id);
    this.loadtimeseries(nextProps.date, nextProps.match.params.id);
  }

  render() {
    const { units } = this.props;

    const display = this.state.display;
    const info = this.state.construction;
    const roadelev = (parseFloat(info.roadelev) || 0) * parseFloat(units);
    const maxwl = (parseFloat(info.maxwl) || 0) * parseFloat(units);
    const rawdata = this.state.series;
    let data = [];
    rawdata.forEach(i => {
      let y = (parseFloat(i.y) || 0) * parseFloat(units);
      let roadelev = (parseFloat(i.roadelev) || 0) * parseFloat(units);
      data.push({ x: i.x, y: y, roadelev: roadelev });
    });
    const max = Math.max(...data.map(i => i.y));
    const min = Math.min(...data.map(i => i.y));
    let breakpoint = 0;
    let off = 0;

    const gradientOffset = () => {
      if (max <= roadelev) {
        return 0;
      } else {
        let bottomofGraph = Math.min(max, roadelev) - 0.5 * units;
        return 1 - (roadelev - bottomofGraph) / (max - bottomofGraph);
      }
    };

    off = gradientOffset();

    const CustomizedAxisTick = createReactClass({
      render() {
        const { x, y, stroke, payload } = this.props;

        return (
          <g transform={`translate(${x},${y})`}>
            <text
              x={0}
              y={0}
              dy={16}
              textAnchor="end"
              fill="#666"
              transform="rotate(-45)"
            >
              {moment
                .utc(payload.value, "YYYYMMDD-HHmmss")
                .local()
                .format("MMMM Do YYYY, h:mm a")}
            </text>
          </g>
        );
      }
    });

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
                <td>Bridge Elevation: </td>
                <td>{(parseFloat(info.roadelev) || 0) * parseFloat(units)} </td>
              </tr>
              <tr>
                <td>
                  <b>Forecasted Overtopping Results from Model</b>
                </td>
              </tr>
              <tr>
                <td>Maximum Water Level:</td>
                <td> {(parseFloat(info.maxwl) || 0) * parseFloat(units)}</td>
              </tr>
              <tr>
                <td>Bridge Overtopped by:</td>
                <td>
                  {(parseFloat(info.floodedby) || 0) * parseFloat(units)}{" "}
                </td>
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
          <h1 className="title">Expected Bridge Deck Condition</h1>
        </div>
        {display ? (
          <ResponsiveContainer width="95%" height={500}>
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 30, left: 50, bottom: 120 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset={off} stopColor="red" stopOpacity={1} />
                  <stop offset={off} stopColor="#8884d8" stopOpacity={1} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="x"
                domain={["auto", "auto"]}
                name="Time"
                tick={<CustomizedAxisTick />}
                interval={10}
              />
              <YAxis
                domain={[
                  Math.min(maxwl, roadelev) - 0.5 * units,
                  Math.max(maxwl, roadelev) + 0.5 * units
                ]}
              />

              <CartesianGrid strokeDasharray="3 3" />
              <Legend verticalAlign="top" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="y"
                stroke="#000"
                fill="url(#colorUv)"
                name="Water Level"
              />
              <Line
                type="monotone"
                dataKey="roadelev"
                dot={false}
                stroke="#000000"
                strokeWidth={5}
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
  units: state.user.units,
  authData: state.user.data
});

export default withRouter(connect(mapStateToProps)(Detail));
