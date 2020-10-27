/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import SellerListingDesktop from "./SellerListingDesktop";
import SellerListingMobile from "../mobile/SellerListingMobile";
import { getSLPDetails } from "../../store/actions";
// import { Helmet } from "react-helmet";
import queryString from "query-string";
import {useRouter} from "next/router";
const querystring = require("querystring");
const isServer = () => typeof window == undefined;

const SellerListing = (props) => {
  const router = useRouter();
  let { slp_content = [], isLoading = true } = !isServer()?props.listingPage:props.data;
  const [mobile, setMobile] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(30);
  const [category, setCategory] = useState(props.data.categoryId);
  const [categoryTitle, setCategoryTitle] = useState("All curated suppliers");
  const [subCategoryTitle, setSubCategoryTitle] = useState(
    "Curated wholesale suppliers whose exquisite craftsmanship and consciously designed products will leave you awestruck"
  );

  const [queryParams, setQueryParams] = useState({
    sort_by: "publishedTimeStamp",
    sort_order: "DESC",
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
    const { f_categories,f_key_methods, f_values, ...rest } = queryParams;
    let defaultQuery = querystring.stringify(rest);

    let query = getQueryParamString();
    let { categoryId = "" } = router.query;
    if (query) {
      query = defaultQuery + "&" + query.replace("?", "");
    } else {
      query = defaultQuery;
    }

    if (categoryId.toLowerCase() !== "all-categories") {
      query = query + "&f_categories=" + categoryId;
    }
    let jsonQuery = queryString.parse(query);
    setQueryParams(jsonQuery);
    props.getSLPDetails(query, true);
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
      if (key=="f_values"|| key=="f_key_methods") {
        tempObj[key] = queryParams[key];
      }
    }
    // let queryResult = querystring.stringify(queryParams);
    // let tempQuery = "";
    // const arr = [];
    // queryResult.split("&").forEach((element) => {
    //   if (!element.search("f_values") || !element.search("f_key_methods")) {
    //     arr.push(element);
    //   }
    // });
    // if (arr.length > 0) {
    //   tempQuery = arr.length > 1 ? `?${arr[0]}&${arr[1]}` : `?${arr[0]}`;
    // }
    // let newurl =
    //   window.location.protocol +
    //   "//" +
    //   window.location.host +
    //   window.location.pathname +
    //   tempQuery;
    // window.history.pushState({ path: newurl }, "", newurl);
    router.push({
      pathname: router.asPath.split('?')[0],
      query: tempObj,    
  }, undefined, {shallow: true });
    // router.push(router.asPath + tempObj);
    // tempQuery = "";
    // props.getSLPDetails(queryResult, false);
  };

  const loadMoreData = () => {
    let offsetCount = offset + limit;
    setOffset(offsetCount);
    let queryObj = { ...queryParams, size: limit, from: offsetCount };
    let queryResult = querystring.stringify(queryObj);
    props.getSLPDetails(queryResult, false, slp_content);
  };
  function setCategoryName (categoryName) {
    switch (categoryName) {
      case "home-furnishing":
        setCategoryTitle("Home furnishing suppliers");
        setSubCategoryTitle(
          "Wholesale home furnishing brands who cater to all your needs for sheets, quilts, blankets, cushions, throws, rugs, table mats, runners and more, handcrafted in a wide variety of techniques like applique, kantha, macrame, tufting and hand weaving."
        );
        break;

      case "furniture-and-storage":
        setCategoryTitle("Furniture suppliers");
        setSubCategoryTitle(
          "Discover bulk furniture suppliers for chairs, benches, coffee tables, dressers and more, made in artisinal techniques like hand carving, hand weaving & hand painting. Choose from sustainable materials across wood, metal, wicker, rope & marble."
        );
        break;

      case "home-decor-and-accessories":
        setCategoryTitle("Home decor suppliers");
        setSubCategoryTitle(
          "Handpicked wholesale home decor suppliers who specialize in artisanal techniques of hand carved wood, marble inlay, metal sand casting, cane weaving to create beautiful home accents; lamps, baskets, vases, mirrors, clocks."
        );
        break;

      case "kitchen-and-dining":
        setCategoryTitle("Kitchenware suppliers");
        setSubCategoryTitle(
          "Curated wholesale brands for platters, cutlery, mugs, wine glasses & kitchen storage. Hand carved & hand painted kitchenware turns everyday utilities into objects of art. Choose from sustainable materials like wood, iron, ceramic & glass."
        );
        break;

      case "fashion":
        setCategoryTitle("Fashion accessories and textiles suppliers");
        setSubCategoryTitle(
          "The best wholesale textile and fashion accessories suppliers across silk, cashmere, cotton and other fabrics specializing in shibori, tie-dye, hand weaving, embroidery, patchwork and many more intricate techniques."
        );
        break;

      case "pets-essentials":
        setCategoryTitle("Pets accessories suppliers");
        setSubCategoryTitle(
          "Pet accessories wholesale suppliers who cater to all pet needs like food bowls, beds, mats and toys. Crafted in specialized techniques of knitting, patchwork, embroidery in sustainable materials like wood, leather, cotton and more."
        );
        break;

      case "baby-and-kids":
        setCategoryTitle("Baby & Kids accessories suppliers");
        setSubCategoryTitle(
          "The best wholesale suppliers specialising in baby and kids products. Choose from a wide range of available designs in crib sets, sheets, quilts, diaper bags and even customize designs to your specifications. These exquisite handcrafted eco-friendly wooden and cotton toys will become a part of your kid’s treasures."
        );
        break;

      case "jewelry":
        setCategoryTitle("Jewelry suppliers");
        setSubCategoryTitle(
          "Wholesale suppliers for all kinds of Jewelry and accessories. Our sellers specialise in techniques like hammering, inlay, gem craft, wire braiding and more to create stunning earrings, anklets, necklaces, bracelets, nose pins and other accessories."
        );
        break;

      default:
        setCategoryTitle("All curated suppliers");
        setSubCategoryTitle(
          "Curated wholesale suppliers whose exquisite craftsmanship and consciously designed products will leave you awestruck"
        );
    }
    setCategory(categoryName);
  };
  return (
    <div>
     
       {mobile ? (
        <SellerListingMobile
          data={props.listingPage}
          isLoading={props.listingPage.isLoading}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          setCategoryName={setCategoryName}
          categoryTitle={categoryTitle}
          subCategoryTitle={subCategoryTitle}
          category={category}
        />
      ) : ( 
        <SellerListingDesktop
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
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    listingPage: state.sellerListing,
  };
};

export default connect(mapStateToProps, { getSLPDetails })(SellerListing);
