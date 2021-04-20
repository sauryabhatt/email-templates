/** @format */

import cookie from "js-cookie";

export const loginToApp = (keycloak, options) => {
  if (options && options.currentPath) {
    const url = keycloak.createLoginUrl({
      redirectUri:
        process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN +
        options.currentPath,
    });
    location.assign(url);
    // keycloak.login({
    //   redirectUri:
    //     process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN +
    //     options.currentPath,
    // });
  } else {
    // keycloak.login({
    //   redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
    // });
    const url = keycloak.createLoginUrl({
      redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
    });
    location.assign(url);
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
  // keycloak.register({
  //   redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
  // });
  // }

  const url = keycloak.createRegisterUrl({
    redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
  });
  location.assign(url);
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
