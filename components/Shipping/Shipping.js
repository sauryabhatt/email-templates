/** @format */

import React from "react";
import { connect } from "react-redux";
import ShippingDetails from "./ShippingDetails";
import { useKeycloak } from "@react-keycloak/ssr";

const Shipping = (props) => {
  let { cart = {} } = props.data;
  const { keycloak } = useKeycloak();

  return <ShippingDetails app_token={keycloak.token} cart={cart} />;
};

const mapStateToProps = (state) => {
  return {
    cart: state.checkout.cart,
    user: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, null)(Shipping);
