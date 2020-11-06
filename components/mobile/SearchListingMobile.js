/** @format */

import React, { useState, useEffect } from "react";
import { Layout, Button, Drawer } from "antd";
import ProductFacets from "../common/ProductFacets";
import BreadCrumb from "../common/BreadCrumb";
import ContentSection from "../common/ContentSection";
import PLPFooter from "../common/PLPFooter";
import SLPLoaderMobile from "../../public/filestore/SLPLoaderMobile";
import Icon from "@ant-design/icons";
import CategoryBannerCarousel from "../CategoryBannerCarousel";
import SellerFacets from "../common/SellerFacets";

function SellerListingMobile(props) {
  let productList = props.data;
  let {
    queryParams = {},
    getFilterData,
    loadMoreData,
    setCategoryName,
    categoryTitle,
    searchBy,
    category,
    isLoading,
    searchText = "",
  } = props;
  let {
    slp_content = [],
    slp_count = 0,
    slp_facets = [],
    slp_categories = {},
  } = productList || {};

  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    let queries = props.queryParams;
    for (let list in queries) {
      if (list === "f_categories") {
        if (queries[list]) {
          setCategoryName(queries[list]);
        }
      }
    }
  }, [props.queryParams]);

  const showDrawer = () => {
    let state = !drawer;
    setDrawer(state);
  };

  const onClose = () => {
    setDrawer(false);
  };

  if (isLoading) {
    return (
      <Icon
        component={SLPLoaderMobile}
        style={{ width: "100%" }}
        className="slp-loader-icon"
      />
    );
  }

  if (slp_count === null || slp_count === 0) {
    return (
      <Layout
        className="seller-listing-container"
        id="product-listing-page"
        style={{ background: "#f9f7f2", display: "block" }}
      >
        <div className="qa-pad-0-30 qa-mar-btm-4">
          <div className="qa-font-butler qa-fs-but-22 qa-mar-btm-1 qa-pad-top-2 qa-txt-alg-cnt qa-wb-all">
            Sorry we could not find any{" "}
            {searchBy === "product" ? "products" : "sellers"} related to '
            {searchText}'
          </div>
          <div className="qa-font-san seller-details-text qa-text-body qa-txt-alg-cnt">
            However you can browse our extensive range of handmade, eco friendly
            products
          </div>
          <CategoryBannerCarousel pageId="SLP" />
        </div>
      </Layout>
    );
  }

  return (
    <div>
      <Layout className="seller-listing-container" id="product-listing-page">
        <Layout style={{ background: "#f9f7f2", display: "block" }}>
          <BreadCrumb pageId="search-listing" categoryName={searchText} />

          <div className="qa-pad-0-30">
            <div className="qa-font-butler qa-fs-but-22 qa-mar-btm-1 qa-wb-all">
              {categoryTitle}
            </div>
            {/* <div className="qa-font-san seller-details-text qa-text-body">
              {subCategoryTitle}
            </div> */}
          </div>
          <div className="qa-pad-0-30">
            <Button className="qa-button slp-filters" onClick={showDrawer}>
              <div className="slp-filters-text">Filters</div>
            </Button>
            <Drawer
              placement="right"
              closable={false}
              width="100%"
              onClose={onClose}
              visible={drawer}
              className="mobile-slider-filter"
            >
              <Button className="button-back" type="link" onClick={onClose}>
                <svg
                  width="46"
                  height="45"
                  viewBox="0 0 46 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.8125"
                    width="45"
                    height="45"
                    rx="15"
                    fill="white"
                  />
                  <path
                    d="M23.3125 18L18.8125 22.5L23.3125 27"
                    stroke="#332F2F"
                    strokeWidth="2"
                  />
                  <path
                    d="M19.2617 22.5L28.2617 22.5"
                    stroke="#332F2F"
                    strokeWidth="2"
                  />
                </svg>
              </Button>
              {searchBy === "product" ? (
                <ProductFacets
                  width="100%"
                  id="mobile"
                  pageId="product-listing"
                  getFilterData={getFilterData}
                  facets={slp_facets}
                  setCategoryName={setCategoryName}
                  queryParams={queryParams}
                  onClose={onClose}
                  categories={slp_categories}
                />
              ) : (
                <SellerFacets
                  width="100%"
                  id="mobile"
                  getFilterData={getFilterData}
                  facets={slp_facets}
                  setCategoryName={setCategoryName}
                  queryParams={queryParams}
                  onClose={onClose}
                  categories={slp_categories}
                />
              )}
            </Drawer>
          </div>
          {searchBy === "product" ? (
            <ContentSection
              pageId="product-listing"
              isMobile={true}
              content={slp_content}
              count={slp_count}
              loadMoreData={loadMoreData}
            />
          ) : (
            <ContentSection
              pageId="seller-listing"
              isMobile={true}
              content={slp_content}
              count={slp_count}
              loadMoreData={loadMoreData}
            />
          )}
        </Layout>
      </Layout>
      <PLPFooter category={category} />
    </div>
  );
}

export default SellerListingMobile;
