/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ProductListingDesktop from "./ProductListingDesktop";
// import ProductListingMobile from "../mobile/ProductListingMobile";
import { getPLPDetails } from "../../store/actions";
import queryString from "query-string";
const querystring = require("querystring");
import {useRouter} from "next/router";
const isServer = () => typeof window == undefined;

const ProductListing = (props) => {
  const router = useRouter();
  
  let { slp_content = [], isLoading = true } = !isServer()?props.listingPage:props.data;
  const [mobile, setMobile] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(30);
  const [category, setCategory] = useState(props.data.categoryId);
  const [categoryTitle, setCategoryTitle] = useState("All categories");
  const [subCategoryTitle, setSubCategoryTitle] = useState(
    "Shop handcrafted and artisanal products, produced ethically at wholesale prices."
  );

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
        if(prop !== "categoryId"){
          queryObj[prop] = rq[prop]
        }
      }
      return querystring.stringify(queryObj);
    } else return ""
  }
  useEffect(() => {
    setCategoryName(props.data.categoryId);
    let width = window.screen ? window.screen.width : window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }
    const {f_categories,f_key_methods, f_values, f_product_types, ...rest} = queryParams;
    let defaultQuery = querystring.stringify(rest);
    let query = getQueryParamString();
    let { categoryId = "" } = router.query;
    if (query) {
      query = defaultQuery + "&" + query.replace("?", "");
    } else {
      query = defaultQuery;
    }
    
    if (categoryId.toLowerCase() !== "all categories") {
      query = query + "&f_categories=" + categoryId;
    }
    let jsonQuery = queryString.parse(query);
    setQueryParams(jsonQuery);
    props.getPLPDetails(query, true);
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
      //f_key_methods, f_values, f_product_types
      if (key=="f_values"|| key=="f_key_methods" || key=="f_product_types") {
        tempObj[key] = queryParams[key];
      }
    }
    router.push({
      pathname: router.asPath.split('?')[0],
      query: tempObj,    
  }, undefined, {shallow: true });
  //   let queryResult = querystring.stringify(queryParams);
  //   let tempQuery="";
  //   const arr=[];
  //   queryResult.split('&').forEach(element => {
  //     if(!element.search('f_values')||!element.search('f_key_methods')||!element.search('f_product_types')){
  //       arr.push(element);
  //     }
  // });
  
  // if(arr.length>0){
  // tempQuery = arr.length>2?(`?${arr[0]}&${arr[1]}&${arr[2]}`):(arr.length>1?`?${arr[0]}&${arr[1]}`:`?${arr[0]}`);
  // } 
  // let newurl =
  //       window.location.protocol +
  //       "//" +
  //       window.location.host +
  //       window.location.pathname +
  //       tempQuery;
  //     window.history.pushState({ path: newurl }, "", newurl);
  //     tempQuery="";
  //   props.getPLPDetails(queryResult, false);
  };

  const loadMoreData = () => {
    let offsetCount = offset + limit;
    setOffset(offsetCount);
    let queryObj = { ...queryParams, size: limit, from: offsetCount };
    let queryResult = querystring.stringify(queryObj);
    props.getPLPDetails(queryResult, false, slp_content);
  };

  const setCategoryName = (categoryName) => {
    switch (categoryName) {
      case "Home Furnishing":
        setCategoryTitle("Home furnishings & linens");
        setSubCategoryTitle(
          "Wholesale cushions, throws, quilts, bedding, bath linen, rugs & carpets"
        );
        break;

      case "Furniture & Storage":
        setCategoryTitle("Furniture & storage");
        setSubCategoryTitle(
          "Shop bookcases, benches, chairs, desks, wine cabinets, trunks, beds & poufs in bulk"
        );
        break;

      case "Home Décor & Accessories":
        setCategoryTitle("Home decor");
        setSubCategoryTitle(
          "Wholesale home decor, lighting, ornaments, wall art, candlesticks and garden accessories"
        );
        break;

      case "Kitchen & Dining":
        setCategoryTitle("Kitchen & dining");
        setSubCategoryTitle(
          "Shop tableware, dinnerware, cookware, utensils, cutlery, linens & bar accessories in bulk"
        );
        break;

      case "Fashion":
        setCategoryTitle("Fashion, accessories & textiles");
        setSubCategoryTitle(
          "Wholesale textiles, apparel, scarves, stoles, bags, shawls, belts & footwear"
        );
        break;

      case "Pets Essentials":
        setCategoryTitle("Pet accessories");
        setSubCategoryTitle(
          "Shop dog beds, feeders, cat towers, collars & leashes in bulk"
        );
        break;

      case "Baby & Kids":
        setCategoryTitle("Baby & kids products");
        setSubCategoryTitle(
          "Shop in bulk for organic cotton crib sets, eco-friendly toys, learning tools and & kids furniture"
        );
        break;

      case "Jewelry":
        setCategoryTitle("Jewelry");
        setSubCategoryTitle(
          "Wholesale earrings, necklaces, bracelets, rings, nose pins and cuff links"
        );
        break;

      default:
        setCategoryTitle("All categories");
        setSubCategoryTitle(
          "Shop handcrafted and artisanal products, produced ethically at wholesale prices"
        );
    }
    setCategory(categoryName);
  };

  return (
    <div>
      
      {/* {mobile ? ( */}
        {/* <ProductListingMobile
          data={data}
          isLoading={isLoading}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          setCategoryName={setCategoryName}
          categoryTitle={categoryTitle}
          subCategoryTitle={subCategoryTitle}
          category={category}
        /> */}
      {/* ) : ( */}
        <ProductListingDesktop
          data={!isServer()?props.listingPage:props.data}
          isLoading={!isServer()?props.listingPage.isLoading:false}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          setCategoryName={setCategoryName}
          categoryTitle={categoryTitle}
          subCategoryTitle={subCategoryTitle}
          category={category}
        />
      {/* )} */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    listingPage: state.sellerListing,
  };
};

export default connect(mapStateToProps, { getPLPDetails })(ProductListing);
