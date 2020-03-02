import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import {
  handleAuthentication,
  checkAuth,
  login,
  logout,
  EXPIRES_IN,
  ID_TOKEN,
  ACCESS_TOKEN
} from "./utils/auth0-helper";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import { createBrowserHistory } from "history";
const PRIVATE_ENDPOINT =
  "https://h9gqunf6y7.execute-api.us-west-2.amazonaws.com/dev/api/private";

// const checkAuth = () => {
//   lock.checkSession({ scope: "read:order write:order" }, function(
//     error,
//     authResult
//   ) {
//     if (error || !authResult) {
//       console.log("error checking auth", error);
//       lock.show();
//     } else {
//       // user has an active session, so we can use the accessToken directly.
//       lock.getUserInfo(authResult.accessToken, function(error, profile) {
//         console.log(error, profile);
//         console.log("authResult", authResult);
//       });
//     }
//   });
// };

const App = props => {
  useEffect(() => {
    // webAuth.authorize();
    console.log("expires in ? ", localStorage.getItem(EXPIRES_IN));

    handleAuthentication(() => history.push("/"));
  }, []);

  useEffect(() => {
    checkAuth(() => history.push("/"));
  });

  const fetchPrivate = () => {
    const token = localStorage.getItem(ID_TOKEN);
    console.log("token present?", token);
    fetch(PRIVATE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log("Token:", data);
      })
      .catch(e => {
        console.log("error", e);
      });
  };
  const history = createBrowserHistory();
  console.log("props", props);
  return (
    <Router>
      <Route path="/">
        <button onClick={() => login(() => history.push("/"))}>Login</button>
        <button onClick={() => fetchPrivate()}>Fetch</button>
        <button onClick={() => logout()}>Logout</button>
        <button onClick={() => checkAuth(res => console.log("res", res))}>
          Check
        </button>
      </Route>
    </Router>
  );
};

export default App;
