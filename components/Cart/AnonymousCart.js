/** @format */

import React from "react";
import { useKeycloak } from "@react-keycloak/ssr";
import _ from "lodash";
import signUp_icon from "../../public/filestore/Sign_Up";
import { loginToApp, registerToApp } from "../AuthWithKeycloak";
import { useRouter } from "next/router";
import { Button } from "antd";

export default function AnonymousCart() {
  const { keycloak } = useKeycloak();
  const router = useRouter();

  const signIn = () => {
    loginToApp(keycloak, { currentPath: router.asPath.split("?")[0] });
  };

  console.log("Anonymous cart");

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
            // router.push("/signup");
            registerToApp(keycloak, { currentPath: router.asPath });
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
