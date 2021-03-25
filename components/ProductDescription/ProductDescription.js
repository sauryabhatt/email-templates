/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ProductDetails from "./ProductDetails";
import {
  getProductDetails,
  getSPLPDetails,
  getCollections,
  checkCart,
} from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
import cookie from "js-cookie";
const querystring = require("querystring");
const isServer = () => typeof window == "undefined";

const ProductDescription = (props) => {
  let { userProfile = {}, isLoading } = props;
  let { productDetails, listingPage } = !isServer() ? props : props.data;
  const router = useRouter();

  let { sellerDetails = {} } = productDetails || {};

  const { keycloak } = useKeycloak();
  let authenticated = keycloak.authenticated;
  const [count, setCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  let app_token = null;

  if (keycloak.token) {
    app_token = keycloak.token;
  } else {
    app_token = process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN;
  }

  useEffect(() => {
    let { articleId } = router.query;
    props.getProductDetails(app_token, articleId);
    setCount(1);
    setCartCount(1);
  }, [router.query]);

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
        bird:
          keycloak.authenticated || cookie.get("kcToken") ? "lion" : "apple",
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
    let { profileType = "", verificationStatus = "", profileId = "" } =
      userProfile || {};
    if (
      profileType === "BUYER" &&
      (verificationStatus === "VERIFIED" ||
        verificationStatus === "IN_PROGRESS")
    ) {
      if (cartCount === 1) {
        props.checkCart(keycloak.token);
        profileId = profileId.replace("BUYER::", "");
        props.getCollections(app_token, profileId);
        setCartCount(2);
      }
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
  getCollections,
  getSPLPDetails,
  checkCart,
})(ProductDescription);
