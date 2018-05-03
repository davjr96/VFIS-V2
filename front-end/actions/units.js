import * as constants from "../constants";

export const units = data => dispatch => {
  dispatch({
    type: constants.CHANGING_UNITS,
    payload: data.units
  });
};
