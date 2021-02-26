/** @format */

import React, { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/ssr";
import { loginToApp } from "../AuthWithKeycloak";
import Spinner from "../Spinner/Spinner";
import cookie from "js-cookie";

export const getCookie = (cname) => {
  let cookies = document.cookie
    .split(";")
    .map((cookie) => cookie.split("="))
    .reduce(
      (accumulator, [key, value]) => ({
        ...accumulator,
        [key.trim()]: decodeURIComponent(value),
      }),
      {}
    );

  if (cookies[cname]) {
    return "exist";
  } else {
    return "";
  }
};

function Auth({ children, path }) {
  const { keycloak } = useKeycloak();
  const [status, setStatus] = useState(undefined);

  useEffect(() => {
    if (cookie.get("appToken") || keycloak.authenticated) {
      setStatus("loggedin");
    } else {
      setStatus("loggedout");
    }
  }, [keycloak.authenticated]);

  console.log("User status ", status);
  if (status === undefined) {
    return <Spinner />;
  } else if (status === "loggedout") {
    // setTimeout(() => {
    if (status === "loggedin") {
      return children;
    } else {
      loginToApp(keycloak, { currentPath: path });
    }
    // }, 500);
    return <Spinner />;
  } else if (status === "loggedin") {
    return children;
  } else {
    return <Spinner />;
  }
}

export default Auth;
