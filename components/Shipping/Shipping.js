/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ShippingDetails from "./ShippingDetails";
import { getCart } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import Spinner from "../Spinner/Spinner";

const Shipping = (props) => {
  const { keycloak } = useKeycloak();
  const [cart, setCart] = useState({});
  const [airData, setAirData] = useState({});
  const [seaData, setSeaData] = useState({});

  useEffect(() => {
    if (props.user) {
      let { user = {} } = props || {};
      let { profileType = "" } = user || {};
      if (profileType === "BUYER") {
        props.getCart(keycloak.token, (result) => {
          setCart(result);
          let { priceQuoteRef = "" } = result || {};
          if (priceQuoteRef) {
            fetch(
              `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=AIR`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + keycloak.token,
                },
              }
            )
              .then((res) => {
                if (res.ok) {
                  return res.json();
                } else {
                  throw res.statusText || "Error while updating info.";
                }
              })
              .then((airDataResp) => {
                setAirData(airDataResp);
              })
              .catch((err) => {
                console.log(err);
                setAirData({});
              });

            fetch(
              `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=SEA`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + keycloak.token,
                },
              }
            )
              .then((res) => {
                if (res.ok) {
                  return res.json();
                } else {
                  throw res.statusText || "Error while updating info.";
                }
              })
              .then((seaDataResp) => {
                setSeaData(seaDataResp);
              })
              .catch((err) => {
                console.log(err);
                setSeaData({});
              });
          }
        });
      }
    }
  }, [props.user]);

  if (Object.keys(cart).length) {
    return (
      <ShippingDetails
        appToken={keycloak.token}
        cart={cart}
        airQuote={airData}
        seaQuote={seaData}
      />
    );
  } else {
    return <Spinner />;
  }
};

const mapStateToProps = (state) => {
  return {
    user: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, { getCart })(Shipping);
