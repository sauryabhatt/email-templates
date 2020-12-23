/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ProductDetails from "./ProductDetails";
import {
  getProductDetails,
  getSPLPDetails,
  checkCart,
} from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
const querystring = require("querystring");
const isServer = () => typeof window == "undefined";

const ProductDescription = (props) => {
  let { userProfile = {}, isLoading } = props;
  let { productDetails, listingPage } = !isServer() ? props : props.data;
  const router = useRouter();
  let { articleId } = router.query;
  let { sellerDetails = {} } = productDetails || {};

  const { keycloak } = useKeycloak();
  let authenticated = keycloak.authenticated;
  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );

  const [count, setCount] = useState(0);

  let app_token = token;
  if (authenticated) {
    app_token = keycloak.token;
  }

  useEffect(() => {
    props.getProductDetails(app_token, articleId);
    setCount(1);
  }, [token, router.query]);

  useEffect(() => {
    let { productDetails = "" } = props;
    if (productDetails) {
      let { sellerCode = "" } = productDetails;
      let query = {
        sort_by: "minimumOrderQuantity",
        sort_order: "ASC",
        size: 6,
        from: 0,
        sellerId: sellerCode,
      };
      let queryResult = querystring.stringify(query);
      if (count === 1) {
        props.getSPLPDetails(queryResult);
        setCount(2);
      }
    }
  }, [props.productDetails]);

  useEffect(() => {
    let { userProfile = "" } = props;
    let { profileType = "", verificationStatus = "" } = userProfile || {};
    if (profileType === "BUYER" && verificationStatus === "VERIFIED") {
      props.checkCart(keycloak.token);
    }
  }, [props.userProfile]);

  return (
    <div>
      <ProductDetails
        data={productDetails}
        authenticated={authenticated}
        userProfile={userProfile}
        sellerDetails={sellerDetails}
        token={app_token}
        listingPage={listingPage}
        isLoading={!isServer() ? isLoading : false}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    productDetails: state.sellerListing.productDetails,
    userProfile: state.userProfile.userProfile,
    listingPage: state.sellerListing,
    isLoading: state.sellerListing.isLoading,
  };
};

export default connect(mapStateToProps, {
  getProductDetails,
  getSPLPDetails,
  checkCart,
})(ProductDescription);
