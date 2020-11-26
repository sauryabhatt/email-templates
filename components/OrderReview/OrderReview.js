/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Row,
  Col,
  Steps,
  Button,
  Checkbox,
  Spin,
  message,
  Popover,
} from "antd";
import { UpOutlined, DownOutlined, LoadingOutlined } from "@ant-design/icons";
import PayWithPaypal from "../PayWithPayPal/PayWithPaypal";
import { useKeycloak } from "@react-keycloak/ssr";
import { getOrderByOrderId } from "../../store/actions";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import countries from "../../public/filestore/countryCodes_en.json";
import Icon from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import Link from "next/link";

const { Step } = Steps;

const OrderReview = (props) => {
  const router = useRouter();
  const { keycloak } = useKeycloak();
  let { orderId: orderIdParam } = router.query;
  const mediaMatch = window.matchMedia("(min-width: 1024px)");
  const [showRow, setShowRow] = useState(true);
  const [showProduct, setShowProduct] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [indexValue, setIndexValue] = useState(null);
  const [showAdditionalServices, setShowAdditionalServices] = useState(true);
  const [countryCode, setCountryCode] = useState(null);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [estimateCharge, setEstimateCharge] = useState(0);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [locale, setLocale] = useState(null);
  const [localeUpdated, setLocaleUpdated] = useState(false);
  const [popover, setPopover] = useState("");
  useEffect(() => {
    if(keycloak?.token && orderIdParam) {
      props.getOrderByOrderId(keycloak.token, orderIdParam);
    }
  }, [keycloak.token, orderIdParam]);

  useEffect(() => {
    if (props.order) {
      getCountryCode();
      getEstimateCharge();
    }
  }, [props.order]);

  const handleRow = (value) => {
    setShowRow(value);
  };

  const handleProductDetails = (value) => {
    setShowProduct(value);
  };

  const successPayment = () => {
    router.push("/payment-success");
  };

  const showError = (value) => {
    if (value) {
      document.getElementsByClassName("termsError")[0].style.display = "block";
    } else {
      document.getElementsByClassName("termsError")[0].style.display = "none";
    }
  };

  const updateOrder = (data, status) => {
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL +
        "/v1/orders/my/payments-reference?order_updated_Status=" +
        status,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.status.toString().startsWith("2")) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  };
  const capturePayment = (authId, orderId, actions) => {
    let data = {
      amount: {
        value: props.order.paymentTerms
          .find((x) => x.chargeId === "ADVANCE")
          .amount.toFixed(2),
        currency_code: props.order.currency,
      },
      final_capture: false,
    };

    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        "/payments/paypal/" +
        props.order.orderId +
        "/authorizations/" +
        authId +
        "/capture",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.status.toString().startsWith("2")) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        setIsProcessing(false);
        if (res.error === "INSTRUMENT_DECLINED") {
          return actions.restart();
        } else {
          delete res.qauthorizations[0].requestUUID;
          delete res.currentAuth.requestUUID;
          updateOrder(res, "CHECKED_OUT");
          let url = "/order/" + props.order.orderId + "/payment-success";
          router.push(url);
        }
      })
      .catch((err) => {
        voidPPOrder(orderId);
        let data = {
          gbOrderNo: props.order.orderId,
        };
        updateOrder(data, "FAILED");
        // setLoading(false);
      });
  };

  const voidPPOrder = (orderId) => {
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        "/payments/paypal/checkout/orders/" +
        orderId +
        "/void",
      {
        method: "POST",
        headers: {
          "Content-Length": 0,
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.status.toString().startsWith("2")) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        let url = "/order/" + props.order.orderId + "/payment-failure";
        router.push(url);
        // setIsProcessing(false);
        // router.push('/payment-success')
      })
      .catch((err) => {
        let url = "/order/" + props.order.orderId + "/payment-failure";
        router.push(url);
        // setLoading(false);
      });
  };

  const authorizePayment = (orderId, actions) => {
    setIsProcessing(true);
    let data = {
      amount: {
        value: props.order.paymentTerms
          .find((x) => x.chargeId === "ADVANCE")
          .amount.toFixed(2),
        currency_code: props.order.currency,
      },
    };
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        "/payments/paypal/" +
        props.order.orderId +
        "/authorizations",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.status.toString().startsWith("2")) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        capturePayment(res.currentAuth.ppAuthId, orderId);
        // setIsProcessing(false);
        // router.push('/payment-success')
      })
      .catch((err) => {
        voidPPOrder(orderId);
        let data = {
          gbOrderNo: props.order.orderId,
        };
        updateOrder(data, "FAILED");
        message.error(err.message || err, 5);
        // setLoading(false);
      });
  };

  const saveOrder = (orderId, actions) => {
    setIsProcessing(true);
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        "/payments/paypal/checkout/orders/" +
        orderId +
        "/save",
      {
        method: "POST",
        headers: {
          "Content-Length": 0,
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        // setIsProcessing(false);
        // router.push('/payment-success')
        authorizePayment(orderId, actions);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        // setLoading(false);
      });
  };

  if (isProcessing || !props.order) {
    return (
      <Row justify="space-around" className="order-body">
        <Spin tip="Processing payment" size="large" />
      </Row>
    );
  }

  const prepareTableRows =
    props.order &&
    props.order.subOrders &&
    props.order.subOrders.map((subOrder) => {
      return subOrder.products.map((product, index) => {
        return (
          <tr>
            {index == 0 ? (
              <td rowSpan={subOrder.products.length} id="seller-name">
                <span className="qa-font-san qa-fw-b qa-fs-12">
                  {props.brandNameList &&
                    props.brandNameList[subOrder.sellerCode] &&
                    props.brandNameList[subOrder.sellerCode].brandName}
                </span>
              </td>
            ) : (
              ""
            )}

            <td>
              <span className="qa-font-san qa-fw-b qa-fs-12">{index + 1}</span>
            </td>
            <td>
              <span className="qa-font-san qa-fw-b qa-fs-12">
                {product.productId}
              </span>
            </td>
            <td>
              <span className="qa-font-san qa-fw-b qa-fs-12">
                {product.productName}
              </span>
            </td>
            <td>
              <span className="qa-font-san qa-fw-b qa-fs-12">
                {product.quantity}
              </span>
            </td>
            <td>
              <span className="qa-font-san qa-fw-b qa-fs-12">
                {product.unitOfMeasure}
              </span>
            </td>
            <td>
              <span className="qa-font-san qa-fw-b qa-fs-12">
                {product.unitPrice}
              </span>
            </td>
            <td>
              <span className="qa-font-san qa-fw-b qa-fs-12">
                {product.totalProductCost}
              </span>
            </td>
            {/* {renderTableData(subOrder.products)} */}
          </tr>
        );
      });
    });

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
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05">
            {getSymbolFromCurrency(props.order && props.order.currency)}
            {parseFloat(
              subOrder.products.reduce((x, y) => x + y["totalProductCost"], 0)
            ).toFixed(2)}
          </div>
          <div className="c-left-blk qa-mar-btm-05">Qalara margin</div>
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05">
            {getSymbolFromCurrency(props.order && props.order.currency)}
            {parseFloat(
              subOrder.qalaraSellerMargin && subOrder.qalaraSellerMargin
            ).toFixed(2)}
          </div>
          <div className="c-left-blk qa-mar-btm-05">Quality testing</div>
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05">
            {getSymbolFromCurrency(props.order && props.order.currency)}
            {parseFloat(
              subOrder.products.reduce(
                (x, y) =>
                  x["qualityTestingCharge"] ||
                  0 + y["qualityTestingCharge"] ||
                  0,
                0
              )
            ).toFixed(2)}
          </div>
        </div>
        <div className="cart-info-text">
          Note: Qalara margin may vary by total cart value{" "}
          <Link href="/FAQforwholesalebuyers">
            <a target="_blank" className="qa-sm-color qa-cursor">
              Refer FAQs here
            </a>
          </Link>
        </div>
      </div>
    );
  };

  const popupHover = (value) => {
    setPopover(value);
  };

  const prepareProductsList =
    props.order &&
    props.order.subOrders &&
    props.order.subOrders.map((subOrder, index) => {
      return (
        <React.Fragment key={index}>
          <Row style={{ paddingTop: "10px" }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <span className="qa-fs-17 qa-font-san qa-fw-b qa-tc-white">
                {props.brandNameList &&
                  props.brandNameList[subOrder.sellerCode] &&
                  props.brandNameList[subOrder.sellerCode].brandName}
              </span>
            </Col>
            <Col
              xs={18}
              sm={18}
              md={16}
              lg={16}
              style={mediaMatch.matches ? { paddingTop: "10px" } : {}}
            >
              <span
                className={
                  mediaMatch.matches
                    ? "qa-font-san qa-tc-white qa-fs-14"
                    : "qa-font-san qa-tc-white qa-fs-12"
                }
              >
                Value of products purchased
              </span>
            </Col>
            <Col
              xs={6}
              sm={6}
              md={8}
              lg={8}
              className="qa-col-end"
              style={mediaMatch.matches ? { paddingTop: "10px" } : {}}
            >
              <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-14">
                {getSymbolFromCurrency(props.order && props.order.currency)}
                {parseFloat(
                  subOrder.products.reduce((x, y) => x + y["total"], 0)
                ).toFixed(2)}
              </span>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} className="qa-col-end">
              <Popover
                placement="bottomRight"
                content={priceBreakup(subOrder)}
                trigger="click"
                visible={popover === `seller-${index}` ? true : false}
                overlayClassName="price-breakup-popup"
              >
                <span
                  className="qa-font-san qa-fs-14 qa-sm-color"
                  style={{ textDecoration: "underline", cursor: "pointer" }}
                  onClick={() => {
                    popupHover(`seller-${index}`);
                  }}
                >
                  See breakup
                </span>
              </Popover>
            </Col>
          </Row>
          <Row style={{ paddingTop: "10px" }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <hr style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }} />
            </Col>
          </Row>
        </React.Fragment>
      );
    });

  const prepareProductsForMobile =
    props.order &&
    props.order.subOrders &&
    props.order.subOrders.map((subOrder, i) => {
      return subOrder.products.map((product, index) => {
        return (
          <React.Fragment>
            <Col xs={18} sm={18} md={18} lg={0} xl={0} className="qa-mar-top-2">
              <span
                className="qa-font-san qa-fs-12 qa-tc-white"
                style={{ lineHeight: "100%", letterSpacing: ".02em" }}
              >
                {product.productName}
              </span>
            </Col>
            {/* <Col xs={4} sm={4} md={0} lg={0} className="qa-col-center qa-mar-top-2" style={{ alignItems: 'center' }}>
                        <span className="qa-font-san qa-fw-b qa-fs-12 qa-tc-white" style={{ lineHeight: '130%' }}>{getSymbolFromCurrency(props.order && props.order.currency)}450</span>
                    </Col> */}
            <Col
              xs={6}
              sm={6}
              md={6}
              lg={0}
              className="qa-col-end qa-mar-top-2"
              style={{ alignItems: "center" }}
            >
              {/* {showProduct ? <UpOutlined onClick={() => setSh} className="upOutlined"/> 
                         <DownOutlined onClick={() => handleCollapsible(index, false, i, "upOutlined", "downOutlined")} className="downOutlined" style={{display: 'none'}}/> */}
            </Col>
            {product.isQualityTestingRequired ? (
              <React.Fragment>
                <Col xs={2} sm={2} md={2} lg={0}>
                  <img
                    className="images"
                    src={process.env.NEXT_PUBLIC_URL + "/tick.png"}
                    style={{ height: "20px" }}
                  ></img>
                </Col>
                <Col xs={22} sm={22} md={22} lg={22}>
                  <span
                    className="qa-font-san qa-fs-12"
                    style={{
                      color: "rgba(25, 25, 25, 0.6)",
                      letterSpacing: ".02em",
                      lineHeight: "100%",
                    }}
                  >
                    Quality testing
                  </span>
                </Col>{" "}
              </React.Fragment>
            ) : (
              ""
            )}
            <Col xs={24} sm={24} md={24} lg={0} className="qa-mar-top-2">
              <hr />
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={0}
              style={{ padding: "10px" }}
              className={"product_" + index}
            >
              <Row>
                <Col xs={18} sm={18} md={18} lg={0}>
                  <span
                    className="qa-font-san qa-fs-12 qa-tc-white"
                    style={{ lineHeight: "100%", letterSpacing: ".02em" }}
                  >
                    Item ID
                  </span>
                </Col>
                <Col
                  xs={6}
                  sm={6}
                  md={6}
                  lg={0}
                  className="qa-col-end"
                  style={{ alignItems: "center" }}
                >
                  <span
                    className="qa-font-san qa-tc-white qa-fs-12"
                    style={{ lineHeight: "130%" }}
                  >
                    {product.productId}
                  </span>
                </Col>
                <Col xs={18} sm={18} md={18} lg={0}>
                  <span
                    className="qa-font-san qa-fs-12 qa-tc-white"
                    style={{ lineHeight: "100%", letterSpacing: ".02em" }}
                  >
                    Quantity
                  </span>
                </Col>
                <Col
                  xs={6}
                  sm={6}
                  md={6}
                  lg={0}
                  className="qa-col-end"
                  style={{ alignItems: "center" }}
                >
                  <span
                    className="qa-font-san qa-tc-white qa-fs-12"
                    style={{ lineHeight: "130%" }}
                  >
                    {product.quantity}
                  </span>
                </Col>
                <Col xs={18} sm={18} md={18} lg={0}>
                  <span
                    className="qa-font-san qa-fs-12 qa-tc-white"
                    style={{ lineHeight: "100%", letterSpacing: ".02em" }}
                  >
                    Unit
                  </span>
                </Col>
                <Col
                  xs={6}
                  sm={6}
                  md={6}
                  lg={0}
                  className="qa-col-end"
                  style={{ alignItems: "center" }}
                >
                  <span
                    className="qa-font-san qa-tc-white qa-fs-12"
                    style={{ lineHeight: "130%" }}
                  >
                    {product.unit}
                  </span>
                </Col>
                <Col xs={18} sm={18} md={18} lg={0}>
                  <span
                    className="qa-font-san qa-fs-12 qa-tc-white"
                    style={{ lineHeight: "100%", letterSpacing: ".02em" }}
                  >
                    Per unit price ({props.order && props.order.currency})
                  </span>
                </Col>
                <Col
                  xs={6}
                  sm={6}
                  md={6}
                  lg={0}
                  className="qa-col-end"
                  style={{ alignItems: "center" }}
                >
                  <span
                    className="qa-font-san qa-tc-white qa-fs-12"
                    style={{ lineHeight: "130%" }}
                  >
                    {product.unitPrice}
                  </span>
                </Col>
                <Col xs={18} sm={18} md={18} lg={0}>
                  <span
                    className="qa-font-san qa-fs-12 qa-tc-white"
                    style={{ lineHeight: "100%", letterSpacing: ".02em" }}
                  >
                    Base price excl. margin and other charges (
                    {props.order && props.order.currency})
                  </span>
                </Col>
                <Col
                  xs={6}
                  sm={6}
                  md={6}
                  lg={0}
                  className="qa-col-end"
                  style={{ alignItems: "center" }}
                >
                  <span
                    className="qa-font-san qa-tc-white qa-fs-12"
                    style={{ lineHeight: "130%" }}
                  >
                    {product.totalProductCost}
                  </span>
                </Col>
              </Row>
            </Col>
          </React.Fragment>
        );
      });
    });

  const downloadMedia = (data) => {
    if (data) {
      var a = document.createElement("a");
      a.href =
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL + data["mediaUrl"];
      a.setAttribute("download", "Spec-sheet");
      a.setAttribute("target", "_blank");
      a.click();
    }
  };

  const downloadBuyerAgreement = () => {
    var a = document.createElement("a");
    a.href = process.env.NEXT_PUBLIC_REACT_APP_BUYER_AGREEMENT_URL;
    a.setAttribute("download", "Buyer-agreement");
    a.setAttribute("target", "_blank");
    a.click();
  };

  const handleCheck = (e) => {
    setIsTermsAccepted(e.target.checked);
    document.getElementsByClassName("termsError")[0].style.display = "none";
  };

  const getEstimateCharge = () => {
    let sum = 0;
    if (props.order) {
      props.order.miscCharges.map((charges) => {
        if (charges.chargeId == "FREIGHT_CHARGES") {
          sum =
            sum +
              props.order.miscCharges.find(
                (x) => x.chargeId === "FREIGHT_CHARGES"
              ).amount || 0;
        } else if (charges.chargeId == "CUSTOM_CHARGES") {
          sum =
            sum +
              props.order.miscCharges.find(
                (x) => x.chargeId === "CUSTOM_CHARGES"
              ).amount || 0;
        }
      });
    }
    setEstimateCharge(sum);
  };

  const getCountryCode = () => {
    let code =
      countries[props.order.shippingAddressDetails["country"].toUpperCase()];
    if (
      code === "BR" ||
      code === "RU" ||
      code === "IN" ||
      code === "BG" ||
      code === "JP" ||
      code === "LT" ||
      code === "LV" ||
      code === "IS" ||
      code === "CN" ||
      code === "MX" ||
      code === "LI"
    ) {
      setLocale(`en_${code}`);
      setLocaleUpdated(true);
    } else {
      setLocale(null);
      setLocaleUpdated(true);
    }
  };

  if (
    props.order &&
    props.order.status !== "COMMITTED" &&
    props.order.payment_status !== "FAILED"
  ) {
    return <Redirect href="/account/orders" />;
  }

  if (props.order == undefined) {
    return (
      <div className="qa-loader-middle">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </div>
    );
  }

  if (props.order) {
    return (
      <React.Fragment>
        <Row justify="space-around" className="order-body">
          <Col xs={22} sm={22} md={22} lg={18} xl={18}>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-font-butler qa-fs-28 qa-tc-white"
                      : "qa-font-butler qa-fs-17 qa-tc-white"
                  }
                  style={{ letterSpacing: ".01em" }}
                >
                  Review your order details
                </span>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <hr style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }} />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="space-around" className="order-content">
          <Col xs={22} sm={22} md={22} lg={18} xl={18}>
            <Row
              gutter={mediaMatch.matches ? [64, 0] : []}
              style={
                mediaMatch.matches
                  ? {}
                  : { display: "flex", flexDirection: "column-reverse" }
              }
            >
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                {mediaMatch.matches ? (
                  ""
                ) : (
                  <Row style={{ paddingTop: "40px" }}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <span
                        className="qa-fs-17 qa-font-san qa-fw-b qa-tc-white"
                        style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                      >
                        Payment terms
                      </span>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      className="payment-term"
                    >
                      <Row>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          style={{ lineHeight: "110%" }}
                        >
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                Advance payment :
                              </span>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                {getSymbolFromCurrency(
                                  props.order && props.order.currency
                                )}
                                {parseFloat(
                                  props.order &&
                                    props.order.paymentTerms &&
                                    props.order.paymentTerms.find(
                                      (x) => x.chargeId === "ADVANCE"
                                    ).amount
                                ).toFixed(2)}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          style={{ lineHeight: "100%" }}
                        >
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                Pay on shipping :
                              </span>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                {getSymbolFromCurrency(
                                  props.order && props.order.currency
                                )}
                                {parseFloat(
                                  props.order &&
                                    props.order.paymentTerms &&
                                    props.order.paymentTerms.find(
                                      (x) => x.chargeId === "ON_SHIPPED"
                                    ).amount
                                ).toFixed(2)}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                Pay on delivery :
                              </span>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                {getSymbolFromCurrency(
                                  props.order && props.order.currency
                                )}
                                {parseFloat(
                                  props.order &&
                                    props.order.paymentTerms &&
                                    props.order.paymentTerms.find(
                                      (x) => x.chargeId === "POST_DELIVERY"
                                    ).amount
                                ).toFixed(2)}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Row>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={20}
                          xl={20}
                          style={{ lineHeight: "16px" }}
                        >
                          <span
                            className={
                              mediaMatch.matches
                                ? "qa-font-san qa-tc-white qa-fs-12"
                                : "qa-font-san qa-tc-white qa-fs-10"
                            }
                          >
                            secure payment by credit cards and other payment
                            modes
                          </span>
                        </Col>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={4}
                          xl={4}
                          className={mediaMatch.matches ? "" : "qa-col-end"}
                        >
                          <img
                            className="images"
                            src={process.env.NEXT_PUBLIC_URL + "/payapl.png"}
                          ></img>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
                {/* {mediaMatch.matches ? {} : <Row style={{ paddingTop: '20px' }}><Col xs={24} sm={24} md={24} lg={24}>
                                <hr style={{ border: '-1px solid rgba(25, 25, 25, 0.6)' }} />
                            </Col></Row>} */}
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <span
                      className="qa-fs-16 qa-font-san qa-fw-b qa-tc-white"
                      style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                    >
                      Buyer
                    </span>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <span
                      className={
                        mediaMatch.matches
                          ? "qa-fs-14 qa-font-san qa-tc-white"
                          : "qa-fs-12 qa-font-san qa-tc-white"
                      }
                      style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                    >
                      {props.user && props.user.orgName}
                    </span>
                  </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <hr />
                  </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <span
                      className="qa-fs-16 qa-font-san qa-fw-b qa-tc-white"
                      style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                    >
                      Shipping to:
                    </span>
                  </Col>
                  <Col xs={22} sm={22} md={22} lg={18} xl={18}>
                    <span
                      className={
                        mediaMatch.matches
                          ? "qa-fs-14 qa-font-san qa-tc-white"
                          : "qa-fs-12 qa-font-san qa-tc-white"
                      }
                      style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                    >
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["addressLine1"]}
                      ,
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["addressLine2"]}
                      ,
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["city"]}
                      ,
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["country"]}{" "}
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["zipCode"]}
                    </span>
                  </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <hr />
                  </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={22} sm={22} md={22} lg={22}>
                    <span
                      className="qa-fs-17 qa-font-san qa-fw-b qa-tc-white"
                      style={{ lineHeight: "110%", letterSpacing: ".02em" }}
                    >
                      Shipping mode:{" "}
                    </span>
                    <span
                      className="qa-fs-17 qa-font-san qa-tc-white"
                      style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                    >
                      {props.order &&
                        props.order.shippingMode &&
                        props.order.shippingMode.charAt(0).toUpperCase() +
                          props.order.shippingMode.substr(1).toLowerCase()}
                    </span>
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={2} className="qa-col-end">
                    {showRow ? (
                      <UpOutlined onClick={() => handleRow(false)} />
                    ) : (
                      <DownOutlined onClick={() => handleRow(true)} />
                    )}
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{ paddingTop: "10px" }}
                  >
                    <hr />
                  </Col>
                </Row>
                <Row
                  style={showRow ? { paddingTop: "20px" } : { display: "none" }}
                >
                  <Col
                    xs={24}
                    sm={24}
                    md={15}
                    lg={15}
                    className="shipping-container"
                  >
                    <Row>
                      <Col xs={4} sm={4} md={4} lg={4}>
                        {props.shippingMode == "AIR" ? (
                          <img
                            className="images"
                            src={process.env.NEXT_PUBLIC_URL + "/Air.png"}
                          ></img>
                        ) : (
                          <img
                            className="images"
                            src={process.env.NEXT_PUBLIC_URL + "/Sea.png"}
                          ></img>
                        )}
                      </Col>
                      <Col xs={20} sm={20} md={20} lg={20}>
                        <span
                          className="qa-font-san qa-fs-17 qa-tc-white"
                          style={{ lineHeight: "110%", letterSpacing: ".02em" }}
                        >
                          {props.order &&
                            props.order.shippingMode &&
                            props.order.shippingMode.charAt(0).toUpperCase() +
                              props.order.shippingMode.substr(1).toLowerCase()}
                        </span>
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr />
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={15} sm={15} md={15} lg={15}>
                        <span
                          className="qa-font-san qa-fs-12"
                          style={{
                            color: "rgba(25, 25, 25, 0.6)",
                            lineHeight: "110%",
                            letterSpacing: ".02em",
                          }}
                        >
                          Estimated freight fees
                        </span>
                      </Col>
                      <Col xs={9} sm={9} md={9} lg={9} className="qa-col-end">
                        <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white">
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
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr
                          style={{ border: "1px dashed rgba(25, 25, 25, 0.6)" }}
                        />
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={15} sm={15} md={15} lg={15}>
                        <span
                          className="qa-font-san qa-fs-12"
                          style={{
                            color: "rgba(25, 25, 25, 0.6)",
                            lineHeight: "110%",
                            letterSpacing: ".02em",
                          }}
                        >
                          Estimated custom duties
                        </span>
                      </Col>
                      <Col xs={9} sm={9} md={9} lg={9} className="qa-col-end">
                        <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(
                            props.order &&
                              props.order.miscCharges &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "CUSTOM_CHARGES"
                              ) &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "CUSTOM_CHARGES"
                              ).amount
                          ).toFixed(2)}
                        </span>
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr
                          style={{ border: "1px dashed rgba(25, 25, 25, 0.6)" }}
                        />
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={15} sm={15} md={15} lg={15}>
                        <span
                          className="qa-font-san qa-fs-12"
                          style={{
                            color: "rgba(25, 25, 25, 0.6)",
                            lineHeight: "110%",
                            letterSpacing: ".02em",
                          }}
                        >
                          Total lead time
                        </span>
                      </Col>
                      <Col xs={9} sm={9} md={9} lg={9} className="qa-col-end">
                        <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white">
                          {props.order &&
                            props.order.miscCharges &&
                            props.order.miscCharges.find(
                              (x) => x.chargeId === "LEAD_TIME"
                            ) &&
                            props.order.miscCharges.find(
                              (x) => x.chargeId === "LEAD_TIME"
                            ).amount}
                        </span>
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr
                          style={{ border: "1px dashed rgba(25, 25, 25, 0.6)" }}
                        />
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={15} sm={15} md={15} lg={15}>
                        <span
                          className="qa-font-san qa-fw-b qa-fs-14"
                          style={{
                            color: "rgba(25, 25, 25, 0.6)",
                            lineHeight: "110%",
                            letterSpacing: ".02em",
                          }}
                        >
                          Total estimated charges
                        </span>
                      </Col>
                      <Col xs={9} sm={9} md={9} lg={9} className="qa-col-end">
                        <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(estimateCharge).toFixed(2)}*
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {mediaMatch.matches ? (
                  <Row style={{ paddingTop: "40px" }}>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <span
                        className="qa-fs-17 qa-font-san qa-fw-b qa-tc-white"
                        style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                      >
                        Payment terms
                      </span>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      className="payment-term"
                    >
                      <Row>
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <Row>
                            <Col xs={10} sm={10} md={10} lg={10}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                Advance payment :
                              </span>
                            </Col>
                            <Col xs={14} sm={14} md={14} lg={14}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                {getSymbolFromCurrency(
                                  props.order && props.order.currency
                                )}
                                {parseFloat(
                                  props.order &&
                                    props.order.paymentTerms &&
                                    props.order.paymentTerms.find(
                                      (x) => x.chargeId === "ADVANCE"
                                    ).amount
                                ).toFixed(2)}
                              </span>
                            </Col>
                          </Row>
                          {/* <span
                          className={
                            mediaMatch.matches
                              ? "qa-fs-14 qa-font-san qa-tc-white"
                              : "qa-fs-12 qa-font-san qa-tc-white"
                          }
                          style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                        >
                        Advance payment : {getSymbolFromCurrency(
                          props.order && props.order.currency
                        )}{props.order && props.order.paymentTerms && props.order.paymentTerms.find((x) => x.chargeId === "ADVANCE").amount}
                        </span> */}
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <Row>
                            <Col xs={10} sm={10} md={10} lg={10}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                Pay on shipping :
                              </span>
                            </Col>
                            <Col xs={14} sm={14} md={14} lg={14}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                {getSymbolFromCurrency(
                                  props.order && props.order.currency
                                )}
                                {parseFloat(
                                  props.order &&
                                    props.order.paymentTerms &&
                                    props.order.paymentTerms.find(
                                      (x) => x.chargeId === "ON_SHIPPED"
                                    ).amount
                                ).toFixed(2)}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <Row>
                            <Col xs={10} sm={10} md={10} lg={10}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                Pay on delivery :
                              </span>
                            </Col>
                            <Col xs={14} sm={14} md={14} lg={14}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-12 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                {getSymbolFromCurrency(
                                  props.order && props.order.currency
                                )}
                                {parseFloat(
                                  props.order &&
                                    props.order.paymentTerms &&
                                    props.order.paymentTerms.find(
                                      (x) => x.chargeId === "POST_DELIVERY"
                                    ).amount
                                ).toFixed(2)}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Row>
                        <Col xs={20} sm={20} md={20} lg={20}>
                          <span className="qa-font-san qa-tc-white qa-fs-12">
                            secure payment by credit cards and other payment
                            modes
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4} className="qa-col-end">
                          <img
                            className="images"
                            src={process.env.NEXT_PUBLIC_URL + "/payapl.png"}
                          ></img>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : (
                  ""
                )}
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Row style={{ paddingTop: "10px" }}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    className="qa-col-center"
                  >
                    <span
                      className="qa-font-san qa-fw-b qa-fs-12 qa-tc-white"
                      style={{ letterSpacing: ".02em" }}
                    >
                      Quotation ID &nbsp;{" "}
                    </span>
                    <span
                      className="qa-font-san qa-fs-12 qa-tc-white"
                      style={{ letterSpacing: ".02em" }}
                    >
                      {props.order && props.order.priceQuoteRef}
                    </span>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{ paddingTop: "10px" }}
                  >
                    <Row>
                      <Col xs={3} sm={3} md={3} lg={5} xl={5}></Col>
                      <Col
                        xs={8}
                        sm={8}
                        md={8}
                        lg={6}
                        xl={6}
                        className="qa-col-center"
                      >
                        <img
                          className="images"
                          src={
                            process.env.NEXT_PUBLIC_URL + "/pdf_download.png"
                          }
                          style={{ height: "50px" }}
                          onClick={(e) =>
                            downloadMedia(props.order.quotationMedia)
                          }
                        ></img>
                      </Col>
                      <Col
                        xs={1}
                        sm={1}
                        md={1}
                        lg={1}
                        className="qa-col-center"
                      >
                        <img
                          className="images"
                          src={process.env.NEXT_PUBLIC_URL + "/Line.png"}
                          style={{ height: "50px" }}
                        ></img>
                      </Col>
                      <Col
                        xs={8}
                        sm={8}
                        md={8}
                        lg={6}
                        xl={6}
                        className="qa-col-center"
                      >
                        <img
                          className="images"
                          src={
                            process.env.NEXT_PUBLIC_URL + "/pdf_download.png"
                          }
                          style={{ height: "50px" }}
                          onClick={(e) => downloadBuyerAgreement()}
                        ></img>
                      </Col>
                      <Col xs={3} sm={3} md={3} lg={5} xl={5}></Col>
                      <Col xs={3} sm={3} md={3} lg={5} xl={5}></Col>
                      <Col
                        xs={8}
                        sm={8}
                        md={8}
                        lg={6}
                        xl={6}
                        style={{
                          textAlign: "center",
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          lineHeight: "10px",
                        }}
                      >
                        <span
                          className="qa-fs-12 qa-font-san"
                          style={{ color: "#191919" }}
                        >
                          Quotation & spec sheet
                        </span>
                      </Col>
                      <Col
                        xs={1}
                        sm={1}
                        md={1}
                        lg={1}
                        className="qa-col-center"
                      >
                        {/* <img className='images' src={process.env.NEXT_PUBLIC_URL + "/Line.png"} style={{ height: '50px' }}></img> */}
                      </Col>
                      <Col
                        xs={8}
                        sm={8}
                        md={8}
                        lg={6}
                        xl={6}
                        style={{
                          textAlign: "center",
                          paddingLeft: "10px",
                          paddingRight: "10px",
                          lineHeight: "10px",
                        }}
                      >
                        <span
                          className="qa-fs-12 qa-font-san"
                          style={{ color: "#191919" }}
                        >
                          Buyer agreement
                        </span>
                      </Col>
                      <Col xs={3} sm={3} md={3} lg={5} xl={5}></Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={24} sm={24} md={24} lg={24} className="payment-term">
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <span
                          className="qa-font-butler qa-fs-20 qa-tc-white"
                          style={{ lineHeight: "38px", letterSpacing: ".01em" }}
                        >
                          Order summary
                        </span>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr
                          style={{ border: "-1px solid rgba(25, 25, 25, 0.6)" }}
                        />
                      </Col>
                    </Row>
                    {prepareProductsList}

                    {/* <Row style={{ paddingTop: '20px' }}>
                                        <Col xs={22} sm={22} md={24} lg={24}>
                                            <span className="qa-fs-17 qa-font-san qa-fw-b qa-tc-white">Craftloom exports</span>
                                        </Col>
                                        <Col xs={18} sm={18} md={16} lg={16} style={mediaMatch.matches ? { paddingTop: '10px' } : {}}>
                                            <span className={mediaMatch.matches ? "qa-font-san qa-tc-white qa-fs-14" : 'qa-font-san qa-tc-white qa-fs-12'}>Value of products purchased</span>
                                        </Col>
                                        <Col xs={6} sm={6} md={8} lg={8} className="qa-col-end" style={mediaMatch.matches ? { paddingTop: '10px' } : ''}>
                                            <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-14">{getSymbolFromCurrency(props.order && props.order.currency)}200</span>
                                        </Col>
                                    </Row>
                                    <Row style={{ paddingTop: '20px' }}>
                                        <Col xs={24} sm={24} md={24} lg={24}>
                                            <hr style={{ border: '-1px solid rgba(25, 25, 25, 0.6)' }} />
                                        </Col>
                                    </Row> */}
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                              : "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                          }
                        >
                          Freight fee*
                        </span>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="qa-col-end"
                      >
                        <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-14">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(
                            props.order &&
                              props.order.miscCharges &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "FREIGHT_CHARGES"
                              ).amount
                          ).toFixed(2)}
                        </span>
                      </Col>
                      <Col
                        xs={18}
                        sm={18}
                        md={18}
                        lg={16}
                        xl={16}
                        style={{ paddingTop: "10px" }}
                      >
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                              : "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                          }
                        >
                          Custom, taxes & duties*
                        </span>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="qa-col-end"
                        style={{ paddingTop: "10px" }}
                      >
                        <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-14">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(
                            props.order &&
                              props.order.miscCharges &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "CUSTOM_CHARGES"
                              ).amount
                          ).toFixed(2)}
                        </span>
                      </Col>
                      {/* <Col xs={18} sm={18} md={18} lg={16} xl={16} style={{ paddingTop: "10px" }}>
                      <span
                        className={
                          mediaMatch.matches
                            ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                            : "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                        }
                      >
                        Coupon discount
                      </span>
                    </Col>
                    <Col
                      xs={6}
                      sm={6}
                      md={6}
                      lg={8}
                      xl={8}
                      className="qa-col-end"
                      style={{ paddingTop: "10px" }}
                    >
                      <span className="qa-font-san qa-fw-b qa-fs-14" style={{ color: '#0ABC1C' }}>
                        - {getSymbolFromCurrency(
                        props.order && props.order.currency
                      )}
                        {props.order &&
                          props.order.miscCharges &&
                          props.order.miscCharges.find(
                            (x) => x.chargeId === "DISCOUNT"
                          ).amount || 0}
                      </span>
                    </Col> */}
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr />
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "20px" }}>
                      <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                              : "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                          }
                        >
                          TOTAL CART VALUE
                        </span>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="qa-col-end"
                      >
                        <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-20">
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
                      </Col>

                      <Col
                        xs={18}
                        sm={18}
                        md={18}
                        lg={16}
                        xl={16}
                        className="qa-mar-top-1"
                      >
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                              : "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                          }
                        >
                          VAT / GST
                        </span>
                        {/* <div className="c-left-blk">
                        Part of these charges are refundable.{" "}
                        <Link
                          href="/FAQforwholesalebuyers"
                          target="_blank"
                          className="qa-sm-color"
                        >
                          Know more
                        </Link>
                      </div> */}
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="qa-col-end qa-mar-top-1"
                      >
                        <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-14">
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          {parseFloat(
                            (props.order &&
                              props.order.miscCharges &&
                              props.order.miscCharges.find(
                                (x) => x.chargeId === "VAT"
                              ) &&
                              parseFloat(
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "VAT"
                                ).amount
                              )) ||
                              0
                          ).toFixed(2)}
                        </span>
                      </Col>
                      <Col xs={15} sm={15} md={15} lg={15}>
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
                            className={
                              mediaMatch.matches
                                ? "qa-font-san qa-fs-14 qa-sm-color"
                                : "qa-font-san qa-fs-12 qa-sm-color"
                            }
                            style={{ textDecoration: "underline" }}
                          >
                            <a
                              target="_blank"
                              className="qa-sm-color qa-cursor"
                            >
                              Know more
                            </a>
                          </Link>
                        </div>
                      </Col>
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "DISCOUNT"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "DISCOUNT"
                        ).amount > 0 && (
                          <Col
                            xs={18}
                            sm={18}
                            md={18}
                            lg={16}
                            xl={16}
                            style={{ paddingTop: "10px" }}
                          >
                            <span
                              className={
                                mediaMatch.matches
                                  ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                                  : "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                              }
                            >
                              {props.order && props.order.referralCode
                                ? props.order.referralCode
                                : "Coupon"}{" "}
                              discount applied
                            </span>
                          </Col>
                        )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "DISCOUNT"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "DISCOUNT"
                        ).amount > 0 && (
                          <Col
                            xs={6}
                            sm={6}
                            md={6}
                            lg={8}
                            xl={8}
                            className="qa-col-end"
                            style={{ paddingTop: "10px" }}
                          >
                            <span
                              className="qa-font-san qa-fw-b qa-fs-14"
                              style={{ color: "#0ABC1C" }}
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
                                  ).amount) ||
                                  0
                              ).toFixed(2)}
                            </span>
                          </Col>
                        )}
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr />
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                              : "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                          }
                        >
                          TOTAL COST
                        </span>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="qa-col-end"
                      >
                        <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-20">
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
                              )
                          ).toFixed(2)}
                        </span>
                      </Col>
                    </Row>

                    <Row style={{ paddingTop: "10px" }} gutter={[8, 0]}>
                      <Col
                        xs={2}
                        sm={2}
                        md={2}
                        lg={1}
                        xl={1}
                        style={mediaMatch.matches ? { marginTop: "-2px" } : {}}
                      >
                        <Checkbox onChange={handleCheck} id="check"></Checkbox>
                      </Col>
                      <Col
                        xs={22}
                        sm={22}
                        md={22}
                        lg={23}
                        xl={23}
                        style={
                          mediaMatch.matches
                            ? { lineHeight: "100%", paddingLeft: "10px" }
                            : { lineHeight: "100%" }
                        }
                      >
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-fs-14 qa-tc-white"
                              : "qa-font-san qa-fs-12 qa-tc-white"
                          }
                        >
                          I agree to the{" "}
                        </span>
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-fs-14 qa-sm-color"
                              : "qa-font-san qa-fs-12 qa-sm-color"
                          }
                        >
                          quotation and specification sheet, and the buyer
                          agreement
                        </span>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        style={{ lineHeight: "100%" }}
                        className="qa-mar-top-1"
                      >
                        <span
                          className="qa-font-san qa-fs-14 termsError qa-error"
                          style={{ display: "none" }}
                        >
                          Please accept this agreement
                        </span>
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "20px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        {/* <Button className="qa-button payemnt-btn" onClick={successPayment}><span>PROCEED TO PAYMENT1</span></Button> */}
                        {props.order && localeUpdated ? (
                          <PayWithPaypal
                            token={keycloak.token}
                            saveOrder={saveOrder}
                            order={props.order}
                            user={props.user}
                            currency={props.order && props.order.currency}
                            countryCode={
                              props.order &&
                              countries[
                                props.order.shippingAddressDetails["country"]
                                  .toString()
                                  .toUpperCase()
                              ]
                            }
                            termsAccepted={isTermsAccepted}
                            showError={showError}
                            locale={locale}
                            isCartSummary={false}
                            currencyDetails={null}
                            // stateCode={getStateCode}
                          />
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        className="qa-col-center"
                      >
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-fs-14"
                              : "qa-font-san qa-fs-12"
                          }
                          style={{
                            lineHeight: "110%",
                            color: "rgba(25, 25, 25, 0.6)",
                          }}
                        >
                          Transactions are secure and encrypted
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row style={{ paddingTop: "10px" }}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{ lineHeight: "110%" }}
                  >
                    <span
                      className="qa-font-san qa-fs-12 qa-tc-white"
                      style={{ letterSpacing: ".01em" }}
                    >
                      *This is an estimate, final invoice will be shared at the
                      time of shipping
                    </span>
                  </Col>
                </Row>
                {/* <Row style={{ paddingTop: '10px' }} gutter={[8, 0]}>
                                <Col xs={2} sm={2} md={1} lg={1}>
                                    <Checkbox onChange={handleCheck}></Checkbox>
                                </Col>
                                <Col xs={22} sm={22} md={23} lg={23} style={{ lineHeight: '100%' }}>
                                    <span className={mediaMatch.matches ? "qa-font-san qa-fs-14 qa-tc-white" : "qa-font-san qa-fs-12 qa-tc-white"}>I agree to the </span><span className={mediaMatch.matches ? "qa-font-san qa-fs-14 qa-sm-color" : "qa-font-san qa-fs-12 qa-sm-color"}>quotation and specification sheet, and the buyer agreement</span>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} style={{ lineHeight: '100%' }} className="qa-mar-top-1">
                                    <span className="qa-font-san qa-fs-14 termsError qa-error" style={{ display: 'none' }}>Please accept this agreement</span>
                                </Col>
                            </Row> */}
              </Col>
            </Row>
            {mediaMatch.matches ? (
              <Row style={{ marginTop: "35px" }}>
                <Col xs={0} sm={0} md={24} lg={24}>
                  <Row>
                    <Col xs={0} sm={0} md={20} lg={20}>
                      <span
                        className="qa-font-san qa-fs-20 qa-tc-white"
                        style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                      >
                        Product details
                      </span>
                    </Col>
                    <Col xs={0} sm={0} md={4} lg={4} className="qa-col-end">
                      {showProduct ? (
                        <UpOutlined
                          onClick={() => handleProductDetails(false)}
                        />
                      ) : (
                        <DownOutlined
                          onClick={() => handleProductDetails(true)}
                        />
                      )}
                    </Col>
                  </Row>
                  <Row style={{ paddingTop: "10px" }}>
                    <Col xs={0} sm={0} md={24} lg={24}>
                      <hr />
                    </Col>
                  </Row>
                  <Row
                    style={
                      showProduct ? { paddingTop: "20px" } : { display: "none" }
                    }
                  >
                    <Col
                      xs={0}
                      sm={0}
                      md={4}
                      lg={4}
                      className="additional-services"
                    >
                      <span className="qa-font-san qa-fs-14 qa-tc-white qa-letter-spacing">
                        Additional services
                      </span>
                    </Col>
                    <Col xs={0} sm={0} md={20} lg={20} className="payment-term">
                      <Row>
                        <Col
                          xs={0}
                          sm={0}
                          md={11}
                          lg={11}
                          className="qa-col-start"
                        >
                          <Col xs={0} sm={0} md={24} lg={24}>
                            <Row>
                              <Col xs={0} sm={0} md={2} lg={2}>
                                <img
                                  className="images"
                                  src={
                                    process.env.NEXT_PUBLIC_URL + "/tick.png"
                                  }
                                  style={{ height: "15px" }}
                                ></img>
                              </Col>
                              <Col xs={0} sm={0} md={22} lg={22}>
                                <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white">
                                  Production monitoring,{" "}
                                  {getSymbolFromCurrency(
                                    props.order && props.order.currency
                                  )}
                                  50 per seller order
                                </span>
                              </Col>
                              <Col xs={0} sm={0} md={2} lg={2}></Col>
                              <Col xs={0} sm={0} md={22} lg={22}>
                                <span
                                  className="qa-font-san qa-fs-12"
                                  color={{
                                    color: "rgba(25, 25, 25, 0.6)",
                                    lineHeight: "120%",
                                  }}
                                >
                                  Launch offer, this service is on us!
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Col>
                        <Col
                          xs={0}
                          sm={0}
                          md={2}
                          lg={2}
                          className="qa-col-first"
                        >
                          <img
                            className="images"
                            src={process.env.NEXT_PUBLIC_URL + "/Line.png"}
                            style={{ height: "50px" }}
                          ></img>
                        </Col>
                        <Col
                          xs={0}
                          sm={0}
                          md={11}
                          lg={11}
                          className="qa-col-start"
                        >
                          <Col xs={0} sm={0} md={24} lg={24}>
                            <Row>
                              <Col xs={0} sm={0} md={2} lg={2}>
                                <img
                                  className="images"
                                  src={
                                    process.env.NEXT_PUBLIC_URL + "/tick.png"
                                  }
                                  style={{ height: "15px" }}
                                ></img>
                              </Col>
                              <Col xs={0} sm={0} md={22} lg={22}>
                                <span className="qa-font-san qa-fw-b qa-fs-14 qa-tc-white">
                                  Qaulity inspection,{" "}
                                  {getSymbolFromCurrency(
                                    props.order && props.order.currency
                                  )}
                                  50 per seller order
                                </span>
                              </Col>
                              <Col xs={0} sm={0} md={2} lg={2}></Col>
                              <Col xs={0} sm={0} md={22} lg={22}>
                                <span
                                  className="qa-font-san qa-fs-12"
                                  color={{
                                    color: "rgba(25, 25, 25, 0.6)",
                                    lineHeight: "120%",
                                  }}
                                >
                                  Launch offer, this service is on us!
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row
                    style={
                      showProduct
                        ? { marginTop: "30px", border: "15px solid #E6E4DF" }
                        : { display: "none" }
                    }
                  >
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <table
                        style={{ width: "100%" }}
                        className="product-table"
                      >
                        <tr>
                          <th>
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#f9f7f2" }}
                            >
                              Seller name
                            </span>{" "}
                            <span
                              className="qa-font-san qa-fs-14"
                              style={{ color: "#f9f7f2" }}
                            ></span>
                          </th>
                          <th>
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#f9f7f2" }}
                            >
                              S.No
                            </span>
                          </th>
                          <th>
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#f9f7f2" }}
                            >
                              Item ID
                            </span>
                          </th>
                          <th>
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#f9f7f2" }}
                            >
                              Product name
                            </span>
                          </th>
                          <th>
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#f9f7f2" }}
                            >
                              Quantity
                            </span>
                          </th>
                          <th>
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#f9f7f2" }}
                            >
                              Unit
                            </span>
                          </th>
                          <th>
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#f9f7f2" }}
                            >
                              Per unit price (
                              {props.order && props.order.currency})
                            </span>
                          </th>
                          <th>
                            <span
                              className="qa-font-san qa-fs-12"
                              style={{ color: "#f9f7f2" }}
                            >
                              Base price excl. margin and other charges (
                              {props.order && props.order.currency})
                            </span>
                          </th>
                        </tr>
                        {prepareTableRows}
                        {/* <tr>
                                                <td rowSpan={props.order && props.order} id="seller-name"><span className="qa-font-san qa-fw-b qa-fs-12">Craftloom exports</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">01</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">QLR1234</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">Wooden shelf teak brown polis</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">10</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">pieces</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">20.00</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">200</span></td>
                                            </tr>
                                            <tr>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">01</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">QLR1234</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">Wooden shelf teak brown polis</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">10</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">pieces</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">20.00</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">200</span></td>
                                            </tr>
                                            <tr>
                                                <td rowSpan="2" id="seller-name"><span className="qa-font-san qa-fw-b qa-fs-12">Craftloom exports</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">01</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">QLR1234</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">Wooden shelf teak brown polis Wooden shelf teak brown polis</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">10</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">pieces</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">20.00</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">200</span></td>
                                            </tr>
                                            <tr>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">01</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">QLR1234</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">Wooden shelf teak brown polis</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">10</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">pieces</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">20.00</span></td>
                                                <td><span className="qa-font-san qa-fw-b qa-fs-12">200</span></td>
                                            </tr> */}
                      </table>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ) : (
              <React.Fragment>
                <Row style={{ marginTop: "35px" }}>
                  <Col xs={22} sm={22} md={22} lg={0}>
                    <span
                      className="qa-font-san qa-fs-12 qa-fw-b qa-tc-white"
                      style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                    >
                      Additional services
                    </span>
                  </Col>
                  <Col xs={2} sm={2} md={2} lg={0} className="qa-col-end">
                    {showAdditionalServices ? (
                      <UpOutlined
                        onClick={() => setShowAdditionalServices(false)}
                      />
                    ) : (
                      <DownOutlined
                        onClick={() => setShowAdditionalServices(true)}
                      />
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={0} className="qa-mar-top-1">
                    <hr />
                  </Col>
                  {showAdditionalServices ? (
                    <React.Fragment>
                      <Col xs={2} sm={2} md={2} lg={0} className="qa-mar-top-1">
                        <img
                          className="images"
                          src={process.env.NEXT_PUBLIC_URL + "/tick.png"}
                          style={{ height: "20px" }}
                        ></img>
                      </Col>
                      <Col
                        xs={22}
                        sm={22}
                        md={22}
                        lg={22}
                        className="qa-mar-top-1"
                      >
                        <span className="qa-font-san qa-fs-12 qa-tc-white">
                          Production monitoring,{" "}
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          50 per seller order
                        </span>
                      </Col>
                      <Col xs={2} sm={2} md={2} lg={0} className="qa-mar-top-1">
                        <img
                          className="images"
                          src={process.env.NEXT_PUBLIC_URL + "/tick.png"}
                          style={{ height: "20px" }}
                        ></img>
                      </Col>
                      <Col
                        xs={22}
                        sm={22}
                        md={22}
                        lg={22}
                        className="qa-mar-top-1"
                      >
                        <span className="qa-font-san qa-fs-12 qa-tc-white">
                          Production monitoring,{" "}
                          {getSymbolFromCurrency(
                            props.order && props.order.currency
                          )}
                          50 per seller order
                        </span>
                      </Col>{" "}
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                </Row>
                <Row style={{ marginTop: "35px" }}>
                  <Col xs={22} sm={22} md={22} lg={0}>
                    <span
                      className="qa-font-san qa-fs-12 qa-fw-b qa-tc-white"
                      style={{ lineHeight: "110%", letterSpacing: ".02em" }}
                    >
                      Product details
                    </span>
                  </Col>
                  <Col
                    xs={2}
                    sm={2}
                    md={2}
                    lg={0}
                    className="qa-col-end"
                    style={{ alignItems: "center" }}
                  >
                    {showProduct ? (
                      <UpOutlined onClick={() => setShowProduct(false)} />
                    ) : (
                      <DownOutlined onClick={() => setShowProduct(true)} />
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={0} className="qa-mar-top-1">
                    <hr />
                  </Col>
                  {showProduct ? prepareProductsForMobile : ""}
                  <Col xs={24} sm={24} md={24} lg={0}>
                    <Row style={{ paddingTop: "20px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        {/* <Button className="qa-button payemnt-btn" style={{ minWidth: '90%' }} onClick><span>PROCEED TO PAYMENT</span></Button> */}
                        {props.order && localeUpdated ? (
                          <PayWithPaypal
                            token={keycloak.token}
                            saveOrder={saveOrder}
                            order={props.order}
                            user={props.user}
                            currency={props.order && props.order.currency}
                            countryCode={
                              props.order &&
                              countries[
                                props.order.shippingAddressDetails["country"]
                                  .toString()
                                  .toUpperCase()
                              ]
                            }
                            termsAccepted={isTermsAccepted}
                            showError={showError}
                            locale={locale}
                            isCartSummary={false}
                            currencyDetails={null}
                          />
                        ) : (
                          ""
                        )}
                      </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        className="qa-col-center"
                      >
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-fs-14"
                              : "qa-font-san qa-fs-12"
                          }
                          style={{
                            lineHeight: "110%",
                            color: "rgba(25, 25, 25, 0.6)",
                          }}
                        >
                          Transactions are secure and encrypted
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </React.Fragment>
            )}
          </Col>
        </Row>
      </React.Fragment>
    );
  }
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

export default connect(mapStateToProps, { getOrderByOrderId })(OrderReview);
