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

export const registerToApp = (keycloak, options) => {
  // if (options && options.currentPath) {
  //   keycloak.register({
  //     redirectUri:
  //       process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN +
  //       options.currentPath,
  //   });
  // } else {
  keycloak.register({
    redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
  });
  // }
};

export const logoutFromApp = (keycloak, options) => {
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
  cookie.remove("loggedInUser");
};
