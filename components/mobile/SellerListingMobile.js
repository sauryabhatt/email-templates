/** @format */

import React, { useState, useEffect } from "react";
import { Layout, Button, Drawer } from "antd";
import SellerFacets from "../common/SellerFacets";
import BreadCrumb from "../common/BreadCrumb";
import ContentSection from "../common/ContentSection";
import SEOFooter from "../common/SEOFooter";
import SLPLoaderMobile from "../../public/filestore/SLPLoaderMobile";
import Icon from "@ant-design/icons";

function SellerListingMobile(props) {
  let productList = props.data;
  let {
    queryParams = {},
    getFilterData,
    loadMoreData,
    setCategoryName,
    categoryTitle,
    subCategoryTitle,
    category,
    isLoading = true,
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

  useEffect(() => {
    setDrawer(false);
  }, [props.categoryTitle]);

  const showDrawer = () => {
    setDrawer(true);
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

  return (
    <div>
      <Layout className="seller-listing-container">
        <Layout style={{ background: "#f9f7f2", display: "block" }}>
          <BreadCrumb pageId="seller-listing" categoryName={category} />

          <div className="qa-pad-0-30">
            <div className="qa-font-butler qa-fs-but-22 qa-mar-btm-1">
              {categoryTitle}
            </div>
            <div className="qa-font-san seller-details-text qa-text-body">
              {subCategoryTitle}
            </div>
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
            </Drawer>
          </div>
          <ContentSection
            pageId="seller-listing"
            isMobile={true}
            content={slp_content}
            count={slp_count}
            loadMoreData={loadMoreData}
          />
        </Layout>
      </Layout>
      <SEOFooter category={category} />
    </div>
  );
}

export default SellerListingMobile;
