/** @format */

import React, { useState } from "react";
import { Col, Button, Modal, Popover } from "antd";
import getSymbolFromCurrency from "currency-symbol-map";
import moment from "moment";
import Icon from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";

const OrderCard = (props) => {
  const router = useRouter();
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const { order, handleShowOrder, mediaMatche } = props;
  const [popover, setPopover] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const { keycloak } = useKeycloak();

  const redirectTrackingUrl = () => {
    let data = order.trackingURL;
    if (data) {
      let url = "https://" + data;
      window.open(url, "_blank");
      setModalVisible(false);
    }
  };

  const diff_hours = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  };
  let {
    orderedDate = "",
    subOrders = [],
    orderConfirmedDate = "",
    paymentTime = "",
    expectedDeliveryDateMin='',
    expectedDeliveryDateMax=''
  } = order;

  let date1 = expectedDeliveryDateMin.split("-");
let minDate = new Date(date1[0], date1[1]-1, date1[2]);


let date2 = expectedDeliveryDateMax.split("-");
let maxDate = new Date(date2[0], date2[1]-1, date2[2]);


  let paymentTimeDiff = diff_hours(new Date(paymentTime), new Date());
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

  const retryPayment = (orderId, type) => {
    if (type == "CUSTOM") {
      let url = "/order-review/" + orderId;
      router.push(url);
    } else {
      //props.getOrderByOrderId(keycloak.token, orderId);
      let url = "/RTS/order-review/" + orderId;
      router.push(url);
    }
  };

  const handleClick = (orders, subOrders) => {
    props.handleShowOrder(true);
    setOrderDetails(orders);
    setSubOrders(subOrders);
  };
  let priceBreakup = (
    <div className="breakup-popup qa-font-san">
      <div className="qa-border-bottom qa-pad-btm-15 qa-fs-14 qa-fw-b">
        Order value breakup
        <span
          onClick={() => {
            setPopover(false);
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
        <div className="c-left-blk qa-mar-btm-05">
          Value of products purchased
        </div>
        <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
          {getSymbolFromCurrency(order && order.currency) || "$"}
          {parseFloat(order.subTotal * order.conversionFactor).toFixed(2)}
        </span>
        {/* {order.shippingTerms === "DDU" ? null : ( */}
        <div>
          <div className="c-left-blk qa-mar-btm-05">Freight fees</div>
          {order && order.orderType == "RTS" ? (
            <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
              {getSymbolFromCurrency(order && order.currency) || "$"}
              {order &&
              order.miscChargesActual &&
              order.miscChargesActual.find((x) => x.chargeId === "FREIGHT_MAX")
                ? parseFloat(
                    order.miscChargesActual.find(
                      (x) => x.chargeId === "FREIGHT_MAX"
                    ).amount * order.conversionFactor
                  ).toFixed(2)
                : order &&
                  order.miscCharges &&
                  order.miscCharges.find((x) => x.chargeId === "FREIGHT_MAX") &&
                  parseFloat(
                    order.miscCharges.find((x) => x.chargeId === "FREIGHT_MAX")
                      .amount * order.conversionFactor
                  ).toFixed(2)}
            </span>
          ) : (
            <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
              {getSymbolFromCurrency(order && order.currency) || "$"}
              {order &&
              order.miscChargesActual &&
              order.miscChargesActual.find(
                (x) => x.chargeId === "FREIGHT_CHARGES"
              )
                ? order.miscChargesActual.find(
                    (x) => x.chargeId === "FREIGHT_CHARGES"
                  ).amount * order.conversionFactor
                : order &&
                  order.miscCharges &&
                  order.miscCharges.find(
                    (x) => x.chargeId === "FREIGHT_CHARGES"
                  ) &&
                  order.miscCharges.find(
                    (x) => x.chargeId === "FREIGHT_CHARGES"
                  ).amount * order.conversionFactor}
            </span>
          )}
          {order &&
            order.miscCharges &&
            order.miscCharges.find((x) => x.chargeId === "SELLER_DISCOUNT") &&
            order.miscCharges.find((x) => x.chargeId === "SELLER_DISCOUNT")
              .amount > 0 && (
              <div className="c-left-blk qa-mar-btm-05">
                <span
                  className="qa-fs-14 qa-fw-b qa-font-san"
                  style={{ color: "#02873A" }}
                >
                  Shipping discount
                </span>
              </div>
            )}
          {order &&
            order.miscCharges &&
            order.miscCharges.find((x) => x.chargeId === "SELLER_DISCOUNT") &&
            order.miscCharges.find((x) => x.chargeId === "SELLER_DISCOUNT")
              .amount > 0 && (
              <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
                {order && order.orderType == "RTS" ? (
                  <span
                    className="qa-fs-16 qa-font-san"
                    style={{ color: "#02873A" }}
                  >
                    - {getSymbolFromCurrency(order && order.currency) || "$"}
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
                    className="qa-fs-16 qa-font-san"
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
                      ).amount * order.conversionFactor) ||
                      0}
                  </span>
                )}
              </span>
            )}

          {order &&
            order.miscCharges &&
            order.miscCharges.find((x) => x.chargeId === "PRODUCT_DISCOUNT") &&
            order.miscCharges.find((x) => x.chargeId === "PRODUCT_DISCOUNT")
              .amount > 0 && (
              <div className="c-left-blk qa-mar-btm-05">
                <span
                  className="qa-fs-14 qa-fw-b qa-font-san"
                  style={{ color: "#02873A" }}
                >
                  Shipping discount
                </span>
              </div>
            )}
          {order &&
            order.miscCharges &&
            order.miscCharges.find((x) => x.chargeId === "PRODUCT_DISCOUNT") &&
            order.miscCharges.find((x) => x.chargeId === "PRODUCT_DISCOUNT")
              .amount > 0 && (
              <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
                {order && order.orderType == "RTS" ? (
                  <span
                    className="qa-fs-16 qa-font-san"
                    style={{ color: "#02873A" }}
                  >
                    - {getSymbolFromCurrency(order && order.currency) || "$"}
                    {(order &&
                      order.miscCharges &&
                      order.miscCharges.find(
                        (x) => x.chargeId === "PRODUCT_DISCOUNT"
                      ) &&
                      parseFloat(
                        order.miscCharges.find(
                          (x) => x.chargeId === "PRODUCT_DISCOUNT"
                        ).amount * order.conversionFactor
                      ).toFixed(2)) ||
                      0}
                  </span>
                ) : (
                  <span
                    className="qa-fs-16 qa-font-san"
                    style={{ color: "#02873A" }}
                  >
                    - {getSymbolFromCurrency(order && order.currency)}
                    {(order &&
                      order.miscCharges &&
                      order.miscCharges.find(
                        (x) => x.chargeId === "PRODUCT_DISCOUNT"
                      ) &&
                      order.miscCharges.find(
                        (x) => x.chargeId === "PRODUCT_DISCOUNT"
                      ).amount * order.conversionFactor) ||
                      0}
                  </span>
                )}
              </span>
            )}
          {order &&
            order.referralCode &&
            order.miscCharges &&
            order.miscCharges.find((x) => x.chargeId === "DISCOUNT") &&
            order.miscCharges.find((x) => x.chargeId === "DISCOUNT").amount >
              0 && (
              <div className="c-left-blk qa-mar-btm-05">
                <span
                  className="qa-fs-14 qa-fw-b qa-font-san"
                  style={{ color: "#02873A" }}
                >
                  {order && order.referralCode} applied
                </span>
              </div>
            )}
          {order &&
            order.referralCode &&
            order.miscCharges &&
            order.miscCharges.find((x) => x.chargeId === "DISCOUNT") &&
            order.miscCharges.find((x) => x.chargeId === "DISCOUNT").amount >
              0 && (
              <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
                {order && order.orderType == "RTS" ? (
                  <span
                    className="qa-fs-16 qa-fw-b qa-font-san"
                    style={{ color: "#02873A" }}
                  >
                    - {getSymbolFromCurrency(order && order.currency) || "$"}
                    {(order &&
                      order.miscCharges &&
                      order.miscCharges.find(
                        (x) => x.chargeId === "DISCOUNT"
                      ) &&
                      parseFloat(
                        order.miscCharges.find((x) => x.chargeId === "DISCOUNT")
                          .amount * order.conversionFactor
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
                      order.miscCharges.find((x) => x.chargeId === "DISCOUNT")
                        .amount * order.conversionFactor) ||
                      0}
                  </span>
                )}
              </span>
            )}
          <div className="c-left-blk qa-mar-btm-05">Custom, taxes & duties</div>
          {order && order.orderType == "RTS" ? (
            <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
              {getSymbolFromCurrency(order && order.currency) || "$"}
              {order &&
              order.miscChargesActual &&
              order.miscChargesActual.find((x) => x.chargeId === "DUTY_MAX")
                ? parseFloat(
                    order.miscChargesActual.find(
                      (x) => x.chargeId === "DUTY_MAX"
                    ).amount * order.conversionFactor
                  ).toFixed(2)
                : order &&
                  order.miscCharges &&
                  order.miscCharges.find((x) => x.chargeId === "DUTY_MAX") &&
                  parseFloat(
                    order.miscCharges.find((x) => x.chargeId === "DUTY_MAX")
                      .amount * order.conversionFactor
                  ).toFixed(2)}
            </span>
          ) : (
            <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
              {getSymbolFromCurrency(order && order.currency) || "$"}
              {order &&
              order.miscChargesActual &&
              order.miscChargesActual.find(
                (x) => x.chargeId === "CUSTOM_CHARGES"
              )
                ? order.miscChargesActual.find(
                    (x) => x.chargeId === "CUSTOM_CHARGES"
                  ).amount * order.conversionFactor
                : order &&
                  order.miscCharges &&
                  order.miscCharges.find(
                    (x) => x.chargeId === "CUSTOM_CHARGES"
                  ) &&
                  order.miscCharges.find((x) => x.chargeId === "CUSTOM_CHARGES")
                    .amount * order.conversionFactor}
            </span>
          )}
          <div
            className="qa-border-bottom"
            style={{ paddingBottom: "15px", marginBottom: "15px" }}
          >
            <div className="c-left-blk qa-mar-btm-05">VAT/ GST / Taxes</div>
            {order && order.orderType == "RTS" ? (
              <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
                {getSymbolFromCurrency(order && order.currency) || "$"}
                {order &&
                order.miscChargesActual &&
                order.miscChargesActual.find((x) => x.chargeId === "VAT")
                  ? parseFloat(
                      order.miscChargesActual.find((x) => x.chargeId === "VAT")
                        .amount * order.conversionFactor
                    ).toFixed(2)
                  : order &&
                    order.miscCharges &&
                    order.miscCharges.find((x) => x.chargeId === "VAT") &&
                    parseFloat(
                      order.miscCharges.find((x) => x.chargeId === "VAT")
                        .amount * order.conversionFactor
                    ).toFixed(2)}
              </span>
            ) : (
              <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
                {getSymbolFromCurrency(order && order.currency) || "$"}
                {order &&
                order.miscChargesActual &&
                order.miscChargesActual.find((x) => x.chargeId === "VAT")
                  ? order.miscChargesActual.find((x) => x.chargeId === "VAT")
                      .amount * order.conversionFactor
                  : order &&
                    order.miscCharges &&
                    order.miscCharges.find((x) => x.chargeId === "VAT") &&
                    order.miscCharges.find((x) => x.chargeId === "VAT").amount *
                      order.conversionFactor}
              </span>
            )}
            {order &&
              order.promoDiscount !== undefined &&
              order.promoDiscount !== "" &&
              order.promoDiscount > 0 && (
                <div className="c-left-blk qa-mar-btm-05">
                  <span
                    className="qa-fs-14 qa-fw-b qa-font-san"
                    style={{ color: "#02873A" }}
                  >
                    <span style={{ textTransform: "uppercase" }}>
                      {order.promoCode}
                    </span>{" "}
                    applied
                  </span>
                </div>
              )}
            {order &&
              order.promoDiscount !== undefined &&
              order.promoDiscount !== "" &&
              order.promoDiscount > 0 && (
                <span
                  className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b"
                  style={{ color: "#02873A" }}
                >
                  - {getSymbolFromCurrency(order && order.currency) || "$"}
                  {parseFloat(
                    order.promoDiscount * order.conversionFactor
                  ).toFixed(2)}
                </span>
              )}
          </div>
        </div>
        {/* )} */}
        <div className="qa-mar-btm-15">
          <div className="c-left-blk qa-mar-btm-05 qa-fw-b">
            Total order value
          </div>
          <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(order && order.currency) || "$"}
            {parseFloat(order.total * order.conversionFactor).toFixed(2)}
          </span>
        </div>
        {order.paymentTerms && order.paymentTerms.length > 0
          ? order.paymentTerms.map((pm, index) => {
              return pm.chargeId === "ADVANCE" ? (
                <div className="qa-blue ">
                  <div className="c-left-blk qa-mar-btm-05 qa-fw-b">
                    PAYMENT RECEIVED
                  </div>
                  <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
                    {getSymbolFromCurrency(order && order.currency) || "$"}
                    {parseFloat(pm.amount * order.conversionFactor).toFixed(2)}
                  </span>
                </div>
              ) : pm.chargeId === "POST_DELIVERY" ? (
                <div>
                  <div className="c-left-blk qa-mar-btm-05 qa-fw-b">
                    PAY LATER
                  </div>
                  <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
                    {getSymbolFromCurrency(order && order.currency) || "$"}
                    {parseFloat(
                      (order.total - order.paymentTerms[0].amount) *
                        order.conversionFactor
                    ).toFixed(2)}
                  </span>
                </div>
              ) : null;
            })
          : null}
      </div>
    </div>
  );

  return (
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
            ORDER ID
          </div>
          <div className="qa-fs-14 order-header-tile-content qa-tc-white">
            {order.orderId}
          </div>
        </div>
        <div className="order-card-headr-tile">
          <div className="qa-fs-10 odrer-header-title qa-grey-color">
            ORDER DATE
          </div>
          <div className="qa-fs-14 order-header-tile-content qa-tc-white">
            {moment(order.orderConfirmedDate).format("DD MMM YY")}
          </div>
        </div>
        <div className="order-card-headr-tile">
          <div className="qa-fs-10 odrer-header-title qa-grey-color">
            ORDER STATUS
          </div>
          <div className="qa-fs-14 order-header-tile-content qa-tc-white">
            {order.status == "DRAFT" ? (
              <span className="qa-error-color">Payment unsuccessful</span>
            ) : (
              order.status
            )}
          </div>
        </div>
        {order.status === "DELIVERED" ? (
          <div className="order-card-headr-tile">
            <div className="qa-fs-10 odrer-header-title qa-grey-color">
              DELIVERED DATE
            </div>
            <div className="qa-fs-14 order-header-tile-content qa-tc-white">
              {moment(order.deliveredDate).format("DD MMM YY")}
            </div>
          </div>
        ) : null}
        {order.status === "DELIVERED" ||
        order.status === "CANCELED" ||
        order.status === "DRAFT" ? (
          order.status === "DRAFT" && !mediaMatche ? (
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
                {moment(minDate).format("DD MMM YY")} -{" "}
                {moment(maxDate).format("DD MMM YY")}
              </div>
            </div>
            {order.trackingURL && order.shipperName && !mediaMatche ? (
              <div className="order-card-headr-tile">
                <div
                  onClick={() => setModalVisible(true)}
                  className="qa-fs-14 odrer-header-title qa-sm-color qa-fw-b qa-cursor qa-underline"
                >
                  TRACK SELLER ORDER
                </div>
                {/*<div className="qa-fs-14 order-header-tile-content qa-green-color">
                  Arriving early.
                </div>*/}
              </div>
            ) : null}
          </React.Fragment>
        )}
      </div>
      {mediaMatche ? (
        <div className="order-card-body">
          {order.subOrders && order.subOrders.length > 0
            ? order.subOrders.map((e, index) => {
                return (
                  <div className="qa-flex-row qa-border-bottom">
                    {e.products && e.products.length > 0 ? (
                      <span
                        style={{ position: "relative", marginRight: "20px" }}
                      >
                        {order.orderType === "RTS" ? (
                          <img
                            className="images"
                            onError={addDefaultSrc}
                            src={e.products[0].image}
                            alt="Order placeholder"
                          ></img>
                        ) : (
                          <img
                            className="images"
                            onError={addDefaultSrc}
                            src={
                              process.env
                                .NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                              `${
                                e.products[0].thumbnailMedia
                                  ? e.products[0].thumbnailMedia.mediaUrl
                                  : null
                              }`
                            }
                            alt="Order placeholder"
                          ></img>
                        )}
                        {e.products.length > 1 ? (
                          <span className="place-hold">
                            {" "}
                            +{e.products.length - 1}
                          </span>
                        ) : null}
                      </span>
                    ) : null}

                    <div className="qa-fs-12 qa-flex-column">
                      <div>
                        Seller order ID:
                        <br />
                        {e.id}
                      </div>
                      <div
                        style={{ marginTop: "28px" }}
                        className="qa-sm-color qa-fw-b qa-cursor qa-underline"
                        onClick={() => {
                          order.subIndex = index;
                          props.setDetailOrder(order);
                          handleShowOrder(true);
                          props.setOrderText(order);
                        }}
                      >
                        View details
                      </div>
                    </div>
                  </div>
                );
              })
            : null}
          <div>
            <div
              className="qa-flex-row qa-fw-b qa-border-bottom"
              style={{ justifyContent: "space-between" }}
            >
              <span className="qa-fs-14">
                TOTAL ORDER VALUE ({order.shippingTerms})
              </span>
              <div className="qa-flex-column qa-txt-alg-rgt">
                <span className="qa-fs-14">
                  {getSymbolFromCurrency(order && order.currency) || "$"}
                  {order &&
                    parseFloat(order.total * order.conversionFactor).toFixed(2)}
                </span>
                <Popover
                  placement="bottomRight"
                  content={priceBreakup}
                  trigger="click"
                  visible={popover}
                  overlayClassName="price-breakup-popup"
                >
                  <span
                    onClick={() => setPopover(true)}
                    className="qa-cursor qa-fs-14 qa-sm-color"
                  >
                    See breakup
                  </span>
                </Popover>
              </div>
            </div>

            <div
              className="qa-flex-row "
              style={{ justifyContent: "space-between" }}
            >
              <div>
                {order.status === "DRAFT" ? (
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
                        onClick={() =>
                          retryPayment(order.orderId, order.orderType)
                        }
                      >
                        <span className="qa-font-san qa-fs-12 qa-fw-b qa-tc-white">
                          RETRY PAYMENT
                        </span>
                      </Button>
                    )}
                  </span>
                ) : order.payment_status !== "FAILED" &&
                  order.status !== "CANCELED" ? (
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
                        order && order.orderInvoice && order.orderInvoice.media
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
                ) : null}
              </div>
              {order.status === "DELIVERED" ||
              order.status === "CANCELED" ||
              order.status === "DRAFT" ? null : order.trackingURL &&
                order.shipperName &&
                order.status ? (
                <div className="order-card-headr-tile">
                  <div
                    onClick={() => setModalVisible(true)}
                    className="qa-fs-14 odrer-header-title qa-sm-color qa-fw-b qa-cursor "
                  >
                    TRACK ORDER
                  </div>
                  {/*<div className="qa-fs-14 order-header-tile-content qa-green-color">
                  Arriving early.
                </div>*/}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="order-card-body">
          {order.subOrders && order.subOrders.length > 0
            ? order.subOrders.map((e, index) => {
                return (
                  <div key={index} className="order-card-details-tile">
                    <div className="qa-flex-row">
                      <div
                        className="order-card-detail qa-fs-12"
                        style={{ marginRight: "60px" }}
                      >
                        <div className="qa-grey-color">Seller ID</div>
                        <div className="a">{e.sellerCode} </div>
                      </div>
                      <div className="order-card-detail">
                        {e.products && e.products.length > 0
                          ? e.products.map((p, i) => {
                              if (i > 2) {
                                return null;
                              }
                              return (
                                <span
                                  style={{
                                    position: "relative",
                                    marginRight: "20px",
                                  }}
                                >
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
                                        process.env
                                          .NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                                        `${
                                          p.thumbnailMedia
                                            ? p.thumbnailMedia.mediaUrl
                                            : null
                                        }`
                                      }
                                      alt="Order placeholder"
                                    ></img>
                                  )}
                                  {i == 2 && e.products.length > 3 ? (
                                    <span className="place-hold"> +3</span>
                                  ) : null}
                                </span>
                              );
                            })
                          : null}
                      </div>
                    </div>
                    <div className="order-card-detail qa-fs-14 qa-txt-alg-rgt">
                      <div> Seller order ID: {e.id}</div>
                      <div
                        className="qa-sm-color qa-fw-b qa-cursor qa-underline"
                        onClick={() => {
                          order.subIndex = index;
                          props.setDetailOrder(order);
                          handleShowOrder(true);
                          props.setOrderText(order);
                        }}
                      >
                        View details
                      </div>
                    </div>
                  </div>
                );
              })
            : null}

          <div className="order-card-bottom">
            <div className="qa-flex-row qa-fw-b">
              <span className="qa-fs-17">
                TOTAL ORDER VALUE ({order.shippingTerms})
              </span>
              <div className="qa-flex-column qa-mar-left-50 qa-txt-alg-rgt">
                <span className="qa-fs-17">
                  {getSymbolFromCurrency(order && order.currency) || "$"}
                  {order &&
                    parseFloat(order.total * order.conversionFactor).toFixed(2)}
                </span>
                <Popover
                  placement="bottomRight"
                  content={priceBreakup}
                  trigger="click"
                  visible={popover}
                  overlayClassName="price-breakup-popup"
                >
                  <span
                    onClick={() => setPopover(true)}
                    className="qa-cursor qa-fs-14 qa-sm-color"
                  >
                    See breakup
                  </span>
                </Popover>
              </div>
            </div>

            <div>
              {order.payment_status !== "FAILED" &&
              order.status !== "CANCELED" ? (
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
                      order && order.orderInvoice && order.orderInvoice.media
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
              ) : null}
            </div>
          </div>
        </div>
      )}
      <Modal
        title="Track your order"
        visible={isModalVisible}
        footer={null}
        closeIcon=<span
          className="track-cross"
          onClick={() => setModalVisible(false)}
        >
          X
        </span>
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
  );
};

export default OrderCard;
