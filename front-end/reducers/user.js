import * as constants from "../constants";

const initialState = {
  data: null,
  isLoading: false,
  date: null
};

export default function userUpdate(state = initialState, { type, payload }) {
  switch (type) {
    case constants.USER_LOGGING_IN:
      return { ...initialState, isLoading: true };
    case constants.USER_LOGGED_IN:
      return { ...state, data: payload, isLoading: false };
    case constants.CHANGING_DATE:
      return { ...state, date: payload };
    case constants.USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
}
