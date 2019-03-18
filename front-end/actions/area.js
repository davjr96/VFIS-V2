import * as constants from "../constants";

export const area = data => dispatch => {
  dispatch({
    type: constants.CHANGING_AREA,
    payload: data.area
  });
};
