/** @format */

import React, { useState } from "react";
import { Col, Button, Modal, Popover } from "antd";
import getSymbolFromCurrency from "currency-symbol-map";
import moment from "moment";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const OrderDetail = (props) => {
  const router = useRouter();
  const { order, handleShowOrder, mediaMatche } = props;
  const subOrders = order.subOrders[order.subIndex];
  const [popover, setPopover] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const mediaMatch = window.matchMedia("(min-width: 768px)");

  let { paymentTime = "" } = order;

  const diff_hours = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };
  let paymentTimeDiff = diff_hours(new Date(paymentTime), new Date());

  const redirectTrackingUrl = () => {
    let data = order.trackingURL;
    if (data) {
      let url = "https://" + data;
      window.open(url, "_blank");
      setModalVisible(false);
    }
  };

  const retryPayment = (orderId, type) => {
    if (type == "CUSTOM") {
      let url = "/order-review/" + orderId;
      router.push(url);
    } else {
      let url = "/RTS/order-review/" + orderId;
      router.push(url);
    }
  };
  const addDefaultSrc = (ev) => {
    ev.target.src = process.env.NEXT_PUBLIC_URL + "/placeholder.png";
  };
  return (
    <div className="tst">
      <div className="qa-mar-btm-1"> Order ID #{order.orderId}</div>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        className="order-card-container qa-mar-btm-2 qa-font-san"
      >
        <div className="order-card-header">
          <div className="order-card-headr-tile">
            <div className="qa-fs-10 odrer-header-title qa-grey-color">
              SELLER ORDER ID
            </div>
            <div className="qa-fs-14 order-header-tile-content qa-tc-white">
              {order.orderId}
            </div>
          </div>
          <div className="order-card-headr-tile">
            <div className="qa-fs-10 odrer-header-title qa-grey-color">
              SELLER ORDER STATUS
            </div>
            <div className="qa-fs-14 order-header-tile-content qa-tc-white">
              {order.status == "DRAFT" ? (
                <span className="qa-error-color">Payment unsuccessful</span>
              ) : (
                order.status
              )}
            </div>
          </div>
          {order.status === "DELIVERED" ||
          order.status === "CANCELED" ||
          order.status === "DRAFT" ? (
            order.status === "DRAFT" ? (
              <span>
                {paymentTimeDiff <= 48 && (
                  <Button
                    className={
                      mediaMatch.matches
                        ? "retry-payment-btn qa-vertical-center"
                        : "retry-payment-btn-mob qa-vertical-center"
                    }
                    size={mediaMatch.matches ? "large" : "small"}
                    style={{
                      justifyContent: "center",
                      backgroundColor: "#d9bb7f",
                    }}
                    onClick={() => retryPayment(order.orderId, order.orderType)}
                  >
                    <span className="qa-font-san qa-fs-12 qa-fw-b qa-tc-white">
                      RETRY PAYMENT
                    </span>
                  </Button>
                )}
              </span>
            ) : null
          ) : (
            <React.Fragment>
              <div className="order-card-headr-tile">
                <div className="qa-fs-10 odrer-header-title qa-grey-color">
                  ESTIMATED DELIVERY DATE
                </div>
                <div className="qa-fs-14 order-header-tile-content qa-green-color">
                  {moment(order.expectedDeliveryDateMin).format("DD MMM YY")} -{" "}
                  {moment(order.expectedDeliveryDateMax).format("DD MMM YY")}
                </div>
              </div>
              <div className="order-card-headr-tile">
                {order.trackingURL && order.shipperName ? (
                  <div
                    onClick={() => setModalVisible(true)}
                    className="qa-fs-14 odrer-header-title qa-sm-color qa-fw-b qa-cursor qa-underline"
                  >
                    TRACK SELLER ORDER
                  </div>
                ) : null}
                {/*<div className="qa-fs-14 order-header-tile-content qa-green-color">
                  Arriving early.
                </div>*/}
              </div>
            </React.Fragment>
          )}
        </div>
        <div className="order-card-body">
          <div
            className="qa-flex-row"
            style={{ justifyContent: "space-between" }}
          >
            <div className="qa-flex-column">
              <div className="qa-fs-17 qa-fw-b total-text">
                TOTAL SELLER ORDER VALUE
              </div>
              <div className="qa-mar-btm-05 qa-fs-12">
                Seller ID: {subOrders.sellerCode}
              </div>
              <div className="qa-flex-row qa-mar-btm-15 qa-fs-12 order-detail-text">
                <span className="click-icon-wrp ">
                  <CheckCircleOutlined
                    style={{
                      fontSize: "20px",
                      marginRight: "7px",
                    }}
                  />
                  Quality inspection
                </span>
                <span className="click-icon-wrp">
                  <CheckCircleOutlined
                    style={{
                      marginRight: "7px",
                      fontSize: "20px",
                    }}
                  />
                  Production monitoring
                </span>
              </div>
            </div>
            <div className="qa-flex-column qa-txt-alg-rgt">
              <span className="qa-fw-b qa-fs-17">
                {getSymbolFromCurrency(order && order.currency) || "$"}
                {parseFloat(subOrders.total * order.conversionFactor).toFixed(
                  2
                )}
              </span>
              {/*<Popover
                placement="bottomRight"
                content={priceBreakup}
                trigger="click"
                visible={popover}
                overlayClassName="price-breakup-popup"
              >
            <span onClick = {() => setPopover(true)} className = "qa-cursor qa-fs-14 qa-sm-color"> See breakup</span>
            </Popover>*/}
            </div>
          </div>

          {subOrders.products && subOrders.products.length > 0
            ? subOrders.products.map((p, i) => {
                return (
                  <div key={i} className="qa-flex-row order-card-details-tile">
                    <div className="qa-flex-row" style={{ width: "100%" }}>
                      {order.orderType === "RTS" ? (
                        <img
                          className="images"
                          onError={addDefaultSrc}
                          src={p.image}
                          alt="Order placeholder"
                        ></img>
                      ) : (
                        <img
                          className="images"
                          onError={addDefaultSrc}
                          src={
                            process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                            `${
                              p.thumbnailMedia
                                ? p.thumbnailMedia.mediaUrl
                                : null
                            }`
                          }
                          alt="Order placeholder"
                        ></img>
                      )}
                      <div
                        className="qa-flex-column"
                        style={{ marginLeft: "16px" }}
                      >
                        <span className="qa-fs-14">{p.productName}</span>
                        <span className="qa-fs-14">
                          Item ID -
                          <span className="qa-fs-14 qa-tc-white">
                            {order.orderType == "CUSTOM"
                              ? p.productId
                              : p.articleId}
                          </span>
                        </span>
                        <span className="qa-gray">
                          {p.color} {p.size ? `, ${p.size}` : null}
                        </span>
                        {/*p.qualityTestingCharge ? <span>Quality testing</span> : null*/}
                      </div>
                    </div>
                    <div className="qa-flex-column order-detail-payment">
                      <div
                        className="qa-flex-row"
                        style={{ justifyContent: "space-between" }}
                      >
                        <span>Units</span>
                        <span className="qa-fw-b">{p.quantity}</span>
                      </div>
                      <div
                        className="qa-flex-row"
                        style={{ justifyContent: "space-between" }}
                      >
                        <span>Base price</span>
                        <span className="qa-fw-b">
                          {getSymbolFromCurrency(order && order.currency) ||
                            "$"}
                          {parseFloat(p.total * order.conversionFactor).toFixed(
                            2
                          )}
                        </span>
                      </div>
                      {/*<div className="qa-flex-row" style={{justifyContent: "space-between"}}>
                        <span>Apportioned  freight,<br/> customs, duties & taxes</span>
                        <span className = "qa-fw-b">$80.00</span>
                      </div>*/}
                    </div>
                    <hr />
                  </div>
                );
              })
            : null}
        </div>
        <Modal
          title="Track your order"
          visible={isModalVisible}
          footer={null}
          closeIcon={
            <span
              className="track-cross"
              onClick={() => setModalVisible(false)}
            >
              X
            </span>
          }
        >
          <p>Logistics partner: {order.shipperName}</p>
          <span>
            You will be redirected to the partner website to track your order.{" "}
          </span>
          <br />
          <span
            onClick={redirectTrackingUrl}
            className="qa-fs-14 qa-sm-color qa-cursor qa-underline"
          >
            Please click here to track your order.
          </span>
        </Modal>
      </Col>
    </div>
  );
};

export default OrderDetail;
