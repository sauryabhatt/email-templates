/** @format */

import React from "react";
import { Layout } from "antd";
import ProductFacets from "../common/ProductFacets";
import SellerFacets from "../common/SellerFacets";
import BreadCrumb from "../common/BreadCrumb";
import ContentSection from "../common/ContentSection";
import SortByFilter from "../common/SortByFilter";
import PLPFooter from "../common/PLPFooter";
import SLPFooter from "../common/SEOFooter";
import { Row, Col, Switch } from "antd";
import PLPLoader from "../../public/filestore/PLPLoader";
import Icon from "@ant-design/icons";
import CategoryBannerCarousel from "../CategoryBannerCarousel";
const { Content } = Layout;

function SearchListingDesktop(props) {
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

  const handleSortFilter = (value) => {
    let queryParam = queryParams;
    if (value === "createdTs") {
      queryParam = { ...queryParam, sort_order: "DESC", sort_by: "createdTs" };
    } else if (value === "minimumOrderQuantity") {
      queryParam = {
        ...queryParam,
        sort_order: "ASC",
        sort_by: "minimumOrderQuantity",
      };
    } else {
      queryParam = { ...queryParam, sort_order: "ASC", sort_by: value };
    }
    getFilterData(queryParam, "sort");
  };

  if (isLoading) {
    return (
      <Icon
        component={PLPLoader}
        style={{ width: "100%" }}
        className="slp-loader-icon"
      />
    );
  }

  if (slp_count === null || slp_count === 0) {
    return (
      <Layout className="seller-listing-container" id="product-listing-page">
        <Content
          style={{ background: "#f9f7f2", padding: "50px 0px 150px 50px" }}
        >
          <div>
            <div className="qa-font-butler qa-fs-but-22 qa-mar-btm-05 qa-wb-all qa-pad-rgt-50">
              Sorry we could not find any{" "}
              {searchBy === "product" ? "products" : "sellers"} related to '
              {searchText}'
            </div>
            <div className="qa-font-san qa-fs-14 seller-details-text qa-text-body qa-pad-rgt-50">
              However you can browse our extensive range of handmade, eco
              friendly products
            </div>
            <CategoryBannerCarousel pageId="SLP" />
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <div>
      <Layout className="seller-listing-container" id="product-listing-page">
        <Content style={{ background: "#f9f7f2" }}>
          <BreadCrumb pageId="search-listing" categoryName={searchText} />
        </Content>

        <Layout style={{ background: "#f9f7f2" }}>
          {searchBy === "product" ? (
            <ProductFacets
              getFilterData={getFilterData}
              queryParams={queryParams}
              facets={slp_facets}
              categories={slp_categories}
              setCategoryName={setCategoryName}
              pageId="product-listing"
            />
          ) : (
            <SellerFacets
              getFilterData={getFilterData}
              queryParams={queryParams}
              facets={slp_facets}
              categories={slp_categories}
              setCategoryName={setCategoryName}
            />
          )}
          <Layout style={{ background: "#f9f7f2" }}>
            <Row className="qa-pad-0-30">
              <Col span={18}>
                <div className="qa-font-butler qa-fs-but-22 qa-mar-btm-05 qa-wb-all">
                  {categoryTitle}
                </div>

                {/* <div className="qa-font-san qa-fs-14 seller-details-text qa-text-body">
                  {subCategoryTitle}
                </div> */}
              </Col>
              {/* <Col
                span={4}
                className="qa-txt-alg-rgt"
                style={{ paddingTop: "15px" }}
              >
                <div>
                  <span className="qa-pad-rgt-1">Video demo only:</span>
                  <Switch
                    size="small"
                    // defaultChecked
                    className="qa-video-check"
                  />
                </div>
              </Col> */}
              <Col span={6} className="qa-txt-alg-rgt qa-mar-top-1">
                <SortByFilter handleSortFilter={handleSortFilter} id="PLP" />
              </Col>
            </Row>

            {searchBy === "product" ? (
              <ContentSection
                pageId="product-listing"
                content={slp_content}
                count={slp_count}
                loadMoreData={loadMoreData}
              />
            ) : (
              <ContentSection
                pageId="seller-listing"
                content={slp_content}
                count={slp_count}
                loadMoreData={loadMoreData}
              />
            )}
          </Layout>
        </Layout>
      </Layout>
      {searchBy === "product" ? (
        <PLPFooter category={category} />
      ) : (
        <SLPFooter category={category} />
      )}
    </div>
  );
}

export default SearchListingDesktop;
