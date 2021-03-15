/** @format */

import cookie from "js-cookie";

export const loginToApp = (keycloak, options) => {
  if (options && options.currentPath) {
    keycloak.login({
      redirectUri:
        process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN +
        options.currentPath,
    });
  } else {
    keycloak.login({
      redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
    });
  }
};

export const logoutFromApp = (keycloak, options) => {
  cookie.remove("appToken");
  document.cookie = "appToken=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  // document.cookie = "appToken=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  if (options && options.currentPath) {
    keycloak.logout({
      redirectUri:
        process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN +
        options.currentPath,
    });
  } else {
    keycloak.logout({
      redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
    });
  }
};
