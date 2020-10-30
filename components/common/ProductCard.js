/** @format */

import React from "react";
import SellerBanner from "./SellerBanner";
import DynamicCarousel from "./DynamicCarousel";
import  Link  from "next/link"
import { Row, Col } from "antd";
import { useSelector, connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import { loginToApp } from "../AuthWithKeycloak";
import {useRouter} from "next/router";
import { useKeycloak } from "@react-keycloak/ssr";

function ProductCard(props) {
  const isAuthenticated = useSelector((state) => state.auth.authenticated);
  const router = useRouter();
  const {keycloak} = useKeycloak();
  const getConvertedCurrency = (baseAmount) => {
    let { convertToCurrency = "", rates = [] } = props.currencyDetails;
    return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(2);
  };

  const signIn = () => {
     loginToApp(keycloak, { currentPath: router.pathname });
  };

  let productDetails = props.data;
  let {
    pageId = "",
    isMobile = false,
    userProfile = {},
    selectedProductId = "",
    selectProduct,
    currencyDetails = {},
    sellerId = "",
  } = props;
  let {
    orgName = "",
    brandName = "",
    companyDescription = "",
    bannerImage = {},
    brandLogo = {},
    productTypeDescs = [],
    publicCategoryMedias = [],
    values = [],
    orderTypes = [],
    id = "",
    vanityId = "",
    exfactoryListPrice = "",
    mediaUrls = [],
    minimumOrderQuantity = "",
    moqUnit = "",
    productName = "",
    productType = "",
    colorFamily = [],
    showSPLP = "",
    visibleTo = "",
    sellerCode = "",
  } = productDetails;

  let { convertToCurrency = "" } = currencyDetails || {};

  let { profileType = "", verificationStatus = "", profileId = "" } =
    userProfile || {};
  if (profileType === "SELLER") {
    profileId = profileId.replace("SELLER::", "");
  }
  let accessLocked = true;
  let showPrice = true;
  if (
    (profileType === "BUYER" && verificationStatus === "VERIFIED") ||
    (profileType === "BUYER" && verificationStatus === "IN_PROGRESS") ||
    (profileType === "SELLER" && profileId === sellerId) ||
    (profileType === "BUYER" &&
      verificationStatus === "IN_PROGRESS" &&
      visibleTo === "ALL")
  ) {
    accessLocked = false;
  }

  if (visibleTo === "ALL") {
    accessLocked = false;
  }

  if (
    !isAuthenticated ||
    (profileType === "BUYER" && verificationStatus === "ON_HOLD") ||
    (profileType === "BUYER" && verificationStatus === "REJECTED") ||
    (profileType === "SELLER" && profileId !== sellerId)
  ) {
    showPrice = false;
  }
  let productNameSC =
    productName.toLowerCase().charAt(0).toUpperCase() +
    productName.toLowerCase().slice(1);

  let productTypeDisp =
    productType === "RTS"
      ? "Ready to ship"
      : productType === "ERTM"
      ? "express custom"
      : "custom order";

  if (pageId === "seller-product-listing" || pageId === "product-listing") {
    id = id.replace("PRODUCT::", "");
    let linkTo = `/product/${id}`;

    if (accessLocked) {
      linkTo = "";
    }
    let sellerLink =
      `/seller/${sellerCode}/` + encodeURIComponent("All Categories");

    return (
      <Link
        href={linkTo}
        className="product-card"
        
      >
        <div onClick={(e) => {
          
          if (accessLocked) {
            selectProduct(id);
            e.stopPropagation();
            e.preventDefault();
          }
        }}>
        <DynamicCarousel
          items={1}
          id={pageId}
          showArrows={true}
          data={mediaUrls}
          productName={productName}
          userProfile={userProfile}
          selectedProductId={selectedProductId}
          productId={id}
          sellerId={sellerId}
          visibleTo={visibleTo}
        />
        <div
          className={
            (id === "product-listing" || id === "seller-product-listing") &&
            accessLocked &&
            isAuthenticated
              ? "product-list-details qa-mar-top-05 qa-font-san qa-fs-12 lock-section"
              : "product-list-details qa-mar-top-05 qa-font-san qa-fs-12"
          }
        >
          {isMobile ? (
            <Row className="qa-tc-white">
              <Col span={12} className="qa-txt-alg-lft">
                <span className="product-order-type qa-mar-btm-05">
                  {productTypeDisp}
                </span>
              </Col>
              <Col
                span={12}
                className="qa-txt-alg-rgt"
                style={{ position: "relative" }}
              >
                {colorFamily.length > 1 && (
                  <div className="p-more-option">+ color options available</div>
                )}
              </Col>
            </Row>
          ) : (
            <Row className="qa-tc-white">
              <Col span={12}>
                <div className="qa-tc-white qa-fw-b qa-line-height qa-text-2line">
                  {productNameSC}
                </div>
              </Col>
              <Col span={12} className="qa-txt-alg-rgt">
                <span className="product-order-type qa-mar-btm-05">
                  {productTypeDisp}
                </span>
              </Col>
            </Row>
          )}
          {isMobile ? (
            <Row className="qa-tc-white">
              <Col span={24}>
                <div className="qa-tc-white qa-fw-b qa-line-height qa-text-2line">
                  {productNameSC}
                </div>
              </Col>
              {!isAuthenticated && (
                <Col span={24}>
                  <div className="qa-tc-white">
                    Base price:{" "}
                    {isAuthenticated && showPrice ? (
                      <span className="qa-fw-b qa-fs-14">
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(exfactoryListPrice)}
                      </span>
                    ) : (
                      <span className="qa-cursor" onClick={signIn}>
                        <span className="qa-fs-13 qa-sm-color">Sign in</span>

                        <svg
                          style={{
                            marginLeft: "3px",
                            verticalAlign: "text-bottom",
                          }}
                          width="12"
                          height="15"
                          viewBox="0 0 19 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.56437 4.08666L7.34698 5.30405L9.60785 7.56492H0.738281V9.30405H9.60785L7.34698 11.5649L8.56437 12.7823L12.9122 8.43449L8.56437 4.08666ZM16.3905 14.5214H9.43393V16.2606H16.3905C17.347 16.2606 18.1296 15.478 18.1296 14.5214V2.34753C18.1296 1.39101 17.347 0.608398 16.3905 0.608398H9.43393V2.34753H16.3905V14.5214Z"
                            fill="#D9BB7F"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  {isAuthenticated && (
                    <div className="qa-tc-white" style={{ marginTop: "-3px" }}>
                      Min order qty {minimumOrderQuantity} {moqUnit}
                    </div>
                  )}
                </Col>
              )}

              {!accessLocked && isAuthenticated && showPrice && (
                <Col span={24}>
                  <div className="qa-tc-white">
                    Base price:{" "}
                    <span className="qa-fw-b qa-fs-14">
                      {getSymbolFromCurrency(convertToCurrency)}
                      {getConvertedCurrency(exfactoryListPrice)}
                    </span>
                  </div>
                  <div className="qa-tc-white" style={{ marginTop: "-3px" }}>
                    Min order qty {minimumOrderQuantity} {moqUnit}
                  </div>
                </Col>
              )}
            </Row>
          ) : (
            <div>
              {!isAuthenticated && (
                <Row className="qa-tc-white">
                  <Col span={16}>
                    <span className="qa-tc-white">
                      Base price:{" "}
                      <span className="qa-cursor" onClick={signIn}>
                        <span className="qa-fs-13 qa-sm-color">Sign in</span>
                        <svg
                          style={{
                            marginLeft: "3px",
                            verticalAlign: "text-bottom",
                          }}
                          width="12"
                          height="15"
                          viewBox="0 0 19 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.56437 4.08666L7.34698 5.30405L9.60785 7.56492H0.738281V9.30405H9.60785L7.34698 11.5649L8.56437 12.7823L12.9122 8.43449L8.56437 4.08666ZM16.3905 14.5214H9.43393V16.2606H16.3905C17.347 16.2606 18.1296 15.478 18.1296 14.5214V2.34753C18.1296 1.39101 17.347 0.608398 16.3905 0.608398H9.43393V2.34753H16.3905V14.5214Z"
                            fill="#D9BB7F"
                          />
                        </svg>
                      </span>
                    </span>
                  </Col>
                  <Col
                    span={8}
                    className="qa-txt-alg-rgt"
                    style={{ position: "relative" }}
                  >
                    {colorFamily.length > 1 && (
                      <div className="p-more-option">
                        + color options available
                      </div>
                    )}
                  </Col>
                </Row>
              )}
              {!accessLocked && isAuthenticated && showPrice && (
                <Row className="qa-tc-white">
                  <Col span={16}>
                    <span className="qa-tc-white">
                      Base price:{" "}
                      <span className="qa-fw-b qa-fs-14">
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(exfactoryListPrice)}
                      </span>
                    </span>
                    <div style={{ marginTop: "-3px" }}>
                      Min order qty {minimumOrderQuantity} {moqUnit}
                    </div>
                  </Col>
                  <Col
                    span={8}
                    className="qa-txt-alg-rgt"
                    style={{ position: "relative" }}
                  >
                    {colorFamily.length > 1 && (
                      <div className="p-more-option">
                        + color options available
                      </div>
                    )}
                  </Col>
                </Row>
              )}
            </div>
          )}
          {pageId === "product-listing" && (
            <Link href={sellerLink} className="explore-more-sellers">
              Explore more by this seller
            </Link>
          )}
        </div>
        </div>    
      </Link>
    );
  } else {
    let linkTo = `/seller/${vanityId}`;
    if (showSPLP === "true" || showSPLP === true) {
      id = id.replace("HOME::SELLER::", "");
      let categoryName = "all-categories";
      linkTo = `/seller/${id}/${categoryName}`;
    }
    return (
      <div onClick={()=>router.push(linkTo)} className="product-card">
        {pageId === "seller-listing" && (
          <SellerBanner
            orgName={brandName || orgName}
            companyDescription={companyDescription}
            bannerImage={bannerImage}
            brandLogo={brandLogo}
          />
        )}
        <DynamicCarousel
          items={1}
          id={pageId}
          showArrows={true}
          data={publicCategoryMedias}
          userProfile={userProfile}
        />
        <div className="seller-list-details">
          <div
            style={{
              lineHeight: "130%",
              marginBottom: "5px",
              height: "31px",
            }}
            className="qa-text-2line"
          >
            <span className="qa-tc-white">
              <span className="qa-tc-white qa-fw-sb">Product range: </span>
            </span>{" "}
            <span className="qa-text-body">{productTypeDescs.join(", ")}</span>
          </div>
          <div>
            <span className="qa-tc-white qa-fw-sb">
              {orderTypes.includes("RTS")
                ? "Ready to ship orders"
                : "Custom orders"}
            </span>
          </div>
          <div
            style={{
              textOverflow: "ellipsis",
              width: "100%",
              display: "block",
              overflow: "hidden",
            }}
          >
            {values.map((list, i) => {
              return (
                <span key={i} className="seller-hash-tag">
                  #{list.replace(/_/gi, "")}
                </span>
              );
            })}
          </div>
        </div>          
     </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currencyDetails: state.currencyConverter,
    userProfile: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, null)(ProductCard);
