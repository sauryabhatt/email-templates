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
  const { keycloak } = useKeycloak();
  const [cartData, setCartData] = useState(false);
  let { token } = keycloak || {};
  let retryCountCart = 0;

  const getSFLDetails = (cart) => {
    setCartData(true);
    props.getSavedForLater(token, (sfl) => {
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
      setIsLoading(false);
    });
  };

  const getCartDetails = () => {
    props.getCart(token, (cart) => {
      let { error = "" } = cart;
      if (!error) {
        getSFLDetails(cart);
      } else {
        if (retryCountCart < 3) {
          getCartDetails();
        } else {
          console.log("Get Cart API Failed!");
          setIsLoading(false);
        }
        retryCountCart++;
      }
    });
  };

  useEffect(() => {
    if (props.user && Object.keys(props.user).length) {
      setIsLoading(true);
      let { user = {} } = props || {};
      let { profileType = "" } = user || {};
      if (profileType === "BUYER" && cartData === false) {
        getCartDetails();
      } else {
        setIsLoading(false);
      }
    }

    if (props.user === null) {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
  }, [props.user]);

  if (isLoading) {
    return <Spinner />;
  }
  if (!isLoading && keycloak.authenticated) {
    return (
      <CartDetails app_token={token} sfl={sfl} brandNames={brandNameList} />
    );
  } else if (!keycloak.authenticated) {
    return <AnonymousCart />;
  }
};

const mapStateToProps = (state) => {
  return {
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
