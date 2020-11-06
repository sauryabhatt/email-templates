/** @format */

import React, { useEffect } from "react";
import { Row, Col, Steps, Button, Checkbox } from "antd";
import { getOrderByOrderId } from "../../store/actions";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import { useKeycloak } from "@react-keycloak/ssr";
import {useRouter} from "next/router";

const PaymentSuccess = (props) => {
  const {keycloak} = useKeycloak();
  const router  = useRouter();
  let { orderId: orderIdParam } = router.query;
  const mediaMatch = window.matchMedia("(min-width: 768px)");

  useEffect(() => {
    props.getOrderByOrderId(keycloak.token, orderIdParam);
  }, [keycloak.token, router.query.orderId ]);

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
                Total product price
              </span>
            </Col>
            <Col xs={6} sm={6} md={6} lg={6}>
              {props.order && props.order.orderType == "RTS" ? (
                <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                  {getSymbolFromCurrency(props.order && props.order.currency)}
                  {parseFloat(
                    subOrder.products.reduce((x, y) => x + y["total"], 0) *
                      props.order.conversionFactor
                  ).toFixed(2)}
                </span>
              ) : (
                <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                  {getSymbolFromCurrency(props.order && props.order.currency)}
                  {subOrder.products.reduce((x, y) => x + y["total"], 0)}
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

  return (
    // <div className='bird-vector'>
    <div
      style={
        mediaMatch.matches ? {} : { marginTop: "20%", marginBottom: "20%" }
      }
    >
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
                    Thank you!
                  </span>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span className="qa-font-butler qa-tc-white qa-fs-20">
                    You order with ID {props.order && props.order.orderId} is
                    confirmed. We will continuously monitor your order and keep
                    you updated on the following:
                  </span>
                </Col>
              </Row>
              <Row className="qa-mar-top-2">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <li>
                    <span className="a-fs-14 qa-font-san qa-tc-white">
                      Production monitoring
                    </span>
                  </li>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <li>
                    <span className="a-fs-14 qa-font-san qa-tc-white">
                      Quality inspection
                    </span>
                  </li>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <li>
                    <span className="a-fs-14 qa-font-san qa-tc-white">
                      Order shipping status and tracking{" "}
                    </span>
                  </li>
                </Col>
              </Row>
              <Row className="qa-mar-top-2">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span className="qa-font-san qa-tc-white qa-fs-17">
                    If you want to review your order or if you have any
                    questions you can either write to us at buyers@qalara.com or
                    refer to the Order section in the 'My Account' page.
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
                      textDecoration: "underline",
                      letterSpacing: "0.01em",
                      cursor: "pointer",
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
                    onClick={redirectToHome}
                  >
                    <span>Continue shopping</span>
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
              className="order-details"
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
                        Cart summary
                      </span>
                    </Col>
                    <Col
                      xs={6}
                      sm={6}
                      md={6}
                      lg={6}
                      style={{ lineHeight: "100%" }}
                    >
                      <span className="qa-col-end qa-font-san qa-fs-14 qa-tc-white">
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
                        className="qa-col-end qa-font-san qa-fs-12"
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
                    Estimated freight charges
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                      {getSymbolFromCurrency(
                        props.order && props.order.currency
                      )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "FREIGHT_CHARGES"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "FREIGHT_CHARGES"
                        ).amount}
                    </span>
                  )}
                </Col>
              </Row>
              <Row className="qa-mar-top-2">
                <Col xs={18} sm={18} md={18} lg={18}>
                  <span className="qa-font-san qa-tc-white qa-fs-14">
                    Estimated custom, duties & taxes
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
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
                    </span>
                  ) : (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                      {getSymbolFromCurrency(
                        props.order && props.order.currency
                      )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "CUSTOM_CHARGES"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "CUSTOM_CHARGES"
                        ).amount}
                    </span>
                  )}
                </Col>
              </Row>
              <Row className="qa-mar-top-2">
                <Col xs={18} sm={18} md={18} lg={18}>
                  <span className="qa-font-san qa-tc-white qa-fs-14">
                    Coupon discount
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span
                      className="qa-font-san qa-fw-b qa-fs-14 qa-col-end"
                      style={{ color: "#0ABC1C" }}
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
                    </span>
                  ) : (
                    <span
                      className="qa-font-san qa-fw-b qa-fs-14 qa-col-end"
                      style={{ color: "#0ABC1C" }}
                    >
                      -{" "}
                      {getSymbolFromCurrency(
                        props.order && props.order.currency
                      )}
                      {(props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "DISCOUNT"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "DISCOUNT"
                        ).amount) ||
                        0}
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
                    TOTAL CART VALUE
                  </span>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6}>
                  {props.order && props.order.orderType == "RTS" ? (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                      {getSymbolFromCurrency(
                        props.order && props.order.currency
                      )}
                      {props.order &&
                        parseFloat(
                          props.order.total * props.order.conversionFactor
                        ).toFixed(2)}
                    </span>
                  ) : (
                    <span className="qa-font-san qa-fw-b qa-tc-white qa-fs-14 qa-col-end">
                      {getSymbolFromCurrency(
                        props.order && props.order.currency
                      )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "TOTAL_AMOUNT"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "TOTAL_AMOUNT"
                        ).amount}
                    </span>
                  )}
                </Col>
              </Row>
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
