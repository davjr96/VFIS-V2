import React, { Component } from "react";
import PropTypes from "prop-types";

import "whatwg-fetch";
import Select from "react-select";
import moment from "moment";
import { date } from "../actions/date";
import { connect } from "react-redux";

class DateComponent extends Component {
  static propTypes = {
    date: PropTypes.func.isRequired
  };

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
          date: json.dates[0][0]
        });
        this.props.date({
          date: json.dates[0][0]
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
    this.props.date({
      date: this.state.dates[e.value][0]
    });
    this.setState({
      date: this.state.dates[e.value][0],
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
      <div>
        <Select
          className="form-inline nav-select"
          value={this.state.selected}
          options={options}
          onChange={e => this.handleChange(e)}
        />
      </div>
    );
  }
}

export default connect(null, { date })(DateComponent);
