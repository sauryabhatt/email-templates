/** @format */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { Row, Col, Button, Modal } from "antd";
import OrderDetails from "./OrderDetails";
import { getOrders, getOrderByOrderId } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
import getSymbolFromCurrency from "currency-symbol-map";
import { LoadingOutlined } from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import SendQueryForm from "../SendQueryForm/SendQueryForm";
import Icon from "@ant-design/icons";
import SellerOrderStatuses from "../../public/filestore/SellerOrderStatuses.json";
import moment from "moment";

const Orders = (props) => {
  const router = useRouter();
  let { orders = [] } = props;
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const { keycloak } = useKeycloak();
  const [orderDetails, setOrderDetails] = useState("");
  const [subOrders, setSubOrders] = useState("");
  const [showLoader, setShowLoader] = useState(true);
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
    setShowLoader(true);
    props.getOrders(keycloak.token);
  }, [keycloak.token]);

  useEffect(() => {
    if (props.orders && props.isOrderAvailable) {
      setShowLoader(false);
    }
  }, [props.orders, props.isOrderAvailable]);

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

  const addDefaultSrc = (ev) => {
    ev.target.src = process.env.NEXT_PUBLIC_URL + "/placeholder.png";
  };

  if (showLoader) {
    return (
      <div className="qa-loader-middle">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </div>
    );
  }

  const diff_hours = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };

  return (
    <React.Fragment>
      <Col xs={24} sm={24} md={22} lg={22}>
        <Row>
          <Col xs={22} sm={22} md={12} lg={12}>
            <div className="form-top">
              <p
                className="form-heading qa-fs-22 qa-font-san qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                MY ORDERS
              </p>
            </div>
          </Col>
          <Col xs={22} sm={22} md={12} lg={12}>
            <div style={{ textAlign: "right" }}>
              <Link href="/FAQforwholesalebuyers">
                <a target="_blank">
                  <span
                    style={{ lineHeight: "17px", cursor: "pointer" }}
                    className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                  >
                    BUYERS’ FAQs{" "}
                  </span>
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
          </Col>
        </Row>
      </Col>
      {!props.showOrderDetails ? (
        <Col xs={22} sm={22} md={22} lg={22}>
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
                    className="qa-font-butler qa-fs-30"
                    style={{ color: "#191919" }}
                  >
                    No orders to display!
                  </span>
                </Col>
                <Col xs={17} sm={17} md={17} lg={17}>
                  <span className="qa-font-san qa-fs-17 qa-tc-white">
                    You currently do not have any active or past orders to
                    display. You can get started by sharing a Request for quote
                    by clicking below.
                  </span>
                </Col>
                <Col xs={7} sm={7} md={7} lg={7}></Col>
                <Col
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: "40px", marginBottom: "40px" }}
                  className="quote-rfq"
                >
                  <Button
                    className="qa-button quote-contact-seller"
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    <span className="qa-font-san qa-fw-b qa-fs-12">
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
            } = order;
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
                lg={24}
                key={i}
                className="qa-mar-btm-2"
                style={{ backgroundColor: "rgb(242, 240, 235)" }}
              >
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row style={{ backgroundColor: "#E6E4DF", height: "60px" }}>
                    {order.payment_status !== "FAILED" ? (
                      <Col
                        xs={11}
                        sm={11}
                        md={17}
                        lg={17}
                        style={{ padding: "20px 0px" }}
                        className="qa-vertical-center"
                      >
                        <span
                          className="qa-fs-14 qa-font-san"
                          style={{
                            color: "#332f2f",
                            display: "flex",
                            textAlign: "left",
                            marginLeft: "20px",
                          }}
                        >
                          ORDER NUMBER #{order.orderId}
                        </span>
                      </Col>
                    ) : (
                      <React.Fragment>
                        <Col
                          xs={11}
                          sm={11}
                          md={7}
                          lg={7}
                          style={{ padding: "10px 0px" }}
                        >
                          <span
                            className="qa-fs-14 qa-font-san"
                            style={{
                              color: "#332f2f",
                              display: "flex",
                              textAlign: "left",
                              marginLeft: "20px",
                            }}
                          >
                            ORDER NUMBER #{order.orderId}
                          </span>
                        </Col>
                        <Col
                          xs={11}
                          sm={11}
                          md={10}
                          lg={10}
                          style={{ padding: "20px 0px", textAlign: "center" }}
                          className="qa-vertical-center"
                        >
                          <span
                            className="qa-fs-14 qa-font-san qa-fw-b"
                            style={{
                              color: "#EE0D1A",
                              marginLeft: "20px",
                            }}
                          >
                            PAYMENT UNSUCCESSFUL
                          </span>
                        </Col>
                      </React.Fragment>
                    )}

                    <Col
                      xs={11}
                      sm={11}
                      md={7}
                      lg={7}
                      className="download-section qa-vertical-center"
                      style={{ paddingRight: "20px" }}
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
                              onClick={() =>
                                retryPayment(order.orderId, order.orderType)
                              }
                            >
                              <span className="qa-font-san qa-fs-12">
                                RETRY PAYMENT
                              </span>
                            </Button>
                          )}
                        </span>
                      )}
                    </Col>
                    {/* <Col
                      xs={11}
                      sm={11}
                      md={12}
                      lg={12}
                      style={{ marginTop: "5px", paddingRight: "20px" }}
                    >
                      <span
                        className="qa-fs-14 qa-font-san"
                        style={{
                          color: "#F2F0EB",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        Order date
                      </span>
                    </Col> */}
                    {/* <Col
                      xs={11}
                      sm={11}
                      md={12}
                      lg={12}
                      style={{ marginBottom: "5px" }}
                    >
                      <span
                        className="qa-fs-14 qa-font-san"
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
                      xs={11}
                      sm={11}
                      md={12}
                      lg={12}
                      style={{ marginBottom: "5px", paddingRight: "20px" }}
                    >
                      <span
                        className="qa-fs-14 qa-font-san"
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
                      className={j === 0 ? "qa-order-first" : "qa-order-list"}
                      key={j}
                      style={{ padding: "10px 20px" }}
                    >
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Row className="qa-mar-btm-15">
                          <Col xs={22} sm={20} md={20} lg={20}>
                            <div
                              className="qa-fs-16 qa-fw-b qa-font-san"
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
                            </div>
                            <div
                              className="qa-fs-12 qa-font-san qa-mar-top-05"
                              style={{ color: "#332f2f", lineHeight: "14px" }}
                            >
                              Seller order id: {id}
                            </div>
                          </Col>
                          <Col xs={4} sm={4} md={4} lg={4}>
                            <span
                              className="qa-font-san qa-fs-14 qa-fw-b qa-cursor"
                              style={{
                                color: "#874439",
                                paddingTop: "5px",
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                              onClick={() => handleClick(order, subOrder)}
                            >
                              View details
                            </span>
                          </Col>
                        </Row>
                      </Col>

                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Row gutter={[8, 0]}>
                          <Col xs={12} sm={12} md={10} lg={10}>
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
                                  <Col xs={8} sm={8} md={11} lg={11} key={k}>
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

                                    {k < 2 ? (
                                      <div
                                        className={
                                          mediaMatch.matches
                                            ? "qa-mar-top-05 qa-font-san qa-fs-12 qa-fw-b qa-tc-white qa-text-2line qa-lh"
                                            : "qa-mar-top-05 qa-font-san qa-fs-10 qa-fw-b qa-tc-white qa-text-2line qa-lh"
                                        }
                                      >
                                        {productNameSC}
                                      </div>
                                    ) : (
                                      ""
                                    )}
                                  </Col>
                                );
                              })}
                              {/* //   <Col xs={8} sm={8} md={11} lg={11}>
                            //     <img
                            //       className="images"
                            //       src={
                            //         process.env.PUBLIC_URL + "/testImage.png"
                            //       }
                            //       style={{ height: "auto", width: "100%" }}
                            //     ></img>
                            //   </Col> */}
                              {/* <Col xs={8} sm={8} md={2} lg={2}>
                                                </Col> */}

                              {/* {products.map((product, j) => {
                                let { productName = "" } = product;
                                return (
                                  <Col xs={8} sm={8} md={11} lg={11} key={j}>
                                    <span
                                      className={
                                        mediaMatch.matches
                                          ? "qa-font-san qa-fs-12 qa-fw-b qa-tc-white"
                                          : "qa-font-san qa-fs-10 qa-fw-b qa-tc-white"
                                      }
                                    >
                                      {productName}
                                    </span>
                                  </Col>
                                );
                              })} */}
                              {/* <Col xs={8} sm={8} md={2} lg={2}>
                                                </Col> */}
                            </Row>
                          </Col>
                          <Col
                            xs={12}
                            sm={12}
                            md={14}
                            lg={14}
                            style={{ paddingRight: "10px" }}
                          >
                            <Row>
                              <Col xs={0} sm={0} md={2} lg={2}></Col>
                              <Col xs={0} sm={0} md={11} lg={11}>
                                <span
                                  className="qa-font-san qa-fs-14"
                                  style={{
                                    color: "#332f2f",
                                    opacity: "0.8",
                                    display: "flex",
                                  }}
                                >
                                  Total order value
                                </span>
                              </Col>
                              <Col xs={0} sm={0} md={1} lg={1}></Col>
                              <Col xs={0} sm={0} md={10} lg={10}>
                                <span
                                  className="qa-fs-14 qa-font-san qa-fw-b"
                                  style={{
                                    color: "#191919",
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
                                      parseFloat(subOrder.qalaraSellerMargin) *
                                        0
                                    ) || 0)
                                  ).toFixed(2)}
                                </span>
                              </Col>
                            </Row>
                            {order.payment_status !== "FAILED" ? (
                              <Row style={{ marginTop: "15px" }}>
                                <Col xs={0} sm={0} md={2} lg={2}></Col>
                                <Col xs={0} sm={0} md={11} lg={11}>
                                  <span
                                    className="qa-font-san qa-fs-14"
                                    style={{
                                      color: "#332f2f",
                                      opacity: "0.8",
                                    }}
                                  >
                                    Expected delivery date
                                  </span>
                                </Col>
                                <Col xs={0} sm={0} md={1} lg={1}></Col>
                                <Col xs={0} sm={0} md={10} lg={10}>
                                  <span
                                    className="qa-fs-14 qa-font-san qa-fw-b"
                                    style={{
                                      color: "#191919",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    {order.expectedDeliveryDateMin &&
                                    order.expectedDeliveryDateMax ? (
                                      <span>
                                        {moment(
                                          order.expectedDeliveryDateMin
                                        ).format("DD/MM/YYYY")}{" "}
                                        -{" "}
                                        {moment(
                                          order.expectedDeliveryDateMax
                                        ).format("DD/MM/YYYY")}
                                      </span>
                                    ) : order.expectedDeliveryDate ? (
                                      moment(order.expectedDeliveryDate).format(
                                        "DD/MM/YYYY"
                                      )
                                    ) : null}
                                  </span>
                                </Col>
                              </Row>
                            ) : (
                              ""
                            )}
                            {order.payment_status !== "FAILED" ? (
                              <Row style={{ marginTop: "15px" }}>
                                <Col xs={0} sm={0} md={2} lg={2}></Col>
                                <Col xs={0} sm={0} md={11} lg={11}>
                                  <span
                                    className="qa-font-san qa-fs-14"
                                    style={{
                                      color: "#332f2f",
                                      opacity: "0.8",
                                      display: "flex",
                                    }}
                                  >
                                    Delivery status
                                  </span>
                                </Col>
                                <Col xs={0} sm={0} md={1} lg={1}></Col>
                                <Col xs={0} sm={0} md={10} lg={10}>
                                  <span
                                    className="qa-fs-14 qa-font-san qa-fw-b"
                                    style={{
                                      color: "#191919",
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    {SellerOrderStatuses.find(
                                      (x) => x.id === order.status
                                    )
                                      ? SellerOrderStatuses.find(
                                          (x) => x.id === order.status
                                        ).name
                                      : ""}
                                  </span>
                                </Col>
                              </Row>
                            ) : (
                              ""
                            )}
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
                          style={{ paddingLeft: "70px", paddingRight: "70px" }}
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
                    <Col
                      xs={23}
                      sm={23}
                      md={24}
                      lg={24}
                      style={{ paddingRight: "10px" }}
                    >
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
                  }}
                >
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12} className="qa-col-end">
                      <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                        Freight fee
                      </span>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="qa-col-end"
                      style={{ paddingRight: "10px" }}
                    >
                      {order && order.orderType == "RTS" ? (
                        <span className="qa-fs-16 qa-fw-b qa-font-san qa-tc-white">
                          {getSymbolFromCurrency(order && order.currency) ||
                            "$"}
                          {order &&
                            order.miscCharges &&
                            order.miscCharges.find(
                              (x) => x.chargeId === "FREIGHT_MAX"
                            ) &&
                            parseFloat(
                              order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_MAX"
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
                    {order &&
                      order.miscCharges &&
                      order.miscCharges.find(
                        (x) => x.chargeId === "DISCOUNT"
                      ) &&
                      order.miscCharges.find((x) => x.chargeId === "DISCOUNT")
                        .amount > 0 && (
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          className="qa-col-end"
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
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          className="qa-col-end"
                          style={{ paddingRight: "10px" }}
                        >
                          {order && order.orderType == "RTS" ? (
                            <span
                              className="qa-fs-16 qa-fw-b qa-font-san"
                              style={{ color: "#02873A" }}
                            >
                              -{" "}
                              {getSymbolFromCurrency(order && order.currency) ||
                                "$"}
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
                              - {getSymbolFromCurrency(order && order.currency)}
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
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          className="qa-col-end"
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
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          className="qa-col-end"
                          style={{ paddingRight: "10px" }}
                        >
                          {order && order.orderType == "RTS" ? (
                            <span
                              className="qa-fs-16 qa-fw-b qa-font-san"
                              style={{ color: "#02873A" }}
                            >
                              -{" "}
                              {getSymbolFromCurrency(order && order.currency) ||
                                "$"}
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
                              - {getSymbolFromCurrency(order && order.currency)}
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
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="qa-col-end qa-mar-top-05"
                    >
                      <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                        Custom, taxes & duties
                      </span>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="qa-col-end qa-mar-top-05"
                      style={{ paddingRight: "10px" }}
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
                              (x) => x.chargeId === "CUSTOM_CHARGES"
                            ) &&
                            order.miscCharges.find(
                              (x) => x.chargeId === "CUSTOM_CHARGES"
                            ).amount}
                        </span>
                      )}
                    </Col>

                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="qa-col-end qa-mar-top-05"
                    >
                      <span className="qa-fs-14 qa-fw-b qa-font-san qa-tc-white">
                        VAT/ GST
                      </span>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="qa-col-end qa-mar-top-05"
                      style={{ paddingRight: "10px" }}
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
                            order.miscCharges.find((x) => x.chargeId === "VAT")
                              .amount) ||
                            0}
                        </span>
                      )}
                    </Col>
                    {order &&
                      order.promoDiscount !== undefined &&
                      order.promoDiscount !== "" &&
                      order.promoDiscount > 0 && (
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          className="qa-col-end qa-mar-top-05"
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
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          className="qa-col-end qa-mar-top-05"
                          style={{ paddingRight: "10px" }}
                        >
                          <span
                            className="qa-fs-16 qa-fw-b qa-font-san"
                            style={{ color: "#02873A" }}
                          >
                            -{" "}
                            {getSymbolFromCurrency(order && order.currency) ||
                              "$"}
                            {parseFloat(order.promoDiscount).toFixed(2)}
                          </span>
                        </Col>
                      )}
                    {/* </Col>
                    <Col xs={15} sm={15} md={15} lg={15} className="qa-col-end">
                      <div className="c-left-blk">
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-fs-14 qa-tc-white"
                              : "qa-font-san qa-fs-12 qa-tc-white"
                          }
                        >
                          Part of these charges are refundable.{" "}
                        </span>
                        <Link
                          href="/FAQforwholesalebuyers"
                          target="_blank"
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-fs-14 qa-sm-color"
                              : "qa-font-san qa-fs-12 qa-sm-color"
                          }
                          style={{ textDecoration: 'underline' }}
                        >
                          Know more
                        </Link>
                      </div>
                    </Col> */}
                  </Row>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  className="qa-mar-btm-05 qa-mar-top-05"
                  style={{ paddingRight: "20px", paddingLeft: "20px" }}
                >
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{ paddingRight: "10px" }}
                    >
                      <hr style={{ color: "0.5px solid #332F2F" }} />
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{ paddingBottom: "20px", paddingRight: "20px" }}
                >
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12} className="qa-col-end">
                      <span className="qa-fs-17 qa-fw-b qa-font-san qa-tc-white">
                        TOTAL CART VALUE
                      </span>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      className="qa-col-end"
                      style={{ paddingRight: "10px" }}
                    >
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
                          {order && order.total}
                        </span>
                      )}
                    </Col>
                  </Row>
                </Col>
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
})(Orders);
