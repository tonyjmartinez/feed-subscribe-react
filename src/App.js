import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Auth0Lock } from "auth0-lock";

const clientId = process.env.REACT_APP_CLIENT_ID;
console.log("clientId", clientId);
const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const lock = new Auth0Lock(clientId, domain, {
  // eslint-disable-line no-undef

  auth: {
    params: {
      scope: "openid email"
    },
    responseType: "token id_token"
  }
});
const PRIVATE_ENDPOINT =
  "https://h9gqunf6y7.execute-api.us-west-2.amazonaws.com/dev/api/private";

const logout = () => {
  localStorage.removeItem("id_token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
};

function App() {
  useEffect(() => {
    lock.checkSession({}, function(error, authResult) {
      if (error || !authResult) {
        console.log("error", error);
        lock.show();
      } else {
        // user has an active session, so we can use the accessToken directly.
        lock.getUserInfo(authResult.accessToken, function(
          error,
          profileResult
        ) {
          let accessToken = null;
          let profile = null;
          console.log(error, profile);
          accessToken = authResult.accessToken;
          profile = profileResult;
          console.log("accesstoken", accessToken);
          console.log("id token", authResult.idToken);
          localStorage.setItem("accessToken", authResult.accessToken);
          localStorage.setItem("id_token", authResult.idToken);
          localStorage.setItem("profile", JSON.stringify(profile));
        });
      }
    });

    lock.on("authenticated", function(authResult) {
      lock.getUserInfo(authResult.accessToken, function(error, profileResult) {
        let accessToken = null;
        let profile = null;
        if (error) {
          console.log(error);
          return;
        }

        accessToken = authResult.accessToken;
        profile = profileResult;
        console.log("accesstoken", accessToken);
        console.log("id token", authResult.idToken);
        localStorage.setItem("accessToken", authResult.accessToken);
        localStorage.setItem("id_token", authResult.idToken);
        localStorage.setItem("profile", JSON.stringify(profile));
      });
    });
  }, []);

  const fetchPrivate = () => {
    const token = localStorage.getItem("id_token");
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
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit your <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <button onClick={() => lock.show()}>Login</button>
      <button onClick={() => fetchPrivate()}>Fetch</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

export default App;
