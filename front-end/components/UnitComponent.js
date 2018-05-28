import React, { Component } from "react";
import PropTypes from "prop-types";
import Switch from "react-switch";

import { units } from "../actions/units";
import { connect } from "react-redux";

class UnitComponent extends Component {
  static propTypes = {
    units: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    if (props.user.units == 1) {
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
    this.props.units({
      units: checked ? 3.28084 : 1
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
              m.
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
              ft.
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
export default connect(mapStateToProps, { units })(UnitComponent);
