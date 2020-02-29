import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import auth0 from "auth0-js";
const { setSession } = auth0;

const clientId = process.env.REACT_APP_CLIENT_ID;
console.log("clientId", clientId);
console.log(localStorage.getItem("id_token"));
// const domain = process.env.REACT_APP_AUTH0_DOMAIN;
const domain = "tonyjmartinez.auth0.com";

const webAuth = new auth0.WebAuth({
  domain: "tonyjmartinez.auth0.com",
  clientID: "zzdHk5KatE3q2qHzl7y7N7XsfwHKhrTR",
  responseType: "token id_token",
  audience: "https://tonyjmartinez.auth0.com/userinfo",
  scope: "openid email",
  redirectUri: "https://feedsubscri.be"
  // redirectUri: "http://localhost:3000/"
});
const PRIVATE_ENDPOINT =
  "https://h9gqunf6y7.execute-api.us-west-2.amazonaws.com/dev/api/private";

const logout = () => {
  localStorage.removeItem("id_token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("profile");
};

function handleAuthentication() {
  webAuth.parseHash(function(err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      console.log("auth", authResult);
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

function App() {
  useEffect(() => {
    // lock.on("authenticated", function(authResult) {
    //   lock.getUserInfo(authResult.accessToken, function(error, profileResult) {
    //     console.log(authResult);
    //     lock.getUserInfo(authResult.accessToken, (error, profile) => {
    //       if (error) {
    //         // Handle error
    //         console.log("error loggin in");
    //         return;
    //       }

    //       localStorage.setItem("accessToken", authResult.accessToken);
    //       localStorage.setItem("id_token", authResult.idToken);
    //       localStorage.setItem("profile", JSON.stringify(profile));
    //     });
    //   });
    // });
    handleAuthentication();
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
      <button onClick={() => webAuth.authorize()}>Login</button>
      <button onClick={() => fetchPrivate()}>Fetch</button>
      <button onClick={() => logout()}>Logout</button>
      {/* <button onClick={() => checkAuth()}>Check Auth</button> */}
    </div>
  );
}

export default App;
