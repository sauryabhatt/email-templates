/** @format */

import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import BreadCrumb from "../common/BreadCrumb";
import ContentSection from "../common/ContentSection";
import SEOFooter from "../common/SEOFooter";
import { Row, Col } from "antd";
import Spinner from "../Spinner/Spinner";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
const { Content } = Layout;

function RecentlyViewedSellers() {
  const { keycloak } = useKeycloak();
  let { token = "" } = keycloak;
  const [isLoading, setIsLoading] = useState(true);
  const [productList, setProductList] = useState([]);
  const [isMobile, setMobile] = useState(false);
  const router = useRouter();
  let retryCount = 0;

  const getRecentlyViewedSellers = (token) => {
    if (token) {
      fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_COLLECTION_URL}/recently/viewed/buyer/seller`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + keycloak.token,
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw (
              res.statusText || "Oops something went wrong. Please try again!"
            );
          }
        })
        .then((res) => {
          setIsLoading(false);
          setProductList(res);
        })
        .catch((err) => {
          if (retryCount < 3) {
            getRecentlyViewedSellers(token);
          } else {
            setIsLoading(false);
            console.log(err.message);
          }
          retryCount++;
        });
    }
  };

  useEffect(() => {
    let width = window.screen ? window.screen.width : window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }
    if (keycloak.token) {
      getRecentlyViewedSellers(keycloak.token);
    }
  }, [keycloak.token]);

  let { sellers = [] } = productList || {};

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div>
      <Layout className="seller-listing-container" id="product-listing-page">
        <Content style={{ background: "#f9f7f2" }}>
          {isMobile && (
            <div style={{ margin: "30px 30px 0px" }}>
              <span className="recently-viewed-title">RECENTLY VIEWED</span>{" "}
              <span
                className="recently-viewed-stitle"
                onClick={() => router.push("/recently-viewed/product/")}
              >
                PRODUCTS{" "}
                <svg
                  width="18"
                  height="8"
                  viewBox="0 0 18 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                    fill="#874439"
                  />
                </svg>
              </span>
            </div>
          )}
          <BreadCrumb pageId="seller-listing" categoryName="Recently Viewed" />
        </Content>

        <Layout style={{ background: "#f9f7f2" }}>
          <Row className="qa-pad-0-30">
            <Col span={18}>
              <div className="qa-font-butler qa-fs-but-22 qa-mar-btm-05">
                Recently viewed sellers
              </div>
              <div className="qa-font-san qa-fs-14 seller-details-text qa-text-body">
                Browse recently viewed suppliers in the past 30 days
              </div>
            </Col>

            {!isMobile && (
              <Col span={6} className="qa-txt-alg-rgt qa-mar-top-1">
                <span className="recently-viewed-title">RECENTLY VIEWED</span>{" "}
                <span
                  className="recently-viewed-stitle"
                  onClick={() => router.push("/recently-viewed/product/")}
                >
                  PRODUCTS{" "}
                  <svg
                    width="18"
                    height="8"
                    viewBox="0 0 18 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                      fill="#874439"
                    />
                  </svg>
                </span>
              </Col>
            )}
          </Row>

          <ContentSection
            pageId="seller-listing"
            content={sellers}
            count={sellers.length}
            recentlyViewed={true}
            isMobile={isMobile}
          />
        </Layout>
      </Layout>

      <SEOFooter category="All Categories" />
    </div>
  );
}

export default RecentlyViewedSellers;
