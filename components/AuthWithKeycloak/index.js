/** @format */

import React from "react";
import {
  SSRKeycloakProvider,
  SSRCookies,
  useKeycloak,
  Cookies,
  ExpressCookies,
} from "@react-keycloak/ssr";
// import store from '../../store';
// import {setAuth, getUserProfile} from '../../store/actions';
// import Spinner from '../Spinner/Spinner';

const keycloakProviderInitConfig = {
  onLoad: "check-sso",
  // onLoad: "login-required",
  flow: "implicit",
  checkLoginIframe: false,
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
  document.cookie = "appToken=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Path=/;";
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
  const keycloakCfg = {
    realm: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_REALM,
    url: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_URL,
    clientId: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_CLIENT_ID,
  };

  // const cookiePersistor = ExpressCookies(cookies);
  const cookiePersistor = new Cookies(cookies);

  // const onKeycloakEvent = (event, error) => {
  //     if (event === 'onReady') {
  //     } else if (event === 'onAuthSuccess') {
  //         keycloak.loadUserProfile().then((profile) => {
  //             store.dispatch(setAuth(keycloak.authenticated, profile));
  //         }).catch((error) => {
  //             store.dispatch(setAuth(keycloak.authenticated, null));
  //             history.push('/error?message="Somthing went wrong on loading user profile."&redirectURI='+history.location.pathname);
  //         });
  //         store.dispatch(getUserProfile(keycloak.token));
  //     }
  //
  // }
  // const onKeycloakTokens = tokens => {
  //     // console.log('onKeycloakTokens', tokens)
  // }
  return (
    <SSRKeycloakProvider
      keycloakConfig={keycloakCfg}
      persistor={SSRCookies(cookies)}
      keycloak={keycloak}
      initConfig={keycloakProviderInitConfig}
      // onEvent={onKeycloakEvent}
      // onTokens={onKeycloakTokens}
      // LoadingComponent={<Spinner/>}
    >
      {props.children}
    </SSRKeycloakProvider>
  );
}

export default AuthWithKeycloak;
