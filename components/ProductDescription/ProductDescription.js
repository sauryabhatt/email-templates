/** @format */

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import ProductDetails from "./ProductDetails";
import {
  getProductDetails,
  getCollections,
  getSPLPDetails,
  checkInventory,
  checkCart,
} from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
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
  const [apiCount, setApiCount] = useState(0);
  const [inStock, setInStock] = useState(0);
  const [skuId, setSkuId] = useState("");
  const [profileId, setProfileId] = useState("");

  let app_token = process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN;
  if (authenticated) {
    app_token = keycloak.token;
  }

  useEffect(() => {
    let { articleId } = router.query;
    props.getProductDetails(app_token, articleId, (productDetails) => {
      let { skus = [] } = productDetails || {};
      if (skus.length > 0) {
        let skuId = skus[0]["id"];
        props.checkInventory(app_token, [skuId], (result) => {
          let qty = result[skuId];
          if (qty > 0) {
            setSkuId(skuId);
          } else {
            setSkuId("");
          }
          setInStock(qty);
        });
      } else {
        setSkuId("");
        setInStock(0);
      }
    });
    setCount(1);
    setApiCount(1);
  }, [router.query]);

  useEffect(() => {
    if (profileId) {
      props.getCollections(keycloak.token, profileId);
    }
  }, [router.query, profileId]);

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
    let { profileType = "", verificationStatus = "", profileId = "" } =
      userProfile || {};

    if (apiCount === 1) {
      if (
        profileType === "BUYER" &&
        (verificationStatus === "VERIFIED" ||
          verificationStatus === "IN_PROGRESS")
      ) {
        profileId = profileId.replace("BUYER::", "");
        setProfileId(profileId);
        props.checkCart(keycloak.token);
        setApiCount(2);
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
        inStock={inStock}
        skuId={skuId}
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
  getCollections,
  checkInventory,
  checkCart,
})(ProductDescription);
