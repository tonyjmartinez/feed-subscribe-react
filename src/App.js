import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import auth0 from "auth0-js";
const { setSession } = auth0;
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
console.log("is dev?", isDev);

console.log(localStorage.getItem("id_token"));
// const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const ID_TOKEN = "id_token";
const ACCESS_TOKEN = "access_token";
const EXPIRES_IN = "expires_in";

const webAuth = new auth0.WebAuth({
  domain: "tonyjmartinez.auth0.com",
  clientID: process.env.REACT_APP_CLIENT_ID,
  responseType: "token id_token",
  audience: "https://tonyjmartinez.auth0.com/userinfo",
  scope: "openid email",
  redirectUri: isDev ? "http://localhost:3000" : "https://feedsubscri.be/"
});
const PRIVATE_ENDPOINT =
  "https://h9gqunf6y7.execute-api.us-west-2.amazonaws.com/dev/api/private";

const logout = () => {
  localStorage.removeItem("id_token");
  localStorage.removeItem("access_token");
};

function handleAuthentication() {
  webAuth.parseHash(function(err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      console.log("auth", authResult);
      localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
      localStorage.setItem(ID_TOKEN, authResult.idToken);
      localStorage.setItem(EXPIRES_IN, authResult.expiresIn);
      // TODO: Redirect to webroot
    } else if (err) {
      console.log(err);
      alert("Error: " + err.error + ". Check the console for further details.");
    }
  });
}

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
const checkAuth = () => {
  webAuth.checkSession({}, function(err, authResult) {
    // err if automatic parseHash fails
    console.log("errror", err);
    console.log("authResult", authResult);
  });
};

function App() {
  useEffect(() => {
    // webAuth.authorize();
    console.log("expires in ? ", localStorage.getItem(EXPIRES_IN));

    handleAuthentication();
  }, []);

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
      <button onClick={() => webAuth.authorize()}>Login</button>
      <button onClick={() => fetchPrivate()}>Fetch</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => checkAuth()}>Check</button>
      {/* <button onClick={() => checkAuth()}>Check Auth</button> */}
    </div>
  );
}

export default App;
