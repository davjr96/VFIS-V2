import React, { Component } from "react";
import PropTypes from "prop-types";

import { units } from "../actions/units";
import { connect } from "react-redux";

class UnitComponent extends Component {
  static propTypes = {
    units: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="switch-field">
        <input
          type="radio"
          id="switch_left"
          name="switch_2"
          value="3.28084"
          onChange={e => {
            this.props.units({
              units: e.target.value
            });
          }}
        />
        <label htmlFor="switch_left">Ft</label>
        <input
          type="radio"
          id="switch_right"
          name="switch_2"
          value="1"
          onChange={e => {
            this.props.units({
              units: e.target.value
            });
          }}
        />
        <label htmlFor="switch_right">m</label>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps, { units })(UnitComponent);
