/** @format */

import React, { useEffect } from "react";
import { Row, Col, Button } from "antd";
import { getOrderByOrderId } from "../../store/actions";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
import Link from "next/link";

const PaymentFailure = (props) => {
  const { keycloak } = useKeycloak();
  const router = useRouter();
  let { orderId: orderIdParam } = router.query;
  const mediaMatch = window.matchMedia("(min-width: 768px)");

  let { order = {} } = props || {};
  let { miscCharges = [] } = order || {};

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

  useEffect(() => {
    props.getOrderByOrderId(keycloak.token, orderIdParam);
  }, [keycloak.token, router.query.orderId]);

  const getOrders =
    props.order &&
    props.order.subOrders &&
    props.order.subOrders.map((subOrder) => {
      return (
        <React.Fragment>
          <Row>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              className="qa-mar-top-2"
              style={{ lineHeight: "100%" }}
            >
              <span
                className="qa-font-san qa-tc-white qa-fw-b qa-fs-17"
                style={{ letterSpacing: "0.02em" }}
              >
                {props.brandNameList &&
                  props.brandNameList[subOrder.sellerCode] &&
                  props.brandNameList[subOrder.sellerCode].brandName}
              </span>
            </Col>
          </Row>
          <Row className="qa-mar-top-2">
            <Col xs={18} sm={18} md={18} lg={18}>
              <span className="qa-font-san qa-tc-white qa-fs-14">
                Value of products purchased
              </span>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              {props.order && props.order.orderType == "RTS" ? (
                <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                  {getSymbolFromCurrency(
                    (props.order && props.order.currency) || "USD"
                  )}
                  {parseFloat(
                    subOrder.products.reduce((x, y) => x + y["total"], 0) *
                      props.order.conversionFactor
                  ).toFixed(2)}
                </span>
              ) : (
                <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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

  return (
    <div>
      <div className="bird-vector" />
      <Row
        justify="center"
        className={
          mediaMatch.matches
            ? "payment-confirmation-body"
            : "payment-confirmation-body-mobile"
        }
        align="middle"
      >
        <Col xs={22} sm={22} md={18} lg={18}>
          <Row justify="center">
            <Col xs={22} sm={22} md={12} lg={12}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span className="qa-font-butler qa-tc-white qa-fs-60">
                    Sorry!
                  </span>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span className="qa-font-butler qa-tc-white qa-fs-20">
                    Your payment has failed. We request you to go to the Order
                    section in the 'My Account' page and retry the payment to
                    complete your order.
                  </span>
                </Col>
              </Row>
              <Row className="qa-mar-top-2">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span className="qa-font-san qa-fs-17 qa-tc-white">
                    If any amount has been debited from your card the amount
                    will be refunded back in the next 3-5 business days.
                  </span>
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
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <span className="qa-font-butler qa-fs-20 qa-tc-white">
                        Order summary
                      </span>
                    </Col>
                    <Col
                      xs={6}
                      sm={6}
                      md={6}
                      lg={6}
                      style={{ lineHeight: "0%" }}
                    >
                      <span className="qa-col-end qa-font-san qa-fs-14 qa-tc-white qa-fw-b">
                        Order ID
                      </span>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{ lineHeight: "100%" }}
                    >
                      <span
                        className="qa-col-end qa-font-san qa-fs-12 "
                        style={{ color: "#332f2f", opacity: "80%" }}
                      >
                        {props.order && props.order.orderId}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="qa-mar-top-1">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <hr style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }} />
                </Col>
              </Row>
              {getOrders}
              <Row className="qa-mar-top-2">
                <Col xs={18} sm={18} md={18} lg={18}>
                  <span className="qa-font-san qa-tc-white qa-fs-14">
                    Estimated freight fees
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {frieghtCharge > 0 &&
                        parseFloat(
                          frieghtCharge * props.order.conversionFactor
                        ).toFixed(2)}
                    </span>
                  ) : (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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
                props.order.miscCharges &&
                props.order.miscCharges.find(
                  (x) => x.chargeId === "DISCOUNT"
                ) &&
                props.order.miscCharges.find((x) => x.chargeId === "DISCOUNT")
                  .amount > 0 && (
                  <Row className="">
                    <Col xs={18} sm={18} md={18} lg={18}>
                      <span
                        className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                        style={{ color: "#02873A" }}
                      >
                        {props.order && props.order.referralCode} discount
                        applied
                      </span>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      {props.order && props.order.orderType == "RTS" ? (
                        <span
                          className="qa-font-san qa-fw-b qa-fs-14 qa-col-end"
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
                      ) : (
                        <span
                          className="qa-font-san qa-fw-b qa-fs-14 qa-col-end"
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
                                ).amount
                              )) ||
                            0
                          ).toFixed(2)}
                        </span>
                      )}
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
                      <span
                        className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                        style={{ color: "#02873A" }}
                      >
                        Shipping promotion applied
                      </span>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6}>
                      {props.order && props.order.orderType == "RTS" ? (
                        <span
                          className="qa-font-san qa-fw-b qa-fs-14 qa-col-end"
                          style={{ color: "#02873A" }}
                        >
                          -{" "}
                          {getSymbolFromCurrency(
                            (props.order && props.order.currency) || "USD"
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
                        </span>
                      ) : (
                        <span
                          className="qa-font-san qa-fw-b qa-fs-14 qa-col-end"
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
                                (x) => x.chargeId === "SELLER_DISCOUNT"
                              ) &&
                              parseFloat(
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "SELLER_DISCOUNT"
                                ).amount
                              )) ||
                            0
                          ).toFixed(2)}
                        </span>
                      )}
                    </Col>
                  </Row>
                )}
              <Row className="qa-mar-top-2">
                <Col xs={18} sm={18} md={18} lg={18}>
                  <span className="qa-font-san qa-tc-white qa-fs-14">
                    Estimated custom, taxes & duties
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "CUSTOM_CHARGES"
                        ) &&
                        parseFloat(
                          props.order.miscCharges.find(
                            (x) => x.chargeId === "CUSTOM_CHARGES"
                          ).amount
                        ).toFixed(2)}
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
                <Col xs={18} sm={18} md={18} lg={18}>
                  <span className="qa-font-san qa-tc-white qa-fs-17 qa-fw-b">
                    SUBTOTAL
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {parseFloat(
                        props.order &&
                          props.order.subOrders &&
                          props.order.subOrders.length > 0 &&
                          props.order.subOrders.reduce(
                            (x, y) => x + y["total"],
                            0
                          ) +
                            frieghtCharge +
                            dutyCharge -
                            couponDiscount -
                            sellerDiscount
                      ).toFixed(2)}
                    </span>
                  ) : (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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
                                  (x) => x.chargeId === "VAT"
                                ).amount) ||
                                0
                            )
                      ).toFixed(2)}
                    </span>
                  )}
                </Col>
              </Row>

              <Row className="qa-mar-top-2">
                <Col xs={18} sm={18} md={18} lg={18}>
                  <span className="qa-font-san qa-tc-white qa-fs-14">
                    VAT/ GST
                  </span>
                  <div className="qa-fs-14 qa-font-san">
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
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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
                </Col>
              </Row>

              {props.order && props.order.promoDiscount > 0 && (
                <Row className="qa-mar-top-2">
                  <Col xs={18} sm={18} md={18} lg={18}>
                    <div
                      style={{ textTransform: "uppercase", color: "#02873A" }}
                      className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                    >
                      {props.order.promoCode}
                    </div>
                    <div
                      className="qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
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
                    <span style={{ color: "#27AE60" }}>
                      -
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {parseFloat(props.order.promoDiscount).toFixed(2)}
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
                <Col xs={18} sm={18} md={18} lg={18}>
                  <span className="qa-font-san qa-tc-white qa-fs-17 qa-fw-b">
                    TOTAL CART VALUE
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                      {getSymbolFromCurrency(
                        (props.order && props.order.currency) || "USD"
                      )}
                      {props.order &&
                        parseFloat(
                          props.order.total * props.order.conversionFactor
                        ).toFixed(2)}
                    </span>
                  ) : (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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
