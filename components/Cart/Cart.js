/** @format */

import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import CartDetails from "./CartDetails";
import {
  getCart,
  getSavedForLater,
  getBrandNameByCode,
} from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import _ from "lodash";
import signUp_icon from "../../public/filestore/Sign_Up";
import { loginToApp } from "../AuthWithKeycloak";
import { useRouter } from "next/router";
import { Button } from "antd";
import Spinner from "../Spinner/Spinner";

const Cart = (props) => {
  let { cart = {}, brandNameList = [] } = props;
  const [isLoading, setLoading] = useState(true);
  const { keycloak } = useKeycloak();
  const router = useRouter();
  let { token } = keycloak || {};
  const loaded = useRef(false);

  const signIn = () => {
    loginToApp(keycloak, { currentPath: router.asPath.split("?")[0] });
  };

  async function getCartDetails() {
    let response1 = await props.getCart(token, (res) => {
      setLoading(false);
    });
    let cartResp = await response1;
    let { cart = {} } =
      cartResp && cartResp["payload"] ? cartResp["payload"] : {};

    let response2 = await props.getSavedForLater(token);
    let sflResp = await response2;
    let { sfl = {} } = sflResp && sflResp["payload"] ? sflResp["payload"] : {};
    let sellerCodeList = [];
    let { products = [] } = sfl || {};
    if (products.length) {
      let groupedOrders = _.groupBy(products, "sellerCode");
      for (let order in groupedOrders) {
        sellerCodeList.push(order);
      }
    }
    let { subOrders = [] } = cart || {};
    if (subOrders.length) {
      for (let sellers of subOrders) {
        let { sellerCode = "" } = sellers;
        if (!sellerCodeList.includes(sellerCode)) {
          sellerCodeList.push(sellerCode);
        }
      }
    }
    if (sellerCodeList.length) {
      let codes = sellerCodeList.join();
      props.getBrandNameByCode(codes, token);
    }
  }

  useEffect(() => {
    if (loaded.current) {
      setLoading(true);
      if (props.user) {
        setLoading(true);
        let { user = {} } = props || {};
        let { profileType = "" } = user || {};
        if (profileType === "BUYER") {
          getCartDetails();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else {
      loaded.current = true;
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    }
  }, [props.user]);

  if (isLoading) {
    return <Spinner />;
  } else if (!keycloak.authenticated) {
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
  } else {
    return (
      <CartDetails app_token={token} cart={cart} brandNames={brandNameList} />
    );
  }
};

const mapStateToProps = (state) => {
  return {
    cart: state.checkout.cart,
    isLoading: state.userProfile.isLoading,
    brandNameList: state.userProfile.brandNameList,
    user: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, {
  getCart,
  getSavedForLater,
  getBrandNameByCode,
})(Cart);
