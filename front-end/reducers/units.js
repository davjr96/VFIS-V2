import * as constants from "../constants";
const initialState = {
  units: 3.28084
};

export default function unitUpdate(state = initialState, { type, payload }) {
  switch (type) {
    case constants.CHANGING_UNITS:
      return { ...state, units: payload };

    default:
      return state;
  }
}
