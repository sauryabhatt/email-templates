/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ShippingDetails from "./ShippingDetails";
import { getCart } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";

const Shipping = (props) => {
  let { cart = {} } = props;
  const {keycloak} = useKeycloak();
  

  // async function getCartDetails() {
    // props.getCart(token);
  // }

  useEffect(() => {
    if (props.user) {
      let { user = {} } = props || {};
      let { profileType = "" } = user || {};
      if (profileType === "BUYER") {
        props.getCart(keycloak.token);
      }
    }
  }, [props.user, keycloak.token]);

  return (
      <ShippingDetails app_token={keycloak.token} cart={cart} />
  );
};

const mapStateToProps = (state) => {
  return {
    cart: state.checkout.cart,
    user: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, { getCart })(Shipping);
