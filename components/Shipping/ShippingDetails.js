/** @format */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Row, Col, Modal, Form, Input, message, Radio } from "antd";
import Icon, {
  UpOutlined,
  DownOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import closeButton from "../../public/filestore/closeButton";
import CartSummary from "../Cart/CartSummary";
import cartIcon from "../../public/filestore/cartIcon";
import Spinner from "../Spinner/Spinner";
import Air from "../../public/filestore/air";
import Sea from "../../public/filestore/sea";
import _ from "lodash";
import PromotionCarousel from "../PromotionCarousel/PromotionCarousel";
import CheckoutSteps from "../common/CheckoutSteps";
import PaymentBanner from "../common/PaymentBanner";
import moment from "moment";

const LANDING_LIMITER = 2;

const ShippingDetails = (props) => {
  const router = useRouter();
  let {
    brandNames = "",
    currencyDetails = {},
    userProfile = {},
    appToken = "",
    airQuote = { ddp: {}, ddu: {} },
    seaQuote = { ddp: {}, ddu: {} },
  } = props;

  const [shippingModeModal, setShippingModeModal] = useState(false);
  const [enable, setEnable] = useState(false);
  const [mode, setMode] = useState("");
  const [showRow, setShowRow] = useState(true);
  const [airData, setAirData] = useState({ ddp: {}, ddu: {} });
  const [seaData, setSeaData] = useState({ ddp: {}, ddu: {} });
  const [cartData, setCartData] = useState(props.cart);
  const [isLoading, setLoading] = useState(true);
  const mediaMatch = window.matchMedia("(min-width: 1024px)");
  const [disablePayment, setPayment] = useState(false);
  const [mov, setMov] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponErr, setCouponErr] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [tat, setTat] = useState("");
  const [shippingTerm, setShippingTerm] = useState("ddu");
  const [shipTerm, setShipTerm] = useState("ddu");
  const [disableAir, setDisableAir] = useState(false);
  const [disableSea, setDisableSea] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [landingFactorShip, setLandingFactorShip] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    if (props.cart && Object.keys(props.cart).length) {
      let { cart = {} } = props || {};
      setCartData(cart);
    }
  }, [props.cart]);

  useEffect(() => {
    if (
      Object.keys(props.airQuote).length &&
      Object.keys(props.seaQuote).length
    ) {
      let {
        airQuote = { ddp: {}, ddu: {} },
        seaQuote = { ddp: {}, ddu: {} },
        cart = {},
      } = props || {};
      setAirData(airQuote);
      setSeaData(seaQuote);
      if (
        Object.keys(airQuote[shippingTerm]).length ||
        Object.keys(seaQuote[shippingTerm]).length
      ) {
        let { cart = "" } = props;
        let { subOrders = [], total = 0, shippingModesAvailable = [] } =
          cart || {};
        let landedPrice = false;
        if (subOrders && subOrders.length) {
          let totalAmount = 0;
          for (let sellers of subOrders) {
            let {
              products = "",
              qalaraSellerMargin = 0,
              basePrice = 0,
            } = sellers;
            for (let items of products) {
              let {
                quantity = 0,
                exfactoryListPrice = 0,
                productType = "",
                priceApplied = 0,
                freeShippingEligible = false,
              } = items;
              if (priceApplied && priceApplied !== null) {
                if (freeShippingEligible) landedPrice = true;
                basePrice = basePrice + priceApplied * quantity;
              } else {
                basePrice = basePrice + exfactoryListPrice * quantity;
              }

              if (productType === "ERTM") {
                setMov(true);
              }
            }
            totalAmount = totalAmount + basePrice;
          }
          let seaMax =
            seaQuote[shippingTerm]["dutyMax"] +
            seaQuote[shippingTerm]["frightCostMax"];
          let airMax =
            airQuote[shippingTerm]["dutyMax"] +
            airQuote[shippingTerm]["frightCostMax"];

          if (airMax > 0 && seaMax > 0) {
            let landingFactor = "";
            landingFactor =
              (total + (seaMax > airMax ? airMax : seaMax)) / totalAmount;

            setLandingFactorShip(landingFactor);

            if (landingFactor > LANDING_LIMITER) {
              console.log("Landing factor is ", landingFactor);
              setPayment(true);
              setLoading(false);
            } else {
              if (
                shippingModesAvailable.includes("Air") &&
                shippingModesAvailable.includes("Sea")
              ) {
                let mode = "AIR";
                if (seaMax < airMax) {
                  mode = "SEA";
                }
                selectMode(mode);
              } else if (shippingModesAvailable.includes("Air")) {
                selectMode("AIR");
              } else if (shippingModesAvailable.includes("Sea")) {
                selectMode("SEA");
              }
            }
          }

          if (!landedPrice) {
            let { frightCostMax: a_frieghtCost = 0 } =
              airQuote[shippingTerm] || {};
            let { frightCostMax: s_frieghtCost = 0 } =
              seaQuote[shippingTerm] || {};

            if (a_frieghtCost > 0 && s_frieghtCost > 0) {
              if (a_frieghtCost > s_frieghtCost) {
                let percentage =
                  ((a_frieghtCost - s_frieghtCost) / a_frieghtCost) * 100;
                if (percentage > 50) {
                  setDisableAir(true);
                }
              }

              if (s_frieghtCost > a_frieghtCost) {
                let percentage =
                  ((s_frieghtCost - a_frieghtCost) / s_frieghtCost) * 100;
                if (percentage > 50) {
                  setDisableSea(true);
                }
              }
            }
          }

          let a_result = Object.values(airQuote[shippingTerm]).every(
            (o) => o === 0
          );
          let s_result = Object.values(seaQuote[shippingTerm]).every(
            (o) => o === 0
          );

          if (a_result) {
            setDisableAir(a_result);
          }
          if (s_result) {
            setDisableSea(s_result);
          }

          if (a_result && s_result) {
            setPayment(true);
            setLoading(false);
          }

          let result =
            airQuote[shippingTerm]["tat"] === 0 &&
            seaQuote[shippingTerm]["tat"] === 0;
          if (result) {
            setPayment(true);
            setLoading(false);
          }
        }
      } else {
        let result =
          Object.values(airQuote[shippingTerm]).every((o) => o === 0) &&
          Object.values(seaQuote[shippingTerm]).every((o) => o === 0);
        if (result) {
          setPayment(true);
        }
      }
    }
  }, [props.airQuote, props.seaQuote]);

  const checkCommitStatus = () => {
    let cartId = orderId || subOrders.length > 0 ? subOrders[0]["orderId"] : "";
    let url = `${
      process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL
    }/orders/my/${cartId}/checkout/?mode=${mode}&promoCode=${couponCode}&promoDiscount=${couponDiscount}&tat=${tat}&shippingTerms=${shippingTerm.toUpperCase()}`;

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + appToken,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((result) => {
        let { status = "" } = result;
        if (status === "COMMITTED") {
          let url = "/payment";
          router.push(url);
        } else {
          console.log("Not shippable");
          // setNonShippable(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCouponCode = (e) => {
    let value = e.target.value.trim();
    if (value.length > 0) {
      setCouponErr(false);
    } else {
      setCouponErr(true);
    }
    setCouponCode(value);
  };

  let {
    subOrders = [],
    orderId = "",
    referralCode = "",
    shippingModesAvailable = [],
  } = cartData || {};
  let { shippingAddressDetails = "" } = props.cart || {};
  let {
    fullName = "",
    addressLine1 = "",
    addressLine2 = "",
    city = "",
    country = "",
    state = "",
    zipCode = "",
    phoneNumber = "",
  } = shippingAddressDetails || {};

  let shippingAddr = "";
  shippingAddr =
    fullName +
    ", " +
    addressLine1 +
    ", " +
    addressLine2 +
    ", " +
    city +
    ", " +
    state +
    ", " +
    country +
    ", " +
    zipCode +
    ", " +
    phoneNumber;

  let { priceQuoteRef = "", country: s_country = "", postalCode = "" } =
    props.cart || {};

  let allOrders = [];
  for (let orders of subOrders) {
    let orderObj = {};
    let {
      products = [],
      sellerCode = "",
      id = "",
      orderId = "",
      status = "",
      smallBatchesAvailable = "",
    } = orders || {};
    orderObj["id"] = id;
    orderObj["orderId"] = orderId;
    orderObj["status"] = status;
    orderObj["sellerCode"] = sellerCode;
    orderObj["smallBatchesAvailable"] = smallBatchesAvailable;
    let allProducts = [];
    for (let product of products) {
      let productObj = {};
      let {
        articleId = "",
        quantity = "",
        isSampleDeliveryRequired = "",
        isQualityTestingRequired = "",
        image = "",
      } = product || {};
      productObj["image"] = image;
      productObj["articleId"] = articleId;
      productObj["quantity"] = quantity;
      productObj["isSampleDeliveryRequired"] = isSampleDeliveryRequired;
      productObj["isQualityTestingRequired"] = isQualityTestingRequired;
      allProducts.push(productObj);
    }
    orderObj["products"] = allProducts;
    allOrders.push(orderObj);
  }

  const applyCoupon = () => {
    let data = {
      postalCode: postalCode,
      country: s_country,
      shippingMode: mode || "DEFAULT",
      shippingTerms: shippingTerm.toUpperCase(),
      referralCode: referralCode,
      promoDiscount: promoDiscount,
      promoCode: couponCode,
      subOrders: allOrders,
    };
    if (couponApplied) {
      data["promoCode"] = "";
      setCouponCode("");
    }
    if (couponCode.length > 0 || couponApplied) {
      applyCouponAPI(data, couponApplied);
      setCouponErr(false);
    } else {
      setCouponErr(true);
    }
  };

  const applyCouponAPI = (data, couponApplied = "") => {
    setBtnLoading(true);
    let cartId = orderId || subOrders.length > 0 ? subOrders[0]["orderId"] : "";

    let couponUrl = "";
    if (!couponApplied) {
      couponUrl = `${
        process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL
      }/orders/my/${cartId}/${mode}?shippingTerms=${shippingTerm.toUpperCase()}&promoCode=${couponCode}&promoDiscount=${couponDiscount}`;
    } else {
      couponUrl = `${
        process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL
      }/orders/my/${cartId}/${mode}?shippingTerms=${shippingTerm.toUpperCase()}&promoCode=&promoDiscount=0`;
    }

    fetch(couponUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + appToken,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((result) => {
        let { promoMessage = "", promoDiscount = "" } = result || {};
        setPromoDiscount(promoDiscount);
        if (promoDiscount === 0) {
          if (!couponApplied) {
            message.error(promoMessage, 5);
          }
          setPromoMessage(promoMessage);
        } else {
          setPromoMessage("");
          if (!couponApplied) {
            message.success(promoMessage, 5);
          }
        }
        setCartData(result);
        if (couponApplied === true) {
          setCouponApplied(false);
          message.success("Coupon removed", 5);
        } else if (couponApplied === false) {
          setCouponApplied(true);
        }
        setBtnLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setBtnLoading(false);
      });
  };

  let { convertToCurrency = "" } = currencyDetails || {};

  const getConvertedCurrency = (baseAmount, round = false) => {
    let { convertToCurrency = "", rates = [] } = props.currencyDetails;
    if (round) {
      return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(
        0
      );
    }
    return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(2);
  };

  const handleCancel = () => {
    setShippingModeModal(false);
  };

  const selectShippingMode = (mode, term = shippingTerm) => {
    if (mode) {
      let cartId =
        orderId || subOrders.length > 0 ? subOrders[0]["orderId"] : "";
      fetch(
        `${
          process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL
        }/orders/my/${cartId}/${mode}?shippingTerms=${term.toUpperCase()}&promoCode=${couponCode}&promoDiscount=${couponDiscount}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + appToken,
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw res.statusText || "Error while sending e-mail.";
          }
        })
        .then((result) => {
          setCartData(result);
          if (mode === "AIR") {
            let { tat = 0 } = airQuote[shippingTerm] || {};
            setTat(tat);
          } else {
            let { tat = 0 } = seaQuote[shippingTerm] || {};
            setTat(tat);
          }
          let { miscCharges = [], promoDiscount = 0 } = result || {};
          let discount = 0;
          if (miscCharges.length) {
            discount = miscCharges.find((x) => x.chargeId === "DISCOUNT")
              ? miscCharges.find((x) => x.chargeId === "DISCOUNT")["amount"]
              : 0;
          }
          setCouponDiscount(discount);
          setPromoDiscount(promoDiscount);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const selectMode = (mode) => {
    setMode(mode);
    if (!mode) {
      setEnable(false);
    } else {
      setEnable(true);
    }
    selectShippingMode(mode);
  };

  let today = new Date();
  let deliveryDateMin = new Date();
  let deliveryDateMax = new Date();

  let eddMin = "";
  let eddMax = "";
  if (mov) {
    eddMin = deliveryDateMin.setDate(today.getDate() + 30 + tat);
    eddMax = deliveryDateMax.setDate(today.getDate() + 40 + tat);
  } else {
    eddMin = deliveryDateMin.setDate(today.getDate() + 7 + tat);
    eddMax = deliveryDateMax.setDate(today.getDate() + 10 + tat);
  }

  deliveryDateMin = new Date(eddMin);
  deliveryDateMax = new Date(eddMax);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Row id="cart-details" className="cart-section qa-font-san">
      <CheckoutSteps pageId="shipping" />
      {mediaMatch.matches && <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>}
      {mediaMatch.matches && (
        <Col xs={0} sm={0} md={20} lg={20} xl={20}>
          <Row>
            {/* <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="cart-title qa-mar-btm-2"
            >
              Shipping
            </Col> */}
            <PromotionCarousel />
            <Col
              xs={24}
              sm={24}
              md={15}
              lg={15}
              xl={15}
              className="shipping-section"
            >
              <div className="qa-tc-white qa-mar-btm-2 cart-ship-pt qa-border-bottom">
                <div className="qa-fw-b qa-mar-btm-05">Shipping to:</div>
                <div>{shippingAddr}</div>
              </div>
              <div className="cart-title qa-mar-btm-2 qa-cursor sen-font font-size-17">
                Select shipping term:{" "}
              </div>
              <div>
                <Radio.Group
                  onChange={(e) => {
                    setShippingModeModal(true);
                    setShipTerm(e.target.value);
                  }}
                  value={shippingTerm}
                >
                  <Radio value="ddp" className="qa-disp-ib">
                    <span
                      className={
                        shippingTerm === "ddp"
                          ? "cart-prod-title qa-mar-btm-05 qa-fw-b"
                          : "cart-prod-title qa-mar-btm-05"
                      }
                    >
                      DDP (Delivered Duty Paid)
                    </span>
                  </Radio>
                  <div className="shipment-term-subtitle qa-mar-btm-15">
                    Any applicable duties and taxes are estimated and charged to
                    you by Qalara and paid during customs clearance on your
                    behalf.{" "}
                    <Link href="/FAQforwholesalebuyers">
                      <a target="_blank">
                        <span className="qa-sm-color qa-cursor">Know more</span>
                      </a>
                    </Link>
                  </div>
                  <Radio value="ddu" className="qa-disp-ib">
                    <span
                      className={
                        shippingTerm === "ddu"
                          ? "cart-prod-title qa-mar-btm-05 qa-fw-b"
                          : "cart-prod-title qa-mar-btm-05"
                      }
                    >
                      DDU (Delivered Duty Unpaid)
                    </span>
                  </Radio>
                  <div className="shipment-term-subtitle qa-mar-btm-2">
                    Any applicable duties and taxes are paid directly by you to
                    the freight/logistics partner during customs clearance or
                    delivery as applicable.{" "}
                    <Link href="/FAQforwholesalebuyers">
                      <a target="_blank">
                        <span className="qa-sm-color qa-cursor">Know more</span>
                      </a>
                    </Link>
                  </div>
                </Radio.Group>
              </div>
              <div className="cart-title qa-mar-btm-2 qa-cursor sen-font font-size-17">
                Select shipping mode:{" "}
              </div>
              <div className="qa-pad-1 c-item-list">
                {disablePayment ? (
                  <Row>
                    <Col span={24}>
                      <div className="qa-bg-light-theme qa-pad-2 qa-mar-1 qa-no-ship">
                        We will need to generate a custom freight quotation for
                        this. Please click on <b>'Order Quote Request'</b> and
                        we will revert with the best freight rates from our
                        delivery partners.
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Radio.Group
                    onChange={(e) => {
                      selectMode(e.target.value);
                    }}
                    value={mode}
                    style={{ width: "100%" }}
                  >
                    <Row>
                      {!disableAir && shippingModesAvailable.includes("Air") && (
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div
                            className={`${
                              mode === "AIR" ? "selected" : ""
                            } qa-bg-light-theme qa-pad-2 qa-mar-1 qa-box-shadow shipping-mode-section`}
                          >
                            <div className="qa-pad-btm-15 qa-border-bottom">
                              <span>
                                <Radio className="check-box-tnc" value="AIR">
                                  <span className="qa-tc-white qa-font-san">
                                    Air
                                  </span>
                                </Radio>
                              </span>
                              <span style={{ float: "right" }}>
                                <Icon
                                  component={Air}
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    verticalAlign: "middle",
                                  }}
                                  className="air-icon"
                                />
                              </span>
                            </div>
                            <div className="qa-pad-015 qa-dashed-border">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Estimated freight fee*
                                </div>
                              </div>
                              <div className="c-right-blk qa-txt-alg-lft">
                                <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                                  {airData && airData[shippingTerm] ? (
                                    <span>
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {airData[shippingTerm]["frightCostMin"]
                                        ? getConvertedCurrency(
                                            airData[shippingTerm][
                                              "frightCostMin"
                                            ],
                                            true
                                          )
                                        : "0"}
                                      -
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {airData[shippingTerm]["frightCostMax"]
                                        ? getConvertedCurrency(
                                            airData[shippingTerm][
                                              "frightCostMax"
                                            ],
                                            true
                                          )
                                        : "0"}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="qa-pad-015 qa-dashed-border">
                            <div className="c-left-blk qa-txt-alg-lft">
                              <div className="cart-info-text">
                                Estimated custom duties
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-title qa-txt-alg-rgt">
                                {airData ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {airData[shippingTerm]["dutyMin"]
                                      ? getConvertedCurrency(
                                          airData[shippingTerm]["dutyMin"],
                                          true
                                        )
                                      : "0"}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {airData[shippingTerm]["dutyMax"]
                                      ? getConvertedCurrency(
                                          airData[shippingTerm]["dutyMax"],
                                          true
                                        )
                                      : "0"}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </div>
                          </div>
                           */}
                            <div className="qa-mar-top-15">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Shipping lead time
                                </div>
                              </div>
                              <div className="c-right-blk">
                                <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                                  {airData && airData[shippingTerm] ? (
                                    <span>
                                      {airData[shippingTerm]["tat"]
                                        ? airData[shippingTerm]["tat"] - 3
                                        : "0"}
                                      -
                                      {airData[shippingTerm]["tat"]
                                        ? airData[shippingTerm]["tat"]
                                        : "0"}{" "}
                                      days
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="qa-pad-015">
                            <div className="c-left-blk">
                              <div className="qa-fw-b qa-fr-color">
                                Total estimated charges
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-name qa-txt-alg-rgt">
                                {airData && airData[shippingTerm] &&
                                airData[shippingTerm]["frightCostMin"] !== undefined &&
                                airData[shippingTerm]["dutyMin"] !== undefined ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(
                                      airData[shippingTerm]["frightCostMin"] +
                                        airData[shippingTerm]["dutyMin"],
                                      true
                                    )}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(
                                      airData[shippingTerm]["frightCostMax"] +
                                        airData[shippingTerm]["dutyMax"],
                                      true
                                    )}
                                  </span>
                                ) : (
                                  "0"
                                )}
                                *
                              </div>
                            </div>
                          </div>
                        */}
                          </div>
                        </Col>
                      )}
                      {!disableSea && shippingModesAvailable.includes("Sea") && (
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div
                            className={`${
                              mode === "SEA" ? "selected" : ""
                            } qa-bg-light-theme qa-pad-2 qa-mar-1 qa-box-shadow shipping-mode-section`}
                          >
                            <div className="qa-pad-btm-15 qa-border-bottom">
                              <span>
                                <Radio className="check-box-tnc" value="SEA">
                                  <span className="qa-tc-white qa-font-san">
                                    Sea
                                  </span>
                                </Radio>
                              </span>
                              <span style={{ float: "right" }}>
                                <Icon
                                  component={Sea}
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    verticalAlign: "middle",
                                  }}
                                  className="air-icon"
                                />
                              </span>
                            </div>
                            <div className="qa-pad-015 qa-dashed-border">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Estimated freight fee*
                                </div>
                              </div>
                              <div className="c-right-blk qa-txt-alg-lft">
                                <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                                  {seaData && seaData[shippingTerm] ? (
                                    <span>
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {seaData[shippingTerm]["frightCostMin"]
                                        ? getConvertedCurrency(
                                            seaData[shippingTerm][
                                              "frightCostMin"
                                            ],
                                            true
                                          )
                                        : "0"}
                                      -
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {seaData[shippingTerm]["frightCostMax"]
                                        ? getConvertedCurrency(
                                            seaData[shippingTerm][
                                              "frightCostMax"
                                            ],
                                            true
                                          )
                                        : "0"}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="qa-pad-015 qa-dashed-border">
                            <div className="c-left-blk qa-txt-alg-lft">
                              <div className="cart-info-text">
                                Estimated custom duties
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-title qa-txt-alg-rgt">
                                {seaData && seaData[shippingTerm] ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {seaData[shippingTerm]["dutyMin"]
                                      ? getConvertedCurrency(
                                          seaData[shippingTerm]["dutyMin"],
                                          true
                                        )
                                      : "0"}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {seaData[shippingTerm]["dutyMax"]
                                      ? getConvertedCurrency(
                                          seaData[shippingTerm]["dutyMax"],
                                          true
                                        )
                                      : "0"}
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </div>
                          </div>
                          */}
                            <div className="qa-mar-top-15">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Shipping lead time
                                </div>
                              </div>
                              <div className="c-right-blk">
                                <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                                  {seaData[shippingTerm]["tat"]
                                    ? seaData[shippingTerm]["tat"] - 7
                                    : "0"}
                                  -
                                  {seaData[shippingTerm]["tat"]
                                    ? seaData[shippingTerm]["tat"]
                                    : "0"}{" "}
                                  days
                                </div>
                              </div>
                            </div>
                            {/* <div className="qa-pad-015">
                            <div className="c-left-blk">
                              <div className="qa-fw-b qa-fr-color">
                                Total estimated charges
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-name qa-txt-alg-rgt">
                                {seaData && seaData[shippingTerm] &&
                                seaData[shippingTerm]["frightCostMin"] !== undefined &&
                                seaData[shippingTerm]["dutyMin"] !== undefined ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(
                                      seaData[shippingTerm]["frightCostMin"] +
                                        seaData[shippingTerm]["dutyMin"],
                                      true
                                    )}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(
                                      seaData[shippingTerm]["frightCostMax"] +
                                        seaData[shippingTerm]["dutyMax"],
                                      true
                                    )}
                                  </span>
                                ) : (
                                  "0"
                                )}
                                *
                              </div>
                            </div>
                          </div>
                        */}
                          </div>
                        </Col>
                      )}
                      {/* <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="qa-bg-light-theme qa-pad-2 qa-mar-1 qa-box-shadow shipping-mode-section">
                    <div className="qa-pad-btm-15 qa-border-bottom">
                      <span>
                        <span>
                          <svg
                            width="27"
                            height="18"
                            viewBox="0 0 27 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M25.9384 8.864C25.6795 7.8275 24.6563 7.2057 23.6702 7.4907L17.1243 9.3304L8.6184 1L6.23916 1.66073L11.3427 10.9498L5.21598 12.6729L2.78748 10.6777L1 11.183L4.19281 17C4.19281 17 12.9699 14.5385 24.6194 11.2607C25.6179 10.9628 26.1973 9.9004 25.9384 8.864Z"
                              stroke="#332F2F"
                            />
                          </svg>
                        </span>
                        <span className="p-shipBy">Air Express</span>
                      </span>
                      <span style={{ float: "right" }}>
                        <Radio className="check-box-tnc"></Radio>{" "}
                      </span>
                    </div>
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">
                          Estimated freight fee*
                        </div>
                      </div>
                      <div className="c-right-blk qa-txt-alg-lft">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                          $100-$120
                        </div>
                      </div>
                    </div>
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">
                          Estimated custom duties
                        </div>
                      </div>
                      <div className="c-right-blk">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                          $20-$40
                        </div>
                      </div>
                    </div>
                    <div className="qa-mar-top-15">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">Shipping lead time</div>
                      </div>
                      <div className="c-right-blk">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                          7 days
                        </div>
                      </div>
                    </div>
                    <div className="qa-pad-015">
                      <div className="c-left-blk">
                        <div className="qa-fw-b">Total estimated charges</div>
                      </div>
                      <div className="c-right-blk">
                        <div className="cart-prod-name qa-txt-alg-rgt">
                          $120-$160*
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
               */}
                    </Row>
                  </Radio.Group>
                )}
              </div>
              <div
                className={`qa-tc-white qa-fs-12 qa-lh qa-mar-top-1 ${
                  disableAir && !disablePayment ? "" : "qa-mar-btm-2"
                }`}
              >
                <b>*Note on freight, taxes & duties:</b> Freight, Taxes & Duties
                mentioned on this page are estimates and exact amounts are
                determined only after Customs Clearance. Any differential amount
                is neither charged extra, nor refunded.{" "}
                <Link href="/FAQforwholesalebuyers">
                  <a target="_blank">
                    <span className="qa-sm-color qa-cursor">Learn more</span>
                  </a>
                </Link>
              </div>

              {disableAir && !disablePayment && (
                <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-btm-2">
                  *Above freight fee is for the lowest cost shipping mode (sea)
                  for your current order. If you want air shipping please write
                  to us at buyers@qalara.com, and we can generate the air quote
                  based on your current cart/order information.
                </div>
              )}
              {!disablePayment && (
                <Row className="qa-mar-btm-2">
                  <Col span={19}>
                    <div className="cart-title qa-mar-btm-1 qa-cursor sen-font font-size-17">
                      <div className="c-left-blk qa-txt-alg-lft font-size-17">
                        Estimated delivery date:
                      </div>
                      <div className="c-right-blk qa-txt-alg-rgt font-size-17 qa-success qa-fw-b">
                        {tat && mode ? (
                          <span>
                            {moment(deliveryDateMin).format("DD MMM YY")} -{" "}
                            {moment(deliveryDateMax).format("DD MMM YY")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                          <li>Estimated production/ dispatch time</li>
                        </div>
                        <div className="c-right-blk qa-txt-alg-rgt">
                          {mov ? "30-40" : "7-10"} days
                        </div>
                      </div>
                      <div>
                        <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                          <li>Estimated shipping lead time</li>
                        </div>
                        <div className="c-right-blk qa-txt-alg-rgt">
                          {tat && mode ? (
                            <span>
                              {tat - (mode === "AIR" ? 3 : 7)}-{tat} days
                            </span>
                          ) : (
                            "-"
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col span={5}></Col>
                  <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-1">
                    *Lead times are running slightly longer owing to the
                    uncertainty related to the pandemic. In case of unforeseen
                    delays, we will keep you updated till delivery.
                  </div>
                </Row>
              )}
              <Row>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  className="cart-title qa-mar-btm-2 qa-cursor sen-font font-size-17"
                  onClick={() => setShowRow(!showRow)}
                >
                  Shopping cart
                  <span style={{ float: "right" }}>
                    {showRow ? (
                      <UpOutlined style={{ fontSize: "12px" }} />
                    ) : (
                      <DownOutlined style={{ fontSize: "12px" }} />
                    )}
                  </span>
                </Col>
                {showRow && (
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="qa-pad-2 c-item-list qa-mar-btm-4">
                      {_.map(subOrders, (order, i) => {
                        let { products = "", sellerCode = "" } = order;
                        let totalSellerAmount = 0;
                        let basePrice = 0;
                        let samplePrice = 0;
                        let testingPrice = 0;
                        for (let product of products) {
                          let {
                            productType = "",
                            priceApplied = 0,
                            exfactoryListPrice = 0,
                            quantity = 0,
                            sampleCost = 0,
                            qualityTestingCharge = 0,
                          } = product || {};

                          samplePrice =
                            samplePrice +
                            parseFloat(getConvertedCurrency(sampleCost));
                          testingPrice =
                            testingPrice +
                            parseFloat(
                              getConvertedCurrency(qualityTestingCharge)
                            );

                          if (priceApplied && priceApplied !== null) {
                            basePrice =
                              basePrice +
                              parseFloat(getConvertedCurrency(priceApplied)) *
                                quantity;
                          } else {
                            basePrice =
                              basePrice +
                              parseFloat(
                                getConvertedCurrency(exfactoryListPrice)
                              ) *
                                quantity;
                          }
                          totalSellerAmount =
                            basePrice + samplePrice + testingPrice;
                        }
                        return (
                          <div
                            className={`qa-bg-light-theme qa-pad-3 ${
                              i < subOrders.length - 1 ? "qa-mar-btm-2" : ""
                            }`}
                            key={i}
                          >
                            <div className="cart-ship-pt qa-border-bottom">
                              <div className="qa-disp-table-cell">
                                <Icon
                                  component={cartIcon}
                                  className="cart-icon"
                                  style={{
                                    width: "20px",
                                    verticalAlign: "middle",
                                    marginRight: "8px",
                                  }}
                                />
                              </div>
                              <div className="qa-disp-table-cell">
                                <span style={{ fontSize: "17px" }}>
                                  Seller ID: {sellerCode}
                                </span>
                              </div>
                            </div>

                            {_.map(products, (product, j) => {
                              let {
                                articleId = "",
                                color = "",
                                image = "",
                                isQualityTestingRequired = "",
                                isSampleDeliveryRequired = "",
                                minimumOrderQuantity = "",
                                unitOfMeasure = "",
                                productName = "",
                                quantity = "",
                                size = "",
                                freeShippingEligible = false,
                                exfactoryListPrice = 0,
                                priceApplied = 0,
                                qualityTestingCharge = 0,
                                sampleCost = 0,
                              } = product;

                              let totalProductAmount = 0;
                              let basePrice = 0;
                              let samplePrice = 0;
                              let testingPrice = 0;

                              quantity = parseInt(quantity);
                              minimumOrderQuantity = parseInt(
                                minimumOrderQuantity
                              );

                              samplePrice =
                                samplePrice +
                                parseFloat(getConvertedCurrency(sampleCost));
                              testingPrice =
                                testingPrice +
                                parseFloat(
                                  getConvertedCurrency(qualityTestingCharge)
                                );

                              if (priceApplied && priceApplied !== null) {
                                basePrice =
                                  basePrice +
                                  parseFloat(
                                    getConvertedCurrency(priceApplied)
                                  ) *
                                    quantity;
                              } else {
                                basePrice =
                                  basePrice +
                                  parseFloat(
                                    getConvertedCurrency(exfactoryListPrice)
                                  ) *
                                    quantity;
                              }

                              totalProductAmount =
                                basePrice + samplePrice + testingPrice;

                              return (
                                <Row className="qa-pad-20-0" key={j}>
                                  <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                    <div className="aspect-ratio-box">
                                      <img
                                        className="images"
                                        src={image}
                                        alt="Cart item"
                                      ></img>
                                    </div>
                                  </Col>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={9}
                                    lg={9}
                                    xl={9}
                                    className="qa-pad-0-10"
                                  >
                                    <div className="cart-prod-title qa-text-2line">
                                      {productName}
                                    </div>
                                    <div className="cart-prod-title">
                                      Item ID - {articleId}
                                    </div>
                                    <div className="cart-subtitle">{color}</div>
                                    <div className="cart-subtitle">{size}</div>
                                    <div className="cart-prod-title qa-mar-top-1">
                                      Units: {quantity} {unitOfMeasure}
                                    </div>
                                    {/* {isFulfillable === false && (
                                      <div className="cart-sub-text p-out-of-stock qa-mar-top-05">
                                        This product is currently out of stock
                                      </div>
                                    )} */}
                                  </Col>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={9}
                                    lg={9}
                                    xl={9}
                                    className="qa-mar-top-15"
                                  >
                                    <div className="qa-txt-alg-rgt">
                                      {isQualityTestingRequired && (
                                        <div className="cart-subtitle qa-mar-btm-05">
                                          <CheckCircleOutlined /> Quality
                                          testing
                                        </div>
                                      )}
                                      {isSampleDeliveryRequired && (
                                        <div className="cart-subtitle qa-mar-btm-2">
                                          <CheckCircleOutlined /> Sample
                                          required
                                        </div>
                                      )}
                                      <div className="cart-prod-title qa-fw-b">
                                        {getSymbolFromCurrency(
                                          convertToCurrency
                                        )}
                                        {totalProductAmount
                                          ? parseFloat(
                                              totalProductAmount
                                            ).toFixed(2)
                                          : ""}
                                      </div>
                                      {!freeShippingEligible && (
                                        <div className="cart-price-text">
                                          Base price per unit excl. margin and
                                          other charges
                                        </div>
                                      )}
                                      {freeShippingEligible && (
                                        <div className="qa-offer-text qa-mar-top-15">
                                          FREE shipping
                                        </div>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              );
                            })}
                            <Row className="qa-pad-20-0">
                              <Col
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                                className="cart-prod-title qa-fw-b"
                              >
                                SELLER CART VALUE
                              </Col>
                              <Col
                                xs={12}
                                sm={12}
                                md={12}
                                lg={12}
                                xl={12}
                                className="qa-txt-alg-rgt cart-prod-title qa-fw-b"
                              >
                                {getSymbolFromCurrency(convertToCurrency)}
                                {totalSellerAmount
                                  ? parseFloat(totalSellerAmount).toFixed(2)
                                  : ""}
                              </Col>
                            </Row>
                          </div>
                        );
                      })}
                    </div>
                  </Col>
                )}
              </Row>
            </Col>
            <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              {/* {isFulfillable === false && (
                <div className="qa-pad-2 qa-mar-btm-2 cart-error-block display-flex cart-err">
                  <div className="margin-right-2p">
                    <Icon
                      component={alertIcon}
                      className="alert-icon"
                      style={{
                        width: "15px",
                        verticalAlign: "top",
                      }}
                    />
                  </div>
                  Please move out of stock products in order to proceed
                </div>
              )} */}
              <PaymentBanner />
              <div className="qa-pad-0-20 qa-mar-btm-2 cart-price-block qa-font-san">
                <div className="qa-mar-top-05 cart-price-title qa-mar-btm-1">
                  Apply coupon
                </div>
                <Row className="qa-pad-btm-2">
                  <Col xs={16} sm={16} md={16} lg={16} xl={16}>
                    <Form.Item>
                      <Input
                        placeholder="Enter coupon code"
                        className="coupon-box qa-font-san qa-fs-14"
                        onChange={handleCouponCode}
                        value={couponCode}
                      />
                      {couponErr && (
                        <span className="qa-error qa-font-san qa-fs-12">
                          Enter your coupon code
                        </span>
                      )}
                    </Form.Item>
                  </Col>
                  <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                    <Form.Item>
                      {mode ? (
                        <Button
                          className="qa-button coupon-btn"
                          onClick={applyCoupon}
                          disabled={btnLoading}
                        >
                          <span className="qa-font-san qa-fs-14">
                            {couponApplied ? "REMOVE" : "APPLY"}
                          </span>
                        </Button>
                      ) : (
                        <Button className="qa-button coupon-btn-inactive">
                          APPLY
                        </Button>
                      )}
                    </Form.Item>
                  </Col>
                  {couponApplied && promoMessage && (
                    <Col span={24}>
                      <div className="qa-error qa-font-san qa-lh qa-fs-12 qa-mar-top-05">
                        {promoMessage}
                      </div>
                    </Col>
                  )}
                  <Col span={24}>
                    <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 qa-txt-alg-cnt">
                      <span>*Select shipping mode to apply coupons</span>
                    </div>
                  </Col>
                </Row>
              </div>

              <CartSummary
                id="shipping"
                enable={enable}
                cart={cartData}
                brandNames={brandNames}
                currencyDetails={currencyDetails}
                user={userProfile}
                shippingMode={mode}
                disablePayment={disablePayment}
                tat={tat}
                shippingTerm={shippingTerm}
                rfqReason={`Landing factor : ${landingFactorShip}, TAT : ${tat}, Air freight charge ${
                  airData[shippingTerm]["frightCostMax"]
                    ? airData[shippingTerm]["frightCostMax"]
                    : "0"
                }: , Sea freight change : ${
                  seaData[shippingTerm]["frightCostMax"]
                    ? airData[shippingTerm]["frightCostMax"]
                    : "0"
                }`}
              />
            </Col>
          </Row>
        </Col>
      )}
      {mediaMatch.matches && <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>}
      {!mediaMatch.matches && (
        <div style={{ width: "100%" }}>
          <PromotionCarousel />
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="qa-pad-0-20">
            <Row className="shipping-section">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <PaymentBanner />
                <div className="qa-pad-0-20 qa-mar-btm-2 cart-price-block qa-font-san">
                  <div className="qa-mar-top-05 cart-price-title qa-mar-btm-1">
                    Apply coupon
                  </div>
                  <Row className="qa-pad-btm-2">
                    <Col xs={16} sm={16} md={16} lg={16} xl={16}>
                      <Form.Item>
                        <Input
                          placeholder="Enter coupon code"
                          className="coupon-box qa-font-san qa-fs-14"
                          onChange={handleCouponCode}
                          value={couponCode}
                        />
                        {couponErr && (
                          <span className="qa-error qa-font-san qa-fs-12">
                            Enter your coupon code
                          </span>
                        )}
                      </Form.Item>
                    </Col>
                    <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                      <Form.Item>
                        {mode ? (
                          <Button
                            className="qa-button coupon-btn"
                            onClick={applyCoupon}
                            disabled={btnLoading}
                          >
                            <span className="qa-font-san qa-fs-14">
                              {couponApplied ? "REMOVE" : "APPLY"}
                            </span>
                          </Button>
                        ) : (
                          <Button className="qa-button coupon-btn-inactive">
                            APPLY
                          </Button>
                        )}
                      </Form.Item>
                    </Col>
                    {couponApplied && promoMessage && (
                      <Col span={24}>
                        <div className="qa-lh qa-error qa-font-san qa-fs-12 qa-mar-top-05">
                          {promoMessage}
                        </div>
                      </Col>
                    )}
                    <Col span={24}>
                      <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 qa-txt-alg-cnt">
                        <span>*Select shipping mode to apply coupons</span>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className="qa-tc-white qa-mar-btm-2 cart-ship-pt">
                  <div className="qa-fw-b qa-mar-btm-05">Shipping to:</div>
                  <div className="">{shippingAddr}</div>
                </div>
                <div className="cart-ship-pt qa-border-bottom qa-fw-b font-bold qa-mar-btm-1">
                  Select shipping term:{" "}
                </div>
                <div>
                  <Radio.Group
                    onChange={(e) => {
                      setShippingModeModal(true);
                      setShipTerm(e.target.value);
                    }}
                    value={shippingTerm}
                  >
                    <Radio value="ddp" className="qa-disp-ib">
                      <span
                        className={
                          shippingTerm === "ddp"
                            ? "cart-prod-title qa-mar-btm-05 qa-fw-b"
                            : "cart-prod-title qa-mar-btm-05"
                        }
                      >
                        DDP (Delivered Duty Paid)
                      </span>
                    </Radio>
                    <div className="shipment-term-subtitle qa-mar-btm-15">
                      Any applicable duties and taxes are estimated and charged
                      to you by Qalara and paid during customs clearance on your
                      behalf.{" "}
                      <Link href="/FAQforwholesalebuyers">
                        <a target="_blank">
                          <span className="qa-sm-color qa-cursor">
                            Know more
                          </span>
                        </a>
                      </Link>
                    </div>
                    <Radio value="ddu" className="qa-disp-ib">
                      <span
                        className={
                          shippingTerm === "ddu"
                            ? "cart-prod-title qa-mar-btm-05 qa-fw-b"
                            : "cart-prod-title qa-mar-btm-05"
                        }
                      >
                        DDU (Delivered Duty Unpaid)
                      </span>
                    </Radio>
                    <div className="shipment-term-subtitle qa-mar-btm-2">
                      Any applicable duties and taxes are paid directly by you
                      to the freight/logistics partner during customs clearance
                      or delivery as applicable.{" "}
                      <Link href="/FAQforwholesalebuyers">
                        <a target="_blank">
                          <span className="qa-sm-color qa-cursor">
                            Know more
                          </span>
                        </a>
                      </Link>
                    </div>
                  </Radio.Group>
                </div>

                <div className="cart-ship-pt qa-border-bottom qa-fw-b font-bold">
                  Select shipping mode:
                </div>
                {disablePayment ? (
                  <div className="qa-pad-2 qa-ship-section qa-mar-top-2">
                    <div className="qa-no-ship">
                      We will need to generate a custom freight quotation for
                      this. Please click on <b>'Order Quote Request'</b> and we
                      will revert with the best freight rates from our delivery
                      partners.
                    </div>
                  </div>
                ) : (
                  <div className="qa-pad-top-2 qa-pad-btm-2 qa-horizontal-scroll">
                    <Radio.Group
                      onChange={(e) => {
                        selectMode(e.target.value);
                      }}
                      value={mode}
                      style={{ width: "100%" }}
                    >
                      {!disableAir && shippingModesAvailable.includes("Air") && (
                        <div
                          className="min-width-320px"
                          style={{
                            display: "inline-block",
                            marginRight: "20px",
                          }}
                        >
                          <div
                            className={`${
                              mode === "AIR" ? "selected" : ""
                            } qa-bg-light-theme qa-pad-2 qa-box-shadow shipping-mode-section`}
                          >
                            <div className="qa-pad-btm-15 qa-border-bottom">
                              <span>
                                <Radio className="check-box-tnc" value="AIR">
                                  <span className="qa-tc-white qa-font-san">
                                    Air
                                  </span>
                                </Radio>
                              </span>
                              <span style={{ float: "right" }}>
                                <Icon
                                  component={Air}
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    verticalAlign: "middle",
                                  }}
                                  className="air-icon"
                                />
                              </span>
                            </div>
                            <div className="qa-pad-015 qa-dashed-border">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Estimated freight fee*
                                </div>
                              </div>
                              <div className="c-right-blk qa-txt-alg-lft">
                                <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                                  {airData && airData[shippingTerm] ? (
                                    <span>
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {airData[shippingTerm]["frightCostMin"]
                                        ? getConvertedCurrency(
                                            airData[shippingTerm][
                                              "frightCostMin"
                                            ],
                                            true
                                          )
                                        : "0"}
                                      -
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {airData[shippingTerm]["frightCostMax"]
                                        ? getConvertedCurrency(
                                            airData[shippingTerm][
                                              "frightCostMax"
                                            ],
                                            true
                                          )
                                        : "0"}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="qa-pad-015 qa-dashed-border">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Estimated custom duties
                                </div>
                              </div>
                              <div className="c-right-blk">
                                <div className="cart-prod-title qa-txt-alg-rgt">
                                  {airData && airData[shippingTerm] ? (
                                    <span>
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {airData[shippingTerm]["dutyMin"]
                                        ? getConvertedCurrency(
                                            airData[shippingTerm]["dutyMin"],
                                            true
                                          )
                                        : "0"}
                                      -
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {airData[shippingTerm]["dutyMax"]
                                        ? getConvertedCurrency(
                                            airData[shippingTerm]["dutyMax"],
                                            true
                                          )
                                        : "0"}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </div>
                            </div>
                            */}
                            <div className="qa-mar-top-15">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Shipping lead time
                                </div>
                              </div>
                              <div className="c-right-blk">
                                <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                                  {airData && airData[shippingTerm] ? (
                                    <span>
                                      {airData[shippingTerm]["tat"]
                                        ? airData[shippingTerm]["tat"] - 3
                                        : "0"}
                                      -
                                      {airData[shippingTerm]["tat"]
                                        ? airData[shippingTerm]["tat"]
                                        : "0"}{" "}
                                      days
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="qa-pad-015">
                              <div className="c-left-blk">
                                <div className="qa-fw-b qa-fr-color">
                                  Total estimated charges
                                </div>
                              </div>
                              <div className="c-right-blk">
                                <div className="cart-prod-name qa-txt-alg-rgt">
                                  {airData &&
                                  airData[shippingTerm] &&
                                  airData[shippingTerm]["frightCostMin"] !==
                                    undefined &&
                                  airData[shippingTerm]["dutyMin"] !==
                                    undefined ? (
                                    <span>
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {getConvertedCurrency(
                                        airData[shippingTerm]["frightCostMin"] +
                                          airData[shippingTerm]["dutyMin"],
                                        true
                                      )}
                                      -
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {getConvertedCurrency(
                                        airData[shippingTerm]["frightCostMax"] +
                                          airData[shippingTerm]["dutyMax"],
                                        true
                                      )}
                                    </span>
                                  ) : (
                                    "0"
                                  )}
                                  *
                                </div>
                              </div>
                            </div>
                          */}
                          </div>
                        </div>
                      )}
                      {!disableSea && shippingModesAvailable.includes("Sea") && (
                        <div
                          className="min-width-320px"
                          style={{
                            display: "inline-block",
                            marginRight: "20px",
                          }}
                        >
                          <div
                            className={`${
                              mode === "SEA" ? "selected" : ""
                            } qa-bg-light-theme qa-pad-2 qa-box-shadow shipping-mode-section`}
                          >
                            <div className="qa-pad-btm-15 qa-border-bottom">
                              <span>
                                <Radio className="check-box-tnc" value="SEA">
                                  <span className="qa-tc-white qa-font-san">
                                    Sea
                                  </span>
                                </Radio>
                              </span>
                              <span style={{ float: "right" }}>
                                <Icon
                                  component={Sea}
                                  style={{
                                    width: "28px",
                                    height: "28px",
                                    verticalAlign: "middle",
                                  }}
                                  className="air-icon"
                                />
                              </span>
                            </div>
                            <div className="qa-pad-015 qa-dashed-border">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Estimated freight fee*
                                </div>
                              </div>
                              <div className="c-right-blk qa-txt-alg-lft">
                                <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                                  {seaData && seaData[shippingTerm] ? (
                                    <span>
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {seaData[shippingTerm]["frightCostMin"]
                                        ? getConvertedCurrency(
                                            seaData[shippingTerm][
                                              "frightCostMin"
                                            ],
                                            true
                                          )
                                        : "0"}
                                      -
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {seaData[shippingTerm]["frightCostMax"]
                                        ? getConvertedCurrency(
                                            seaData[shippingTerm][
                                              "frightCostMax"
                                            ],
                                            true
                                          )
                                        : "0"}
                                    </span>
                                  ) : (
                                    "0"
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="qa-pad-015 qa-dashed-border">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Estimated custom duties
                                </div>
                              </div>
                              <div className="c-right-blk">
                                <div className="cart-prod-title qa-txt-alg-rgt">
                                  {seaData && seaData[shippingTerm] ? (
                                    <span>
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {seaData[shippingTerm]["dutyMin"]
                                        ? getConvertedCurrency(
                                            seaData[shippingTerm]["dutyMin"],
                                            true
                                          )
                                        : "0"}
                                      -
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {seaData[shippingTerm]["dutyMax"]
                                        ? getConvertedCurrency(
                                            seaData[shippingTerm]["dutyMax"],
                                            true
                                          )
                                        : "0"}
                                    </span>
                                  ) : (
                                    "0"
                                  )}
                                </div>
                              </div>
                            </div>
                             */}
                            <div className="qa-mar-top-15">
                              <div className="c-left-blk qa-txt-alg-lft">
                                <div className="cart-info-text">
                                  Shipping lead time
                                </div>
                              </div>
                              <div className="c-right-blk">
                                <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                                  {seaData && seaData[shippingTerm] ? (
                                    <span>
                                      {seaData[shippingTerm]["tat"]
                                        ? seaData[shippingTerm]["tat"] - 7
                                        : "0"}
                                      -
                                      {seaData[shippingTerm]["tat"]
                                        ? seaData[shippingTerm]["tat"]
                                        : "0"}{" "}
                                      days
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </div>
                              </div>
                            </div>
                            {/* <div className="qa-pad-015">
                              <div className="c-left-blk">
                                <div className="qa-fw-b qa-fr-color">
                                  Total estimated charges
                                </div>
                              </div>
                              <div className="c-right-blk">
                                <div className="cart-prod-name qa-txt-alg-rgt">
                                  {seaData &&
                                  seaData[shippingTerm] &&
                                  seaData[shippingTerm]["frightCostMin"] !==
                                    undefined &&
                                  seaData[shippingTerm]["dutyMin"] !==
                                    undefined ? (
                                    <span>
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {getConvertedCurrency(
                                        seaData[shippingTerm]["frightCostMin"] +
                                          seaData[shippingTerm]["dutyMin"],
                                        true
                                      )}
                                      -
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {getConvertedCurrency(
                                        seaData[shippingTerm]["frightCostMax"] +
                                          seaData[shippingTerm]["dutyMax"],
                                        true
                                      )}
                                    </span>
                                  ) : (
                                    "0"
                                  )}
                                  *
                                </div>
                              </div>
                            </div>
                          */}
                          </div>
                        </div>
                      )}
                      {/* <div className="min-width-320px" style={{ display: "inline-block", marginRight: "20px" }}>
                <div className="qa-bg-dark-theme qa-pad-2 qa-box-shadow shipping-mode-section">
                  <div className="qa-pad-btm-15 qa-border-bottom">
                    <span>
                      <span>
                        <svg
                          width="27"
                          height="18"
                          viewBox="0 0 27 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M25.9384 8.864C25.6795 7.8275 24.6563 7.2057 23.6702 7.4907L17.1243 9.3304L8.6184 1L6.23916 1.66073L11.3427 10.9498L5.21598 12.6729L2.78748 10.6777L1 11.183L4.19281 17C4.19281 17 12.9699 14.5385 24.6194 11.2607C25.6179 10.9628 26.1973 9.9004 25.9384 8.864Z"
                            stroke="#332F2F"
                          />
                        </svg>
                      </span>
                      <span className="p-shipBy">Air Express</span>
                    </span>
                    <span style={{ float: "right" }}>
                      <Radio className="check-box-tnc"></Radio>{" "}
                    </span>
                  </div>
                  <div className="qa-pad-015 qa-dashed-border">
                    <div className="c-left-blk qa-txt-alg-lft">
                      <div className="cart-info-text">
                        Estimated freight fee*
                      </div>
                    </div>
                    <div className="c-right-blk qa-txt-alg-lft">
                      <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                        $100-$120
                      </div>
                    </div>
                  </div>
                  <div className="qa-pad-015 qa-dashed-border">
                    <div className="c-left-blk qa-txt-alg-lft">
                      <div className="cart-info-text">
                        Estimated custom duties
                      </div>
                    </div>
                    <div className="c-right-blk">
                      <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                        $20-$40
                      </div>
                    </div>
                  </div>
                  <div className="qa-mar-top-15">
                    <div className="c-left-blk qa-txt-alg-lft">
                      <div className="cart-info-text">Shipping lead time</div>
                    </div>
                    <div className="c-right-blk">
                      <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                        7 days
                      </div>
                    </div>
                  </div>
                  <div className="qa-pad-015">
                    <div className="c-left-blk">
                      <div className="qa-fw-b qa-dark-body">Total estimated charges</div>
                    </div>
                    <div className="c-right-blk">
                      <div className="cart-prod-name qa-txt-alg-rgt">
                        $120-$160*
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            */}
                    </Radio.Group>
                  </div>
                )}
                <div
                  className={`qa-tc-white qa-fs-12 qa-lh qa-mar-top-1 ${
                    disableAir && !disablePayment ? "" : "qa-mar-btm-3"
                  }`}
                >
                  <b>*Note on freight, taxes & duties:</b> Freight, Taxes &
                  Duties mentioned on this page are estimates and exact amounts
                  are determined only after Customs Clearance. Any differential
                  amount is neither charged extra, nor refunded.{" "}
                  <Link href="/FAQforwholesalebuyers">
                    <a target="_blank">
                      <span className="qa-sm-color qa-cursor">
                        Refer FAQs here
                      </span>
                    </a>
                  </Link>
                </div>

                {disableAir && !disablePayment && (
                  <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-btm-3">
                    *Above freight fee is for the lowest cost shipping mode
                    (sea) for your current order. If you want air shipping
                    please write to us at buyers@qalara.com, and we can generate
                    the air quote based on your current cart/order information.
                  </div>
                )}
                {!disablePayment && (
                  <div className="qa-mar-btm-3">
                    <div className="cart-ship-pt">
                      <div
                        className="qa-txt-alg-lft"
                        style={{
                          width: "45%",
                          display: "inline-block",
                          verticalAlign: "top",
                        }}
                      >
                        Estimated delivery date:
                      </div>
                      <div
                        className="qa-txt-alg-rgt qa-success qa-fw-b"
                        style={{
                          width: "55%",
                          display: "inline-block",
                          verticalAlign: "top",
                        }}
                      >
                        {tat && mode ? (
                          <span>
                            {moment(deliveryDateMin).format("DD MMM YY")} -{" "}
                            {moment(deliveryDateMax).format("DD MMM YY")}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="edd-section">
                      <div className="qa-fs-12 qa-mar-btm-1">
                        <li>
                          <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                            Estimated production/ dispatch time
                          </div>
                          <div className="c-right-blk qa-txt-alg-rgt">
                            {mov ? "30-40" : "7-10"} days
                          </div>
                        </li>
                      </div>

                      <div className="qa-fs-12 qa-mar-btm-1">
                        <li>
                          <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                            Estimated shipping lead time
                          </div>
                          <div className="c-right-blk qa-txt-alg-rgt">
                            {tat && mode ? (
                              <span>
                                {tat - (mode === "AIR" ? 3 : 7)}-{tat} days
                              </span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </li>
                      </div>
                    </div>
                    <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-1">
                      *Lead times are running slightly longer owing to the
                      uncertainty related to the pandemic. In case of unforeseen
                      delays, we will keep you updated till delivery.
                    </div>
                  </div>
                )}
              </Col>
              <div
                className="qa-disp-ib cart-prod-title qa-fw-b qa-pad-btm-1 qa-mar-btm-2 qa-border-bottom"
                onClick={() => setShowRow(!showRow)}
              >
                Order summary{" "}
                <span style={{ float: "right" }}>
                  {showRow ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>
              {showRow && (
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  className="qa-mar-btm-2"
                >
                  {/* {isFulfillable === false && (
                  <div className="qa-pad-2 qa-mar-btm-2 cart-error-block display-flex cart-err">
                    <div className="margin-right-2p">
                      <Icon
                        component={alertIcon}
                        className="alert-icon"
                        style={{
                          width: "15px",
                          verticalAlign: "top",
                        }}
                      />
                    </div>
                    Please move out of stock products in order to proceed
                  </div>
                )} */}

                  <CartSummary
                    id="shipping"
                    enable={enable}
                    cart={cartData}
                    brandNames={brandNames}
                    currencyDetails={currencyDetails}
                    shippingMode={mode}
                    user={userProfile}
                    disablePayment={disablePayment}
                    tat={tat}
                    shippingTerm={shippingTerm}
                    rfqReason={`Landing factor : ${landingFactorShip}, TAT : ${tat}, Air freight charge ${
                      airData[shippingTerm]["frightCostMax"]
                        ? airData[shippingTerm]["frightCostMax"]
                        : "0"
                    }: , Sea freight change : ${
                      seaData[shippingTerm]["frightCostMax"]
                        ? airData[shippingTerm]["frightCostMax"]
                        : "0"
                    }`}
                  />
                </Col>
              )}
            </Row>

            {showRow && (
              <div className="cart-prod-title sen-font qa-fw-b qa-pad-btm-1 qa-mar-btm-2 qa-border-bottom">
                Shopping cart
              </div>
            )}

            {showRow && (
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="qa-mar-btm-2">
                    {_.map(subOrders, (order, i) => {
                      let { products = "", sellerCode = "" } = order;
                      let totalSellerAmount = 0;
                      let basePrice = 0;
                      let samplePrice = 0;
                      let testingPrice = 0;
                      for (let product of products) {
                        let {
                          productType = "",
                          priceApplied = 0,
                          exfactoryListPrice = 0,
                          quantity = 0,
                          sampleCost = 0,
                          qualityTestingCharge = 0,
                        } = product || {};

                        samplePrice =
                          samplePrice +
                          parseFloat(getConvertedCurrency(sampleCost));
                        testingPrice =
                          testingPrice +
                          parseFloat(
                            getConvertedCurrency(qualityTestingCharge)
                          );

                        if (priceApplied && priceApplied !== null) {
                          basePrice =
                            basePrice +
                            parseFloat(getConvertedCurrency(priceApplied)) *
                              quantity;
                        } else {
                          basePrice =
                            basePrice +
                            parseFloat(
                              getConvertedCurrency(exfactoryListPrice)
                            ) *
                              quantity;
                        }
                        totalSellerAmount =
                          basePrice + samplePrice + testingPrice;
                      }
                      return (
                        <div className="qa-bg-light-theme qa-mar-btm-2" key={i}>
                          <div className="cart-ship-pt qa-border-bottom">
                            <Icon
                              component={cartIcon}
                              className="cart-icon qa-disp-tc"
                              style={{
                                width: "20px",
                                verticalAlign: "middle",
                                marginRight: "8px",
                              }}
                            />

                            <div className="qa-disp-tc">
                              Seller ID: {sellerCode}
                            </div>
                          </div>

                          {_.map(products, (product, j) => {
                            let {
                              articleId = "",
                              color = "",
                              image = "",
                              isQualityTestingRequired = "",
                              isSampleDeliveryRequired = "",
                              minimumOrderQuantity = "",
                              unitOfMeasure = "",
                              productName = "",
                              quantity = "",
                              size = "",
                              freeShippingEligible = false,
                              exfactoryListPrice = 0,
                              priceApplied = 0,
                              qualityTestingCharge = 0,
                              sampleCost = 0,
                            } = product;

                            let totalProductAmount = 0;
                            let basePrice = 0;
                            let samplePrice = 0;
                            let testingPrice = 0;

                            quantity = parseInt(quantity);
                            minimumOrderQuantity = parseInt(
                              minimumOrderQuantity
                            );

                            samplePrice =
                              samplePrice +
                              parseFloat(getConvertedCurrency(sampleCost));
                            testingPrice =
                              testingPrice +
                              parseFloat(
                                getConvertedCurrency(qualityTestingCharge)
                              );

                            if (priceApplied && priceApplied !== null) {
                              basePrice =
                                basePrice +
                                parseFloat(getConvertedCurrency(priceApplied)) *
                                  quantity;
                            } else {
                              basePrice =
                                basePrice +
                                parseFloat(
                                  getConvertedCurrency(exfactoryListPrice)
                                ) *
                                  quantity;
                            }

                            totalProductAmount =
                              basePrice + samplePrice + testingPrice;
                            return (
                              <Row className="qa-pad-20-0" key={j}>
                                <Col xs={9} sm={9} md={9} lg={9} xl={9}>
                                  <div className="aspect-ratio-box">
                                    <img
                                      className="images"
                                      src={image}
                                      alt="Cart item"
                                    ></img>
                                  </div>
                                </Col>
                                <Col
                                  xs={15}
                                  sm={15}
                                  md={15}
                                  lg={15}
                                  xl={15}
                                  className="qa-pad-0-10"
                                >
                                  <div className="cart-prod-title qa-text-2line">
                                    {productName}
                                  </div>
                                  <div className="cart-prod-title">
                                    Item ID - {articleId}
                                  </div>
                                  <div className="cart-subtitle">{color}</div>
                                  <div className="cart-subtitle">{size}</div>
                                  {isQualityTestingRequired && (
                                    <div className="cart-subtitle qa-mar-top-05">
                                      <CheckCircleOutlined /> Quality testing
                                    </div>
                                  )}
                                  {isSampleDeliveryRequired && (
                                    <div className="cart-subtitle">
                                      <CheckCircleOutlined /> Sample required
                                    </div>
                                  )}
                                  {freeShippingEligible && (
                                    <div className="qa-mar-top-1 qa-offer-text">
                                      FREE shipping
                                    </div>
                                  )}
                                  <div className="cart-prod-title qa-mar-top-1">
                                    Units: {quantity} {unitOfMeasure}
                                  </div>
                                  {/* {isFulfillable === false && (
                                    <div className="cart-sub-text p-out-of-stock qa-mar-top-05">
                                      This product is currently out of stock
                                    </div>
                                  )} */}
                                </Col>
                                <Col
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={24}
                                  xl={24}
                                  className="qa-mar-top-1"
                                >
                                  <div className="cart-prod-title qa-fw-b">
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {totalProductAmount
                                      ? parseFloat(totalProductAmount).toFixed(
                                          2
                                        )
                                      : ""}
                                  </div>
                                  {!freeShippingEligible && (
                                    <div className="cart-price-text">
                                      Base price per unit excl. margin and other
                                      charges
                                    </div>
                                  )}
                                </Col>
                              </Row>
                            );
                          })}
                          <Row className="qa-pad-top-2 qa-pad-btm-2">
                            <Col
                              xs={16}
                              sm={16}
                              md={16}
                              lg={16}
                              xl={16}
                              className="cart-prod-title qa-fw-b"
                            >
                              SELLER CART VALUE
                            </Col>
                            <Col
                              xs={8}
                              sm={8}
                              md={8}
                              lg={8}
                              xl={8}
                              className="qa-txt-alg-rgt cart-prod-title qa-fw-b"
                            >
                              {getSymbolFromCurrency(convertToCurrency)}
                              {totalSellerAmount
                                ? parseFloat(totalSellerAmount).toFixed(2)
                                : ""}
                            </Col>
                          </Row>
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    {enable ? (
                      <Button
                        onClick={checkCommitStatus}
                        disabled={disablePayment}
                        className="qa-button qa-fs-12 proceed-to-payment active"
                      >
                        Proceed to payment
                      </Button>
                    ) : (
                      <Button className="qa-button qa-fs-12 proceed-to-payment">
                        Proceed to payment
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            )}
          </Col>
        </div>
      )}
      <Modal
        visible={shippingModeModal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={600}
        style={{ top: 5 }}
        className="cart-delete-modal"
      >
        <div className="qa-rel-pos qa-font-san">
          <div className="qa-mar-btm-3 qa-txt-alg-lft" style={{ width: "90%" }}>
            <span className="qa-cursor sen-font qa-fs-18 qa-fw-b">
              PAYMENT MODE CONFIRMATION
            </span>
          </div>

          <div
            onClick={handleCancel}
            style={{
              position: "absolute",
              right: "0px",
              top: "-10px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <div>
            <div className="qa-txt-alg-lft qa-mar-btm-1">
              {shipTerm === "ddp"
                ? "In DDP mode Qalara will estimate duties and taxes at the time of checkout. Any applicable duties and taxes are charged to you by Qalara and paid during customs clearance on your behalf."
                : "In DDU mode our freight/ logistics partner will contact you for the payment of duties and taxes at the time of delivery."}{" "}
            </div>
            <div className="qa-txt-alg-lft qa-mar-btm-2">
              Please select confirm to proceed
            </div>

            <Row>
              <Col xs={24} sm={24} md={3} lg={3} xl={3}></Col>
              <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                <Button
                  className="qa-button qa-fs-12 cart-cancel-delete qa-mar-top-2"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="qa-button qa-fs-12 cart-delete qa-mar-top-2"
                  onClick={() => {
                    setShippingTerm(shipTerm);
                    setShippingModeModal(false);
                    selectShippingMode(mode, shipTerm);
                  }}
                >
                  Confirm
                </Button>
              </Col>
              <Col xs={24} sm={24} md={3} lg={3} xl={3}></Col>
            </Row>
          </div>
        </div>
      </Modal>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    currencyDetails: state.currencyConverter,
    brandNames: state.userProfile.brandNameList,
    userProfile: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, null)(ShippingDetails);
