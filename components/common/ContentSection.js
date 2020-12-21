/** @format */

import React, { useState, useEffect } from "react";
import { Layout, Row, Col } from "antd";
import ProductCard from "./ProductCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const { Content } = Layout;

function ContentSection(props) {
  let {
    content = [],
    count = 0,
    pageId,
    isMobile = false,
    loadMoreData,
    sellerId = "",
  } = props;

  const [selProductId, setSelProductId] = useState("");
  const [open, setOpen] = useState(false);

  const handleClickOutside = (e) => {
    setOpen(false);
    setSelProductId("");
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const selectProduct = (productId) => {
    setSelProductId(productId);
    setOpen(!open);
  };

  if (content && content.length > 0) {
    return (
      <Content>
        <InfiniteScroll
          dataLength={content.length}
          next={loadMoreData}
          hasMore={count > content.length}
          loader={
            <div
              className="qa-mar-btm-4 qa-mar-top-2 qa-font-san qa-pad-0-30"
              style={{ textAlign: "center" }}
            >
              <div style={{ textAlign: "center" }}>
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, color: "black" }}
                      spin
                    />
                  }
                  tip="Loading. Stay tuned!"
                  size="large"
                  style={{
                    verticalAlign: "middle",
                    color: "black",
                  }}
                />
              </div>
            </div>
          }
          endMessage={
            <div
              className="qa-mar-btm-4 qa-mar-top-2 qa-font-san qa-pad-0-30"
              style={{ textAlign: "center" }}
            >
              <div style={{ textAlign: "center" }}>
                <span className="dot one"></span>
                <span className="dot two"></span>
                <span className="dot three"></span>
              </div>
              You have reached the end of the listing.
              <br></br>We are constantly adding new sellers and products. Stay
              tuned!
            </div>
          }
        >
          <Row>
            {content.map((values, index) => (
              <Col
                className="qa-pad-3"
                key={index}
                xs={24}
                sm={24}
                md={12}
                lg={8}
                xl={8}
              >
                <ProductCard
                  key={index}
                  data={values}
                  pageId={pageId}
                  isMobile={isMobile}
                  selectedProductId={selProductId}
                  selectProduct={selectProduct}
                  sellerId={sellerId}
                />
              </Col>
            ))}
          </Row>
        </InfiniteScroll>
      </Content>
    );
  } else return <div></div>;
}

export default ContentSection;
