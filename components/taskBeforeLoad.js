/** @format */

import store from "../store";
import {
  setTokenLoading,
  setTokenSuccess,
  setTokenFail,
} from "../store/actions";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

let timeSkew = 10;
export const getToken = (Component) => {
  const router = useRouter();
  const oldToken =
    (localStorage["persist:appToken"] &&
      JSON.parse(localStorage["persist:appToken"]).token &&
      JSON.parse(JSON.parse(localStorage["persist:appToken"]).token)) ||
    {};
  if (
    (oldToken.requestedTimestamp &&
      oldToken.expires_in &&
      oldToken.requestedTimestamp + oldToken.expires_in - timeSkew <=
        Math.floor(Date.now() / 1000)) ||
    !(oldToken.requestedTimestamp && oldToken.expires_in)
  ) {
    store.dispatch(setTokenLoading());
    var details = {
      grant_type: "client_credentials",
      client_id: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_CLIENT_SECRET,
    };

    var formBody = [];

    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return fetch(
      process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_URL +
        "realms/" +
        process.env.NEXT_PUBLIC_REACT_APP_KEYCLOAK_REALM +
        "/protocol/openid-connect/token",
      {
        method: "POST",
        body: formBody,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        result["requestedTimestamp"] = Math.floor(Date.now() / 1000);
        Cookies.remove("appToken");
        Cookies.set("appToken", result);
        store.dispatch(setTokenSuccess(result));
        setTimeout(() => {
          getToken();
        }, (result.expires_in - timeSkew) * 1000);
        return Component;
      })
      .catch((error) => {
        store.dispatch(
          setTokenFail("Somthing went wrong on loading application token.")
        );
        const values = router.query;
        if (values.redirectURI) {
          router.push(
            '/error?message="Somthing went wrong on loading application token."&redirectURI=' +
              values.redirectURI
          );
        } else {
          router.push(
            '/error?message="Somthing went wrong on loading application token."&redirectURI=' +
              router.pathname
          );
        }
      });
  } else {
    store.dispatch(setTokenSuccess(oldToken));
    setTimeout(() => {
      getToken();
    }, (oldToken.requestedTimestamp + oldToken.expires_in - timeSkew - Math.floor(Date.now() / 1000)) * 1000);
    return Component;
  }
};
