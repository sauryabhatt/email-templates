/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ShippingDetails from "./ShippingDetails";
import { useKeycloak } from "@react-keycloak/ssr";
import { getCart } from "../../store/actions";

const Shipping = (props) => {
  const { keycloak } = useKeycloak();
  const [token, setToken] = useState(props.data.appToken);
  const [cart, setCart] = useState(props.data.cart);
  const [airData, setAirData] = useState(props.data.airData);
  const [seaData, setSeaData] = useState(props.data.seaData);

  useEffect(() => {
    if (props.user && props.user.userProfile) {
      let { user = {} } = props || {};
      let { profileType = "" } = user || {};
      if (profileType === "BUYER") {
        props.getCart(keycloak.token, (res) => {
          setCart(res);
        });
      }
    }
  }, [props.user]);

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

export default connect(mapStateToProps, getCart)(Shipping);
