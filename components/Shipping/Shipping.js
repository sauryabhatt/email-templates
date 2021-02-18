/** @format */

import React, { useState } from "react";
import { connect } from "react-redux";
import ShippingDetails from "./ShippingDetails";
import { useKeycloak } from "@react-keycloak/ssr";

const Shipping = (props) => {
  const { keycloak } = useKeycloak();
  const [token, setToken] = useState(props.appToken);
  const [cart, setCart] = useState(props.data.cart);
  const [airData, setAirData] = useState(props.data.airData);
  const [seaData, setSeaData] = useState(props.data.seaData);

  return (
    <ShippingDetails
      appToken={token || keycloak.token}
      cart={cart}
      airQuote={airData}
      seaQuote={seaData}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    cart: state.checkout.cart,
    user: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, null)(Shipping);
