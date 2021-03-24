/** @format */

import React, { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/ssr";
import { loginToApp } from "../AuthWithKeycloak";
import Spinner from "../Spinner/Spinner";
import cookie from "js-cookie";

function Auth({ children, path }) {
  const { keycloak } = useKeycloak();
  const [status, setStatus] = useState(undefined);

  useEffect(() => {
    console.log("Keycloak token ", keycloak?.token);
    console.log("Cookie ", cookie.get("kcToken"));
    if (cookie.get("kcToken") || keycloak?.token) {
      setStatus("loggedin");
    } else {
      setStatus("loggedout");
    }
  }, [keycloak.token]);

  if (status === undefined) {
    return <Spinner />;
  } else if (status === "loggedout") {
    loginToApp(keycloak, { currentPath: path });
    return <Spinner />;
  } else if (status === "loggedin") {
    return children;
  } else {
    return <Spinner />;
  }
}

export default Auth;
