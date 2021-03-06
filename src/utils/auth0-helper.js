import auth0 from "auth0-js";
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
console.log("is dev?", isDev);

console.log(localStorage.getItem("id_token"));
// const domain = process.env.REACT_APP_AUTH0_DOMAIN;
export const ID_TOKEN = "id_token";
export const ACCESS_TOKEN = "access_token";
export const EXPIRES_IN = "expires_in";
const clientID = process.env.REACT_APP_CLIENT_ID;

console.log("auth0");
const webAuth = new auth0.WebAuth({
  domain: "tonyjmartinez.auth0.com",
  clientID,
  responseType: "token id_token",
  audience: "https://tonyjmartinez.auth0.com/userinfo",
  scope: "openid email",
  // redirectUri: isDev ? "http://localhost:3000" : "https://www.feedsubscri.be/"
  redirectUri: window.location.origin
});

export const login = cb => {
  webAuth.authorize();
};

export const logout = () => {
  localStorage.removeItem("id_token");
  localStorage.removeItem("access_token");
  webAuth.logout({
    returnTo: window.location.origin
    // clientID
  });
};

export function handleAuthentication(cb) {
  webAuth.parseHash(function(err, authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      console.log("auth", authResult);
      localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
      localStorage.setItem(ID_TOKEN, authResult.idToken);
      localStorage.setItem(EXPIRES_IN, authResult.expiresIn);
      cb(true);
    } else if (err) {
      console.log(err);
      cb(false);
    }
  });
}

export const checkAuth = cb => {
  console.log("cb", cb);
  webAuth.checkSession({}, function(err, authResult) {
    // err if automatic parseHash fails

    if (err) {
      console.log("errror", err);
      cb(null);
    } else {
      console.log("authResult", authResult);

      localStorage.setItem(ACCESS_TOKEN, authResult.accessToken);
      localStorage.setItem(ID_TOKEN, authResult.idToken);
      localStorage.setItem(EXPIRES_IN, authResult.expiresIn);
      cb(authResult);
    }
  });
};
