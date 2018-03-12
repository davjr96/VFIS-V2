import * as constants from "../constants";
const initialState = {
  date: null
};

export default function dateUpdate(state = initialState, { type, payload }) {
  switch (type) {
    case constants.CHANGING_DATE:
      return { ...state, date: payload };

    default:
      return state;
  }
}
