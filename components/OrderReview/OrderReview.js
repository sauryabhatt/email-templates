/** @format */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Row, Col, Checkbox, Spin, message, Popover } from "antd";
import { UpOutlined, DownOutlined, LoadingOutlined } from "@ant-design/icons";
import PayWithPaypal from "../PayWithPayPal/PayWithPaypal";
import { useKeycloak } from "@react-keycloak/ssr";
import { getOrderByOrderId } from "../../store/actions";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import countries from "../../public/filestore/countryCodes_en.json";
import Icon from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import Spinner from "./../Spinner/Spinner";
import Air from "../../public/filestore/air";
import Sea from "../../public/filestore/sea";
import sellerList from "../../public/filestore/freeShippingSellers.json";
import Link from "next/link";

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
  const [isLoading, setLoading] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  let retryCount = 0;
  let retryCountCP = 0;
  let retryCountAP = 0;
  let retryCountOR = 0;

  let { order = {}, brandNameList = "" } = props || {};
  let { shippingMode = "", shippingTerms = "", miscCharges = [] } = order || {};

  let dutyMax = 0;
  let dutyMin = 0;
  let vat = 0;

  for (let charge of miscCharges) {
    let { chargeId = "", amount = 0 } = charge;
    if (chargeId === "DDP_VAT") {
      vat = amount;
    } else if (chargeId === "DDP_DUTY_MAX") {
      dutyMax = amount;
    } else if (chargeId === "DDP_DUTY_MIN") {
      dutyMin = amount;
    }
  }

  useEffect(() => {
    if (keycloak?.token && orderIdParam) {
      props.getOrderByOrderId(keycloak.token, orderIdParam);
    }
  }, [keycloak.token, orderIdParam]);

  useEffect(() => {
    setLoading(false);
    if (props.order) {
      getCountryCode();
      getEstimateCharge();
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
  }, [props.order]);

  const handleRow = (value) => {
    setShowRow(value);
  };

  const handleProductDetails = (value) => {
    setShowProduct(value);
  };

  const handlePaymentDetails = (value) => {
    setShowPayment(value);
  };

  const handleShippingDetails = (value) => {
    setShowShipping(value);
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
    let formData = { ...data };
    let { order = {} } = props || {};
    let { shippingMode = "" } = order || {};
    formData["shippingMode"] = shippingMode;
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL +
        "/v1/orders/my/payments-reference?order_updated_Status=" +
        status,
      {
        method: "PUT",
        body: JSON.stringify(formData),
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
          throw (
            res.statusText || "Sorry something went wrong. Please try again!"
          );
        }
      })
      .then((res) => {
        if (status === "FAILED") {
          let url = "/order/" + props.order.orderId + "/payment-failure";
          router.push(url);
        } else {
          let url = "/order/" + props.order.orderId + "/payment-success";
          router.push(url);
        }
      })
      .catch((err) => {
        if (retryCountOR < 3) {
          updateOrder(data, status);
        } else {
          if (status === "FAILED") {
            let url = "/order/" + props.order.orderId + "/payment-failure";
            router.push(url);
          } else {
            let url = "/order/" + props.order.orderId + "/payment-success";
            router.push(url);
          }
        }
        retryCountOR++;
      });
  };

  const checkCapturePayment = (authId, orderId, actions, data) => {
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        "/payments/paypal/check/getCaptureStatus/" +
        props.cart.orderId +
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
          throw (
            res.statusText ||
            "Something went wrong with payment. Please try again!"
          );
        }
      })
      .then((res) => {
        if (res && Object.keys(res).length) {
          setIsProcessing(false);
          if (res.error === "INSTRUMENT_DECLINED") {
            return actions.restart();
          } else {
            delete res.qauthorizations[0].requestUUID;
            delete res.currentAuth.requestUUID;
            updateOrder(res, "CHECKED_OUT");
          }
        } else {
          // voidPPOrder(orderId);
          let data = {
            gbOrderNo: cart.orderId,
          };
          updateOrder(data, "FAILED");
        }
      })
      .catch((err) => {
        if (retryCountCP < 3) {
          checkCapturePayment(authId, orderId, actions);
        } else {
          // voidPPOrder(orderId);
          let data = {
            gbOrderNo: cart.orderId,
          };
          updateOrder(data, "FAILED");
        }
        retryCountCP++;
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
          throw (
            res.statusText ||
            "Something went wrong with payment. Please try again!"
          );
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
        }
      })
      .catch((err) => {
        checkCapturePayment(authId, orderId, actions, data);
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
          throw (
            res.statusText || "Sorry something went wrong. Please try again!"
          );
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

  const checkAuthorizePaymentStatus = (orderId, actions) => {
    setIsProcessing(true);
    let finalValue = getConvertedCurrency(cart.total);
    let value = parseFloat((finalValue * 20) / 100).toFixed(2);
    let currency = currencyDetails.convertToCurrency;

    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        `/payments/paypal/check/getAuthorizationStatus/${orderId}/${cart.orderId}/${value}/${currency}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.text();
        } else {
          throw (
            res.statusText ||
            "There was an error authorizing the amount please try again"
          );
        }
      })
      .then((res) => {
        if (res && res.length) {
          capturePayment(res, orderId);
        } else {
          // voidPPOrder(orderId);
          let data = {
            gbOrderNo: cart.orderId,
          };
          updateOrder(data, "FAILED");
          // message.error(
          //   "There was an error authorizing the amount please try again"
          // );
        }
      })
      .catch((err) => {
        if (retryCountAP < 3) {
          checkAuthorizePaymentStatus(orderId, actions);
        } else {
          // voidPPOrder(orderId);
          let data = {
            gbOrderNo: cart.orderId,
          };
          updateOrder(data, "FAILED");
          // message.error(err.message || err, 5);
        }
        retryCountAP++;
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
          throw (
            res.statusText ||
            "There was an error authorizing the amount please try again"
          );
        }
      })
      .then((res) => {
        capturePayment(res.currentAuth.ppAuthId, orderId);
      })
      .catch((err) => {
        checkAuthorizePaymentStatus(orderId, actions);
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
          throw (
            res.statusText || "Sorry something went wrong. Please try again!"
          );
        }
      })
      .then((res) => {
        authorizePayment(orderId, actions);
      })
      .catch((err) => {
        if (retryCount < 3) {
          saveOrder(orderId, actions);
        } else {
          message.error(err.message || err, 5);
        }
        retryCount++;
      });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (isProcessing) {
    return (
      <Row justify="space-around" className="order-body">
        <Spin tip="Processing payment" size="large" />
      </Row>
    );
  }

  let { promoDiscount = 0, promoCode = "" } = props.order || {};
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
                  {subOrder.sellerCode}
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
                {product.articleId || product.productId}
              </span>
            </td>
            <td>
              <div className="qa-font-san qa-fw-b qa-fs-12 qa-lh-m">
                {product.productName}
              </div>
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
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(props.order && props.order.currency)}
            {parseFloat(
              subOrder.products.reduce((x, y) => x + y["totalProductCost"], 0)
            ).toFixed(2)}
          </div>
          <div className="c-left-blk qa-mar-btm-05">Qalara margin</div>
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(props.order && props.order.currency)}
            {parseFloat(
              (subOrder.qalaraSellerMargin && subOrder.qalaraSellerMargin) || 0
            ).toFixed(2)}
          </div>
          <div className="c-left-blk qa-mar-btm-05">Quality testing</div>
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
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
          {parseFloat(
            subOrder.products.reduce(
              (x, y) => x["sampleCost"] || 0 + y["sampleCost"] || 0,
              0
            )
          ) > 0 && (
            <div className="c-left-blk qa-mar-btm-05">Sample required</div>
          )}
          {parseFloat(
            subOrder.products.reduce(
              (x, y) => x["sampleCost"] || 0 + y["sampleCost"] || 0,
              0
            )
          ) > 0 && (
            <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
              {getSymbolFromCurrency(props.order && props.order.currency)}
              {parseFloat(
                subOrder.products.reduce(
                  (x, y) => x["sampleCost"] || 0 + y["sampleCost"] || 0,
                  0
                )
              ).toFixed(2)}
            </div>
          )}
        </div>
        <div className=".qa-tc-white qa-fs-12 qa-lh qa-txt-alg-cnt">
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

  const popupHover = (value) => {
    setPopover(value);
  };

  const prepareProductsList =
    props.order &&
    props.order.subOrders &&
    props.order.subOrders.map((subOrder, index) => {
      return (
        <React.Fragment key={index}>
          <Row>
            <Col
              xs={18}
              sm={18}
              md={16}
              lg={16}
              style={mediaMatch.matches ? { paddingTop: "10px" } : {}}
            >
              <div className="c-left-blk qa-font-san qa-fw-b">
                Seller ID- {subOrder.sellerCode}
              </div>
            </Col>
            <Col
              xs={6}
              sm={6}
              md={8}
              lg={8}
              className="qa-col-end"
              style={mediaMatch.matches ? { paddingTop: "10px" } : {}}
            ></Col>
            <Col
              xs={18}
              sm={18}
              md={16}
              lg={16}
              style={mediaMatch.matches ? { paddingTop: "5px" } : {}}
            >
              <div
                className={
                  mediaMatch.matches
                    ? "qa-font-san qa-tc-white qa-fs-14 qa-mar-rgt-1 qa-lh"
                    : "qa-font-san qa-tc-white qa-fs-14 qa-mar-rgt-1 qa-lh"
                }
              >
                Value of products purchased
              </div>
            </Col>
            <Col
              xs={6}
              sm={6}
              md={8}
              lg={8}
              className="qa-col-end"
              style={mediaMatch.matches ? { paddingTop: "5px" } : {}}
            >
              <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-14">
                {getSymbolFromCurrency(props.order && props.order.currency)}
                {parseFloat(
                  subOrder.products.reduce((x, y) => x + y["total"], 0) +
                    (subOrder["qalaraSellerMargin"] || 0)
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
          <React.Fragment key={index}>
            <Col xs={18} sm={18} md={18} lg={0} xl={0} className="qa-mar-top-2">
              <div
                className="qa-font-san qa-fs-12 qa-tc-white qa-lh-m"
                style={{ letterSpacing: ".02em" }}
              >
                {product.productName}
              </div>
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
            {/* <Col xs={24} sm={24} md={24} lg={0} className="qa-mar-top-2">
              <hr />
            </Col> */}
            <Col xs={24} sm={24} md={24} lg={0} className="qa-mar-top-05">
              <span
                className="qa-font-san qa-fs-14 qa-tc-white"
                style={{ lineHeight: "100%", letterSpacing: ".02em" }}
              >
                Seller ID: {subOrder.sellerCode}
              </span>
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
                    {product.articleId || product.productId}
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
                    {product.unitOfMeasure}
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
                  <div
                    className="qa-font-san qa-fs-12 qa-tc-white qa-lh qa-mar-top-05"
                    style={{ letterSpacing: ".02em" }}
                  >
                    Base price excl. margin and other charges (
                    {props.order && props.order.currency})
                  </div>
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
                {/* {mediaMatch.matches ? {} : <Row style={{ paddingTop: '20px' }}><Col xs={24} sm={24} md={24} lg={24}>
                                <hr style={{ border: '-1px solid rgba(25, 25, 25, 0.6)' }} />
                            </Col></Row>} */}
                {/* <Row style={{ paddingTop: "20px" }}>
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
                </Row> */}
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <span
                      className="qa-fs-16 qa-font-san qa-tc-white"
                      style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                    >
                      Shipping to:
                    </span>
                  </Col>
                  <Col xs={22} sm={22} md={22} lg={18} xl={18}>
                    <div
                      className={
                        mediaMatch.matches
                          ? "qa-fs-14 qa-font-san qa-tc-white qa-lh-m qa-mar-top-05"
                          : "qa-fs-12 qa-font-san qa-tc-white qa-lh-m qa-mar-top-05"
                      }
                      style={{ letterSpacing: "0.02em" }}
                    >
                      {props.user && props.user.orgName},{" "}
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["addressLine1"]}
                      ,{" "}
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["addressLine2"]}
                      ,{" "}
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["city"]}
                      ,{" "}
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["country"]}
                      ,{" "}
                      {props.order &&
                        props.order.shippingAddressDetails &&
                        props.order.shippingAddressDetails["zipCode"]}
                    </div>
                  </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <hr />
                  </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                  {mediaMatch.matches ? (
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <span
                        className="qa-fs-17 qa-font-san qa-tc-white"
                        style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                      >
                        Shipping term:
                      </span>
                    </Col>
                  ) : (
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Row>
                        <Col xs={20} sm={20} md={20} lg={20}>
                          <span
                            className="qa-fs-17 qa-font-san qa-tc-white"
                            style={{
                              lineHeight: "100%",
                              letterSpacing: "0.02em",
                            }}
                          >
                            Shipping term:{" "}
                            {shippingTerms === "DDU" ||
                              (shippingTerms === "DDP" && (
                                <span className="qa-fw-n qa-uppercase">
                                  {shippingTerms}
                                </span>
                              ))}
                          </span>
                        </Col>
                        <Col xs={4} sm={4} md={4} lg={4} className="qa-col-end">
                          {showShipping ? (
                            <UpOutlined
                              onClick={() => handleShippingDetails(false)}
                            />
                          ) : (
                            <DownOutlined
                              onClick={() => handleShippingDetails(true)}
                            />
                          )}
                        </Col>
                      </Row>
                    </Col>
                  )}

                  {!mediaMatch.matches ? (
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      className="qa-mar-top-05"
                      style={showShipping ? {} : { display: "none" }}
                    >
                      <span
                        className={
                          mediaMatch.matches
                            ? "qa-fs-14 qa-font-san qa-tc-white"
                            : "qa-fs-14 qa-font-san qa-tc-white"
                        }
                        style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                      >
                        {shippingTerms === "DDU" ? (
                          <div className="qa-mar-top-2 qa-font-san">
                            <div className="qa-fw-b">
                              DDU (Delivered Duty Unpaid)
                            </div>
                            <div className="qa-mar-top-1 qa-lh">
                              Duties and taxes will be paid by you at the time
                              of delivery. Qalara will pay the freight fee for
                              the order.
                            </div>
                          </div>
                        ) : (
                          <div className="qa-mar-top-2 qa-font-san">
                            <div className="qa-fw-b">
                              DDP (Delivered Duty Paid)
                            </div>
                            <div className="qa-mar-top-1 qa-lh">
                              Qalara will pay the freight fee, duties and taxes
                            </div>
                          </div>
                        )}
                      </span>
                    </Col>
                  ) : (
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <span
                        className={
                          mediaMatch.matches
                            ? "qa-fs-14 qa-font-san qa-tc-white"
                            : "qa-fs-14 qa-font-san qa-tc-white"
                        }
                        style={{ lineHeight: "100%", letterSpacing: "0.02em" }}
                      >
                        {shippingTerms === "DDU" ? (
                          <div className="qa-mar-top-2 qa-font-san">
                            <div className="qa-fw-b">
                              DDU (Delivered Duty Unpaid)
                            </div>
                            <div className="qa-mar-top-1 qa-lh">
                              Duties and taxes will be paid by you at the time
                              of delivery. Qalara will pay the freight fee for
                              the order.
                            </div>
                          </div>
                        ) : (
                          <div className="qa-mar-top-2 qa-font-san">
                            <div className="qa-fw-b">
                              DDP (Delivered Duty Paid)
                            </div>
                            <div className="qa-mar-top-1 qa-lh">
                              Qalara will pay the freight fee, duties and taxes
                            </div>
                          </div>
                        )}
                      </span>
                    </Col>
                  )}
                </Row>
                <Row style={{ paddingTop: "15px" }}>
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <hr />
                  </Col>
                </Row>
                <Row style={{ paddingTop: "20px" }}>
                  <Col xs={22} sm={22} md={22} lg={22}>
                    <span
                      className="qa-fs-17 qa-font-san qa-tc-white"
                      style={{ lineHeight: "110%", letterSpacing: ".02em" }}
                    >
                      Shipping mode:{" "}
                    </span>
                    <span
                      className="qa-fw-b qa-fs-17 qa-font-san qa-tc-white"
                      style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                    >
                      {props.order &&
                        props.order.shippingMode &&
                        props.order.shippingMode.charAt(0).toUpperCase() +
                          props.order.shippingMode.substr(1).toLowerCase()}
                    </span>
                  </Col>
                  <Col
                    xs={2}
                    sm={2}
                    md={2}
                    lg={2}
                    className="qa-col-end"
                    style={mediaMatch.matches ? { display: "none" } : {}}
                  >
                    {showRow ? (
                      <UpOutlined onClick={() => handleRow(false)} />
                    ) : (
                      <DownOutlined onClick={() => handleRow(true)} />
                    )}
                  </Col>
                  {/* <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{ paddingTop: "10px" }}
                  >
                    <hr />
                  </Col> */}
                </Row>

                <Row
                  style={showRow ? { paddingTop: "20px" } : { display: "none" }}
                >
                  <Col
                    xs={24}
                    sm={24}
                    md={18}
                    lg={18}
                    className="shipping-container"
                  >
                    <Row>
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
                      <Col
                        xs={4}
                        sm={4}
                        md={4}
                        lg={4}
                        className="qa-txt-alg-rgt"
                      >
                        {props.order.shippingMode == "AIR" ? (
                          <Icon
                            component={Air}
                            style={{
                              width: "28px",
                              height: "28px",
                              verticalAlign: "middle",
                            }}
                            className="air-icon"
                          />
                        ) : (
                          <Icon
                            component={Sea}
                            style={{
                              width: "28px",
                              height: "28px",
                              verticalAlign: "middle",
                            }}
                            className="air-icon"
                          />
                        )}
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
                          Estimated freight charges*
                        </span>
                      </Col>
                      <Col xs={9} sm={9} md={9} lg={9} className="qa-col-end">
                        <span className="qa-font-san qa-fw-b qa-fs-12 qa-tc-white qa-mar-top-04">
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
                    <Row>
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ).amount &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ).amount > 0 && (
                          <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                            <span
                              style={{
                                verticalAlign: "middle",
                                color: "#02873A",
                              }}
                              className={
                                mediaMatch.matches
                                  ? "qa-font-san qa-fs-14 qa-fw-b"
                                  : "qa-font-san qa-fs-14 qa-fw-b"
                              }
                            >
                              Shipping promotion applied{" "}
                            </span>
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
                          </Col>
                        )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ).amount &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "SELLER_DISCOUNT"
                        ).amount > 0 && (
                          <Col
                            xs={6}
                            sm={6}
                            md={6}
                            lg={8}
                            xl={8}
                            className="qa-col-end"
                          >
                            <span
                              className="qa-font-san qa-fw-b qa-fs-12"
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
                            </span>
                          </Col>
                        )}
                    </Row>

                    <Row>
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "PRODUCT_DISCOUNT"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "PRODUCT_DISCOUNT"
                        ).amount &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "PRODUCT_DISCOUNT"
                        ).amount > 0 && (
                          <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                            <span
                              style={{
                                verticalAlign: "middle",
                                color: "#02873A",
                              }}
                              className={
                                mediaMatch.matches
                                  ? "qa-font-san qa-fs-14 qa-fw-b"
                                  : "qa-font-san qa-fs-14 qa-fw-b"
                              }
                            >
                              Shipping promotion applied{" "}
                            </span>
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
                          </Col>
                        )}
                      {props.order &&
                        props.order.miscCharges &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "PRODUCT_DISCOUNT"
                        ) &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "PRODUCT_DISCOUNT"
                        ).amount &&
                        props.order.miscCharges.find(
                          (x) => x.chargeId === "PRODUCT_DISCOUNT"
                        ).amount > 0 && (
                          <Col
                            xs={6}
                            sm={6}
                            md={6}
                            lg={8}
                            xl={8}
                            className="qa-col-end"
                          >
                            <span
                              className="qa-font-san qa-fw-b qa-fs-12"
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
                                    (x) => x.chargeId === "PRODUCT_DISCOUNT"
                                  ) &&
                                  props.order.miscCharges.find(
                                    (x) => x.chargeId === "PRODUCT_DISCOUNT"
                                  ).amount) ||
                                  0
                              ).toFixed(2)}
                            </span>
                          </Col>
                        )}
                    </Row>

                    <Row>
                      {promoDiscount > 0 && (
                        <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                          <span
                            style={{ color: "#02873A" }}
                            className={
                              mediaMatch.matches
                                ? "qa-font-san qa-fs-14 qa-fw-b"
                                : "qa-font-san qa-fs-14 qa-fw-b"
                            }
                          >
                            {promoCode} discount applied
                          </span>
                        </Col>
                      )}
                      {promoDiscount > 0 && (
                        <Col
                          xs={6}
                          sm={6}
                          md={6}
                          lg={8}
                          xl={8}
                          className="qa-col-end"
                        >
                          <span
                            className="qa-font-san qa-fw-b qa-fs-12"
                            style={{ color: "#02873A" }}
                          >
                            -{" "}
                            {getSymbolFromCurrency(
                              props.order && props.order.currency
                            )}
                            {parseFloat(promoDiscount || 0).toFixed(2)}
                          </span>
                        </Col>
                      )}
                    </Row>
                    {/* <Row style={{ paddingTop: "10px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr
                          style={{ border: "1px dashed rgba(25, 25, 25, 0.6)" }}
                        />
                      </Col>
                    </Row> */}
                    {/* <Row style={{ paddingTop: "10px" }}>
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
                    </Row> */}
                    <Row style={{ paddingTop: "10px" }}>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={24}
                        className="qa-dashed-border"
                      ></Col>
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
                          Shipping lead time
                        </span>
                      </Col>
                      <Col xs={9} sm={9} md={9} lg={9} className="qa-col-end">
                        <span className="qa-font-san qa-fw-b qa-fs-12 qa-tc-white qa-mar-top-04">
                          {shippingMode === "AIR" ? (
                            <span>
                              {props.order &&
                                props.order.miscCharges &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "LEAD_TIME"
                                ) &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "LEAD_TIME"
                                ).amount - 3}
                            </span>
                          ) : (
                            <span>
                              {props.order &&
                                props.order.miscCharges &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "LEAD_TIME"
                                ) &&
                                props.order.miscCharges.find(
                                  (x) => x.chargeId === "LEAD_TIME"
                                ).amount - 7}
                            </span>
                          )}{" "}
                          -{" "}
                          {props.order &&
                            props.order.miscCharges &&
                            props.order.miscCharges.find(
                              (x) => x.chargeId === "LEAD_TIME"
                            ) &&
                            props.order.miscCharges.find(
                              (x) => x.chargeId === "LEAD_TIME"
                            ).amount}{" "}
                          days
                        </span>
                      </Col>
                    </Row>
                    {/* <Row style={{ paddingTop: "10px" }}>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <hr
                          style={{ border: "1px dashed rgba(25, 25, 25, 0.6)" }}
                        />
                      </Col>
                    </Row> */}
                    {/* <Row style={{ paddingTop: "10px" }}>
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
                 */}
                  </Col>
                </Row>
                <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-1 qa-font-san qa-border-bottom qa-pad-btm-3">
                  <b>*Note on freight, taxes & duties:</b> Freight, Taxes &
                  Duties mentioned on this page are estimates and exact amounts
                  are determined only after Customs Clearance. Any differential
                  amount is neither charged extra, nor refunded.{" "}
                  <Link href="/FAQforwholesalebuyers">
                    <a target="_blank">
                      <span className="qa-sm-color qa-cursor">Learn more</span>
                    </a>
                  </Link>
                </div>

                {mediaMatch.matches ? (
                  ""
                ) : (
                  <Row style={{ paddingTop: "30px" }}>
                    <Col xs={20} sm={20} md={20} lg={20}>
                      <span
                        className="qa-fs-17 qa-font-san qa-tc-white"
                        style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                      >
                        Payment term:
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} className="qa-col-end">
                      {showPayment ? (
                        <UpOutlined
                          onClick={() => handlePaymentDetails(false)}
                        />
                      ) : (
                        <DownOutlined
                          onClick={() => handlePaymentDetails(true)}
                        />
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

                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      className="qa-mar-top-15"
                      style={
                        showPayment ? { padding: "10px" } : { display: "none" }
                      }
                    >
                      <Row>
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          style={{ lineHeight: "110%" }}
                          className="qa-mar-btm-1"
                        >
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-blue qa-fw-b"
                                    : "qa-fs-14 qa-font-san qa-blue qa-fw-b"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                PAY NOW
                              </span>
                            </Col>
                            <Col
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              className="qa-txt-alg-rgt"
                            >
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-blue qa-fw-b"
                                    : "qa-fs-14 qa-font-san qa-blue qa-fw-b"
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
                          className="qa-mar-btm-1"
                        >
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-14 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                Pay on dispatch
                              </span>
                            </Col>
                            <Col
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              className="qa-txt-alg-rgt"
                            >
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-14 qa-font-san qa-tc-white"
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
                                    : "qa-fs-14 qa-font-san qa-tc-white"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                Pay on delivery
                              </span>
                            </Col>
                            <Col
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              className="qa-txt-alg-rgt"
                            >
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-tc-white"
                                    : "qa-fs-14 qa-font-san qa-tc-white"
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
                    {/* <Col xs={24} sm={24} md={24} lg={24}>
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
                    </Col> */}
                  </Row>
                )}

                {mediaMatch.matches ? (
                  <Row style={{ paddingTop: "20px" }}>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      className="qa-mar-btm-1"
                    >
                      <span
                        className="qa-fs-17 qa-font-san qa-tc-white"
                        style={{ lineHeight: "110%", letterSpacing: ".01em" }}
                      >
                        Payment term:
                      </span>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      className="payment-term shipping-container"
                    >
                      <Row>
                        <Col xs={24} sm={24} md={24} lg={24}>
                          <Row>
                            <Col xs={10} sm={10} md={10} lg={10}>
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-blue qa-fw-b"
                                    : "qa-fs-12 qa-font-san qa-blue qa-fw-b"
                                }
                                style={{
                                  lineHeight: "110%",
                                  letterSpacing: ".01em",
                                }}
                              >
                                PAY NOW
                              </span>
                            </Col>
                            <Col
                              xs={14}
                              sm={14}
                              md={14}
                              lg={14}
                              className="qa-txt-alg-rgt qa-pad-rgt-1"
                            >
                              <span
                                className={
                                  mediaMatch.matches
                                    ? "qa-fs-14 qa-font-san qa-blue qa-fw-b"
                                    : "qa-fs-12 qa-font-san qa-blue qa-fw-b"
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
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          className="qa-mar-top-1"
                        >
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
                                Pay on dispatch
                              </span>
                            </Col>
                            <Col
                              xs={14}
                              sm={14}
                              md={14}
                              lg={14}
                              className="qa-txt-alg-rgt qa-pad-rgt-1"
                            >
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
                        <Col
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          className="qa-mar-top-1"
                        >
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
                                Pay on delivery
                              </span>
                            </Col>
                            <Col
                              xs={14}
                              sm={14}
                              md={14}
                              lg={14}
                              className="qa-txt-alg-rgt qa-pad-rgt-1"
                            >
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
                        <Col xs={20} sm={19} md={19} lg={19}>
                          <div className="qa-font-san qa-tc-white qa-fs-12 qa-lh qa-mar-top-05">
                            Secure payment by credit cards and other payment
                            modes{" "}
                            <Link href="/FAQforwholesalebuyers">
                              <a target="_blank">
                                <span className="qa-sm-color qa-cursor qa-font-san qa-fs-12">
                                  Refer Payment FAQs
                                </span>
                              </a>
                            </Link>
                          </div>
                        </Col>
                        {/* <Col xs={4} sm={4} md={4} lg={4} className="qa-col-end">
                          <img
                            className="images"
                            src={process.env.NEXT_PUBLIC_URL + "/payapl.png"}
                          ></img>
                        </Col> */}
                      </Row>
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
                lg={12}
                xl={12}
                className="order-review-right"
              >
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
                        xs={2}
                        sm={2}
                        md={2}
                        lg={2}
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
                        xs={2}
                        sm={2}
                        md={2}
                        lg={2}
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
                <Row style={{ paddingTop: "10px" }}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    className="payment-term"
                    style={{ padding: "20px 20px 10px" }}
                  >
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <span
                          className="qa-font-butler qa-fs-20 qa-tc-white"
                          style={{ lineHeight: "38px", letterSpacing: ".01em" }}
                        >
                          Cart summary
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
                              ? "qa-font-san qa-tc-white qa-fs-14"
                              : "qa-font-san qa-tc-white qa-fs-14"
                          }
                        >
                          Estimated freight fees*
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
                              ? "qa-font-san qa-tc-white qa-fs-14"
                              : "qa-font-san qa-tc-white qa-fs-14"
                          }
                        >
                          {shippingTerms === "DDU"
                            ? "Customs duties excluded*"
                            : "Estimated customs & duties*"}
                          {shippingTerms === "DDU" && (
                            <div>
                              <Popover
                                placement="bottomRight"
                                content={dduContent}
                                trigger="click"
                                overlayClassName="price-breakup-popup"
                              >
                                <span
                                  className="qa-font-san qa-fs-14 qa-sm-color"
                                  style={{
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                >
                                  View estimates
                                </span>
                              </Popover>
                            </div>
                          )}
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
                        <span className="qa-font-san qa-tc-white qa-fs-14">
                          {shippingTerms === "DDU" ? (
                            "NA"
                          ) : (
                            <span className="qa-fw-b">
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
                          )}
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
                      <span className="qa-font-san qa-fw-b qa-fs-14" style={{ color: '#02873A' }}>
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
                    <Row>
                      <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                              : "qa-font-san qa-tc-white qa-fs-17 qa-fw-b"
                          }
                        >
                          SUBTOTAL
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
                        <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-17">
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
                                ) +
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
                              ? "qa-font-san qa-tc-white qa-fs-14"
                              : "qa-font-san qa-tc-white qa-fs-14"
                          }
                        >
                          {shippingTerms === "DDU"
                            ? "VAT/ GST / Taxes excluded*"
                            : "VAT/ GST / Taxes*"}
                        </span>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="qa-col-end qa-mar-top-1"
                      >
                        <span className="qa-font-san qa-tc-white qa-fs-14">
                          {shippingTerms === "DDU" ? (
                            "NA"
                          ) : (
                            <span className="qa-fw-b">
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
                          )}
                        </span>
                      </Col>
                      <Col xs={15} sm={15} md={15} lg={15}>
                        <div className="c-left-blk qa-font-san">
                          <div
                            className={
                              mediaMatch.matches
                                ? "qa-font-san qa-fs-14 qa-tc-white qa-lh"
                                : "qa-font-san qa-fs-14 qa-tc-white qa-lh"
                            }
                          >
                            Refundable for some countries like UK/AU.{" "}
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
                                className="qa-sm-color qa-cursor qa-font-san"
                              >
                                Learn more
                              </a>
                            </Link>
                          </div>
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
                                  ? "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                                  : "qa-font-san qa-tc-white qa-fs-14 qa-fw-b"
                              }
                              style={{ color: "#02873A" }}
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
                      <Col
                        xs={18}
                        sm={18}
                        md={18}
                        lg={16}
                        xl={16}
                        className="qa-pad-rgt-1"
                      >
                        <div
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b qa-lh"
                              : "qa-font-san qa-tc-white qa-fs-17 qa-fw-b qa-lh"
                          }
                        >
                          TOTAL ORDER VALUE{" "}
                          {(shippingTerms === "DDU" ||
                            shippingTerms === "DDP") && (
                            <span className="qa-fw-n qa-uppercase">
                              ({shippingTerms})
                            </span>
                          )}
                        </div>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="qa-col-end"
                      >
                        <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-17">
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

                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17 qa-fw-b qa-blue"
                              : "qa-font-san qa-tc-white qa-fs-17 qa-fw-b qa-blue"
                          }
                        >
                          PAY NOW
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
                        <span className="qa-font-san qa-tc-white qa-fw-b qa-fs-17 qa-blue">
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

                    <Row style={{ paddingTop: "10px" }}>
                      <Col xs={18} sm={18} md={18} lg={16} xl={16}>
                        <span
                          className={
                            mediaMatch.matches
                              ? "qa-font-san qa-tc-white qa-fs-17"
                              : "qa-font-san qa-tc-white qa-fs-17"
                          }
                        >
                          PAY LATER
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
                        <span className="qa-font-san qa-tc-white qa-fs-17">
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
                              ) -
                                parseFloat(
                                  props.order &&
                                    props.order.paymentTerms &&
                                    props.order.paymentTerms.find(
                                      (x) => x.chargeId === "ADVANCE"
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
                              ? "qa-font-san qa-fs-14 qa-sm-color qa-cursor"
                              : "qa-font-san qa-fs-12 qa-sm-color qa-cursor"
                          }
                        >
                          <span
                            onClick={(e) =>
                              downloadMedia(props.order.quotationMedia)
                            }
                          >
                            quotation and specification sheet,
                          </span>{" "}
                          <span onClick={(e) => downloadBuyerAgreement()}>
                            and the buyer agreement
                          </span>
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
                    <Row style={{ paddingTop: "10px" }}>
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
                            onButtonReady={() => {
                              setPaypalLoaded(true);
                            }}
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
                    {/* <Row style={{ paddingTop: "10px" }}>
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
                    </Row> */}
                  </Col>
                </Row>
                <Row style={{ paddingTop: "5px" }}>
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{ lineHeight: "110%" }}
                  >
                    <div
                      className="qa-font-san qa-fs-12 qa-tc-white qa-lh"
                      style={
                        mediaMatch.matches
                          ? { letterSpacing: ".01em", textAlign: "center" }
                          : { letterSpacing: ".01em", textAlign: "left" }
                      }
                    >
                      *This is an estimate, final invoice will be shared at the
                      time of shipping
                    </div>
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
              <Row style={{ marginTop: "20px" }}>
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
                                  Quality inspection,{" "}
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
                              Seller ID
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
                <Row style={{ marginTop: "20px" }}>
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
                <Row style={{ marginTop: "20px" }}>
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
                        {props.order && paypalLoaded && localeUpdated ? (
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
                    {/* <Row style={{ paddingTop: "10px" }}>
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
                    </Row> */}
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
