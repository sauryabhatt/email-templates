/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SellerProductListingDesktop from "./SellerProductListingDesktop";
import SellerProductListingMobile from "../mobile/SellerProductListingMobile";
import { getSPLPDetails, getProductSellerDetails } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useSelector } from "react-redux";
import queryString from "query-string";
import { useRouter } from "next/router";
import cookie from "js-cookie";
const querystring = require("querystring");

//TODO: handle token
const isServer = () => typeof window == "undefined";

const SellerProductListing = (props) => {
  const router = useRouter();
  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );

  const { keycloak } = useKeycloak();
  let appToken = keycloak.token ? keycloak.token : token;
  let { sellerDetails = {}, userProfile = {} } = props || {};
  let { slp_content = [], isLoading = true } = !isServer()
    ? props.listingPage
    : props.data;
  const [mobile, setMobile] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(30);
  const [category, setCategory] = useState(router.query.categoryId);
  const [sellerId, setSellerId] = useState(router.query.sellerId);

  const [queryParams, setQueryParams] = useState({
    sort_by: "popularity",
    sort_order: "DESC",
    size: limit,
    from: offset,
    bird: keycloak.authenticated || cookie.get("appToken") ? "lion" : "apple",
  });

  const getQueryParamString = () => {
    let queryObj = {};
    const rq = router.query;

    if (Object.keys(rq).length) {
      for (const prop in router.query) {
        if (prop !== "categoryId" && prop !== "sellerId") {
          queryObj[prop] = rq[prop];
        }
      }
      return querystring.stringify(queryObj);
    } else return "";
  };

  useEffect(() => {
    let width = window.screen ? window.screen.width : window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }
    const {
      f_categories,
      f_key_methods,
      f_values,
      f_product_types,
      f_color,
      f_l2_names,
      f_l3_names,
      f_country,
      f_style_type,
      f_material,
      startPrice,
      endPrice,
      cameo,
      f_themes,
      f_seller_code,
      f_moqBucket,
      f_isfreeshipping,
      exfactoryListPrice,
      f_categorieslist,
      f_l1names,
      f_seller_names,
      f_l2name,
      f_l3name,
      f_l1_names,
      bird,
      sellerId: sellerIdKey,
      ...rest
    } = queryParams;
    let defaultQuery = querystring.stringify(rest);
    let query = getQueryParamString();
    let { categoryId = "", sellerId = "" } = router.query;

    if (query) {
      query = defaultQuery + "&" + query.replace("?", "");
    } else {
      query = defaultQuery;
    }

    if (categoryId.toLowerCase() !== "all-categories") {
      query = query + "&f_categories=" + categoryId;
    }
    query = query + "&sellerId=" + sellerId;
    let jsonQuery = queryString.parse(query);
    setQueryParams(jsonQuery);
    props.getProductSellerDetails(appToken, sellerId);
    props.getSPLPDetails(query);
    setSellerId(sellerId);
  }, [router.query]);

  const getFilterData = (queryParams, instanceType) => {
    setQueryParams(queryParams);
    const tempObj = {};

    for (const key in queryParams) {
      if (
        key !== "f_categories" &&
        key !== "from" &&
        key !== "size" &&
        key !== "sort_by" &&
        key !== "sort_order" &&
        key !== "state" &&
        key !== "bird"
      ) {
        tempObj[key] = queryParams[key];
      }
    }

    if (instanceType === "clear") {
      router.push(
        {
          pathname: window.location.pathname,
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(
        {
          pathname: window.location.pathname,
          query: tempObj,
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const loadMoreData = () => {
    let offsetCount = offset + limit;
    setOffset(offsetCount);
    let queryObj = { ...queryParams, size: limit, from: offsetCount };
    let queryResult = querystring.stringify(queryObj);
    props.getSPLPDetails(queryResult, slp_content);
  };

  const setCategoryName = (categoryName) => {
    setCategory(categoryName);
  };
  return (
    <div>
      {mobile ? (
        <SellerProductListingMobile
          data={!isServer() ? props.listingPage : props.data}
          isLoading={!isServer() ? props.listingPage.isLoading : false}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          category={category}
          setCategoryName={setCategoryName}
          sellerId={sellerId}
          sellerDetails={isServer() ? props.data.sellerDetails : sellerDetails}
          token={keycloak.token || token}
          userProfile={userProfile}
          // sellerIdentity={(sellerDetails && sellerDetails.kcIdentityId) || null}
        />
      ) : (
        <SellerProductListingDesktop
          data={!isServer() ? props.listingPage : props.data}
          isLoading={!isServer() ? props.listingPage.isLoading : false}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          category={category}
          setCategoryName={setCategoryName}
          sellerId={sellerId}
          sellerDetails={isServer() ? props.data.sellerDetails : sellerDetails}
          userProfile={userProfile}
          token={keycloak.token || token}
          // sellerIdentity={(sellerDetails && sellerDetails.kcIdentityId) || null}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    listingPage: state.sellerListing,
    sellerDetails: state.sellerListing.sellerDetails,
    userProfile: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, {
  getSPLPDetails,
  getProductSellerDetails,
})(SellerProductListing);
