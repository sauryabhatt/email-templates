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
import _ from "lodash";

const Cart = (props) => {
  let { cart = {}, brandNameList = [] } = props;
  const [isLoading, setLoading] = useState(true);
  const { keycloak } = useKeycloak();
  let { token } = keycloak || {};

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
    if (props.user) {
      setLoading(true);
      let { user = {} } = props || {};
      let { profileType = "" } = user || {};
      if (profileType === "BUYER") {
        getCartDetails();
      }
    } else {
      console.log(props.isLoading)
      setLoading(false);
    }
  }, [props.user]);

  return (
    <CartDetails
      isLoading={isLoading}
      app_token={token}
      cart={cart}
      brandNames={brandNameList}
    />
  );
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
