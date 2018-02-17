import * as constants from "../constants";
var base64 = require("base-64");

export const login = data => dispatch => {
  let headers = new Headers();

  headers.append(
    "Authorization",
    "Basic " + base64.encode(data.user + ":" + data.pass)
  );

  fetch("/api/login", {
    method: "GET",
    headers: headers
  })
    .then(function(response) {
      return response.json();
    })
    .then(json => {
      if (json.status == "OK")
        dispatch({
          type: constants.USER_LOGGED_IN,
          payload: data
        });
      else {
        alert(json.status);
        return {
          type: constants.USER_LOGGED_OUT
        };
      }
    })
    .catch(function(ex) {
      console.log("parsing failed", ex);
    });
};

export function logout() {
  return {
    type: constants.USER_LOGGED_OUT
  };
}
