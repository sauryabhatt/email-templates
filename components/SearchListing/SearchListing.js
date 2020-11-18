/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SearchListingDesktop from "./SearchListingDesktop";
import SearchListingMobile from "../mobile/SearchListingMobile";
import { getPLPDetails, getSLPDetails } from "../../store/actions";
import queryString from "query-string";
import { useRouter } from "next/router";
const querystring = require("querystring");

const SearchListing = (props) => {
  const router = useRouter();
  let { slp_content = [], isLoading = true } = props.listingPage;
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
    let { searchBy = "", search: searchFromQuery = "" } = router.query;
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
      if (
        key == "f_values" ||
        key == "f_key_methods" ||
        key == "f_product_types"
      ) {
        tempObj[key] = queryParams[key];
      }
    }

    router.push(
      {
        pathname: router.asPath.split("?")[0],
        query: tempObj,
      },
      undefined,
      { shallow: true }
    );

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
    // if (searchBy === "product") {
    //   props.getPLPDetails(queryResult, false);
    // } else {
    //   props.getSLPDetails(queryResult, false);
    // }
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
          data={props.listingPage}
          isLoading={props.listingPage.isLoading}
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
          data={props.listingPage}
          isLoading={isLoading}
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
