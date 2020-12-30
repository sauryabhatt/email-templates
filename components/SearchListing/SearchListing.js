/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SearchListingDesktop from "./SearchListingDesktop";
import SearchListingMobile from "../mobile/SearchListingMobile";
import { getPLPDetails, getSLPDetails } from "../../store/actions";
import queryString from "query-string";
import { useRouter } from "next/router";
const isServer = () => typeof window == "undefined";
const querystring = require("querystring");

const SearchListing = (props) => {
  const router = useRouter();
  let { slp_content = [], isLoading = true } = !isServer()
    ? props.listingPage
    : props.data;
  const [mobile, setMobile] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(30);
  const [category, setCategory] = useState("All Categories");
  const [categoryTitle, setCategoryTitle] = useState("All categories");
  const [searchBy, setSearchBy] = useState("");
  const [searchText, setSearchText] = useState("");

  const [queryParams, setQueryParams] = useState({
    sort_by: "popularity",
    sort_order: "DESC",
    size: limit,
    from: offset,
  });

  const getQueryParamString = () => {
    let queryObj = {};
    const rq = router.query;

    if (Object.keys(rq).length) {
      for (const prop in router.query) {
        if (prop !== "search" || prop !== "searchBy") {
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
    let { searchBy = "", search: searchFromQuery = "" } =
      props.data || router.query;

    const {
      f_product_types,
      f_categories,
      f_key_methods,
      f_values,
      search,
      sort_by: sort,
      ...rest
    } = queryParams;
    let newObj = { ...rest };
    if (searchBy.toLowerCase() === "seller") {
      newObj = {
        ...rest,
        sort_by: sort,
        sort_order: "DESC",
      };
    } else {
      newObj = {
        ...rest,
        sort_by: sort,
        sort_order: "DESC",
      };
    }
    let defaultQuery = querystring.stringify(newObj);
    let query = getQueryParamString();

    if (query) {
      query = defaultQuery + "&" + query.replace("?", "");
    } else {
      query = defaultQuery;
    }

    let jsonQuery = queryString.parse(query);
    setQueryParams(jsonQuery);
    if (searchBy === "product") {
      props.getPLPDetails(query, true);
      setCategoryTitle(
        `Showing products related to '${decodeURIComponent(searchFromQuery)}'`
      );
    } else {
      props.getSLPDetails(query, true);
      setCategoryTitle(
        `Showing sellers related to '${decodeURIComponent(searchFromQuery)}'`
      );
    }
    setSearchBy(searchBy);
    setSearchText(decodeURIComponent(searchFromQuery));
  }, [router.query]);

  const getFilterData = (queryParams, instanceType) => {
    setQueryParams(queryParams);
    const tempObj = {};

    for (const key in queryParams) {
      if (
        key == "f_values" ||
        key == "f_key_methods" ||
        key == "f_product_types"
      ) {
        tempObj[key] = queryParams[key];
      }
    }

    if (instanceType === "clear") {
      router.push(
        {
          pathname:
            window.location.protocol +
            "//" +
            window.location.host +
            "/search/" +
            router.query.searchBy +
            "/" +
            encodeURIComponent(router.query.search),
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(
        {
          pathname:
            window.location.protocol +
            "//" +
            window.location.host +
            "/search/" +
            router.query.searchBy +
            "/" +
            encodeURIComponent(router.query.search),
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
    if (searchBy === "product") {
      props.getPLPDetails(queryResult, false, slp_content);
    } else {
      props.getSLPDetails(queryResult, false, slp_content);
    }
  };

  const setCategoryName = (categoryName) => {
    // console.log(categoryName);
  };

  return (
    <>
      {mobile ? (
        <SearchListingMobile
          data={!isServer() ? props.listingPage : props.data}
          isLoading={!isServer() ? props.listingPage.isLoading : false}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          setCategoryName={setCategoryName}
          categoryTitle={categoryTitle}
          category={category}
          searchBy={searchBy}
          searchText={searchText}
        />
      ) : (
        <SearchListingDesktop
          data={!isServer() ? props.listingPage : props.data}
          isLoading={!isServer() ? props.listingPage.isLoading : false}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          setCategoryName={setCategoryName}
          categoryTitle={categoryTitle}
          category={category}
          searchBy={searchBy}
          searchText={searchText}
        />
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    listingPage: state.sellerListing,
  };
};

export default connect(mapStateToProps, { getPLPDetails, getSLPDetails })(
  SearchListing
);
