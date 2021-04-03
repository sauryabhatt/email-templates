/** @format */

import React from "react";
import Link from "next/link";
import Icon from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import signUp_icon from "../../public/filestore/Sign_Up";
import { loginToApp, registerToApp } from "../AuthWithKeycloak";
import { useRouter } from "next/router";
import { useKeycloak } from "@react-keycloak/ssr";

const AddToCollectionSignUp = (props) => {
  let { handleCancel = "" } = props;

  const router = useRouter();
  const { keycloak } = useKeycloak();

  const signIn = () => {
    loginToApp(keycloak, { currentPath: router.asPath.split("?")[0] });
  };

  return (
    <div className="qa-rel-pos">
      <div
        onClick={handleCancel}
        style={{
          position: "absolute",
          right: "-25px",
          top: "-25px",
          cursor: "pointer",
          zIndex: "1",
        }}
      >
        <Icon
          component={closeButton}
          style={{ width: "30px", height: "30px" }}
        />
      </div>
      <div id="product-login-modal">
        <div className="product-login-modal-content">
          <p className="product-login-modal-para" style={{ color: "#af0000" }}>
            To save a product to collection, please sign up as a buyer
          </p>
        </div>
        <div className="product-login-modal-content">
          <div className="product-login-modal-head sub-heading">
            Introducing
          </div>
        </div>
        <div className="product-login-modal-para">
          <div className="product-login-modal-head sub-heading">
            Save to collection!
          </div>
        </div>
        <div className="product-login-modal-content">
          <p className="product-login-modal-para">
            If you would like to request for quote for multiple products, you
            can now use our new Save to Collection feature and send a combined
            Quote request easily
          </p>
        </div>

        <div className="qa-txt-alg-cnt">
          <div className="login-modal-signup-btn">
            {/* <Link href="/signup"> */}
            <span
              className="button"
              onClick={() => {
                registerToApp(keycloak, {
                  currentPath: router.asPath,
                });
                // router.push("/signup");
              }}
            >
              <span className="sign-up-text-icon">{signUp_icon()} </span>
              <span className="sign-up-text">Sign Up as a buyer</span>
            </span>
            {/* </Link> */}
          </div>
        </div>
        <div className="product-login-modal-content qa-mar-top-1">
          <p className="product-login-modal-para sign-in-account">
            Already have an account?{" "}
            <span
              style={{ textDecoration: "underline" }}
              className="qa-sm-color qa-cursor"
              onClick={signIn}
            >
              Sign in here
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddToCollectionSignUp;
