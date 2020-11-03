/** @format */

import React, { useState, useEffect } from "react";
import Link  from "next/link";
import {useRouter} from "next/router";
import { Button, Row, Col, Modal, Checkbox } from "antd";
import Icon, {
  UpOutlined,
  DownOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import closeButton from "../../public/filestore/closeButton";
import CartSummary from "../Cart/CartSummary";
import cartIcon from "../../public/filestore/cartIcon";
import Spinner from "../Spinner/Spinner";
import Air from "../../public/filestore/air";
import Sea from "../../public/filestore/sea";
import alertIcon from "../../public/filestore/alertIcon";
import infoIcon from "../../public/filestore/infoIcon";
import deliveredCountryList from "../../public/filestore/deliveredCountries.json";
import _ from "lodash";
import { getBrandNameByCode } from "../../store/actions";
const { Step } = Steps;

const ShippingDetails = (props) => {
  const router = useRouter();
  const LANDING_LIMITER = 3;
  let {
    cart = {},
    app_token = "",
    brandNames = "",
    currencyDetails = {},
  } = props;
  let {
    subOrders = [],
    shippingAddressDetails = "",
    orderId = "",
    isFulfillable = false,
  } = cart || {};
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

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");
  const [enable, setEnable] = useState(false);
  const [mode, setMode] = useState("");
  const [showRow, setShowRow] = useState(true);
  const [airData, setAirData] = useState({});
  const [seaData, setSeaData] = useState({});
  const [cartData, setCartData] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [deliver, setDeliver] = useState(false);
  const mediaMatch = window.matchMedia("(min-width: 1024px)");
  const [disablePayment, setPayment] = useState(false);
  const [mov, setMov] = useState("");

  useEffect(() => {
    let { cart = "", app_token = "" } = props;
    let { priceQuoteRef = "", shippingAddressDetails = {}, subOrders = [] } =
      cart || {};

    let sellerCodeList = [];
    if (subOrders && subOrders.length) {
      for (let sellers of subOrders) {
        let { sellerCode = "" } = sellers;

        if (!sellerCodeList.includes(sellerCode)) {
          sellerCodeList.push(sellerCode);
        }
      }
    }
    if (sellerCodeList.length) {
      let codes = sellerCodeList.join();
      props.getBrandNameByCode(codes, app_token);
    }

    if (shippingAddressDetails) {
      let { country } = shippingAddressDetails || {};
      if (deliveredCountryList.includes(country)) {
        setDeliver(true);
        
      }
    }
    if (priceQuoteRef) {
      setCartData(cart);
      fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=SEA`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + app_token,
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            setSeaData({});
            return res.json();
          } else {
            throw res.statusText || "COntent not found";
          }
        })
        .then((res) => {
          setSeaData(res);
          setLoading(false);
          // let result = Object.values(res).every((o) => o === 0);
          // setPayment(result);
        })
        .catch((error) => {
          // message.error(error)
          setLoading(false);
        });
      fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=AIR`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + app_token,
          },
        }
      )
        .then((res) => {
          setAirData({});
          if (res.ok) {
            return res.json();
          } else {
            throw res.statusText || "COntent not found";
          }
        })
        .then((res) => {
          setAirData(res);
          // let result = Object.values(res).every((o) => o === 0);
          // setPayment(result);
          setLoading(false);
        })
        .catch((error) => {
          // message.error(error)
          setLoading(false);
        });
    }
  }, [props.cart, props.app_token]);

  useEffect(() => {
    let { cart = "" } = props;
    let { subOrders = [], total = 0 } = cart || {};

    if (subOrders && subOrders.length) {
      let totalAmount = 0;
      for (let sellers of subOrders) {
        let { products = "", qalaraSellerMargin = 0, basePrice = 0 } = sellers;

        for (let items of products) {
          let { quantity = 0, exFactoryPrice = 0, productType = "" } = items;
          basePrice = basePrice + exFactoryPrice * quantity;
          if (productType === "ERTM") {
            setMov(true);
          }
        }
        totalAmount = totalAmount + basePrice;
      }
      const seaMax = seaData["dutyMax"] + seaData["frightCostMax"];
      const airMax = airData["dutyMax"] + airData["frightCostMax"];

      if (
        Object.keys(airData).length === 0 &&
        Object.keys(seaData).length === 0
      ) {
        setPayment(true);
        
      } else {
        setPayment(false);
      }
      if (airMax > 0 && seaMax > 0) {
        let landingFactor = "";
        landingFactor =
          (total + (seaMax > airMax ? airMax : seaMax)) / totalAmount;

        if (landingFactor > LANDING_LIMITER) {
          setPayment(true);
        }
      }
    }
  }, [seaData, airData, props.cart, props.app_token]);

  const checkCommitStatus = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/my/${orderId}/checkout/?mode=${mode}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + app_token,
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
      .then((result) => {
        let { status = "" } = result;
        if (status === "COMMITTED") {
          let url = "/payment";
          router.push(url);
        } else {
          // setNonShippable(true);
        }
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  };

  let showError = false;
  let { convertToCurrency = "" } = currencyDetails || {};
  if (subOrders && subOrders.length) {
    for (let orders of subOrders) {
      let { total = 0 } = orders;
      if (total < 250) {
        showError = true;
      }
    }
  }

  let { frightCostMax: a_frieghtCost = 0 } = airData || {};
  let { frightCostMax: s_frieghtCost = 0 } = seaData || {};
  let disableAir = false;
  let disableSea = false;

  if (a_frieghtCost > 0 && s_frieghtCost > 0) {
    if (a_frieghtCost > s_frieghtCost) {
      let percentage = ((a_frieghtCost - s_frieghtCost) / a_frieghtCost) * 100;
      if (percentage > 50) {
        disableAir = true;
      }
    }

    if (s_frieghtCost > a_frieghtCost) {
      let percentage = ((s_frieghtCost - a_frieghtCost) / s_frieghtCost) * 100;
      if (percentage > 50) {
        disableSea = true;
      }
    }
  }

  let a_result = Object.values(airData).every((o) => o === 0);
  let s_result = Object.values(seaData).every((o) => o === 0);

  if (a_result) {
    disableAir = a_result;
  }
  if (s_result) {
    disableSea = s_result;
  }

  const getConvertedCurrency = (baseAmount, round = false) => {
    let { convertToCurrency = "", rates = [] } = props.currencyDetails;
    if (round) {
      return Math.round(
        Number.parseFloat(baseAmount * rates[convertToCurrency])
      );
    }
    return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(2);
  };

  const customDot = (dot, { status, index }) => (
    <Link href="/cart">
      <span className="qa-ant-steps-icon">
        {status === "finish" ? <CheckOutlined /> : index + 1}
      </span>
    </Link>
  );
  const mcustomDot = (dot, { status, index }) => (
    <Link href="/cart">
      <span className="ant-steps-icon-dot"></span>
    </Link>
  );

  const handleCancel = () => {
    setDeleteModal(false);
    setDeleteItem("");
  };

  const selectShippingMode = (mode) => {
    fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/my/${orderId}/${mode}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + app_token,
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
      })
      .catch((err) => {
        console.log(err);
      });
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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Row id="cart-details" className="cart-section qa-font-san">
      {mediaMatch.matches && (
        <Col xs={0} sm={0} md={24} lg={24} xl={24}>
          <Row className="qa-mar-btm-2 qa-cart-steps">
            <Col xs={0} sm={0} md={4} lg={4} xl={4}></Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <Steps current={1} progressDot={customDot}>
                <Step
                  title={<Link href="/cart">Shopping cart</Link>}
                  className="qa-cursor"
                />
                <Step title="Shipping" />
                <Step title="Payment" />
              </Steps>
            </Col>
            <Col xs={0} sm={0} md={4} lg={4} xl={4}></Col>
          </Row>
        </Col>
      )}
      {!mediaMatch.matches && (
        <Col span={24}>
          <Row className="qa-mar-2">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Steps current={1} progressDot={mcustomDot} size="small">
                <Step
                  title={<Link href="/cart">Shopping cart</Link>}
                  className="qa-cursor"
                />
                <Step title="Shipping" />
                <Step title="Payment" />
              </Steps>
            </Col>
          </Row>
        </Col>
      )}
      <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
      {mediaMatch.matches && (
        <Col xs={0} sm={0} md={20} lg={20} xl={20}>
          <Row>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="cart-title qa-mar-btm-2"
            >
              Shipping
            </Col>
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
              <div className="cart-title qa-mar-btm-2 qa-cursor sen-font">
                Select shipping mode:{" "}
              </div>
              <div className="qa-pad-1 c-item-list">
                {disablePayment ? (
                  <Row>
                    <Col span={24}>
                      <div className="qa-bg-light-theme qa-pad-2 qa-mar-1 qa-no-ship">
                        We will need to generate a custom freight quotation for
                        this. Please click on <b>'Create Order'</b> and we will
                        revert with the best freight rates from our delivery
                        partners.
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    {!disableAir && (
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div
                          className={`${
                            mode === "AIR" ? "selected" : ""
                          } qa-bg-light-theme qa-pad-2 qa-mar-1 qa-box-shadow shipping-mode-section`}
                        >
                          <div className="qa-pad-btm-15 qa-border-bottom">
                            <span>
                              <Icon
                                component={Air}
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  verticalAlign: "middle",
                                }}
                                className="air-icon"
                              />
                              <span className="qa-va-m qa-tc-white qa-font-san">
                                Air
                              </span>
                            </span>
                            <span style={{ float: "right" }}>
                              <Checkbox
                                className="check-box-tnc"
                                checked={mode === "AIR"}
                                onChange={() => {
                                  if (!mode) {
                                    selectMode("AIR");
                                  } else {
                                    selectMode("");
                                  }
                                }}
                              ></Checkbox>{" "}
                            </span>
                          </div>
                          <div className="qa-pad-015 qa-dashed-border">
                            <div className="c-left-blk qa-txt-alg-lft">
                              <div className="cart-info-text">
                                Estimated freight charges
                              </div>
                            </div>
                            <div className="c-right-blk qa-txt-alg-lft">
                              <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                                {airData ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {airData["frightCostMin"]
                                      ? getConvertedCurrency(
                                          airData["frightCostMin"],
                                          true
                                        )
                                      : "0"}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {airData["frightCostMax"]
                                      ? getConvertedCurrency(
                                          airData["frightCostMax"],
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
                          <div className="qa-pad-015 qa-dashed-border">
                            <div className="c-left-blk qa-txt-alg-lft">
                              <div className="cart-info-text">
                                Estimated duty charges
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                                {airData ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {airData["dutyMin"]
                                      ? getConvertedCurrency(
                                          airData["dutyMin"],
                                          true
                                        )
                                      : "0"}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {airData["dutyMax"]
                                      ? getConvertedCurrency(
                                          airData["dutyMax"],
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
                          <div className="qa-pad-015 qa-dashed-border">
                            <div className="c-left-blk qa-txt-alg-lft">
                              <div className="cart-info-text">
                                Shipping lead time
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                                {airData ? (
                                  <span>
                                    {airData["tat"] ? airData["tat"] - 3 : "0"}-
                                    {airData["tat"] ? airData["tat"] : "0"} Days
                                  </span>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="qa-pad-015">
                            <div className="c-left-blk">
                              <div className="qa-fw-b">
                                Total estimated charges
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-name qa-txt-alg-rgt">
                                {airData &&
                                airData["frightCostMin"] !== undefined &&
                                airData["dutyMin"] !== undefined ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(
                                      airData["frightCostMin"] +
                                        airData["dutyMin"],
                                      true
                                    )}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(
                                      airData["frightCostMax"] +
                                        airData["dutyMax"],
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
                        </div>
                      </Col>
                    )}
                    {!disableSea && (
                      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div
                          className={`${
                            mode === "SEA" ? "selected" : ""
                          } qa-bg-light-theme qa-pad-2 qa-mar-1 qa-box-shadow shipping-mode-section`}
                        >
                          <div className="qa-pad-btm-15 qa-border-bottom">
                            <span>
                              <Icon
                                component={Sea}
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  verticalAlign: "middle",
                                }}
                                className="air-icon"
                              />
                              <span className="qa-va-m qa-tc-white qa-font-san">
                                Sea
                              </span>
                            </span>
                            <span style={{ float: "right" }}>
                              <Checkbox
                                className="check-box-tnc"
                                checked={mode === "SEA"}
                                onChange={() => {
                                  if (!mode) {
                                    selectMode("SEA");
                                  } else {
                                    selectMode("");
                                  }
                                }}
                              ></Checkbox>{" "}
                            </span>
                          </div>
                          <div className="qa-pad-015 qa-dashed-border">
                            <div className="c-left-blk qa-txt-alg-lft">
                              <div className="cart-info-text">
                                Estimated freight charges
                              </div>
                            </div>
                            <div className="c-right-blk qa-txt-alg-lft">
                              <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                                {seaData ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {seaData["frightCostMin"]
                                      ? getConvertedCurrency(
                                          seaData["frightCostMin"],
                                          true
                                        )
                                      : "0"}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {seaData["frightCostMax"]
                                      ? getConvertedCurrency(
                                          seaData["frightCostMax"],
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
                          <div className="qa-pad-015 qa-dashed-border">
                            <div className="c-left-blk qa-txt-alg-lft">
                              <div className="cart-info-text">
                                Estimated duty charges
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                                {seaData ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {seaData["dutyMin"]
                                      ? getConvertedCurrency(
                                          seaData["dutyMin"],
                                          true
                                        )
                                      : "0"}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {seaData["dutyMax"]
                                      ? getConvertedCurrency(
                                          seaData["dutyMax"],
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
                          <div className="qa-pad-015 qa-dashed-border">
                            <div className="c-left-blk qa-txt-alg-lft">
                              <div className="cart-info-text">
                                Shipping lead time
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                                {seaData["tat"] ? seaData["tat"] - 7 : "0"}-
                                {seaData["tat"] ? seaData["tat"] : "0"} Days
                              </div>
                            </div>
                          </div>
                          <div className="qa-pad-015">
                            <div className="c-left-blk">
                              <div className="qa-fw-b">
                                Total estimated charges
                              </div>
                            </div>
                            <div className="c-right-blk">
                              <div className="cart-prod-name qa-txt-alg-rgt">
                                {seaData &&
                                seaData["frightCostMin"] !== undefined &&
                                seaData["dutyMin"] !== undefined ? (
                                  <span>
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(
                                      seaData["frightCostMin"] +
                                        seaData["dutyMin"],
                                      true
                                    )}
                                    -{getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(
                                      seaData["frightCostMax"] +
                                        seaData["dutyMax"],
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
                        <Checkbox className="check-box-tnc"></Checkbox>{" "}
                      </span>
                    </div>
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">
                          Estimated freight charges
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
                          Estimated duty charges
                        </div>
                      </div>
                      <div className="c-right-blk">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                          $20-$40
                        </div>
                      </div>
                    </div>
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">Shipping lead time</div>
                      </div>
                      <div className="c-right-blk">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                          7 Days
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
                )}
              </div>
              <div
                className={`qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 ${
                  disableAir && !disablePayment ? "" : "qa-mar-btm-3"
                }`}
              >
                *Freight & Duties charges mentioned are estimates. Actuals
                generally range between ±10% of the estimates, and will be
                charged at time of dispatch.
              </div>

              {disableAir && !disablePayment && (
                <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-btm-3">
                  *Air shipping appears to be very expensive for this order. If
                  you want air shipping please write to us at buyers@qalara.com
                </div>
              )}
              {!disablePayment && (
                <div className="display-flex">
                  <div className="margin-right-1p">
                    <Icon
                      component={infoIcon}
                      className="info-icon"
                      style={{
                        width: "15px",
                        verticalAlign: "top",
                      }}
                    />
                  </div>
                  <div className="qa-tc-white qa-fs-14 qa-lh qa-mar-btm-3">
                    Estimated time to prepare and ship your order is{" "}
                    {mov ? "25-30" : "4-7"} Days
                  </div>
                </div>
              )}
              <Row>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  className="cart-title qa-mar-btm-2 qa-cursor sen-font"
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
                        let {
                          sellerOrgName = "",
                          products = "",
                          sellerCode = "",
                          total = 0,
                          qalaraSellerMargin = 0,
                          qualityTestingCharge = 0,
                        } = order;
                        let totalAmount =
                          total + qalaraSellerMargin + qualityTestingCharge;
                        return (
                          <div
                            className={`qa-bg-light-theme qa-pad-3 ${
                              total < 250 ? " qa-error-border" : ""
                            } ${
                              i < subOrders.length - 1 ? "qa-mar-btm-2" : ""
                            }`}
                            key={i}
                          >
                            <div className="cart-ship-pt qa-fw-b qa-border-bottom">
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
                                  {brandNames &&
                                    brandNames[sellerCode] &&
                                    brandNames[sellerCode].brandName}
                                </span>
                                {total < 250 && (
                                  <div className="cart-sub-text">
                                    Add{" "}
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {getConvertedCurrency(250 - total)} more to
                                    reach seller’s minimum order value
                                  </div>
                                )}
                              </div>

                              {/* <span
                            className="cart-delete qa-cursor"
                            onClick={() => {
                              setDeleteItem(sellerOrgName);
                              setDeleteModal(true);
                            }}
                          >
                            Delete cart
                          </span> */}
                            </div>

                            {_.map(products, (product, j) => {
                              let {
                                articleId = "",
                                color = "",
                                image = "",
                                isQualityTestingRequired = "",
                                isSampleDeliveryRequired = "",
                                productId = "",
                                productName = "",
                                quantity = "",
                                size = "",
                                total = "",
                                isFulfillable = false,
                                unitOfMeasure = "",
                              } = product;
                              quantity = parseInt(quantity);

                              return (
                                <Row
                                  className={`${
                                    isFulfillable === false
                                      ? "qa-pad-20-0 oos-border qa-mar-btm-1"
                                      : "qa-pad-20-0"
                                  }`}
                                  key={j}
                                >
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
                                    <div className="cart-prod-title qa-fw-b">
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
                                    {isFulfillable === false && (
                                      <div className="cart-sub-text p-out-of-stock qa-mar-top-05">
                                        This product is currently out of stock
                                      </div>
                                    )}
                                  </Col>
                                  <Col
                                    xs={24}
                                    sm={24}
                                    md={9}
                                    lg={9}
                                    xl={9}
                                    className="qa-mar-top-15"
                                  >
                                    <div className="qa-disp-table-cell qa-txt-alg-rgt">
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
                                        {total
                                          ? getConvertedCurrency(total)
                                          : ""}
                                      </div>
                                      <div className="cart-price-text">
                                        Base price per unit excl. margin and
                                        other charges
                                      </div>
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
                                {total ? getConvertedCurrency(total) : ""}
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
              {showError && (
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
                  Please move the seller cart with value less than{" "}
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(250)} to 'Save for later' in order to
                  proceed
                </div>
              )}
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
              {/* {disablePayment && (
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
                  Freight charges are not available for the Pincode that you
                  have selected. Please write to us at buyers@qalara.com to
                  generate a custom quote for your requirements.
                </div>
              )} */}
              <CartSummary
                id="shipping"
                enable={enable}
                cart={cartData}
                brandNames={brandNames}
                showCartError={showError}
                currencyDetails={currencyDetails}
                shippingMode={mode}
                deliver={deliver}
                disablePayment={disablePayment}
              />
            </Col>
          </Row>
        </Col>
      )}
      <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
      {!mediaMatch.matches && (
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="qa-pad-0-20">
          <Row className="shipping-section">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div className="qa-tc-white qa-mar-btm-2 cart-ship-pt">
                <div className="qa-fw-b qa-mar-btm-05">Shipping to:</div>
                <div className="">{shippingAddr}</div>
              </div>
              <div className="cart-ship-pt qa-border-bottom qa-fw-b font-bold">
                Select shipping mode:
              </div>
              {disablePayment ? (
                <div className="qa-pad-2 qa-ship-section qa-mar-top-2">
                  <div className="qa-no-ship">
                    We will need to generate a custom freight quotation for
                    this. Please click on <b>'Create Order'</b> and we will
                    revert with the best freight rates from our delivery
                    partners.
                  </div>
                </div>
              ) : (
                <div className="qa-pad-top-2 qa-pad-btm-2 qa-horizontal-scroll">
                  {!disableAir && (
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <div
                        className={`${
                          mode === "AIR" ? "selected" : ""
                        } qa-bg-light-theme qa-pad-2 qa-box-shadow shipping-mode-section`}
                      >
                        <div className="qa-pad-btm-15 qa-border-bottom">
                          <span>
                            <Icon
                              component={Air}
                              style={{
                                width: "28px",
                                height: "28px",
                                verticalAlign: "middle",
                              }}
                              className="air-icon"
                            />
                            <span className="qa-va-m qa-tc-white qa-font-san">
                              Air
                            </span>
                          </span>
                          <span style={{ float: "right" }}>
                            <Checkbox
                              className="check-box-tnc"
                              checked={mode === "AIR"}
                              onChange={() => {
                                if (!mode) {
                                  selectMode("AIR");
                                } else {
                                  selectMode("");
                                }
                              }}
                            ></Checkbox>{" "}
                          </span>
                        </div>
                        <div className="qa-pad-015 qa-dashed-border">
                          <div className="c-left-blk qa-txt-alg-lft">
                            <div className="cart-info-text">
                              Estimated freight charges
                            </div>
                          </div>
                          <div className="c-right-blk qa-txt-alg-lft">
                            <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                              {airData ? (
                                <span>
                                  {getSymbolFromCurrency(convertToCurrency)}
                                  {airData["frightCostMin"]
                                    ? getConvertedCurrency(
                                        airData["frightCostMin"],
                                        true
                                      )
                                    : "0"}
                                  -{getSymbolFromCurrency(convertToCurrency)}
                                  {airData["frightCostMax"]
                                    ? getConvertedCurrency(
                                        airData["frightCostMax"],
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
                        <div className="qa-pad-015 qa-dashed-border">
                          <div className="c-left-blk qa-txt-alg-lft">
                            <div className="cart-info-text">
                              Estimated duty charges
                            </div>
                          </div>
                          <div className="c-right-blk">
                            <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                              {airData ? (
                                <span>
                                  {getSymbolFromCurrency(convertToCurrency)}
                                  {airData["dutyMin"]
                                    ? getConvertedCurrency(
                                        airData["dutyMin"],
                                        true
                                      )
                                    : "0"}
                                  -{getSymbolFromCurrency(convertToCurrency)}
                                  {airData["dutyMax"]
                                    ? getConvertedCurrency(
                                        airData["dutyMax"],
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
                        <div className="qa-pad-015 qa-dashed-border">
                          <div className="c-left-blk qa-txt-alg-lft">
                            <div className="cart-info-text">
                              Shipping lead time
                            </div>
                          </div>
                          <div className="c-right-blk">
                            <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                              {airData ? (
                                <span>
                                  {airData["tat"] ? airData["tat"] - 3 : "0"}-
                                  {airData["tat"] ? airData["tat"] : "0"} Days
                                </span>
                              ) : (
                                "-"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="qa-pad-015">
                          <div className="c-left-blk">
                            <div className="qa-fw-b">
                              Total estimated charges
                            </div>
                          </div>
                          <div className="c-right-blk">
                            <div className="cart-prod-name qa-txt-alg-rgt">
                              {airData &&
                              airData["frightCostMin"] !== undefined &&
                              airData["dutyMin"] !== undefined ? (
                                <span>
                                  {getSymbolFromCurrency(convertToCurrency)}
                                  {getConvertedCurrency(
                                    airData["frightCostMin"] +
                                      airData["dutyMin"],
                                    true
                                  )}
                                  -{getSymbolFromCurrency(convertToCurrency)}
                                  {getConvertedCurrency(
                                    airData["frightCostMax"] +
                                      airData["dutyMax"],
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
                      </div>
                    </div>
                  )}
                  {!disableSea && (
                    <div
                      style={{ display: "inline-block", marginRight: "20px" }}
                    >
                      <div
                        className={`${
                          mode === "SEA" ? "selected" : ""
                        } qa-bg-light-theme qa-pad-2 qa-box-shadow shipping-mode-section`}
                      >
                        <div className="qa-pad-btm-15 qa-border-bottom">
                          <span>
                            <Icon
                              component={Sea}
                              style={{
                                width: "28px",
                                height: "28px",
                                verticalAlign: "middle",
                              }}
                              className="air-icon"
                            />
                            <span className="qa-va-m qa-tc-white qa-font-san">
                              Sea
                            </span>
                          </span>
                          <span style={{ float: "right" }}>
                            <Checkbox
                              className="check-box-tnc"
                              checked={mode === "SEA"}
                              onChange={() => {
                                if (!mode) {
                                  selectMode("SEA");
                                } else {
                                  selectMode("");
                                }
                              }}
                            ></Checkbox>{" "}
                          </span>
                        </div>
                        <div className="qa-pad-015 qa-dashed-border">
                          <div className="c-left-blk qa-txt-alg-lft">
                            <div className="cart-info-text">
                              Estimated freight charges
                            </div>
                          </div>
                          <div className="c-right-blk qa-txt-alg-lft">
                            <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                              {seaData ? (
                                <span>
                                  {getSymbolFromCurrency(convertToCurrency)}
                                  {seaData["frightCostMin"]
                                    ? getConvertedCurrency(
                                        seaData["frightCostMin"],
                                        true
                                      )
                                    : "0"}
                                  -{getSymbolFromCurrency(convertToCurrency)}
                                  {seaData["frightCostMax"]
                                    ? getConvertedCurrency(
                                        seaData["frightCostMax"],
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
                        <div className="qa-pad-015 qa-dashed-border">
                          <div className="c-left-blk qa-txt-alg-lft">
                            <div className="cart-info-text">
                              Estimated duty charges
                            </div>
                          </div>
                          <div className="c-right-blk">
                            <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                              {seaData ? (
                                <span>
                                  {getSymbolFromCurrency(convertToCurrency)}
                                  {seaData["dutyMin"]
                                    ? getConvertedCurrency(
                                        seaData["dutyMin"],
                                        true
                                      )
                                    : "0"}
                                  -{getSymbolFromCurrency(convertToCurrency)}
                                  {seaData["dutyMax"]
                                    ? getConvertedCurrency(
                                        seaData["dutyMax"],
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
                        <div className="qa-pad-015 qa-dashed-border">
                          <div className="c-left-blk qa-txt-alg-lft">
                            <div className="cart-info-text">
                              Shipping lead time
                            </div>
                          </div>
                          <div className="c-right-blk">
                            <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                              {seaData ? (
                                <span>
                                  {seaData["tat"] ? seaData["tat"] - 7 : "0"}-
                                  {seaData["tat"] ? seaData["tat"] : "0"} Days
                                </span>
                              ) : (
                                "-"
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="qa-pad-015">
                          <div className="c-left-blk">
                            <div className="qa-fw-b">
                              Total estimated charges
                            </div>
                          </div>
                          <div className="c-right-blk">
                            <div className="cart-prod-name qa-txt-alg-rgt">
                              {seaData &&
                              seaData["frightCostMin"] !== undefined &&
                              seaData["dutyMin"] !== undefined ? (
                                <span>
                                  {getSymbolFromCurrency(convertToCurrency)}
                                  {getConvertedCurrency(
                                    seaData["frightCostMin"] +
                                      seaData["dutyMin"],
                                    true
                                  )}
                                  -{getSymbolFromCurrency(convertToCurrency)}
                                  {getConvertedCurrency(
                                    seaData["frightCostMax"] +
                                      seaData["dutyMax"],
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
                      </div>
                    </div>
                  )}
                  {/* <div style={{ display: "inline-block", marginRight: "20px" }}>
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
                      <Checkbox className="check-box-tnc"></Checkbox>{" "}
                    </span>
                  </div>
                  <div className="qa-pad-015 qa-dashed-border">
                    <div className="c-left-blk qa-txt-alg-lft">
                      <div className="cart-info-text">
                        Estimated freight charges
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
                        Estimated duty charges
                      </div>
                    </div>
                    <div className="c-right-blk">
                      <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                        $20-$40
                      </div>
                    </div>
                  </div>
                  <div className="qa-pad-015 qa-dashed-border">
                    <div className="c-left-blk qa-txt-alg-lft">
                      <div className="cart-info-text">Shipping lead time</div>
                    </div>
                    <div className="c-right-blk">
                      <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                        7 Days
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
              </div>
            */}
                </div>
              )}
              <div
                className={`qa-tc-white qa-fs-12 qa-lh ${
                  disableAir && !disablePayment ? "" : "qa-mar-btm-3"
                }`}
              >
                *Freight & Duties charges mentioned are estimates. Actuals
                generally range between ±10% of the estimates, and will be
                charged at time of dispatch.
              </div>

              {disableAir && !disablePayment && (
                <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-btm-3">
                  *Air shipping appears to be very expensive for this order. If
                  you want air shipping please write to us at buyers@qalara.com
                </div>
              )}
              {!disablePayment && (
                <div className="qa-tc-white qa-fs-14 qa-lh qa-mar-btm-3 display-flex">
                  <div className="margin-right-1p">
                    <Icon
                      component={infoIcon}
                      className="info-icon"
                      style={{
                        width: "15px",
                        verticalAlign: "top",
                      }}
                    />
                  </div>
                  Estimated time to prepare and ship your order is{" "}
                  {mov ? "25-30" : "4-7"} Days
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
                {showError && (
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
                    Please move the seller cart with value less than{" "}
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(250)} to 'Save for later' in order to
                    proceed
                  </div>
                )}
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
                {/* {disablePayment && (
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
                    Freight charges are not available for the Pincode that you
                    have selected. Please write to us at buyers@qalara.com to
                    generate a custom quote for your requirements.
                  </div>
                )} */}
                <CartSummary
                  id="shipping"
                  enable={enable}
                  cart={cartData}
                  brandNames={brandNames}
                  showCartError={showError}
                  currencyDetails={currencyDetails}
                  shippingMode={mode}
                  deliver={deliver}
                  disablePayment={disablePayment}
                />
              </Col>
            )}{" "}
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
                    let {
                      sellerOrgName = "",
                      products = "",
                      sellerCode = "",
                      total = 0,
                      qalaraSellerMargin = 0,
                      qualityTestingCharge = 0,
                    } = order;
                    let totalAmount =
                      total + qalaraSellerMargin + qualityTestingCharge;
                    return (
                      <div className="qa-bg-light-theme qa-mar-btm-2" key={i}>
                        <div className="cart-ship-pt qa-fw-b qa-border-bottom">
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
                            {brandNames &&
                              brandNames[sellerCode] &&
                              brandNames[sellerCode].brandName}
                            {total < 250 && (
                              <div className="cart-sub-text">
                                Add {getSymbolFromCurrency(convertToCurrency)}
                                {getConvertedCurrency(250 - total)} more to
                                reach seller’s minimum order value
                              </div>
                            )}
                          </div>
                          {/* <div className="qa-txt-alg-cnt qa-pad-top-05 qa-pad-btm-1">
                        <span
                          className="cart-delete qa-cursor"
                          onClick={() => {
                            setDeleteItem(sellerOrgName);
                            setDeleteModal(true);
                          }}
                        >
                          Delete cart
                        </span>
                      </div> */}
                        </div>

                        {_.map(products, (product, j) => {
                          let {
                            articleId = "",
                            color = "",
                            image = "",
                            isQualityTestingRequired = "",
                            isSampleDeliveryRequired = "",
                            productId = "",
                            productName = "",
                            quantity = "",
                            size = "",
                            total = "",
                            isFulfillable = false,
                            unitOfMeasure = "",
                          } = product;
                          quantity = parseInt(quantity);
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
                                <div className="cart-prod-title qa-fw-b">
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
                                <div className="cart-prod-title qa-mar-top-1">
                                  Units: {quantity} {unitOfMeasure}
                                </div>
                                {isFulfillable === false && (
                                  <div className="cart-sub-text p-out-of-stock qa-mar-top-05">
                                    This product is currently out of stock
                                  </div>
                                )}
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
                                  {total ? getConvertedCurrency(total) : ""}
                                </div>
                                <div className="cart-price-text qa-mar-btm-1">
                                  Base price per unit excl. margin and other
                                  charges
                                </div>
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
                            {total ? getConvertedCurrency(total) : ""}
                          </Col>
                        </Row>
                        <div>
                          {enable && deliver && !showError ? (
                            <Button
                              onClick={checkCommitStatus}
                              disabled={disablePayment}
                              className={`${
                                enable && deliver && !showError
                                  ? "qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment active"
                                  : "qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment"
                              }`}
                            >
                              Proceed to payment
                            </Button>
                          ) : (
                            <Button
                              className={`${
                                enable && deliver && !showError
                                  ? "qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment active"
                                  : "qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment"
                              }`}
                            >
                              Proceed to payment
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
          )}
        </Col>
      )}
      <Modal
        visible={deleteModal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={450}
        style={{ top: 5 }}
        className="cart-delete-modal"
      >
        <div className="qa-rel-pos qa-font-san">
          <div className="qa-pad-btm-2 qa-txt-alg-cnt">
            <span className="qa-font-butler qa-fs-but-30 qa-tc-white">
              Delete cart?
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
            <div className="qa-txt-alg-cnt qa-mar-btm-2">
              Are you sure you want to delete <br></br>
              <b>{deleteItem}?</b>
            </div>
            <Button
              className="qa-button qa-fs-12 cart-cancel-delete qa-mar-top-2"
              onClick={() => {}}
            >
              Cancel
            </Button>
            <Button
              className="qa-button qa-fs-12 cart-delete qa-mar-top-2"
              onClick={() => {}}
            >
              Delete
            </Button>
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
  };
};

export default connect(mapStateToProps, { getBrandNameByCode })(
  ShippingDetails
);
