/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import ProductListingDesktop from "./ProductListingDesktop";
import ProductListingMobile from "../mobile/ProductListingMobile";
import { getPLPDetails } from "../../store/actions";
import queryString from "query-string";
const querystring = require("querystring");
import { useRouter } from "next/router";
const isServer = () => typeof window == "undefined";

const ProductListing = (props) => {
  const router = useRouter();

  let { slp_content = [], isLoading = true } = !isServer()
    ? props.listingPage
    : props.data;

  let { gb = false } = props.data;
  const [mobile, setMobile] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(30);
  const [category, setCategory] = useState(props.data.categoryId);
  const [categoryTitle, setCategoryTitle] = useState("All categories");
  const [subCategoryTitle, setSubCategoryTitle] = useState(
    "Shop handcrafted and artisanal products, produced ethically at wholesale prices."
  );

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
        if (prop !== "categoryId") {
          queryObj[prop] = rq[prop];
        }
      }
      return querystring.stringify(queryObj);
    } else return "";
  };
  useEffect(() => {
    setCategoryName(props.data.categoryId);
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
      ...rest
    } = queryParams;
    let defaultQuery = querystring.stringify(rest);
    let query = getQueryParamString();
    let { categoryId = "all-categories" } = router.query;

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
    props.getPLPDetails(query, true, false, gb);
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
        key !== "state"
      ) {
        tempObj[key] = queryParams[key];
      }
    }

    if (gb) {
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
    } else {
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
    }
  };

  const loadMoreData = () => {
    let offsetCount = offset + limit;
    setOffset(offsetCount);
    let queryObj = { ...queryParams, size: limit, from: offsetCount };
    let queryResult = querystring.stringify(queryObj);
    props.getPLPDetails(queryResult, false, slp_content, gb);
  };

  const setCategoryName = (categoryName) => {
    switch (categoryName) {
      case "home-furnishing":
        setCategoryTitle("Home linen & furnishings");
        setSubCategoryTitle(
          "Wholesale cushions, throws, quilts, bedding, bath linen, rugs & carpets"
        );
        break;

      case "furniture-and-storage":
        setCategoryTitle("Furniture & storage");
        setSubCategoryTitle(
          "Shop bookcases, benches, chairs, desks, wine cabinets, trunks, beds & poufs in bulk"
        );
        break;

      case "home-decor-and-accessories":
        setCategoryTitle("Home accents & decor");
        setSubCategoryTitle(
          "Wholesale home decor, lighting, ornaments, wall art, candlesticks and garden accessories"
        );
        break;

      case "kitchen-and-dining":
        setCategoryTitle("Kitchenware suppliers");
        setSubCategoryTitle(
          "Shop tableware, dinnerware, cookware, utensils, cutlery, linens & bar accessories in bulk"
        );
        break;

      case "fashion":
        setCategoryTitle("Fashion, accessories & textiles");
        setSubCategoryTitle(
          "Wholesale textiles, apparel, scarves, stoles, bags, shawls, belts & footwear"
        );
        break;

      case "pets-essentials":
        setCategoryTitle("Pet accessories");
        setSubCategoryTitle(
          "Shop dog beds, feeders, cat towers, collars & leashes in bulk"
        );
        break;

      case "baby-and-kids":
        setCategoryTitle("Baby & kids products");
        setSubCategoryTitle(
          "Shop in bulk for organic cotton crib sets, eco-friendly toys, learning tools and & kids furniture"
        );
        break;

      case "jewelry":
        setCategoryTitle("Jewelry");
        setSubCategoryTitle(
          "Wholesale earrings, necklaces, bracelets, rings, nose pins and cufflinks"
        );
        break;

      case "stationery-and-novelty":
        setCategoryTitle("Stationery & novelty");
        setSubCategoryTitle(
          "Wholesale journals, planners, table organisers, pen stands, games, bookmarks and novelty products"
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
      {mobile ? (
        <ProductListingMobile
          data={!isServer() ? props.listingPage : props.data}
          isLoading={!isServer() ? props.listingPage.isLoading : false}
          getFilterData={getFilterData}
          queryParams={queryParams}
          loadMoreData={loadMoreData}
          setCategoryName={setCategoryName}
          categoryTitle={categoryTitle}
          subCategoryTitle={subCategoryTitle}
          category={category}
        />
      ) : (
        <ProductListingDesktop
          data={!isServer() ? props.listingPage : props.data}
          isLoading={!isServer() ? props.listingPage.isLoading : false}
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

export default connect(mapStateToProps, { getPLPDetails })(ProductListing);
