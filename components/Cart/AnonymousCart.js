/** @format */

import React, { useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/ssr";
import _ from "lodash";
import signUp_icon from "../../public/filestore/Sign_Up";
import { loginToApp } from "../AuthWithKeycloak";
import { useRouter } from "next/router";
import { Button } from "antd";
import Cart from "./Cart";
import Spinner from "../Spinner/Spinner";

export default function AnonymousCart() {
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const signIn = () => {
    loginToApp(keycloak, { currentPath: router.asPath.split("?")[0] });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (keycloak.token) {
      setLoading(false);
      setAuthenticated(true);

      console.log("Authenticated");
    }
  }, [keycloak.token]);

  console.log("Anonymous cart ", isLoading);
  if (isLoading) {
    return <Spinner />;
  } else if (authenticated) {
    return <Cart />;
  } else {
    return (
      <div id="cart-details" className="cart-section qa-font-san empty-cart">
        <div className="e-cart-title qa-txt-alg-cnt qa-mar-btm-2 qa-fs48">
          Sign up to add products to your cart
        </div>
        <div className="qa-txt-alg-cnt e-cart-stitle">
          In order to checkout and place an order please signup as a buyer
        </div>

        <div className="qa-txt-alg-cnt">
          <Button
            className="qa-button qa-fs-12 qa-shop-btn"
            onClick={(e) => {
              router.push("/signup");
            }}
          >
            <span className="sign-up-cart-icon">{signUp_icon()} </span>
            <span className="qa-va-m">sign up as a buyer</span>
          </Button>
        </div>
        <div className="qa-signin-link qa-mar-top-05">
          Already have an account?{" "}
          <span className="c-breakup" onClick={signIn}>
            Sign in here
          </span>
        </div>
      </div>
    );
  }
}
