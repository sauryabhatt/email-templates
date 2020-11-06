/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SellerProductListingDesktop from "./SellerProductListingDesktop";
import SellerProductListingMobile from "../mobile/SellerProductListingMobile";
import { getSPLPDetails, getProductSellerDetails } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useSelector } from "react-redux";
import queryString from "query-string";
import {useRouter} from "next/router";
const isServer = () => typeof window == undefined;

const querystring = require("querystring");

//TODO: handle token

const SellerProductListing = (props) => {
  const router = useRouter();
  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );

  const {keycloak} = useKeycloak();
  let appToken = keycloak.token ? keycloak.token : token;
  let data = !isServer()?props.listingPage:props.data;
  let { sellerDetails = {}, userProfile = {} } = props || {};
  let { orgName = "", categoryDescs = [] } = sellerDetails || {};
  let { slp_content = [], isLoading = true } = !isServer()?props.listingPage:props.data;
  const [mobile, setMobile] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(30);
  const [category, setCategory] = useState(router.query.categoryId);
  const [sellerId, setSellerId] = useState(router.query.sellerId);

  const [queryParams, setQueryParams] = useState({
    sort_by: "minimumOrderQuantity",
    sort_order: "ASC",
    size: limit,
    from: offset,
  });

  const getQueryParamString=()=>{
    let queryObj={};
    const rq = router.query

    if(Object.keys(rq).length) {
      for (const prop in router.query) {
        if(prop !== "categoryId" && prop !== "sellerId"){
          queryObj[prop] = rq[prop]
        }
      }
      return querystring.stringify(queryObj);
    } else return ""
  }

  useEffect(() => {
    let width = window.screen ? window.screen.width : window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }
    const { f_categories, sellerId: sellerIdKey,f_key_methods, f_values, f_product_types, ...rest } = queryParams;
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
    if (
      instanceType === "categories" ||
      instanceType === "sort" ||
      instanceType === "filter" ||
      instanceType === "submit"
    ) {
      setOffset(0);
    }
    setQueryParams(queryParams);

    const tempObj = {};
    
    for (const key in queryParams) {
      if (key=="f_values"|| key=="f_key_methods" || key=="f_product_types") {
        tempObj[key] = queryParams[key];
      }
    }
    router.push({
      pathname: router.asPath.split('?')[0],
      query: tempObj,    
  }, undefined, {shallow: true });
    // let queryResult = querystring.stringify(queryParams);
    // let tempQuery = "";
    // const arr = [];
    // queryResult.split("&").forEach((element) => {
    //   if (
    //     !element.search("f_values") ||
    //     !element.search("f_key_methods") ||
    //     !element.search("f_product_types")
    //   ) {
    //     arr.push(element);
    //   }
    // });
    // if (arr.length > 0) {
    //   tempQuery =
    //     arr.length > 2
    //       ? `?${arr[0]}&${arr[1]}&${arr[2]}`
    //       : arr.length > 1
    //       ? `?${arr[0]}&${arr[1]}`
    //       : `?${arr[0]}`;
    // }
    // let newurl =
    //   window.location.protocol +
    //   "//" +
    //   window.location.host +
    //   window.location.pathname +
    //   tempQuery;
    // window.history.pushState({ path: newurl }, "", newurl);
    // tempQuery = "";
    // props.getSPLPDetails(queryResult);
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
        data={!isServer()?props.listingPage:props.data}
        isLoading={!isServer()?props.listingPage.isLoading:false}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          category={category}
          setCategoryName={setCategoryName}
          sellerId={sellerId}
          sellerDetails={isServer()?props.data.sellerDetails:sellerDetails}
          // token={keycloak.token || token}
          userProfile={userProfile}
          // sellerIdentity={(sellerDetails && sellerDetails.kcIdentityId) || null}
        />
      ) : ( 
        <SellerProductListingDesktop
          data={!isServer()?props.listingPage:props.data}
          isLoading={!isServer()?props.listingPage.isLoading:false}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          category={category}
          setCategoryName={setCategoryName}
          sellerId={sellerId}
          sellerDetails={isServer()?props.data.sellerDetails:sellerDetails}
          userProfile={userProfile}
          // token={keycloak.token || token}
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
