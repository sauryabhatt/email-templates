/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import CartDetails from "./CartDetails";
import {
  getCart,
  getSavedForLater,
  getBrandNameByCode,
} from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import AnonymousCart from "./AnonymousCart";
import _ from "lodash";
import Spinner from "../Spinner/Spinner";
import Link from "next/link";
import { Button } from "antd";
import { useRouter } from "next/router";

const Cart = (props) => {
  let { brandNameList = [], sfl = {} } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [cart, setCart] = useState("");
  const [subOrder, setSubOrder] = useState(null);
  const { keycloak } = useKeycloak();
  const router = useRouter();
  let { token } = keycloak || {};

  async function getCartDetails() {
    let response1 = await props.getCart(token, (res) => {
      setIsLoading(false);
    });
    let cartResp = await response1;
    let { cart = {} } =
      cartResp && cartResp["payload"] ? cartResp["payload"] : {};

    setCart(cart);

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
    setSubOrder(subOrders);
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
    if (props.user) {
      setIsLoading(true);
      let { user = {} } = props || {};
      let { profileType = "" } = user || {};
      if (profileType === "BUYER") {
        getCartDetails();
      }
    }
    setInitialLoad(true);

    if (initialLoad) {
      setIsLoading(false);
    }
  }, [props.user, initialLoad]);

  useEffect(() => {
    if (props.cartDetails && Object.keys(props.cartDetails).length) {
      setCart(props.cartDetails);
      let { subOrders = [] } = props.cartDetails || {};
      setSubOrder(subOrders);
    }
  }, [props.cartDetails]);

  let { isGuest = false, user = {} } = props || {};
  let { verificationStatus = "", profileType = "" } = user || {};
  let notificationMsg = "You do not have any product added to your cart";
  let buttonName = "Start shopping";
  if (
    (profileType === "BUYER" && verificationStatus === "ON_HOLD") ||
    (profileType === "BUYER" && verificationStatus === "REJECTED")
  ) {
    notificationMsg =
      "You can add products to your cart as soon as your account is verified";
    buttonName = "Go to home page";
  } else if (
    (profileType === "BUYER" &&
      verificationStatus === "VERIFIED" &&
      isGuest === "true") ||
    profileType === "SELLER"
  ) {
    notificationMsg =
      "In order to checkout and place an order please signup as a buyer";
    buttonName = "Sign up as a buyer";
  }

  if (isLoading) {
    return <Spinner />;
  } else if (keycloak.authenticated) {
    if (subOrder && subOrder !== null && subOrder.length === 0 && !isLoading) {
      return (
        <div id="cart-details" className="cart-section qa-font-san empty-cart">
          <div className="e-cart-title qa-txt-alg-cnt qa-mar-btm-1">
            Your cart is empty!
          </div>
          <div className="qa-txt-alg-cnt e-cart-stitle">{notificationMsg}</div>
          <Link href="/account/profile">
            <div className="qa-txt-alg-cnt e-link">My account</div>
          </Link>
          <Link href="/FAQforwholesalebuyers">
            <div className="qa-txt-alg-cnt e-link qa-mar-btm-2">See FAQ</div>
          </Link>
          <div className="qa-txt-alg-cnt qa-mar-btm-4">
            <Button
              className="qa-button qa-fs-12 qa-shop-btn"
              onClick={(e) => {
                if (buttonName === "Sign up as a buyer") {
                  router.push("/signup");
                } else {
                  router.push("/");
                }
                e.preventDefault();
              }}
            >
              {buttonName}
            </Button>
          </div>
        </div>
      );
    } else if (subOrder && subOrder !== null && subOrder.length) {
      return (
        <CartDetails
          app_token={token}
          cart={cart}
          sfl={sfl}
          brandNames={brandNameList}
        />
      );
    } else {
      return <Spinner />;
    }
  } else if (!keycloak.authenticated) {
    return <AnonymousCart />;
  }
};

const mapStateToProps = (state) => {
  return {
    cartDetails: state.checkout.cart,
    brandNameList: state.userProfile.brandNameList,
    user: state.userProfile.userProfile,
    sfl: state.checkout.sfl,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
  };
};

export default connect(mapStateToProps, {
  getCart,
  getSavedForLater,
  getBrandNameByCode,
})(Cart);
