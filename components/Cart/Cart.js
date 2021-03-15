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

const Cart = (props) => {
  let { brandNameList = [], sfl = {} } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(false);
  const [cart, setCart] = useState("");
  const { keycloak } = useKeycloak();
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
    }
  }, [props.cartDetails]);

  if (isLoading) {
    return <Spinner />;
  }
  if (keycloak.authenticated) {
    return (
      <CartDetails
        app_token={token}
        cart={cart}
        sfl={sfl}
        brandNames={brandNameList}
      />
    );
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
  };
};

export default connect(mapStateToProps, {
  getCart,
  getSavedForLater,
  getBrandNameByCode,
})(Cart);
