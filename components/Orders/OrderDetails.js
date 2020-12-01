/** @format */

import React, { useState } from "react";
import { Row, Col, Button, Popover } from "antd";
import getSymbolFromCurrency from "currency-symbol-map";
import Icon from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import Link from "next/link";
import ParentOrderStatuses from "../../public/filestore/ParentOrderStatuses.json";
import sellerList from "../../public/filestore/freeShippingSellers.json";
import moment from "moment";

const OrderDetails = (props) => {
  let { orders = {}, subOrders = {} } = props;
  let {
    orderedDate = "",
    orderId = "",
    miscCharges = [],
    orderConfirmedDate = "",
  } = orders || {};
  let date = new Date(orderConfirmedDate || orderedDate);

  let month = "" + (date.getMonth() + 1);
  let day = date.getDate();
  let year = date.getFullYear();
  day = day <= 9 ? "0" + day : day;
  month = month <= 9 ? "0" + month : month;
  let orderDate = day + "-" + month + "-" + year;
  const statusMap = {
    CHECKED_OUT: "Confirmed",
  };
  const [popover, setPopover] = useState("");

  const popupHover = (value) => {
    setPopover(value);
  };

  const redirectTrackingUrl = (data) => {
    if (data) {
      let url = "https://" + data;
      window.open(url, "_blank");
      // var a = document.createElement("a");
      // a.href = data;
      // // a.setAttribute("download", "Spec-sheet");
      // a.setAttribute("target", "_blank");
      // a.click();
    }
  };

  let freightCharges = "";
  let customCharges = "";
  let qalaraCharges = "";
  let totalCharges = "";

  for (let charges of miscCharges) {
    if (charges["chargeId"] === "FREIGHT_CHARGES") {
      freightCharges = charges["amount"];
    } else if (charges["chargeId"] === "CUSTOM_CHARGES") {
      customCharges = charges["amount"];
    } else if (charges["chargeId"] === "QALARA_CHARGES") {
      qalaraCharges = charges["amount"];
    } else if (charges["chargeId"] === "TOTAL_AMOUNT") {
      totalCharges = charges["amount"];
    }
  }
  let {
    id = "",
    sellerOrgName = "",
    total = "",
    status = "",
    sellerCode = "",
    products = [],
  } = subOrders || {};

  const priceBreakup = (subOrder) => {
    return (
      <div className="breakup-popup qa-font-san">
        <div className="qa-border-bottom qa-pad-btm-15 cart-prod-name">
          Price breakup
          <span
            onClick={() => {
              setPopover("");
            }}
            style={{
              float: "right",
              marginTop: "-8px",
              cursor: "pointer",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </span>
        </div>
        <div className="qa-mar-btm-1 cart-ship-pt qa-mar-top-15">
          <div className="c-left-blk qa-mar-btm-05">Base price</div>
          {props.orders && props.orders.orderType == "RTS" ? (
            <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05">
              {getSymbolFromCurrency(props.orders && props.orders.currency) ||
                "$"}
              {parseFloat(
                subOrder.products.reduce(
                  (x, y) => x + y["quantity"] * y["exfactoryListPrice"],
                  0
                ) * orders.conversionFactor
              ).toFixed(2)}
            </div>
          ) : (
            <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05">
              {getSymbolFromCurrency(props.orders && props.orders.currency)}
              {parseFloat(
                subOrder.products.reduce(
                  (x, y) => x + y["totalProductCost"],
                  0
                ) * orders.conversionFactor
              ).toFixed(2)}
            </div>
          )}
          <div className="c-left-blk qa-mar-btm-05" style={{ width: "50%" }}>
            Qalara margin
          </div>
          <div
            className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05"
            style={{ width: "50%" }}
          >
            <span
              className="qa-font-san"
              style={{ textDecoration: "line-through" }}
            >
              {getSymbolFromCurrency(props.orders && props.orders.currency) ||
                "$"}
              {subOrder.qalaraSellerMargin &&
                subOrder.qalaraSellerMargin.toFixed(2)}
            </span>
            <span className="qa-font-san qa-fw-b" style={{ color: "#02873A" }}>
              {" "}
              {getSymbolFromCurrency(props.orders && props.orders.currency) ||
                "$"}
              0.00
            </span>
          </div>

          <div className="c-left-blk qa-mar-btm-05">Quality testing</div>
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05">
            {getSymbolFromCurrency(props.orders && props.orders.currency) ||
              "$"}
            {parseFloat(
              subOrder.products.reduce(
                (x, y) =>
                  x["qualityTestingCharge"] ||
                  0 + y["qualityTestingCharge"] ||
                  0,
                0
              ) * orders.conversionFactor
            ).toFixed(2)}
          </div>
        </div>
        <div className="cart-info-text">
          Note: Qalara margin may vary by total cart value{" "}
          <Link href="/FAQforwholesalebuyers">
            <a target="_blank">
              <span className="qa-sm-color">Refer FAQs here</span>
            </a>
          </Link>
        </div>
      </div>
    );
  };

  const addDefaultSrc = (ev) => {
    ev.target.src = process.env.NEXT_PUBLIC_URL + "/placeholder.png";
  };

  const mediaMatch = window.matchMedia("(min-width: 768px)");
  return (
    <React.Fragment>
      <Col xs={24} sm={24} md={22} lg={22} style={{ marginBottom: "10px" }}>
        <Row>
          <Col xs={24} sm={24} md={22} lg={22}>
            <span className="qa-font-san qa-fs-16 qa-tc-white">
              Order details
            </span>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={22} lg={22}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <Row style={{ backgroundColor: "#E6E4DF" }}>
              <Col xs={12} sm={12} md={12} lg={12} style={{ marginTop: "5px" }}>
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-fs-14 qa-font-san"
                      : "qa-fs-10 qa-font-san"
                  }
                  style={{
                    color: "#332f2f",
                    display: "flex",
                    textAlign: "left",
                    marginLeft: "20px",
                  }}
                >
                  Order number
                </span>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: "5px", paddingRight: "20px" }}
              >
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-fs-14 qa-font-san"
                      : "qa-fs-10 qa-font-san"
                  }
                  style={{
                    color: "#332f2f",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Order confirmed date
                </span>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: "5px" }}
              >
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-fs-14 qa-font-san"
                      : "qa-fs-10 qa-font-san"
                  }
                  style={{
                    color: "#332f2f",
                    display: "flex",
                    textAlign: "left",
                    marginLeft: "20px",
                  }}
                >
                  #{orderId}
                </span>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: "5px", paddingRight: "20px" }}
              >
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-fs-14 qa-font-san"
                      : "qa-fs-10 qa-font-san"
                  }
                  style={{
                    color: "#332f2f",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {orderDate}
                </span>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} style={{ marginTop: "5px" }}>
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-fs-14 qa-font-san"
                      : "qa-fs-10 qa-font-san"
                  }
                  style={{
                    color: "#332f2f",
                    display: "flex",
                    textAlign: "left",
                    marginLeft: "20px",
                  }}
                >
                  Order status
                </span>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginTop: "5px", paddingRight: "20px" }}
              >
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-fs-14 qa-font-san"
                      : "qa-fs-10 qa-font-san"
                  }
                  style={{
                    color: "#332f2f",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  Delivery expected by
                </span>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: "5px" }}
              >
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-fs-14 qa-font-san qa-fw-b"
                      : "qa-fs-10 qa-font-san qa-fw-b"
                  }
                  style={{
                    color: "#332f2f",
                    display: "flex",
                    textAlign: "left",
                    marginLeft: "20px",
                  }}
                >
                  {
                    ParentOrderStatuses.find(
                      (x) => x.id === props.orders.status
                    ).name
                  }
                </span>
              </Col>
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{ marginBottom: "5px", paddingRight: "20px" }}
              >
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-fs-14 qa-font-san qa-fw-b"
                      : "qa-fs-10 qa-font-san qa-fw-b"
                  }
                  style={{
                    color: "#332f2f",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {props.orders.expectedDeliveryDate
                    ? moment(props.orders.expectedDeliveryDate).format(
                        "DD/MM/YYYY"
                      )
                    : null}
                </span>
              </Col>
            </Row>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ padding: "20px", backgroundColor: "#F2F0EB" }}
          >
            <Col xs={24} sm={24} md={24} lg={24} className="first-row">
              <Row gutter={[8, 0]}>
                <Col xs={8} sm={8} md={16} lg={16} className="seller-name">
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <div
                        className={
                          mediaMatch.matches
                            ? "qa-fs-16 qa-fw-b qa-font-san qa-tc-white"
                            : "qa-fs-14 qa-fw-b qa-font-san qa-tc-white"
                        }
                        style={
                          mediaMatch.matches
                            ? { lineHeight: "20px" }
                            : { lineHeight: "100%" }
                        }
                      >
                        {props.brandNameList &&
                          props.brandNameList[props.subOrders.sellerCode] &&
                          props.brandNameList[props.subOrders.sellerCode]
                            .brandName}
                      </div>
                      <div
                        className={
                          mediaMatch.matches
                            ? "qa-fs-12 qa-font-san"
                            : "qa-fs-10 qa-font-san qa-tc-white qa-mar-top-05"
                        }
                        style={
                          mediaMatch.matches
                            ? {
                                lineHeight: "20px",
                                color: "#332f2f",
                                opacity: "0.8",
                              }
                            : {
                                lineHeight: "100%",
                                color: "#332f2f",
                                opacity: "0.8",
                              }
                        }
                      >
                        {props.subOrders.id}
                      </div>
                    </Col>
                  </Row>
                </Col>
                {orders.status !== "FAILED" ? (
                  <Col
                    xs={16}
                    sm={16}
                    md={8}
                    lg={8}
                    className="download-section"
                  >
                    <Button
                      className={
                        mediaMatch.matches
                          ? "download-invoice-btn"
                          : "download-invoice-btn-mob"
                      }
                      size={mediaMatch.matches ? "large" : "small"}
                      disabled={
                        (props.subOrders &&
                          props.subOrders &&
                          props.subOrders.orderTrackingLink == undefined) ||
                        (props.subOrders &&
                          props.subOrders &&
                          props.subOrders.orderTrackingLink == null)
                      }
                      onClick={(e) =>
                        redirectTrackingUrl(
                          props.subOrders &&
                            props.subOrders &&
                            props.subOrders.orderTrackingLink
                        )
                      }
                    >
                      Track order
                    </Button>
                  </Col>
                ) : (
                  <Col xs={16} sm={16} md={8} lg={8}></Col>
                )}
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ marginBottom: "15px" }}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr />
                </Col>
              </Row>
            </Col>

            {products.length > 0 &&
              products.map((product, j) => {
                let {
                  thumbnailMedia = {},
                  productName = "",
                  quantity = "",
                  productId = "",
                  total = "",
                  unitOfMeasure = "",
                  totalProductCost = "",
                  color = "",
                  size = "",
                  isQualityTestingRequired = false,
                  isSampleDeliveryRequired = false,
                } = product;
                let productNameSC =
                  productName.toLowerCase().charAt(0).toUpperCase() +
                  productName.toLowerCase().slice(1);
                let { mediaUrl = "" } = thumbnailMedia || {};
                return (
                  <Col
                    key={j}
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    className="first-row"
                  >
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Row gutter={[8, 0]}>
                          <Col xs={10} sm={10} md={4} lg={4}>
                            <div className="aspect-ratio-box">
                              {orders && orders.orderType == "RTS" ? (
                                <img
                                  className="images"
                                  src={product.image}
                                  alt="Order placeholder"
                                ></img>
                              ) : (
                                <img
                                  className="images"
                                  onError={addDefaultSrc}
                                  src={
                                    process.env
                                      .NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                                    mediaUrl
                                  }
                                  alt="Order placeholder"
                                ></img>
                              )}
                              {/* <img
                                className="images"
                                src={
                                  process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                                  mediaUrl
                                }
                                alt="Order placeholder"
                              ></img> */}
                            </div>
                          </Col>
                          <Col xs={14} sm={14} md={10} lg={10}>
                            <Row>
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={24}
                                style={
                                  mediaMatch.matches
                                    ? { lineHeight: "17px" }
                                    : { lineHeight: "110%" }
                                }
                              >
                                <span
                                  className={
                                    mediaMatch.matches
                                      ? "qa-font-san qa-fw-b qa-fs-14 qa-tc-white"
                                      : "qa-font-san qa-fw-b qa-fs-12 qa-tc-white"
                                  }
                                >
                                  {productNameSC}
                                </span>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={24}
                                style={
                                  mediaMatch.matches
                                    ? { lineHeight: "17px" }
                                    : { lineHeight: "75%" }
                                }
                              >
                                <span
                                  className={
                                    mediaMatch.matches
                                      ? "qa-font-san qa-fs-12 qa-tc-white"
                                      : "qa-font-san qa-fs-10 qa-tc-white"
                                  }
                                >
                                  Item code {productId}
                                </span>
                              </Col>

                              {isQualityTestingRequired && (
                                <Col xs={24} sm={24} md={24} lg={24}>
                                  <Row>
                                    <Col
                                      xs={2}
                                      sm={2}
                                      md={2}
                                      lg={2}
                                      style={
                                        mediaMatch.matches
                                          ? {}
                                          : { lineHeight: "100%" }
                                      }
                                    >
                                      <img
                                        className="images"
                                        src={
                                          process.env.NEXT_PUBLIC_URL +
                                          "/tick.png"
                                        }
                                        style={
                                          mediaMatch.matches
                                            ? {
                                                height: "20px",
                                              }
                                            : {
                                                height: "10px",
                                              }
                                        }
                                      ></img>
                                    </Col>
                                    <Col
                                      xs={22}
                                      sm={22}
                                      md={22}
                                      lg={22}
                                      style={
                                        mediaMatch.matches
                                          ? { paddingLeft: "5px" }
                                          : {
                                              lineHeight: "100%",
                                              paddingLeft: "5px",
                                            }
                                      }
                                    >
                                      <span
                                        className="qa-font-san qa-fs-12"
                                        style={{
                                          color: "rgba(25, 25, 25, 0.6)",
                                        }}
                                      >
                                        Quality testing
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              )}

                              {isSampleDeliveryRequired && (
                                <Col xs={24} sm={24} md={24} lg={24}>
                                  <Row>
                                    <Col
                                      xs={2}
                                      sm={2}
                                      md={2}
                                      lg={2}
                                      style={
                                        mediaMatch.matches
                                          ? {}
                                          : { lineHeight: "100%" }
                                      }
                                    >
                                      <img
                                        className="images"
                                        src={
                                          process.env.NEXT_PUBLIC_URL +
                                          "/tick.png"
                                        }
                                        style={
                                          mediaMatch.matches
                                            ? {
                                                height: "20px",
                                              }
                                            : {
                                                height: "10px",
                                              }
                                        }
                                      ></img>
                                    </Col>
                                    <Col
                                      xs={22}
                                      sm={22}
                                      md={22}
                                      lg={22}
                                      style={
                                        mediaMatch.matches
                                          ? { paddingLeft: "5px" }
                                          : {
                                              lineHeight: "100%",
                                              paddingLeft: "5px",
                                            }
                                      }
                                    >
                                      <span
                                        className="qa-font-san qa-fs-12"
                                        style={{
                                          color: "rgba(25, 25, 25, 0.6)",
                                        }}
                                      >
                                        Sample required
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              )}
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={24}
                                style={
                                  mediaMatch.matches
                                    ? { lineHeight: "14px" }
                                    : { lineHeight: "100%" }
                                }
                              >
                                <span
                                  className={
                                    mediaMatch.matches
                                      ? "qa-font-san qa-fs-12 qa-tc-white"
                                      : "qa-font-san qa-fs-10 qa-tc-white"
                                  }
                                >
                                  {color}
                                </span>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={24}
                                style={
                                  mediaMatch.matches
                                    ? { lineHeight: "17px" }
                                    : { lineHeight: "100%" }
                                }
                              >
                                <span
                                  className={
                                    mediaMatch.matches
                                      ? "qa-font-san qa-fs-12 qa-tc-white"
                                      : "qa-font-san qa-fs-10 qa-tc-white"
                                  }
                                >
                                  {size}
                                </span>
                              </Col>
                              <Col xs={0} sm={0} md={24} lg={24}>
                                <span className="qa-font-san qa-fs-14 qa-tc-white">
                                  Units: {quantity} {unitOfMeasure}
                                </span>
                              </Col>
                              {/* <Col
                                xs={12}
                                sm={12}
                                md={0}
                                lg={0}
                                style={
                                  mediaMatch.matches
                                    ? { display: "none", lineHeight: "130%" }
                                    : {
                                        display: "flex",
                                        justifyContent: "flex-start",
                                        lineHeight: "100%",
                                      }
                                }
                              >
                                <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white test-class">
                                  {getSymbolFromCurrency(orders && orders.currency)}{total}
                                </span>
                              </Col> */}
                              <Col
                                xs={24}
                                sm={24}
                                md={0}
                                lg={0}
                                style={
                                  mediaMatch.matches
                                    ? { display: "none" }
                                    : {
                                        display: "block",
                                      }
                                }
                              >
                                <div
                                  className={
                                    mediaMatch.matches
                                      ? "qa-font-san qa-fs-14 qa-tc-white"
                                      : "qa-font-san qa-fs-10 qa-tc-white"
                                  }
                                >
                                  Units: {quantity} {unitOfMeasure}
                                </div>
                                {miscCharges &&
                                  miscCharges.length > 0 &&
                                  miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ) &&
                                  miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ).amount > 0 &&
                                  sellerList.length &&
                                  sellerList.includes(sellerCode) && (
                                    <div className="qa-offer-text qa-mar-top-05 qa-disp-inline">
                                      FREE shipping
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={0} sm={0} md={10} lg={10}>
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24}></Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={24}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {orders && orders.orderType == "RTS" ? (
                                  <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white">
                                    {getSymbolFromCurrency(
                                      orders && orders.currency
                                    )}
                                    {parseFloat(
                                      total * orders.conversionFactor
                                    ).toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white">
                                    {getSymbolFromCurrency(
                                      orders && orders.currency
                                    )}
                                    {total}
                                  </span>
                                )}
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={24}
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  textAlign: "right",
                                  paddingLeft: "50%",
                                }}
                              >
                                {miscCharges &&
                                  miscCharges.length > 0 &&
                                  miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ) &&
                                  miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ).amount > 0 &&
                                  sellerList.length &&
                                  sellerList.includes(sellerCode) && (
                                    <div className="qa-offer-text qa-mar-top-1 qa-disp-inline">
                                      FREE shipping
                                    </div>
                                  )}
                                {(!sellerList.includes(sellerCode) ||
                                  !(
                                    miscCharges.find(
                                      (x) => x.chargeId === "SELLER_DISCOUNT"
                                    ) &&
                                    miscCharges.find(
                                      (x) => x.chargeId === "SELLER_DISCOUNT"
                                    ).amount > 0
                                  )) && (
                                  <span
                                    className="qa-font-san qa-fs-12 qa-tc-white"
                                    style={{ color: "rgba(25, 25, 25, 0.6)" }}
                                  >
                                    Base price per unit excl. margin and other
                                    charges
                                  </span>
                                )}
                              </Col>
                            </Row>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={0}
                            lg={0}
                            style={{ lineHeight: "110%" }}
                          >
                            {(!sellerList.includes(sellerCode) ||
                              !(
                                miscCharges.find(
                                  (x) => x.chargeId === "SELLER_DISCOUNT"
                                ) &&
                                miscCharges.find(
                                  (x) => x.chargeId === "SELLER_DISCOUNT"
                                ).amount > 0
                              )) && (
                              <span
                                className="qa-font-san qa-fs-8"
                                style={{ color: "rgba(25, 25, 25, 0.6)" }}
                              >
                                Base price per unit excl. margin and other
                                charges
                              </span>
                            )}
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  // <Col
                  //   xs={24}
                  //   sm={24}
                  //   md={24}
                  //   lg={24}
                  //   style={{ marginBottom: "25px" }}
                  // >
                  //   <Row>
                  //     <Col xs={24} sm={24} md={24} lg={24}>
                  //       <hr />
                  //     </Col>
                  //   </Row>
                  // </Col>
                );
              })}
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ marginBottom: "10px" }}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr />
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col
                      xs={16}
                      sm={16}
                      md={12}
                      lg={12}
                      className={
                        mediaMatch.matches ? "qa-col-end" : "qa-col-start"
                      }
                    >
                      <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                        Total seller order value
                      </span>
                    </Col>
                    <Col xs={8} sm={8} md={12} lg={12} className="qa-col-end">
                      {orders && orders.orderType == "RTS" ? (
                        <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                          {getSymbolFromCurrency(orders && orders.currency) ||
                            "$"}
                          {(
                            parseFloat(
                              parseFloat(
                                subOrders.products.reduce(
                                  (x, y) => x + y["total"],
                                  0
                                )
                              ) * orders.conversionFactor
                            ) +
                            (parseFloat(
                              parseFloat(subOrders.qalaraSellerMargin) * 0
                            ) || 0)
                          ).toFixed(2)}
                        </span>
                      ) : (
                        <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                          {getSymbolFromCurrency(orders && orders.currency)}
                          {products.reduce((x, y) => x + y["total"], 0)}
                        </span>
                      )}
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} className="qa-col-end">
                      <Popover
                        placement="bottomRight"
                        content={priceBreakup(props.subOrders)}
                        trigger="click"
                        visible={popover === "seller" ? true : false}
                        overlayClassName="price-breakup-popup"
                      >
                        <span
                          className="qa-font-san qa-fs-14"
                          style={{
                            color: "#874439",
                            textDecoration: "underline",
                            lineHeight: "17px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            popupHover("seller");
                          }}
                        >
                          See breakup
                        </span>
                      </Popover>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            {/* <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ marginBottom: "25px" }}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr />
                </Col>
              </Row>
            </Col> */}
            {/* <Col xs={24} sm={24} md={24} lg={24} className="first-row">
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col
                      xs={15}
                      sm={15}
                      md={12}
                      lg={12}
                      className={
                        mediaMatch.matches ? "qa-col-end" : "qa-col-start"
                      }
                    >
                      <span className="qa-fs-14 qa-font-san qa-tc-white qa-fw-b">
                        Freight fee*
                      </span>
                    </Col>
                    <Col xs={9} sm={9} md={12} lg={12} className="qa-col-end">
                      <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                        {getSymbolFromCurrency(orders && orders.currency)}{freightCharges}
                      </span>
                    </Col>
                    <Col
                      xs={15}
                      sm={15}
                      md={12}
                      lg={12}
                      className={
                        mediaMatch.matches ? "qa-col-end" : "qa-col-start"
                      }
                    >
                      <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                        Custom, taxes & duties*
                      </span>
                    </Col>
                    <Col xs={9} sm={9} md={12} lg={12} className="qa-col-end">
                      <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                        {getSymbolFromCurrency(orders && orders.currency)}{customCharges}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ marginBottom: "25px" }}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr />
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} className="first-row">
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className={
                        mediaMatch.matches ? "qa-col-end" : "qa-col-start"
                      }
                    >
                      <span
                        className={
                          mediaMatch.matches
                            ? "qa-fs-17 qa-fw-b qa-font-san qa-tc-white"
                            : "qa-fs-14 qa-fw-b qa-font-san qa-tc-white"
                        }
                      >
                        Total cart value
                      </span>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} className="qa-col-end">
                      <span
                        className={
                          mediaMatch.matches
                            ? "qa-fs-20 qa-fw-b qa-font-san qa-tc-white"
                            : "qa-fs-14 qa-fw-b qa-font-san qa-tc-white"
                        }
                      >
                        {getSymbolFromCurrency(orders && orders.currency)}{totalCharges}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col> */}

            {/* <Col xs={24} sm={24} md={24} lg={24}>
                            <Row>
                                <Col xs={24} sm={24} md={24} lg={24}>
                                    <span className="qa-font-san qa-fs-14 qa-fw-b" style={{ color: '#874439', textDecoration: 'underline', lineHeight: '17px', display: 'flex', justifyContent: 'flex-end' }} onClick={handleClick}>View details</span>
                                </Col>
                            </Row>
                        </Col> */}
          </Col>
        </Col>
      </Col>
      <Col
        xs={24}
        sm={24}
        md={22}
        lg={22}
        className={mediaMatch.matches ? "qa-col-end" : "qa-col-start"}
      >
        <div className="qa-font-san qa-fs-12 qa-tc-white qa-mar-top-05 qa-lh">
          *These are estimates. Final value to be shared at the time of
          shipment.
        </div>
      </Col>
    </React.Fragment>
  );
};

export default OrderDetails;
