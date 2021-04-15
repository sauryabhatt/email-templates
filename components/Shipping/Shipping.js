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
  let retryCountAir = 0;
  let retryCountSea = 0;
  let retryCountCart = 0;

  const getAirData = (priceQuoteRef) => {
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
          throw (
            res.statusText || "Oops something went wrong. Please try again!"
          );
        }
      })
      .then((airDataResp) => {
        setAirData(airDataResp);
      })
      .catch((err) => {
        console.log(err);
        if (retryCountAir < 3) {
          getAirData(priceQuoteRef);
        } else {
          setAirData({ ddp: {}, ddu: {} });
        }
        retryCountAir++;
      });
  };

  const getSeaData = (priceQuoteRef) => {
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
          throw (
            res.statusText || "Oops something went wrong. Please try again!"
          );
        }
      })
      .then((seaDataResp) => {
        setSeaData(seaDataResp);
      })
      .catch((err) => {
        console.log(err);
        if (retryCountSea < 3) {
          getSeaData(priceQuoteRef);
        } else {
          setSeaData({ ddp: {}, ddu: {} });
        }
        retryCountSea++;
      });
  };

  const getCartDetails = () => {
    props.getCart(keycloak.token, (result) => {
      let { error = "" } = result;
      if (!error) {
        setCart(result);
        let { priceQuoteRef = "" } = result || {};
        if (priceQuoteRef) {
          getAirData(priceQuoteRef);
          getSeaData(priceQuoteRef);
        }
      } else {
        if (retryCountCart < 3) {
          getCartDetails();
        } else {
          console.log("Get Cart API Failed!");
        }
        retryCountCart++;
      }
    });
  };

  useEffect(() => {
    if (props.user) {
      let { user = {} } = props || {};
      let { profileType = "" } = user || {};
      if (profileType === "BUYER") {
        getCartDetails();
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
