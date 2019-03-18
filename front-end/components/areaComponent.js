import React, { Component } from "react";
import PropTypes from "prop-types";
import Switch from "react-switch";

import { area } from "../actions/area";
import { connect } from "react-redux";

class AreaComponent extends Component {
  static propTypes = {
    area: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    if (props.user.area == "LA") {
      this.state = {
        checked: false
      };
    } else {
      this.state = {
        checked: true
      };
    }
  }

  handleChange(checked) {
    this.setState({ checked });
    console.log(checked);
    this.props.area({
      area: checked ? "VA" : "LA"
    });
  }

  render() {
    return (
      <label htmlFor="icon-switch">
        <Switch
          checked={this.state.checked}
          onChange={this.handleChange}
          uncheckedIcon={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 15,
                paddingRight: 2
              }}
            >
              LA
            </div>
          }
          checkedIcon={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                fontSize: 15,
                paddingRight: 2
              }}
            >
              VA
            </div>
          }
          className="react-switch"
          id="icon-switch"
        />
      </label>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user
});
export default connect(
  mapStateToProps,
  { area }
)(AreaComponent);
