/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PaymentDetails from "./PaymentDetails";
import { useKeycloak } from "@react-keycloak/ssr";

const Payment = (props) => {
  let { user = {} } = props;
  const { keycloak } = useKeycloak();
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState(props.data.cart);

  useEffect(() => {
    let { priceQuoteResp = {}, cart = {} } = props.data || {};
    let { shippingTerms = "" } = cart || {};
    let shippingTerm = shippingTerms.toLowerCase();
    if (priceQuoteResp && priceQuoteResp[shippingTerm]) {
      setData(priceQuoteResp[shippingTerm]);
    }
    setIsLoading(false);
  }, []);

  return (
    <PaymentDetails
      app_token={keycloak.token}
      cart={cart}
      user={user}
      data={data}
      isLoading={isLoading}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    cart: state.checkout.cart,
    user: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, null)(Payment);
