/*This is the main file of our website.
It has two main purposes, to handle the routing/display of all other components
and populate the dropdown bar with all data sets
*/
import React, { Component } from "react";
import "./App.css";
import "whatwg-fetch";
import Select from "react-select";
import "react-select/dist/react-select.css";
import moment from "moment";
import { BrowserRouter, Link, Route } from "react-router-dom";
import Map from "./Map";
import TableView from "./Table";
class App extends Component {
  constructor(props) {
    super(props);
    this.loadDates = this.loadDates.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      date: "",
      selected: 0,
      dates: []
    };
  }
  //This function loads the dates of the data sets
  loadDates() {
    fetch("/api/dates")
      .then(function(response) {
        return response.json();
      })
      .then(json => {
        this.setState({
          dates: json.dates,
          date: json.dates[0]
        });
      })
      .catch(function(ex) {
        console.log("parsing failed", ex);
      });
  }

  componentDidMount() {
    this.loadDates();
  }

  //When a different date is selected, update the state to the selected date
  handleChange(e) {
    this.setState({
      date: this.state.dates[e.value],
      selected: e.value
    });
  }

  render() {
    //Add all dates to the dropdown bar correctly formatted
    var options = [];
    for (var j = 0; j < this.state.dates.length; j++) {
      options.push({
        value: j,
        label: moment
          .utc(this.state.dates[j], "YYYYMMDD-HHmmss")
          .local()
          .format("MMMM Do YYYY, h a")
      });
    }

    return (
      <BrowserRouter>
        <div>
          <div className="App">
            <nav className="navbar navbar-dark bg-primary">
              <Link className="navbar-item btn-light btn" to="/">
                Map
              </Link>
              <Link className="navbar-item btn-light btn" to="/table">
                Table
              </Link>
              <Select
                className="form-inline nav-select"
                value={this.state.selected}
                options={options}
                onChange={e => this.handleChange(e)}
              />
            </nav>
          </div>
          <div>
            <Route
              exact
              path="/"
              render={() => <Map date={this.state.date} />}
            />
            <Route
              exact
              path="/table"
              render={() => <TableView date={this.state.date} />}
            />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
