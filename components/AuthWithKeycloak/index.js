/** @format */

import React from "react";
import {
  SSRKeycloakProvider,
  SSRCookies,
  useKeycloak,
} from "@react-keycloak/ssr";

const keycloakProviderInitConfig = {
  onLoad: "check-sso",
  // onLoad: "login-required",
  flow: "implicit",
  // checkLoginIframe: false,
  silentCheckSsoRedirectUri:
    process.env.NEXT_PUBLIC_URL + "/silent-check-sso.html",
};

const keycloakCfg = {
  realm: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_REALM,
  url: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_URL,
  clientId: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_CLIENT_ID,
};

const redirectUriForApp = {
  "/": "/check-user-status",
};

export const loginToApp = (keycloak, options) => {
  if (options && options.currentPath) {
    if (redirectUriForApp[options.currentPath]) {
      keycloak.login({
        redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
      });
    } else {
      keycloak.login({
        redirectUri:
          process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN +
          options.currentPath,
      });
    }
  } else {
    keycloak.login({
      redirectUri: process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN,
    });
  }
};

export const logoutFromApp = (keycloak, options) => {
  document.cookie = "appToken=; path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
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

function AuthWithKeycloak(props) {
  const { keycloak } = useKeycloak();
  const { cookies } = props;

  // const cookiePersistor = ExpressCookies(cookies);
  // const cookiePersistor = new Cookies();

  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakCfg}
      persistor={SSRCookies(cookies)}
      keycloak={keycloak}
      initConfig={keycloakProviderInitConfig}
    >
      {props.children}
    </SSRKeycloakProvider>
  );
}

export default AuthWithKeycloak;
