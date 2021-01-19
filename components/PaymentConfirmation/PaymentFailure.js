/** @format */

import React, { useEffect, useState } from "react";
import { Row, Col, Button, Popover, Tooltip } from "antd";
import { getOrderByOrderId } from "../../store/actions";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
import Link from "next/link";
import Icon from "@ant-design/icons";
import infoIcon from "../../public/filestore/infoSuccess";
import sellerList from "../../public/filestore/freeShippingSellers.json";

const PaymentFailure = (props) => {
  const { keycloak } = useKeycloak();
  const router = useRouter();
  let { orderId: orderIdParam } = router.query;
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const [sellers, setSellers] = useState([]);

  let { order = {}, brandNameList = "" } = props || {};

  useEffect(() => {
    props.getOrderByOrderId(keycloak.token, orderIdParam);
  }, [keycloak.token, router.query.orderId]);

  useEffect(() => {
    if (props.order) {
      if (
        props.order.subOrders &&
        props.order.subOrders.length &&
        props.brandNameList
      ) {
        let sellers = [];
        for (let orders of props.order.subOrders) {
          let { sellerCode = "" } = orders;
          if (sellerList.includes(sellerCode)) {
            let sellerName = brandNameList[sellerCode]
              ? brandNameList[sellerCode].brandName
                ? brandNameList[sellerCode].brandName
                : ""
              : "";
            sellers.push(sellerName);
          }
        }
        setSellers(sellers);
      }
    }
  }, [props]);

  let {
    miscCharges = [],
    total = 0,
    paymentTerms = [],
    conversionFactor = 0,
    promoDiscount = 0,
    promoCode = "",
    shippingTerms = "",
    shippingMode = "",
    expectedDeliveryDateMax = "",
    expectedDeliveryDateMin = "",
    orderType = "",
    typeOfOrder = "",
    orderId = "",
    subOrders = [],
  } = order || {};

  let date1 = new Date(expectedDeliveryDateMin);
  let date2 = new Date(expectedDeliveryDateMax);
  let diffTime = Math.abs(date2 - date1);
  let tat = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let frieghtCharge = 0;
  let dutyCharge = 0;
  let vatCharge = 0;
  let couponDiscount = 0;
  let freightDis = 0;
  let sellerDiscount = 0;
  let productDiscount = 0;
  let customFreightCharge = 0;
  let vat = 0;
  let dutyMax = 0;
  let dutyMin = 0;

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
    } else if (chargeId === "PRODUCT_DISCOUNT") {
      productDiscount = amount;
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
    }
  }

  if (couponDiscount > 0 || sellerDiscount > 0 || productDiscount > 0) {
    frieghtCharge = freightDis;
  }

  if (customFreightCharge) {
    frieghtCharge = customFreightCharge;
  }

  const getOrders =
    props.order &&
    props.order.subOrders &&
    props.order.subOrders.map((subOrder, i) => {
      let {
        products = "",
        sellerCode = "",
        qalaraSellerMargin = 0,
        total = 0,
      } = subOrder;

      let totalAmount = 0;
      let basePrice = 0;
      let samplePrice = 0;
      let testingPrice = 0;

      for (let items of products) {
        let {
          qualityTestingCharge = 0,
          sampleCost = 0,
          quantity = 0,
          exfactoryListPrice = 0,
        } = items;
        samplePrice =
          samplePrice +
          parseFloat(parseFloat(sampleCost * conversionFactor).toFixed(2));
        testingPrice =
          testingPrice +
          parseFloat(
            parseFloat(qualityTestingCharge * conversionFactor).toFixed(2)
          );
        basePrice =
          basePrice +
          parseFloat(
            parseFloat(exfactoryListPrice * conversionFactor).toFixed(2)
          ) *
            quantity;
      }
      qalaraSellerMargin = parseFloat(
        parseFloat(qalaraSellerMargin * conversionFactor).toFixed(2)
      );
      totalAmount = basePrice + samplePrice + testingPrice;

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
          <Row
            className={`${
              i === props.order.subOrders.length - 1
                ? "qa-mar-top-05 qa-mar-btm-1"
                : "qa-mar-top-05 qa-mar-btm-2"
            }`}
          >
            <Col span={16}>
              <div className="qa-font-san qa-tc-white qa-fs-14 qa-mar-rgt-1 qa-lh">
                Value of products purchased
              </div>
            </Col>
            <Col span={8}>
              {props.order && props.order.orderType == "RTS" ? (
                <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                  {getSymbolFromCurrency(
                    (props.order && props.order.currency) || "USD"
                  )}
                  {parseFloat(totalAmount).toFixed(2)}
                </span>
              ) : (
                <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                  {getSymbolFromCurrency(
                    (props.order && props.order.currency) || "USD"
                  )}
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

  const redirectToFaq = () => {
    router.push("/FAQforwholesalebuyers");
  };

  const redirectToOrders = () => {
    router.push("/account/orders");
  };

  const dduContent = (
    <div className="breakup-popup qa-font-san qa-tc-white">
      <div className="qa-border-bottom qa-pad-btm-15 qa-fs-14 qa-lh">
        Estimated custom taxes and duties
      </div>
      <div className="qa-mar-top-1 qa-lh">
        Estimated custom duties for this order is{" "}
        <b>
          {getSymbolFromCurrency(props.order && props.order.currency)}
          {dutyMin}
          {dutyMax > 0 ? (
            <span>
              {" "}
              to {getSymbolFromCurrency(props.order && props.order.currency)}
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

  let subTotal = 0;
  let totalCartValue = 0;

  if (subOrders && subOrders.length > 0) {
    for (let order of subOrders) {
      let { products = "", qalaraSellerMargin = 0 } = order;

      let sellerTotal = 0;
      let basePrice = 0;
      let samplePrice = 0;
      let testingPrice = 0;

      for (let items of products) {
        let {
          qualityTestingCharge = 0,
          sampleCost = 0,
          quantity = 0,
          exfactoryListPrice = 0,
        } = items;
        samplePrice =
          samplePrice +
          parseFloat(parseFloat(sampleCost * conversionFactor).toFixed(2));
        testingPrice =
          testingPrice +
          parseFloat(
            parseFloat(qualityTestingCharge * conversionFactor).toFixed(2)
          );
        basePrice =
          basePrice +
          parseFloat(
            parseFloat(exfactoryListPrice * conversionFactor).toFixed(2)
          ) *
            quantity;
      }

      sellerTotal = basePrice + samplePrice + testingPrice;

      subTotal = subTotal + sellerTotal;
      totalCartValue = totalCartValue + sellerTotal;
    }
  }

  subTotal =
    subTotal +
    parseFloat(parseFloat(frieghtCharge * conversionFactor).toFixed(2)) +
    parseFloat(parseFloat(dutyCharge * conversionFactor).toFixed(2)) -
    parseFloat(parseFloat(couponDiscount * conversionFactor).toFixed(2)) -
    parseFloat(parseFloat(sellerDiscount * conversionFactor).toFixed(2)) -
    parseFloat(parseFloat(productDiscount * conversionFactor).toFixed(2));

  totalCartValue =
    totalCartValue +
    parseFloat(parseFloat(frieghtCharge * conversionFactor).toFixed(2)) +
    parseFloat(parseFloat(dutyCharge * conversionFactor).toFixed(2)) -
    parseFloat(parseFloat(sellerDiscount * conversionFactor).toFixed(2)) -
    parseFloat(parseFloat(productDiscount * conversionFactor).toFixed(2)) -
    parseFloat(parseFloat(couponDiscount * conversionFactor).toFixed(2)) +
    parseFloat(parseFloat(vatCharge * conversionFactor).toFixed(2)) -
    parseFloat(parseFloat(promoDiscount * conversionFactor).toFixed(2));

  if (conversionFactor) {
    total = total * conversionFactor;
  }

  return (
    <div>
      <div className="bird-vector" />
      <Row
        justify="center"
        className={
          mediaMatch.matches
            ? "payment-confirmation-body payment-failure-section"
            : "payment-confirmation-body-mobile payment-failure-section"
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
                    Sorry!
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <div className="qa-font-butler qa-tc-white qa-fs-20 qa-lh-m">
                    Your payment has failed. We request you to go to the Order
                    section in the 'My Account' page and retry the payment to
                    complete your order.
                  </div>
                </Col>
              </Row>
              <Row className="qa-mar-top-2">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <div className="qa-font-san qa-fs-17 qa-tc-white qa-lh-m">
                    If any amount has been debited from your card the amount
                    will be refunded back in the next 3-5 business days.
                  </div>
                </Col>
              </Row>
              <Row className="qa-mar-top-2">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-fs-17 qa-font-san qa-sm-color"
                    style={{
                      textDecoration: "underline",
                      letterSpacing: "0.01em",
                    }}
                    onClick={redirectToOrders}
                  >
                    Go to my orders
                  </span>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-fs-17 qa-font-san qa-sm-color"
                    style={{
                      textDecoration: "underline",
                      letterSpacing: "0.01em",
                    }}
                    onClick={redirectToFaq}
                  >
                    See FAQ
                  </span>
                </Col>
              </Row>
              <Row className="qa-mar-top-2">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Button
                    className="qa-button payemnt-btn"
                    onClick={redirectToOrders}
                  >
                    <span>Retry shopping</span>
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={2} lg={2}></Col>
            <Col
              xs={22}
              sm={22}
              md={10}
              lg={10}
              className={
                mediaMatch.matches
                  ? "order-details"
                  : "order-details qa-mar-top-3"
              }
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col xs={16} sm={16} md={16} lg={16}>
                      <span className="qa-font-butler qa-fs-19 qa-tc-white">
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
                        className="qa-col-end qa-font-san"
                        style={{ color: "#332F2F", fontSize: "11px" }}
                      >
                        {orderId}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="qa-mar-top-05">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }} />
                </Col>
              </Row>
              {getOrders}
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }} />
                </Col>
              </Row>
              <Row className="qa-mar-top-1">
                <Col span={16}>
                  <div className="qa-font-san qa-tc-white qa-fs-14 qa-lh qa-mar-rgt-1">
                    Estimated freight fees
                  </div>
                </Col>
                <Col span={8}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
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
                        (props.order && props.order.currency) || "USD"
                      )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "FREIGHT_CHARGES"
                        ) &&
                        parseFloat(
                          props.order.miscCharges.find(
                            (x) => x.chargeId === "FREIGHT_CHARGES"
                          ).amount
                        ).toFixed(2)}
                    </span>
                  )}
                </Col>
              </Row>
              {props.order &&
                props.order.orderType == "RTS" &&
                props.order.miscCharges &&
                props.order.miscCharges.find(
                  (x) => x.chargeId === "DISCOUNT"
                ) &&
                props.order.miscCharges.find((x) => x.chargeId === "DISCOUNT")
                  .amount > 0 && (
                  <Row className="qa-mar-top-1">
                    <Col span={16}>
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
                    <Col span={8}>
                      <span
                        className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                        style={{ color: "#02873A" }}
                      >
                        -{" "}
                        {getSymbolFromCurrency(
                          (props.order && props.order.currency) || "USD"
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
                      </span>
                    </Col>
                  </Row>
                )}
              {sellerDiscount > 0 && (
                <Row className="qa-mar-top-05">
                  <Col span={16}>
                    <div
                      className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                      style={{ color: "#02873A" }}
                    >
                      Shipping promotion applied{" "}
                      <Tooltip
                        overlayClassName="qa-tooltip"
                        placement="top"
                        trigger="hover"
                        title={`Free shipping promotion applied for seller ${sellers.join(
                          ", "
                        )}`}
                      >
                        <span
                          style={{
                            cursor: "pointer",
                            verticalAlign: "middle",
                          }}
                        >
                          <Icon
                            component={infoIcon}
                            style={{
                              width: "15px",
                              height: "15px",
                            }}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </Col>
                  <Col span={8}>
                    {props.order && props.order.orderType == "RTS" ? (
                      <span
                        className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                        style={{ color: "#02873A" }}
                      >
                        -{" "}
                        {getSymbolFromCurrency(
                          (props.order && props.order.currency) || "USD"
                        )}
                        {parseFloat(
                          sellerDiscount * props.order.conversionFactor
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span
                        className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                        style={{ color: "#02873A" }}
                      >
                        -{" "}
                        {getSymbolFromCurrency(
                          (props.order && props.order.currency) || "USD"
                        )}
                        {parseFloat(sellerDiscount).toFixed(2)}
                      </span>
                    )}
                  </Col>
                </Row>
              )}
              {productDiscount > 0 && (
                <Row className="qa-mar-top-05">
                  <Col span={16}>
                    <div
                      className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                      style={{ color: "#02873A" }}
                    >
                      Shipping promotion applied{" "}
                      <Tooltip
                        overlayClassName="qa-tooltip"
                        placement="top"
                        trigger="hover"
                        title="Free shipping promotion applied"
                      >
                        <span
                          style={{
                            cursor: "pointer",
                            verticalAlign: "middle",
                          }}
                        >
                          <Icon
                            component={infoIcon}
                            style={{
                              width: "15px",
                              height: "15px",
                            }}
                          />
                        </span>
                      </Tooltip>
                    </div>
                  </Col>
                  <Col span={8}>
                    {props.order && props.order.orderType == "RTS" ? (
                      <span
                        className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                        style={{ color: "#02873A" }}
                      >
                        -{" "}
                        {getSymbolFromCurrency(
                          (props.order && props.order.currency) || "USD"
                        )}
                        {parseFloat(
                          productDiscount * props.order.conversionFactor
                        ).toFixed(2)}
                      </span>
                    ) : (
                      <span
                        className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                        style={{ color: "#02873A" }}
                      >
                        -{" "}
                        {getSymbolFromCurrency(
                          (props.order && props.order.currency) || "USD"
                        )}
                        {parseFloat(productDiscount).toFixed(2)}
                      </span>
                    )}
                  </Col>
                </Row>
              )}
              <Row className="qa-mar-top-2">
                <Col span={16}>
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
                <Col span={8}>
                  {shippingTerms === "DDU" ? (
                    <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end">
                      NA
                    </span>
                  ) : (
                    <span>
                      {props.order && props.order.orderType == "RTS" ? (
                        <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                          {getSymbolFromCurrency(
                            (props.order && props.order.currency) || "USD"
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
                        </span>
                      ) : (
                        <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                          {getSymbolFromCurrency(
                            (props.order && props.order.currency) || "USD"
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
                        </span>
                      )}
                    </span>
                  )}
                </Col>
              </Row>
              <Row className="qa-mar-top-1">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }} />
                </Col>
              </Row>
              <Row className="qa-mar-top-1">
                <Col span={16}>
                  <div className="qa-font-san qa-tc-white qa-fs-17 qa-fw-b qa-mar-rgt-1 qa-lh">
                    SUBTOTAL
                  </div>
                </Col>
                <Col span={8}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-17 qa-col-end">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {parseFloat(subTotal).toFixed(2)}
                    </span>
                  ) : (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-17 qa-col-end">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
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
                                  (x) => x.chargeId === "PRODUCT_DISCOUNT"
                                ) &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "PRODUCT_DISCOUNT"
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
                <Col span={16}>
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
                <Col span={8}>
                  {shippingTerms === "DDU" ? (
                    <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end">
                      NA
                    </span>
                  ) : (
                    <span>
                      {props.order && props.order.orderType == "RTS" ? (
                        <span className="qa-font-san qa-tc-white qa-fs-14 qa-col-end qa-fw-b">
                          {getSymbolFromCurrency(
                            (props.order && props.order.currency) || "USD"
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
                            (props.order && props.order.currency) || "USD"
                          )}
                          {(props.order &&
                            props.order.miscCharges &&
                            props.order.miscCharges.find(
                              (x) => x.chargeId === "VAT"
                            ) &&
                            parseFloat(
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "VAT"
                              ).amount
                            ).toFixed(2)) ||
                            0}
                        </span>
                      )}
                    </span>
                  )}
                </Col>
              </Row>

              {props.order &&
                props.order.orderType == "CUSTOM" &&
                props.order.miscCharges &&
                props.order.miscCharges.find(
                  (x) => x.chargeId === "DISCOUNT"
                ) &&
                props.order.miscCharges.find((x) => x.chargeId === "DISCOUNT")
                  .amount > 0 && (
                  <Row className="qa-mar-top-1">
                    <Col span={16}>
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
                    <Col span={8}>
                      <span
                        className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                        style={{ color: "#02873A" }}
                      >
                        -{" "}
                        {getSymbolFromCurrency(
                          (props.order && props.order.currency) || "USD"
                        )}
                        {(
                          (props.order &&
                            props.order.miscCharges &&
                            props.order.miscCharges.find(
                              (x) => x.chargeId === "DISCOUNT"
                            ) &&
                            parseFloat(
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "DISCOUNT"
                              ).amount * props.order.conversionFactor
                            )) ||
                          0
                        ).toFixed(2)}
                      </span>
                    </Col>
                  </Row>
                )}

              {props.order && props.order.promoDiscount > 0 && (
                <Row className="qa-mar-top-2">
                  <Col span={16}>
                    <div
                      style={{ textTransform: "uppercase", color: "#02873A" }}
                      className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                    >
                      {props.order.promoCode}
                    </div>
                    <div
                      className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b qa-lh qa-mar-rgt-1"
                      style={{ color: "#02873A" }}
                    >
                      discount applied
                    </div>
                  </Col>
                  <Col
                    span={8}
                    className="qa-font-san qa-fw-b qa-fs-14 qa-col-end qa-fw-b"
                  >
                    <span style={{ color: "#02873A" }}>
                      -
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {parseFloat(
                        props.order.promoDiscount * props.order.conversionFactor
                      ).toFixed(2)}
                    </span>
                  </Col>
                </Row>
              )}
              <Row className="qa-mar-top-1">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }} />
                </Col>
              </Row>
              <Row className="qa-mar-top-1">
                <Col span={16}>
                  <div className="qa-font-san qa-tc-white qa-fs-17 qa-fw-b qa-mar-rgt-1 qa-lh">
                    TOTAL ORDER VALUE{" "}
                    {(shippingTerms === "DDU" || shippingTerms === "DDP") && (
                      <span className="qa-fw-n qa-uppercase">
                        ({shippingTerms.toUpperCase()})
                      </span>
                    )}
                  </div>
                </Col>
                <Col span={8}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-17 qa-col-end">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {props.order && parseFloat(totalCartValue).toFixed(2)}
                    </span>
                  ) : (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-17 qa-col-end">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "TOTAL_AMOUNT"
                        ) &&
                        parseFloat(
                          props.order.miscCharges.find(
                            (x) => x.chargeId === "TOTAL_AMOUNT"
                          ).amount
                        ).toFixed(2)}
                    </span>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
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

export default connect(mapStateToProps, { getOrderByOrderId })(PaymentFailure);
