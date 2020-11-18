/** @format */

import React from "react";
import { Layout } from "antd";
import ProductFacets from "../common/ProductFacets";
import BreadCrumb from "../common/BreadCrumb";
import ContentSection from "../common/ContentSection";
import SortByFilter from "../common/SortByFilter";
import PLPFooter from "../common/PLPFooter";
import { Row, Col, Switch } from "antd";
import SLPLoader from "../../public/filestore/SLPLoader";
import Icon from "@ant-design/icons";
const { Content } = Layout;

function ProductListingDesktop(props) {
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
      <Layout className="seller-listing-container" id="product-listing-page">
        <Content style={{ background: "#f9f7f2" }}>
          <BreadCrumb pageId="product-listing" categoryName={category} />
        </Content>

        <Layout style={{ background: "#f9f7f2" }}>
          <ProductFacets
            getFilterData={getFilterData}
            queryParams={queryParams}
            facets={slp_facets}
            categories={slp_categories}
            setCategoryName={setCategoryName}
            pageId="product-listing"
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
                <SortByFilter
                  handleSortFilter={handleSortFilter}
                  id="PLP"
                  queryParams={queryParams}
                />
              </Col>
            </Row>

            <ContentSection
              pageId="product-listing"
              content={slp_content}
              count={slp_count}
              loadMoreData={loadMoreData}
            />
          </Layout>
        </Layout>
      </Layout>
      <PLPFooter category={category} />
    </div>
  );
}

export default ProductListingDesktop;
