/** @format */

import React, { useEffect } from "react";
import { Row, Col, Button, Popover } from "antd";
import { getOrderByOrderId } from "../../store/actions";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
import Link from "next/link";
import moment from "moment";

const PaymentSuccess = (props) => {
  const { keycloak } = useKeycloak();
  const router = useRouter();
  let { orderId: orderIdParam } = router.query;
  const mediaMatch = window.matchMedia("(min-width: 768px)");

  useEffect(() => {
    props.getOrderByOrderId(keycloak.token, orderIdParam);
  }, [keycloak.token, router.query.orderId]);

  let { order = {} } = props || {};
  let {
    balance = 0,
    total = 0,
    paymentTerms = [],
    conversionFactor = 0,
    promoDiscount = 0,
    promoCode = "",
    miscCharges = [],
    shippingTerms = "",
    shippingMode = "",
    expectedDeliveryDateMax = "",
    expectedDeliveryDateMin = "",
    orderType = "",
    typeOfOrder = "",
    orderId = "",
  } = order || {};

  const getOrders =
    props.order &&
    props.order.subOrders &&
    props.order.subOrders.map((subOrder) => {
      return (
        <React.Fragment>
          <Row>
            <Col span={24}>
              <span
                className="qa-font-san qa-tc-white qa-fs-16 qa-fw-b"
                style={{ letterSpacing: "0.02em" }}
              >
                Seller ID- {subOrder.sellerCode}
              </span>
            </Col>
          </Row>
          <Row className="qa-mar-top-1 qa-mar-btm-05">
            <Col xs={18} sm={18} md={18} lg={18}>
              <div className="qa-font-san qa-tc-white qa-fs-14 qa-mar-rgt-1 qa-lh">
                Value of products purchased
              </div>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              {props.order && orderType == "RTS" ? (
                <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                  {getSymbolFromCurrency(props.order && props.order.currency)}
                  {parseFloat(
                    subOrder.products.reduce((x, y) => x + y["total"], 0) *
                      props.order.conversionFactor
                  ).toFixed(2)}
                </span>
              ) : (
                <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                  {getSymbolFromCurrency(props.order && props.order.currency)}
                  {parseFloat(
                    subOrder.products.reduce((x, y) => x + y["total"], 0)
                  ).toFixed(2)}
                </span>
              )}
            </Col>
          </Row>
        </React.Fragment>
      );
    });

  const redirectToHome = () => {
    router.push("/");
  };

  const redirectToAccount = () => {
    router.push("/account/orders");
  };

  const redirectToFaq = () => {
    router.push("/FAQforwholesalebuyers");
  };

  let frieghtCharge = 0;
  let dutyCharge = 0;
  let vatCharge = 0;
  let couponDiscount = 0;
  let freightDis = 0;
  let sellerDiscount = 0;
  let customFreightCharge = 0;
  let vat = 0;
  let dutyMax = 0;
  let dutyMin = 0;
  let tat = 0;

  for (let charge of miscCharges) {
    let { chargeId = "", amount = 0 } = charge;
    if (chargeId === "TOTAL_COST_FREIGHT_MAX") {
      frieghtCharge = amount;
    } else if (chargeId === "VAT") {
      vatCharge = vatCharge + amount;
    } else if (chargeId === "DUTY_MAX") {
      dutyCharge = amount;
    } else if (chargeId === "DISCOUNT") {
      couponDiscount = amount;
    } else if (chargeId === "FREIGHT_MAX") {
      freightDis = amount;
    } else if (chargeId === "SELLER_DISCOUNT") {
      sellerDiscount = amount;
    } else if (chargeId === "FREIGHT_CHARGES") {
      customFreightCharge = amount;
    } else if (chargeId === "QALARA_CHARGES") {
      vatCharge = vatCharge + amount;
    } else if (chargeId === "DDP_VAT") {
      vat = amount;
    } else if (chargeId === "DDP_DUTY_MAX") {
      dutyMax = amount;
    } else if (chargeId === "DDP_DUTY_MIN") {
      dutyMin = amount;
    } else if (chargeId === "TAT") {
      tat = amount;
    }
  }

  if (couponDiscount > 0 || sellerDiscount > 0) {
    frieghtCharge = freightDis;
  }

  if (customFreightCharge) {
    frieghtCharge = customFreightCharge;
  }

  if (conversionFactor) {
    total = total * conversionFactor;
  }
  let advance = 0;

  if (!balance) {
    if (paymentTerms.find((x) => x.chargeId === "ADVANCE")) {
      advance = paymentTerms.find((x) => x.chargeId === "ADVANCE").amount;
      balance = total - advance;
    }
  } else {
    balance = balance;
  }
  advance = total - balance || 0;

  const dduContent = (
    <div className="breakup-popup qa-font-san qa-tc-white">
      <div className="qa-border-bottom qa-pad-btm-15 qa-fs-14 qa-lh">
        Estimated custom taxes and duties
      </div>
      <div className="qa-mar-top-1 qa-lh">
        Estimated custom duties for this order is{" "}
        <b>
          {getSymbolFromCurrency(props.order && props.order.currency)}
          {dutyMin} to{" "}
          {dutyMax > 0 ? (
            <span>
              {getSymbolFromCurrency(props.order && props.order.currency)}
              {dutyMax}.
            </span>
          ) : (
            "."
          )}
        </b>
      </div>
      <div className="qa-mar-top-05 qa-lh">
        Estimated VAT/GST/Taxes for this order is{" "}
        <b>
          {getSymbolFromCurrency(props.order && props.order.currency)}
          {vat}.
        </b>
      </div>
      <div className="qa-fs-12 qa-mar-top-15 qa-lh">
        Since you have selected DDU mode this has to be paid directly by you at
        actuals to our freight/logistics partner at the time of delivery/custom
        clearance as applicable.
      </div>
    </div>
  );

  return (
    // <div className='bird-vector'>
    <div>
      <div className="bird-vector" />
      <Row
        justify="center"
        className={
          mediaMatch.matches
            ? "payment-confirmation-body payment-success-section"
            : "payment-confirmation-body-mobile payment-success-section"
        }
        align="middle"
      >
        <Col xs={22} sm={22} md={18} lg={18}>
          <Row justify="center">
            <Col xs={22} sm={22} md={12} lg={12}>
              <Row className="qa-mar-top-2">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <div
                    className={
                      mediaMatch.matches
                        ? "qa-font-butler qa-tc-white qa-fs-60"
                        : "qa-font-butler qa-tc-white qa-fs-36 qa-mar-btm-15"
                    }
                  >
                    Thank you!
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  {orderType === "RTS" ? (
                    <div className="qa-font-butler qa-tc-white qa-fs-20 qa-lh-m">
                      You order with ID {orderId} is confirmed. We will monitor
                      your order and keep you updated on your order status till
                      the order is delivered. Please refer to the order
                      confirmation email for more details.
                    </div>
                  ) : (
                    <div>
                      <div className="qa-font-butler qa-tc-white qa-fs-20 qa-lh-m">
                        Your order with {orderId} is confirmed. We will
                        continuously monitor your order and keep you updated on
                        the following:
                      </div>
                      <div className="qa-mar-top-2 qa-font-san">
                        <li>Production monitoring</li>
                        <li>Quality inspection</li>
                        <li>Order shipping status and tracking</li>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>
              <Row className="qa-mar-top-3 qa-font-san">
                <Col span={24}>
                  <div className="cart-title qa-mar-btm-1 qa-cursor sen-font font-size-17 qa-border-bottom">
                    <div
                      className="c-left-blk qa-txt-alg-lft font-size-17"
                      style={{ width: "45%" }}
                    >
                      Estimated delivery date:
                    </div>
                    <div
                      className="c-right-blk qa-txt-alg-rgt font-size-17 qa-success qa-fw-b"
                      style={{ width: "55%" }}
                    >
                      {props.order && (
                        <span>
                          {moment(expectedDeliveryDateMin).format("DD MMM YY")}{" "}
                          -{" "}
                          {moment(expectedDeliveryDateMax).format("DD MMM YY")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                        <li>Estimated production/ dispatch time</li>
                      </div>
                      <div className="c-right-blk qa-txt-alg-rgt">
                        {typeOfOrder === "ERTM" ? "25-35" : "7-10"} days
                      </div>
                    </div>
                    <div>
                      <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                        <li>Estimated shipping lead time</li>
                      </div>
                      <div className="c-right-blk qa-txt-alg-rgt">
                        {shippingMode ? (
                          <span>
                            {tat - (shippingMode === "AIR" ? 3 : 7)}-{tat} days
                          </span>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={1}></Col>
              </Row>
              {orderType === "RTS" ? (
                <div>
                  <Row className="qa-mar-top-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <div className="qa-font-san qa-tc-white qa-fs-17 qa-lh-m">
                        If you want to review your order refer to the 'My
                        orders' section within 'My account'.
                      </div>
                    </Col>
                  </Row>

                  <Row className="qa-mar-top-1">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <div
                        className="qa-fs-17 qa-font-san qa-sm-color"
                        style={{
                          letterSpacing: "0.01em",
                          cursor: "pointer",
                        }}
                        onClick={redirectToAccount}
                      >
                        My account
                      </div>
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <div className="qa-font-san qa-tc-white qa-fs-17 qa-lh-m">
                        In case you have any questions you can refer to our FAQ
                        section or write to us at{" "}
                        <a
                          href="mailto:buyers@qalara.com"
                          className="qa-tc-white"
                        >
                          buyers@qalara.com
                        </a>
                      </div>
                    </Col>
                  </Row>

                  <Row className="qa-mar-top-1">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <span
                        className="qa-fs-17 qa-font-san qa-sm-color"
                        style={{
                          letterSpacing: "0.01em",
                          cursor: "pointer",
                        }}
                        onClick={redirectToFaq}
                      >
                        See FAQ
                      </span>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div>
                  <Row className="qa-mar-top-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <div className="qa-font-san qa-tc-white qa-fs-17 qa-lh-m">
                        At the time of the delivery our logistics partner will
                        contact you for the payment of applicable duties and
                        taxes. Please refer to the order confirmation email for
                        more details.
                      </div>
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <div className="qa-font-san qa-tc-white qa-fs-17 qa-lh-m">
                        If you want to review your order or if you have any
                        questions you can either write to us at
                        buyers@qalara.com or refer to the 'My account' or 'FAQ'
                        section.
                      </div>
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-2">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <span
                        className="qa-fs-17 qa-font-san qa-sm-color"
                        style={{
                          letterSpacing: "0.01em",
                          cursor: "pointer",
                        }}
                        onClick={redirectToAccount}
                      >
                        My account
                      </span>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <span
                        className="qa-fs-17 qa-font-san qa-sm-color"
                        style={{
                          letterSpacing: "0.01em",
                          cursor: "pointer",
                        }}
                        onClick={redirectToFaq}
                      >
                        See FAQ
                      </span>
                    </Col>
                  </Row>
                </div>
              )}
              <Row className="qa-mar-top-2">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Button
                    className="qa-button payemnt-btn"
                    onClick={redirectToHome}
                  >
                    <span>Continue shopping</span>
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={2} lg={2}></Col>
            <Col xs={22} sm={22} md={10} lg={10}>
              <Row
                className={
                  mediaMatch.matches
                    ? "order-details qa-mar-btm-3"
                    : "order-details qa-mar-top-3 qa-mar-btm-3"
                }
              >
                <Col span={24}>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Row>
                        <Col xs={16} sm={16} md={16} lg={16}>
                          <span className="qa-font-butler qa-fs-20 qa-tc-white">
                            Order summary
                          </span>
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8}>
                          <span className="qa-col-end qa-font-san qa-fs-14 qa-tc-white">
                            Order ID
                          </span>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          style={{ lineHeight: "0%" }}
                        >
                          <span
                            className="qa-col-end qa-font-san qa-fs-12"
                            style={{ color: "#332f2f", opacity: "80%" }}
                          >
                            {orderId}
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-05">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <hr
                        style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }}
                      />
                    </Col>
                  </Row>
                  {getOrders}
                  <Row className="qa-mar-top-05">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <hr
                        style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }}
                      />
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-1">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <div className="qa-font-san qa-tc-white qa-fs-14 qa-lh qa-mar-rgt-1">
                        Estimated freight fees
                      </div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      {orderType == "RTS" ? (
                        <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {props.order &&
                            props.order.miscCharges &&
                            props.order.miscCharges.find(
                              (x) => x.chargeId === "FREIGHT_MAX"
                            ) &&
                            parseFloat(
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_MAX"
                              ).amount * props.order.conversionFactor
                            ).toFixed(2)}
                        </span>
                      ) : (
                        <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(
                            props.order &&
                              props.order.miscCharges &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_CHARGES"
                              ) &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_CHARGES"
                              ).amount
                          ).toFixed(2)}
                        </span>
                      )}
                    </Col>
                  </Row>
                  {props.order &&
                    orderType == "RTS" &&
                    props.order.miscCharges &&
                    props.order.miscCharges.find(
                      (x) => x.chargeId === "DISCOUNT"
                    ) &&
                    props.order.miscCharges.find(
                      (x) => x.chargeId === "DISCOUNT"
                    ).amount > 0 && (
                      <Row className="">
                        <Col xs={18} sm={18} md={18} lg={18}>
                          <div
                            className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                            style={{ color: "#02873A" }}
                          >
                            {props.order && props.order.referralCode
                              ? props.order.referralCode
                              : "Coupon"}{" "}
                            discount applied
                          </div>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6}>
                          <div
                            className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b qa-lh qa-mar-rgt-1"
                            style={{ color: "#02873A" }}
                          >
                            -{" "}
                            {getSymbolFromCurrency(
                              props.order && props.order.currency
                            )}
                            {props.order &&
                              props.order.miscCharges &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "DISCOUNT"
                              ) &&
                              parseFloat(
                                (props.order.miscCharges.find(
                                  (x) => x.chargeId === "DISCOUNT"
                                ).amount || 0) * props.order.conversionFactor
                              ).toFixed(2)}
                          </div>
                        </Col>
                      </Row>
                    )}
                  {props.order &&
                    props.order.miscCharges &&
                    props.order.miscCharges.find(
                      (x) => x.chargeId === "SELLER_DISCOUNT"
                    ) &&
                    props.order.miscCharges.find(
                      (x) => x.chargeId === "SELLER_DISCOUNT"
                    ).amount > 0 && (
                      <Row className="">
                        <Col xs={18} sm={18} md={18} lg={18}>
                          <div
                            className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                            style={{ color: "#02873A" }}
                          >
                            Shipping promotion applied
                          </div>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6}>
                          {props.order && orderType == "RTS" ? (
                            <div
                              className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                              style={{ color: "#02873A" }}
                            >
                              -{" "}
                              {getSymbolFromCurrency(
                                props.order && props.order.currency
                              )}
                              {props.order &&
                                props.order.miscCharges &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "SELLER_DISCOUNT"
                                ) &&
                                parseFloat(
                                  (props.order.miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ).amount || 0) * props.order.conversionFactor
                                ).toFixed(2)}
                            </div>
                          ) : (
                            <div
                              className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                              style={{ color: "#02873A" }}
                            >
                              -{" "}
                              {getSymbolFromCurrency(
                                props.order && props.order.currency
                              )}
                              {parseFloat(
                                (props.order &&
                                  props.order.miscCharges &&
                                  props.order.miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ) &&
                                  props.order.miscCharges.find(
                                    (x) => x.chargeId === "SELLER_DISCOUNT"
                                  ).amount) ||
                                  0
                              ).toFixed(2)}
                            </div>
                          )}
                        </Col>
                      </Row>
                    )}
                  <Row className="qa-mar-top-15">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <div className="qa-font-san qa-tc-white qa-fs-14 qa-lh qa-mar-rgt-1">
                        {shippingTerms === "DDU"
                          ? "Customs duties excluded*"
                          : "Estimated custom, taxes & duties"}
                      </div>
                      {shippingTerms === "DDU" && (
                        <div>
                          <Popover
                            placement="bottomRight"
                            content={dduContent}
                            trigger="click"
                            overlayClassName="price-breakup-popup"
                          >
                            <span className="c-breakup">View estimates</span>
                          </Popover>
                        </div>
                      )}
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      {shippingTerms === "DDU" ? (
                        <div className="qa-font-san qa-tc-white qa-fs-14 qa-col-end">
                          NA
                        </div>
                      ) : (
                        <div>
                          {props.order && orderType == "RTS" ? (
                            <div className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                              {getSymbolFromCurrency(
                                props.order && props.order.currency
                              )}
                              {props.order &&
                                props.order.miscCharges &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "DUTY_MAX"
                                ) &&
                                parseFloat(
                                  props.order.miscCharges.find(
                                    (x) => x.chargeId === "DUTY_MAX"
                                  ).amount * props.order.conversionFactor
                                ).toFixed(2)}
                            </div>
                          ) : (
                            <div className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                              {getSymbolFromCurrency(
                                props.order && props.order.currency
                              )}
                              {parseFloat(
                                parseFloat(
                                  props.order &&
                                    props.order.miscCharges &&
                                    props.order.miscCharges.find(
                                      (x) => x.chargeId === "CUSTOM_CHARGES"
                                    ) &&
                                    props.order.miscCharges.find(
                                      (x) => x.chargeId === "CUSTOM_CHARGES"
                                    ).amount
                                ) +
                                  parseFloat(
                                    props.order &&
                                      props.order.miscCharges &&
                                      props.order.miscCharges.find(
                                        (x) => x.chargeId === "QALARA_CHARGES"
                                      ) &&
                                      props.order.miscCharges.find(
                                        (x) => x.chargeId === "QALARA_CHARGES"
                                      ).amount
                                  )
                              ).toFixed(2)}
                            </div>
                          )}
                        </div>
                      )}
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-1">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <hr
                        style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }}
                      />
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-1">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <div className="qa-font-san qa-tc-white qa-fs-17 qa-fw-b qa-mar-rgt-1 qa-lh">
                        SUBTOTAL
                      </div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      {props.order && orderType == "RTS" ? (
                        <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-17 qa-col-end qa-fw-b">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(
                            parseFloat(
                              props.order &&
                                props.order.subOrders &&
                                props.order.subOrders.length > 0 &&
                                props.order.subOrders.reduce(
                                  (x, y) => x + y["total"],
                                  0
                                ) * conversionFactor
                            ) +
                              frieghtCharge * conversionFactor +
                              dutyCharge * conversionFactor -
                              couponDiscount * conversionFactor -
                              sellerDiscount * conversionFactor
                          ).toFixed(2)}
                        </span>
                      ) : (
                        <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-17 qa-col-end qa-fw-b">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(
                            props.order &&
                              props.order.miscCharges &&
                              parseFloat(
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "TOTAL_AMOUNT"
                                ).amount
                              ) +
                                parseFloat(
                                  (props.order &&
                                    props.order.miscCharges &&
                                    props.order.miscCharges.find(
                                      (x) => x.chargeId === "DISCOUNT"
                                    ).amount) ||
                                    0
                                ) +
                                parseFloat(
                                  (props.order &&
                                    props.order.miscCharges &&
                                    props.order.miscCharges.find(
                                      (x) => x.chargeId === "SELLER_DISCOUNT"
                                    ) &&
                                    props.order.miscCharges.find(
                                      (x) => x.chargeId === "SELLER_DISCOUNT"
                                    ).amount) ||
                                    0
                                ) -
                                parseFloat(
                                  (props.order &&
                                    props.order.miscCharges &&
                                    props.order.miscCharges.find(
                                      (x) => x.chargeId === "VAT"
                                    ).amount) ||
                                    0
                                )
                          ).toFixed(2)}
                        </span>
                      )}
                    </Col>
                  </Row>

                  <Row className="qa-mar-top-15">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <div className="qa-font-san qa-tc-white qa-fs-14 qa-lh qa-mar-rgt-1">
                        {shippingTerms === "DDU"
                          ? "VAT/ GST / Taxes excluded*"
                          : "VAT/ GST / Taxes*"}
                      </div>
                      <div className="qa-fs-14 qa-font-san qa-lh qa-mar-rgt-1">
                        Refundable for some countries like UK/AU.{" "}
                        <Link href="/FAQforwholesalebuyers">
                          <a target="_blank">
                            <span className="qa-sm-color qa-cursor">
                              Learn more
                            </span>
                          </a>
                        </Link>
                      </div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      {shippingTerms === "DDU" ? (
                        <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end">
                          NA
                        </span>
                      ) : (
                        <span>
                          {props.order && orderType == "RTS" ? (
                            <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                              {getSymbolFromCurrency(
                                props.order && props.order.currency
                              )}
                              {props.order &&
                                props.order.miscCharges &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "VAT"
                                ) &&
                                parseFloat(
                                  props.order.miscCharges.find(
                                    (x) => x.chargeId === "VAT"
                                  ).amount * props.order.conversionFactor
                                ).toFixed(2)}
                            </span>
                          ) : (
                            <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                              {getSymbolFromCurrency(
                                props.order && props.order.currency
                              )}
                              {parseFloat(
                                (props.order &&
                                  props.order.miscCharges &&
                                  props.order.miscCharges.find(
                                    (x) => x.chargeId === "VAT"
                                  ) &&
                                  props.order.miscCharges.find(
                                    (x) => x.chargeId === "VAT"
                                  ).amount) ||
                                  0
                              ).toFixed(2)}
                            </span>
                          )}
                        </span>
                      )}
                    </Col>
                  </Row>

                  {props.order &&
                    orderType == "CUSTOM" &&
                    props.order.miscCharges &&
                    props.order.miscCharges.find(
                      (x) => x.chargeId === "DISCOUNT"
                    ) &&
                    props.order.miscCharges.find(
                      (x) => x.chargeId === "DISCOUNT"
                    ).amount > 0 && (
                      <Row className="">
                        <Col xs={18} sm={18} md={18} lg={18}>
                          <div
                            className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                            style={{ color: "#02873A" }}
                          >
                            {props.order && props.order.referralCode
                              ? props.order.referralCode
                              : "Coupon"}{" "}
                            discount applied
                          </div>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6}>
                          <span
                            className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                            style={{ color: "#02873A" }}
                          >
                            -{" "}
                            {getSymbolFromCurrency(
                              props.order && props.order.currency
                            )}
                            {parseFloat(
                              (props.order &&
                                props.order.miscCharges &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "DISCOUNT"
                                ) &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "DISCOUNT"
                                ).amount) ||
                                0
                            ).toFixed(2)}
                          </span>
                        </Col>
                      </Row>
                    )}

                  {promoDiscount > 0 && (
                    <Row className="qa-mar-top-2">
                      <Col xs={18} sm={18} md={18} lg={18}>
                        <div
                          style={{
                            textTransform: "uppercase",
                            color: "#02873A",
                          }}
                          className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                        >
                          {promoCode}
                        </div>
                        <div
                          className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                          style={{ color: "#02873A" }}
                        >
                          discount applied
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={6}
                        className="qa-font-san qa-fw-b qa-fs-14 qa-col-end"
                      >
                        <span style={{ color: "#02873A" }}>
                          -
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(promoDiscount).toFixed(2)}
                        </span>
                      </Col>
                    </Row>
                  )}
                  <Row className="qa-mar-top-1">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <hr
                        style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }}
                      />
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-1">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <div className="qa-font-san qa-tc-white qa-fs-17 qa-fw-b qa-lh qa-mar-rgt-1">
                        TOTAL ORDER VALUE{" "}
                        {shippingTerms === "DDU" ||
                          (shippingTerms === "DDP" && (
                            <span className="qa-fw-n qa-uppercase">
                              ({shippingTerms.toUpperCase()})
                            </span>
                          ))}
                      </div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      {props.order && orderType == "RTS" ? (
                        <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-17 qa-col-end">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {props.order &&
                            parseFloat(
                              props.order.total * props.order.conversionFactor
                            ).toFixed(2)}
                        </span>
                      ) : (
                        <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-17 qa-col-end">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(
                            props.order &&
                              props.order.miscCharges &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "TOTAL_AMOUNT"
                              ) &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "TOTAL_AMOUNT"
                              ).amount
                          ).toFixed(2)}
                        </span>
                      )}
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-2 qa-fs-17 qa-blue">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <div className="qa-font-san qa-fw-b qa-mar-rgt-1 qa-lh">
                        ADVANCE RECEIVED
                      </div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      <span className="qa-font-san qa-fw-b qa-col-end">
                        {getSymbolFromCurrency(
                          props.order && props.order.currency
                        )}
                        {parseFloat(advance).toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-1 qa-fs-17">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <div className="qa-font-san qa-tc-white qa-mar-rgt-1 qa-lh">
                        PAY LATER
                      </div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      <span className="qa-font-san qa-tc-white qa-col-end">
                        {getSymbolFromCurrency(
                          props.order && props.order.currency
                        )}

                        {parseFloat(balance).toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* <Row
                className={
                  mediaMatch.matches
                    ? "order-details qa-mar-btm-3"
                    : "order-details qa-mar-top-3 qa-mar-btm-3"
                }
              >
                <Col span={24}>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Row>
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <span className="qa-font-butler qa-fs-20 qa-tc-white">
                            Payment terms
                          </span>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-1">
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <hr
                        style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }}
                      />
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-2">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <span className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b">
                        Advance collected
                      </span>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                        {getSymbolFromCurrency(
                          props.order && props.order.currency
                        )}
                        {parseFloat(advance).toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                  <Row className="qa-mar-top-2">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <span className="qa-font-san qa-tc-white qa-fs-14">
                        Amount to be collected once the shipment has reached the
                        destination country
                      </span>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                        {getSymbolFromCurrency(
                          props.order && props.order.currency
                        )}

                        {parseFloat(balance).toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row> */}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
    // </div >
  );
};

const mapStateToProps = (state) => {
  return {
    order: state.userProfile.order,
    user: state.userProfile.userProfile,
    shippingMode:
      state.userProfile.order && state.userProfile.order.shippingMode,
    brandNameList: state.userProfile.brandNameList,
  };
};

export default connect(mapStateToProps, { getOrderByOrderId })(PaymentSuccess);
