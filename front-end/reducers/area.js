import * as constants from "../constants";
const initialState = {
  area: "VA"
};

export default function unitUpdate(state = initialState, { type, payload }) {
  switch (type) {
    case constants.CHANGING_AREA:
      return { ...state, area: payload };

    default:
      return state;
  }
}
