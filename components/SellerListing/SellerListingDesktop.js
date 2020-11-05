/** @format */

import React from "react";
import { Layout } from "antd";
import SellerFacets from "../common/SellerFacets";
import BreadCrumb from "../common/BreadCrumb";
import ContentSection from "../common/ContentSection";
import SortByFilter from "../common/SortByFilter";
import SEOFooter from "../common/SEOFooter";
import { Row, Col } from "antd";
import SLPLoader from "../../public/filestore/SLPLoader";
import Icon from "@ant-design/icons";
const { Content } = Layout;

function SellerListingDesktop(props) {
  let productList = props.data;
  let {
    queryParams = {},
    getFilterData,
    loadMoreData,
    setCategoryName,
    categoryTitle,
    subCategoryTitle,
    category,
    isLoading,
  } = props;
  let {
    slp_content = [],
    slp_count = 0,
    slp_facets = [],
    slp_categories = {},
  } = productList || {};

  const handleSortFilter = (value) => {
    let queryParam = queryParams;
    if (value === "asc") {
      queryParam = { ...queryParam, sort_order: "ASC", sort_by: "brandName" };
    } else if (value === "desc") {
      queryParam = { ...queryParam, sort_order: "DESC", sort_by: "brandName" };
    } else {
      queryParam = { ...queryParam, sort_order: "DESC", sort_by: value };
    }
    getFilterData(queryParam, "sort");
  };

  if (isLoading) {
    return (
      <Icon
        component={SLPLoader}
        style={{ width: "100%" }}
        className="slp-loader-icon"
      />
    );
  }

  return (
    <div>
      <Layout className="seller-listing-container">
        <Content style={{ background: "#f9f7f2" }}>
          <BreadCrumb pageId="seller-listing" categoryName={category} />
        </Content>

        <Layout style={{ background: "#f9f7f2" }}>
          <SellerFacets
            getFilterData={getFilterData}
            queryParams={queryParams}
            facets={slp_facets}
            categories={slp_categories}
            setCategoryName={setCategoryName}
          />
          <Layout style={{ background: "#f9f7f2" }}>
            <Row className="qa-pad-0-30">
              <Col span={18}>
                <div className="qa-font-butler qa-fs-but-22 qa-mar-btm-05">
                  {categoryTitle}
                </div>
                <div className="qa-font-san qa-fs-14 seller-details-text qa-text-body">
                  {subCategoryTitle}
                </div>
              </Col>

              <Col span={6} className="qa-txt-alg-rgt qa-mar-top-1">
                <SortByFilter handleSortFilter={handleSortFilter} />
              </Col>
            </Row>

            <ContentSection
              pageId="seller-listing"
              content={slp_content}
              count={slp_count}
              loadMoreData={loadMoreData}
            />
          </Layout>
        </Layout>
      </Layout>
      <SEOFooter category={category} />
    </div>
  );
}

export default SellerListingDesktop;
