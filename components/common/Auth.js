/** @format */

import React, { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/ssr";
import { loginToApp } from "../AuthWithKeycloak";
import Spinner from "../Spinner/Spinner";
import { useCookies } from "react-cookie";

export const getCookie = (cname) => {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

function Auth({ children, path }) {
  const { keycloak } = useKeycloak();
  const [status, setStatus] = useState(undefined);
  const [cookie, setCookie] = useCookies(["authStatus"]);

  useEffect(() => {
    if (getCookie("appToken")) {
      // if (cookie && cookie["authStatus"]) {
      setCookie("authUser", getCookie("appToken"), {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      // }
    }

    if (getCookie("appToken")) {
      // if (keycloak.token) {
      setStatus("loggedin");
    } else {
      setStatus("loggedout");
    }
  }, [keycloak.authenticated, keycloak.token]);

  if (status === undefined) {
    return <Spinner />;
  } else if (status === "loggedout") {
    // setTimeout(() => {
    //   if (status === "loggedin") {
    //     return children;
    //   } else {
    loginToApp(keycloak, { currentPath: path });
    //   }
    // }, 500);
    // return <Spinner />;
  } else if (status === "loggedin") {
    return children;
  } else {
    return <Spinner />;
  }
}

export default Auth;
