import * as constants from "../constants";

export const date = data => dispatch => {
  dispatch({
    type: constants.CHANGING_DATE,
    payload: data.date
  });
};
