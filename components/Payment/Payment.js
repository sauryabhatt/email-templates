/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import PaymentDetails from "./PaymentDetails";
import { checkCartAPI, getOrder } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
// import { Helmet } from "react-helmet";

const Payment = (props) => {
  let { cart = {}, user = {} } = props;
  const { keycloak } = useKeycloak();
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function getCartDetails(token) {
    props.checkCartAPI(token, (result) => {
      let {
        orderId = "",
        priceQuoteRef = "",
        shippingMode = "",
        shippingTerms = "",
      } = result || {};

      if (priceQuoteRef && shippingMode !== "DEFAULT") {
        fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=${shippingMode}`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + token,
            },
          }
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw res.statusText || "COntent not found";
            }
          })
          .then((res) => {
            let shippingterm = shippingTerms.toLowerCase();
            setData(res[shippingterm]);
            setLoading(false);
            props.getOrder(orderId, token);
          })
          .catch((error) => {
            // message.error(error)
            setLoading(false);
          });
      }
    });
  }

  useEffect(() => {
    if (props.user) {
      let { user = {} } = props || {};
      let { profileType = "" } = user || {};
      if (profileType === "BUYER") {
        getCartDetails(keycloak.token);
      }
    }
  }, [props.user, keycloak.token]);

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

export default connect(mapStateToProps, {
  checkCartAPI,
  getOrder,
})(Payment);
