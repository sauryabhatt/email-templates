/** @format */

import React, { useEffect, useState } from "react";
import { Row, Col, Menu, Button, Breadcrumb, Modal } from "antd";
import OrderDetails from "../Orders/OrderDetails";
import { getOrders, getOrderByOrderId } from "./../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { connect } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import getSymbolFromCurrency from "currency-symbol-map";
import closeButton from "../../public/filestore/closeButton";
import SendQueryForm from "./../SendQueryForm/SendQueryForm";
import Icon from "@ant-design/icons";
import ParentOrderStatuses from "../../public/filestore/ParentOrderStatuses.json";
import SellerOrderStatuses from "../../public/filestore/SellerOrderStatuses.json";
import moment from "moment";

const OrdersMobile = (props) => {
  let { orders = [] } = props;
  const router = useRouter();
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const { keycloak } = useKeycloak();
  const [orderDetails, setOrderDetails] = useState("");
  const [subOrders, setSubOrders] = useState("");

  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  let requesterName = "";
  if (
    props.userProfile &&
    props.userProfile.firstName &&
    props.userProfile &&
    props.userProfile.lastName
  ) {
    requesterName =
      props.userProfile.firstName + " " + props.userProfile.lastName;
  }

  let values = {
    profileId: props.userProfile && props.userProfile.profileId,
    profileType: props.userProfile && props.userProfile.profileType,
    category: "",
    requirementDetails: "",
    upload: {},
    quantity: "",
    pricePerItem: "",
    deliveryDate: "",
    requesterName: requesterName,
    companyName: props.userProfile && props.userProfile.orgName,
    emailId: props.userProfile && props.userProfile.email,
    country: props.userProfile && props.userProfile.country,
    city: "",
    mobileNo: props.userProfile && props.userProfile.orgPhone,
  };

  const sendQueryCancel = (status) => {
    if (status === "success") {
      setVisible(false);
      setSuccessQueryVisible(true);
    } else {
      setVisible(false);
    }
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
  };
  const handleClick = (orders, subOrders) => {
    props.handleShowOrder(true);
    setOrderDetails(orders);
    setSubOrders(subOrders);
  };

  const statusMap = {
    CHECKED_OUT: "Confirmed",
  };

  useEffect(() => {
    props.getOrders(keycloak.token);
  }, [keycloak.token]);

  const redirect = () => {
    props.handleShowOrder(false);
  };

  const redirectToFaq = () => {
    router.push("/FAQforwholesalebuyers");
  };

  const retryPayment = (orderId, type) => {
    if (type == "CUSTOM") {
      let url = "/order-review/" + orderId;
      router.push(url);
    } else {
      props.getOrderByOrderId(keycloak.token, orderId);
      let url = "/RTS/order-review/" + orderId;
      router.push(url);
    }
  };

  const downloadBuyerAgreement = () => {
    var a = document.createElement("a");
    a.href = process.env.NEXT_PUBLIC_REACT_APP_BUYER_AGREEMENT_URL;
    a.setAttribute("download", "Buyer-agreement");
    a.setAttribute("target", "_blank");
    a.click();
  };

  const downloadInvoice = (data) => {
    if (data) {
      var a = document.createElement("a");
      a.href =
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL + data["mediaUrl"];
      a.setAttribute("download", "Spec-sheet");
      a.setAttribute("target", "_blank");
      a.click();
    }
  };

  const addDefaultSrc = (ev) => {
    ev.target.src = process.env.NEXT_PUBLIC_URL + "/placeholder.png";
  };

  const diff_hours = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };

  return (
    <React.Fragment>
      {props.showOrderDetails ? (
        <Col xs={24} sm={24} md={24} lg={0} style={{ paddingBottom: "35px" }}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={0} className="orders-breadcumb">
              <Breadcrumb>
                <Breadcrumb.Item onClick={redirect}>
                  <span
                    className="qa-fs-16 qa-font-san"
                    style={{
                      lineHeight: "110%",
                      letterSpacing: "0.01em",
                      color: "#D9BB7F",
                    }}
                  >
                    My orders
                  </span>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <span
                    className="qa-fs-16 qa-font-san"
                    style={{ lineHeight: "110%", letterSpacing: "0.01em" }}
                  >
                    Order details
                  </span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </Col>
      ) : (
        ""
      )}
      <Col xs={24} sm={24} md={24} lg={0}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={0}>
            <div style={{ textAlign: "right" }}>
              <div style={{ textAlign: "right" }}>
                <Link
                  href="/FAQforwholesalebuyers"
                  style={{ lineHeight: "17px", cursor: "pointer" }}
                >
                  <a
                    target="_blank"
                    className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                  >
                    BUYERS’ FAQs{" "}
                  </a>
                </Link>
                <span
                  className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                  style={{ lineHeight: "17px" }}
                >
                  {" "}
                  |{" "}
                </span>
                <span
                  className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                  style={{ lineHeight: "17px", cursor: "pointer" }}
                  onClick={downloadBuyerAgreement}
                >
                  {" "}
                  ORDER T&C{" "}
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={24} lg={0}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={0}>
            <div className="form-top">
              <p
                className="form-heading qa-fs-24 qa-font-san qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                My ORDERS
              </p>
            </div>
          </Col>
        </Row>
      </Col>
      {!props.showOrderDetails ? (
        <Col xs={24} sm={24} md={24} lg={0}>
          {props.isOrderAvailable && orders.length == 0 ? (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ backgroundColor: "#F2F0EB" }}
            >
              <Row
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "20px",
                  paddingBottom: "15px",
                }}
              >
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-font-butler qa-fs-24"
                    style={{ color: "#191919" }}
                  >
                    No orders to display!
                  </span>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} className="qa-mar-top-1">
                  <span className="qa-font-san qa-fs-14 qa-tc-white">
                    You currently do not have any active or past orders to
                    display. You can get started by sharing a Request for quote
                    by clicking below.
                  </span>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{ marginTop: "40px", marginBottom: "40px" }}
                  className="quote-rfq"
                >
                  <Button
                    className="qa-button quote-contact-seller-mob"
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    <span className="qa-font-san qa-fw-b qa-fs-14">
                      REQUEST FOR QUOTE
                    </span>
                  </Button>
                </Col>
              </Row>
            </Col>
          ) : (
            ""
          )}
          {orders.map((order, i) => {
            let {
              orderedDate = "",
              subOrders = [],
              orderConfirmedDate = "",
              paymentTime = "",
              miscCharges = [],
            } = order;
            let frieghtCharge = 0;
            let dutyCharge = 0;
            let vatCharge = 0;
            let couponDiscount = 0;
            let freightDis = 0;
            let sellerDiscount = 0;

            for (let charge of miscCharges) {
              let { chargeId = "", amount = 0 } = charge;
              if (chargeId === "TOTAL_COST_FREIGHT_MAX") {
                frieghtCharge = amount;
              } else if (chargeId === "VAT") {
                vatCharge = amount;
              } else if (chargeId === "DUTY_MAX") {
                dutyCharge = amount;
              } else if (chargeId === "DISCOUNT") {
                couponDiscount = amount;
              } else if (chargeId === "FREIGHT_MAX") {
                freightDis = amount;
              } else if (chargeId === "SELLER_DISCOUNT") {
                sellerDiscount = amount;
              }
            }

            if (couponDiscount > 0 || sellerDiscount > 0) {
              frieghtCharge = freightDis;
            }
            let paymentTimeDiff = diff_hours(new Date(paymentTime), new Date());

            let date = new Date(orderConfirmedDate || orderedDate);
            let month = "" + (date.getMonth() + 1);
            let day = date.getDate();
            let year = date.getFullYear();
            day = day <= 9 ? "0" + day : day;
            month = month <= 9 ? "0" + month : month;
            let orderDate = day + "-" + month + "-" + year;

            return (
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={0}
                className="qa-mar-btm-2"
                style={{ backgroundColor: "rgb(242, 240, 235)" }}
                key={i}
              >
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <Row
                      style={{
                        backgroundColor: "#E6E4DF",
                        padding: "15px 20px",
                      }}
                    >
                      {order.payment_status !== "FAILED" ? (
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          className="qa-vertical-center"
                        >
                          <span
                            className="qa-fs-10 qa-font-san"
                            style={{
                              color: "#332f2f",
                              display: "flex",
                              textAlign: "left",
                            }}
                          >
                            Order number #{order.orderId}
                          </span>
                        </Col>
                      ) : (
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          className="qa-vertical-center"
                        >
                          <Row>
                            <Col xs={24} sm={24} md={24} lg={24}>
                              <span
                                className="qa-fs-10 qa-font-san qa-fw-b"
                                style={{
                                  color: "#EE0D1A",
                                  display: "flex",
                                  textAlign: "left",
                                }}
                              >
                                PAYMENT UNSUCCESSFUL
                              </span>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24}>
                              <span
                                className="qa-fs-10 qa-font-san"
                                style={{
                                  color: "#332f2f",
                                  display: "flex",
                                  textAlign: "left",
                                }}
                              >
                                Order number #{order.orderId}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      )}

                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{ textAlign: "right" }}
                        className="qa-vertical-center"
                      >
                        {order.payment_status !== "FAILED" ? (
                          <Button
                            className={
                              mediaMatch.matches
                                ? "download-invoice-btn qa-vertical-center"
                                : "download-invoice-btn-mob qa-vertical-center"
                            }
                            size={mediaMatch.matches ? "large" : "small"}
                            style={{ justifyContent: "center" }}
                            disabled={
                              (order && order.orderInvoice == undefined) ||
                              (order &&
                                order.orderInvoice &&
                                order.orderInvoice.media == null)
                            }
                            onClick={(e) =>
                              downloadInvoice(
                                order &&
                                  order.orderInvoice &&
                                  order.orderInvoice.media
                              )
                            }
                          >
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#000000" }}
                            >
                              Download invoice
                            </span>
                          </Button>
                        ) : (
                          <span>
                            {paymentTimeDiff <= 48 && (
                              <Button
                                className={
                                  mediaMatch.matches
                                    ? "retry-payment-btn qa-vertical-center"
                                    : "retry-payment-btn-mob qa-vertical-center"
                                }
                                size={mediaMatch.matches ? "large" : "small"}
                                style={{ justifyContent: "center" }}
                                onClick={() => retryPayment(order.orderId)}
                              >
                                <span
                                  className="qa-font-san qa-fs-12"
                                  style={{ color: "#F9F7F2" }}
                                >
                                  RETRY PAYMENT
                                </span>
                              </Button>
                            )}
                          </span>
                        )}
                      </Col>
                      {/* <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        style={{ marginBottom: "5px" }}
                      >
                        <span
                          className="qa-fs-10 qa-font-san"
                          style={{
                            color: "#F2F0EB",
                            display: "flex",
                            textAlign: "left",
                            marginLeft: "20px",
                          }}
                        >
                          #{order.orderId}
                        </span>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={11}
                        lg={11}
                        style={{ marginBottom: "5px", paddingRight: "20px" }}
                      >
                        <span
                          className="qa-fs-10 qa-font-san"
                          style={{
                            color: "#F2F0EB",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          {orderDate}
                        </span>
                      </Col> */}
                    </Row>
                  </Col>
                </Row>
                <Row>
                  {subOrders.map((subOrder, j) => {
                    let {
                      id = "",
                      sellerOrgName = "",
                      total = "",
                      status = "",
                      sellerCode = "",
                      products = [],
                    } = subOrder;
                    return (
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        style={{
                          padding: "20px",
                          backgroundColor: "#F2F0EB",
                        }}
                        className={j === 0 ? "qa-order-first" : "qa-order-list"}
                        key={j}
                      >
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <Row>
                            <Col xs={12} sm={12} md={24} lg={24}>
                              <span
                                className="qa-fs-14 qa-fw-b qa-font-san"
                                style={{
                                  color: "#874439",
                                  textDecoration: "underline",
                                  lineHeight: "20px",
                                }}
                              >
                                {props.brandNameList &&
                                  props.brandNameList[subOrder.sellerCode] &&
                                  props.brandNameList[subOrder.sellerCode]
                                    .brandName}
                              </span>
                            </Col>
                            <Col xs={12} sm={12} md={24} lg={24}>
                              <div
                                className="qa-fs-10 qa-font-san"
                                style={{
                                  color: "#332f2f",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                Seller order id:
                              </div>
                              <div
                                className="qa-fs-10 qa-font-san"
                                style={{
                                  color: "#191919",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {id}
                              </div>
                            </Col>
                          </Row>
                        </Col>

                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          style={{ marginTop: "25px" }}
                        >
                          <Row>
                            <Col xs={14} sm={14} md={24} lg={24}>
                              <span
                                className="qa-font-san qa-fs-12"
                                style={{
                                  color: "#332f2f",
                                  opacity: "0.8",
                                  lineHeight: "17px",
                                  display: "flex",
                                }}
                              >
                                Total order value
                              </span>
                            </Col>
                            <Col xs={10} sm={10} md={24} lg={24}>
                              <span
                                className="qa-fs-12 qa-font-san qa-fw-b"
                                style={{
                                  color: "#191919",
                                  lineHeight: "17px",
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {getSymbolFromCurrency(
                                  order && order.currency
                                ) || "$"}
                                {(
                                  parseFloat(
                                    parseFloat(
                                      subOrder.products.reduce(
                                        (x, y) => x + y["total"],
                                        0
                                      )
                                    ) * order.conversionFactor
                                  ) +
                                  (parseFloat(
                                    parseFloat(subOrder.qalaraSellerMargin) * 0
                                  ) || 0)
                                ).toFixed(2)}
                              </span>
                            </Col>
                          </Row>
                          {order.payment_status !== "FAILED" ? (
                            <Row style={{ marginTop: "5px" }}>
                              <Col xs={14} sm={14} md={24} lg={24}>
                                <span
                                  className="qa-font-san qa-fs-12"
                                  style={{
                                    color: "#332f2f",
                                    opacity: "0.8",
                                    lineHeight: "17px",
                                    display: "flex",
                                  }}
                                >
                                  Expected delivery date
                                </span>
                              </Col>
                              <Col xs={10} sm={10} md={24} lg={24}>
                                <span
                                  className="qa-fs-12 qa-font-san qa-fw-b"
                                  style={{
                                    color: "#191919",
                                    lineHeight: "17px",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  {subOrder.expectedDeliveryDate
                                    ? moment(
                                        subOrder.expectedDeliveryDate
                                      ).format("DD/MM/YYYY")
                                    : null}
                                </span>
                              </Col>
                            </Row>
                          ) : (
                            ""
                          )}
                          {order.payment_status !== "FAILED" ? (
                            <Row style={{ marginTop: "5px" }}>
                              <Col xs={14} sm={14} md={24} lg={24}>
                                <span
                                  className="qa-font-san qa-fs-12"
                                  style={{
                                    color: "#332f2f",
                                    opacity: "0.8",
                                    display: "flex",
                                    lineHeight: "17px",
                                  }}
                                >
                                  Delivery status
                                </span>
                              </Col>
                              <Col xs={10} sm={10} md={24} lg={24}>
                                <span
                                  className="qa-fs-12 qa-font-san qa-fw-b"
                                  style={{
                                    color: "#191919",
                                    lineHeight: "17px",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                  }}
                                >
                                  {SellerOrderStatuses.find(
                                    (x) => x.id === subOrder.status
                                  ) &&
                                    SellerOrderStatuses.find(
                                      (x) => x.id === subOrder.status
                                    ).name}
                                </span>
                              </Col>
                            </Row>
                          ) : (
                            ""
                          )}
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          style={{ marginTop: "25px" }}
                        >
                          <Row gutter={[8, 0]}>
                            {products.map((product, k) => {
                              let {
                                thumbnailMedia = {},
                                productName = "",
                              } = product;
                              let productNameSC =
                                productName
                                  .toLowerCase()
                                  .charAt(0)
                                  .toUpperCase() +
                                productName.toLowerCase().slice(1);
                              let { mediaUrl = "" } = thumbnailMedia || {};
                              return (
                                <Col xs={9} sm={9} md={5} lg={5} key={k}>
                                  {k <= 1 ? (
                                    <div className="aspect-ratio-box">
                                      {order.orderType == "RTS" ? (
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
                                      {products.length > 2 && k == 1 ? (
                                        <span className="show-more-circle circle-position">
                                          <span
                                            className="qa-font-san qa-fs-17"
                                            style={{
                                              color: "#F9F7F2",
                                              position: "absolute",
                                              top: "50%",
                                              left: "50%",
                                              transform:
                                                "translate(-50%, -50%)",
                                            }}
                                          >
                                            +{products.length - k - 1}
                                          </span>
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                  {/* <div className="aspect-ratio-box">
                                    {order.orderType == 'RTS' ?
                                      <img
                                        className="images"
                                        src={
                                          product.image
                                        }
                                        alt="Order placeholder"
                                      ></img> : <img
                                        className="images"
                                        src={
                                          process.env
                                            .NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                                          mediaUrl
                                        }
                                        alt="Order placeholder"
                                      ></img>}
                                  </div> */}
                                  {k < 2 ? (
                                    <div className="qa-text-2line qa-font-san qa-fs-10 qa-fw-b qa-lh qa-mar-top-05">
                                      {productNameSC}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </Col>
                              );
                            })}
                          </Row>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          style={{ marginTop: "15px" }}
                        >
                          <Row>
                            <Col xs={24} sm={24} md={24} lg={24}>
                              <span
                                className="qa-font-san qa-fs-14 qa-fw-b"
                                style={{
                                  color: "#874439",
                                  lineHeight: "17px",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                                onClick={() => handleClick(order, subOrder)}
                              >
                                View details
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        {subOrders.length > 1 && j !== subOrders.length - 1 ? (
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            className="qa-mar-top-2"
                          >
                            <hr style={{ color: "0.5px solid #332F2F" }} />
                          </Col>
                        ) : (
                          ""
                        )}
                      </Col>
                    );
                  })}
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{ paddingRight: "20px", paddingLeft: "20px" }}
                  >
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr style={{ color: "0.5px solid #332F2F" }} />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{
                      paddingRight: "20px",
                      paddingLeft: "20px",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                    }}
                  >
                    <Row>
                      <Col
                        xs={16}
                        sm={16}
                        md={16}
                        lg={16}
                        className="qa-col-start"
                      >
                        <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                          Freight fee
                        </span>
                      </Col>
                      <Col xs={8} sm={8} md={8} lg={8} className="qa-col-end">
                        {order && order.orderType == "RTS" ? (
                          <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                            {getSymbolFromCurrency(order && order.currency) ||
                              "$"}
                            {frieghtCharge > 0 &&
                              parseFloat(
                                frieghtCharge * order.conversionFactor
                              ).toFixed(2)}
                          </span>
                        ) : (
                          <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                            {getSymbolFromCurrency(order && order.currency)}
                            {order &&
                              order.miscCharges &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_CHARGES"
                              ) &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_CHARGES"
                              ).amount}
                          </span>
                        )}
                      </Col>
                      {order &&
                        order.miscCharges &&
                        order.miscCharges.find(
                          (x) => x.chargeId === "DISCOUNT"
                        ) &&
                        order.miscCharges.find((x) => x.chargeId === "DISCOUNT")
                          .amount > 0 && (
                          <Col
                            xs={16}
                            sm={16}
                            md={16}
                            lg={16}
                            className="qa-col-start"
                          >
                            <span
                              className="qa-fs-14 qa-fw-b qa-font-san"
                              style={{ color: "#02873A" }}
                            >
                              {order && order.referralCode} discount applied
                            </span>
                          </Col>
                        )}
                      {order &&
                        order.miscCharges &&
                        order.miscCharges.find(
                          (x) => x.chargeId === "DISCOUNT"
                        ) &&
                        order.miscCharges.find((x) => x.chargeId === "DISCOUNT")
                          .amount > 0 && (
                          <Col
                            xs={8}
                            sm={8}
                            md={8}
                            lg={8}
                            className="qa-col-end"
                          >
                            {order && order.orderType == "RTS" ? (
                              <span
                                className="qa-fs-16 qa-fw-b qa-font-san"
                                style={{ color: "#02873A" }}
                              >
                                -{" "}
                                {getSymbolFromCurrency(
                                  order && order.currency
                                ) || "$"}
                                {(order &&
                                  order.miscCharges &&
                                  order.miscCharges.find(
                                    (x) => x.chargeId === "DISCOUNT"
                                  ) &&
                                  parseFloat(
                                    order.miscCharges.find(
                                      (x) => x.chargeId === "DISCOUNT"
                                    ).amount * order.conversionFactor
                                  ).toFixed(2)) ||
                                  0}
                              </span>
                            ) : (
                              <span
                                className="qa-fs-16 qa-fw-b qa-font-san"
                                style={{ color: "#02873A" }}
                              >
                                -{" "}
                                {getSymbolFromCurrency(order && order.currency)}
                                {(order &&
                                  order.miscCharges &&
                                  order.miscCharges.find(
                                    (x) => x.chargeId === "DISCOUNT"
                                  ) &&
                                  order.miscCharges.find(
                                    (x) => x.chargeId === "DISCOUNT"
                                  ).amount) ||
                                  0}
                              </span>
                            )}
                          </Col>
                        )}

                      {order &&
                        order.miscCharges &&
                        order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ) &&
                        order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ).amount > 0 && (
                          <Col
                            xs={16}
                            sm={16}
                            md={16}
                            lg={16}
                            className="qa-col-start"
                          >
                            <span
                              className="qa-fs-14 qa-fw-b qa-font-san"
                              style={{ color: "#02873A" }}
                            >
                              Shipping promotion applied
                            </span>
                          </Col>
                        )}
                      {order &&
                        order.miscCharges &&
                        order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ) &&
                        order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ).amount > 0 && (
                          <Col
                            xs={8}
                            sm={8}
                            md={8}
                            lg={8}
                            className="qa-col-end"
                          >
                            {order && order.orderType == "RTS" ? (
                              <span
                                className="qa-fs-16 qa-fw-b qa-font-san"
                                style={{ color: "#02873A" }}
                              >
                                -{" "}
                                {getSymbolFromCurrency(
                                  order && order.currency
                                ) || "$"}
                                {(order &&
                                  order.miscCharges &&
                                  order.miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ) &&
                                  parseFloat(
                                    order.miscCharges.find(
                                      (x) => x.chargeId === "SELLER_DISCOUNT"
                                    ).amount * order.conversionFactor
                                  ).toFixed(2)) ||
                                  0}
                              </span>
                            ) : (
                              <span
                                className="qa-fs-16 qa-fw-b qa-font-san"
                                style={{ color: "#02873A" }}
                              >
                                -{" "}
                                {getSymbolFromCurrency(order && order.currency)}
                                {(order &&
                                  order.miscCharges &&
                                  order.miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ) &&
                                  order.miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ).amount) ||
                                  0}
                              </span>
                            )}
                          </Col>
                        )}
                      <Col
                        xs={16}
                        sm={16}
                        md={16}
                        lg={16}
                        className="qa-col-start qa-mar-top-05"
                      >
                        <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                          Custom, taxes & duties
                        </span>
                      </Col>
                      <Col
                        xs={8}
                        sm={8}
                        md={8}
                        lg={8}
                        className="qa-col-end qa-mar-top-05"
                      >
                        {order && order.orderType == "RTS" ? (
                          <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                            {getSymbolFromCurrency(order && order.currency) ||
                              "$"}
                            {order &&
                              order.miscCharges &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "DUTY_MAX"
                              ) &&
                              parseFloat(
                                order.miscCharges.find(
                                  (x) => x.chargeId === "DUTY_MAX"
                                ).amount * order.conversionFactor
                              ).toFixed(2)}
                          </span>
                        ) : (
                          <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                            {getSymbolFromCurrency(order && order.currency)}
                            {order &&
                              order.miscCharges &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_CHARGES"
                              ) &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_CHARGES"
                              ).amount}
                          </span>
                        )}
                      </Col>

                      <Col
                        xs={16}
                        sm={16}
                        md={16}
                        lg={16}
                        className="qa-col-start qa-mar-top-05"
                      >
                        <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                          VAT/ GST
                        </span>
                      </Col>
                      <Col
                        xs={8}
                        sm={8}
                        md={8}
                        lg={8}
                        className="qa-col-end qa-mar-top-05"
                      >
                        {order && order.orderType == "RTS" ? (
                          <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                            {getSymbolFromCurrency(order && order.currency) ||
                              "$"}
                            {(order &&
                              order.miscCharges &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "VAT"
                              ) &&
                              parseFloat(
                                order.miscCharges.find(
                                  (x) => x.chargeId === "VAT"
                                ).amount * order.conversionFactor
                              ).toFixed(2)) ||
                              0}
                          </span>
                        ) : (
                          <span className="qa-fs-16 qa-fw-b qa-font-san">
                            {getSymbolFromCurrency(order && order.currency)}
                            {(order &&
                              order.miscCharges &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "VAT"
                              ) &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "VAT"
                              ).amount) ||
                              0}
                          </span>
                        )}
                      </Col>
                      {order &&
                        order.promoDiscount !== undefined &&
                        order.promoDiscount !== "" &&
                        order.promoDiscount > 0 && (
                          <Col
                            xs={16}
                            sm={16}
                            md={16}
                            lg={16}
                            className="qa-col-start qa-mar-top-05"
                          >
                            <span
                              className="qa-fs-14 qa-fw-b qa-font-san"
                              style={{ color: "#02873A" }}
                            >
                              <span style={{ textTransform: "uppercase" }}>
                                {order.promoCode}
                              </span>{" "}
                              discount applied
                            </span>
                          </Col>
                        )}
                      {order &&
                        order.promoDiscount !== undefined &&
                        order.promoDiscount !== "" &&
                        order.promoDiscount > 0 && (
                          <Col
                            xs={8}
                            sm={8}
                            md={8}
                            lg={8}
                            className="qa-col-end qa-mar-top-05"
                          >
                            <span
                              className="qa-fs-14 qa-fw-b qa-font-san"
                              style={{ color: "#02873A" }}
                            >
                              -{" "}
                              {getSymbolFromCurrency(order && order.currency) ||
                                "$"}
                              {parseFloat(order.promoDiscount).toFixed(2)}
                            </span>
                          </Col>
                        )}
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{ paddingRight: "20px", paddingLeft: "20px" }}
                  >
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr style={{ color: "0.5px solid #332F2F" }} />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{
                      paddingRight: "20px",
                      paddingLeft: "20px",
                      paddingBottom: "20px",
                      paddingTop: "5px",
                    }}
                  >
                    <Row>
                      <Col
                        xs={16}
                        sm={16}
                        md={16}
                        lg={16}
                        className="qa-col-start"
                      >
                        <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                          TOTAL CART VALUE
                        </span>
                      </Col>
                      <Col xs={8} sm={8} md={8} lg={8} className="qa-col-end">
                        {order && order.orderType == "RTS" ? (
                          <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                            {getSymbolFromCurrency(order && order.currency) ||
                              "$"}
                            {order &&
                              parseFloat(
                                order.total * order.conversionFactor
                              ).toFixed(2)}
                          </span>
                        ) : (
                          <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                            {getSymbolFromCurrency(order && order.currency)}
                            {order &&
                              order.miscCharges &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "TOTAL_AMOUNT"
                              ) &&
                              order.miscCharges.find(
                                (x) => x.chargeId === "TOTAL_AMOUNT"
                              ).amount}
                          </span>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            );
          })}
        </Col>
      ) : (
        <OrderDetails
          orders={orderDetails}
          subOrders={subOrders}
          brandNameList={props.brandNameList}
        />
      )}
      <Modal
        visible={visible}
        footer={null}
        closable={false}
        onCancel={sendQueryCancel}
        style={{ top: 5 }}
        bodyStyle={{ padding: "0" }}
        className="rfq-submit-modal"
        // width={props.buyerDetails || props.sellerDetails ? 775 : 550}
        className="rfq-submit-modal"
      >
        <div>
          <div
            onClick={sendQueryCancel}
            style={{
              position: "absolute",
              right: "20px",
              top: "15px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />{" "}
          </div>
          <SendQueryForm
            sendQueryCancel={sendQueryCancel}
            token={keycloak.token}
            initialValues={values}
            userId={props.userProfile && props.userProfile.profileId}
          />
        </div>
      </Modal>
      <Modal
        visible={successQueryVisible}
        footer={null}
        closable={true}
        onCancel={successQueryCancel}
        centered
        bodyStyle={{ padding: "0" }}
        width={400}
        className="rfq-submission-modal"
      >
        <div id="send-query-success-modal">
          <div className="send-query-success-modal-content">
            <p className="send-query-success-modal-para1">Thank you!</p>
            <p className="send-query-success-modal-para2">
              We are excited to serve you and will revert within 24 hrs.
            </p>
          </div>
          <Button
            className="send-query-success-modal-button"
            onClick={() => {
              successQueryCancel();
            }}
          >
            Back to home page
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    orders: state.userProfile.orders,
    brandNameList: state.userProfile.brandNameList,
    isOrderAvailable: state.userProfile.isOrderAvailable,
    userProfile: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, {
  getOrders,
  getOrderByOrderId,
})(OrdersMobile);
