/** @format */

import React, { useState, useEffect } from "react";
import { Row, Col, Radio } from "antd";
import Icon, {
  UpOutlined,
  DownOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import getSymbolFromCurrency from "currency-symbol-map";
import amexPayment from "../../public/filestore/amexPayment";
import visaPayment from "../../public/filestore/visaPayment";
import stripePayment from "../../public/filestore/stripePayment";
import paypalPayment from "../../public/filestore/paypalPayment";
import mcPayment from "../../public/filestore/mcPayment";
import discoverPayment from "../../public/filestore/discoverPayment";
import CartSummary from "../Cart/CartSummary";
import cartIcon from "./../../public/filestore/cartIcon";
import _ from "lodash";
import Spinner from "./../Spinner/Spinner";
import Air from "../../public/filestore/air";
import Sea from "../../public/filestore/sea";
import sellerList from "../../public/filestore/freeShippingSellers.json";
import CheckoutSteps from "../common/CheckoutSteps";
import PaymentBanner from "../common/PaymentBanner";
import moment from "moment";
import Link from "next/link";

const PaymentDetails = (props) => {
  let {
    cart = {},
    brandNames = "",
    user = {},
    currencyDetails = {},
    data = {},
    isLoading = true,
  } = props;
  let {
    subOrders = [],
    shippingAddressDetails = "",
    shippingMode = "",
    shippingTerms = "",
    typeOfOrder = "",
    miscCharges = [],
    promoDiscount = "",
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

  let tat = 0;
  if (data && data["tat"]) {
    tat = data["tat"];
  }
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
  const [paymentValue, setPaymentValue] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showShip, setShowShip] = useState(false);
  const [shippingTerm, setShippingTerm] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState(false);
  const mediaMatch = window.matchMedia("(min-width: 1024px)");

  let totalCartValue = 0;
  let frieghtCharge = 0;
  let dutyCharge = 0;
  let vatCharge = 0;
  let couponDiscount = 0;
  let freightDis = 0;
  let sellerDiscount = 0;
  let productDiscount = 0;
  let vat = 0;
  let dutyMax = 0;
  let dutyMin = 0;

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
    } else if (chargeId === "PRODUCT_DISCOUNT") {
      productDiscount = amount;
    } else if (chargeId === "DDP_VAT") {
      vat = amount;
    } else if (chargeId === "DDP_DUTY_MAX") {
      dutyMax = amount;
    } else if (chargeId === "DDP_DUTY_MIN") {
      dutyMin = amount;
    }
  }

  const getConvertedCurrency = (baseAmount, round = false) => {
    let { convertToCurrency = "", rates = [] } = props.currencyDetails;
    if (round) {
      return Number.parseFloat(
        (baseAmount *
          Math.round((rates[convertToCurrency] + Number.EPSILON) * 100)) /
          100
      ).toFixed(0);
    }
    return Number.parseFloat(
      (baseAmount *
        Math.round((rates[convertToCurrency] + Number.EPSILON) * 100)) /
        100
    ).toFixed(2);
  };

  if (couponDiscount > 0 || sellerDiscount > 0 || productDiscount > 0) {
    frieghtCharge = freightDis;
  }

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
        samplePrice = samplePrice + sampleCost;
        testingPrice = testingPrice + qualityTestingCharge;
        basePrice =
          basePrice +
          parseFloat(getConvertedCurrency(exfactoryListPrice)) * quantity;
      }

      sellerTotal = basePrice + samplePrice + testingPrice;

      totalCartValue = totalCartValue + sellerTotal;
    }
  }

  totalCartValue =
    totalCartValue +
    parseFloat(getConvertedCurrency(frieghtCharge)) +
    parseFloat(getConvertedCurrency(dutyCharge)) -
    parseFloat(getConvertedCurrency(sellerDiscount)) -
    parseFloat(getConvertedCurrency(productDiscount)) -
    parseFloat(getConvertedCurrency(couponDiscount)) +
    parseFloat(getConvertedCurrency(vatCharge)) -
    parseFloat(getConvertedCurrency(promoDiscount));

  useEffect(() => {
    setPaymentValue("payViaPaypal");
  }, []);

  let { convertToCurrency = "" } = currencyDetails || {};

  const onChange = (e) => {
    setPaymentValue(e.target.value);
  };

  let today = new Date();
  let deliveryDateMin = new Date();
  let deliveryDateMax = new Date();

  let eddMin = "";
  let eddMax = "";
  if (typeOfOrder === "ERTM") {
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
      <CheckoutSteps pageId="payment" />
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
              Payment
            </Col> */}
            <Col
              xs={24}
              sm={24}
              md={15}
              lg={15}
              xl={15}
              className="shipping-section"
            >
              <div className="qa-tc-white qa-mar-btm-2 cart-ship-pt qa-border-bottom">
                <div className="qa-mar-btm-05">Shipping to:</div>
                <div className="">{shippingAddr}</div>
              </div>
              <div
                className="cart-prod-title qa-pad-btm-05 qa-mar-btm-2 qa-cursor qa-border-bottom"
                onClick={() => setShippingTerm(!shippingTerm)}
              >
                Shipping term:{" "}
                <span className="qa-fw-b qa-tc-white qa-font-san">
                  {shippingTerms.toUpperCase()}{" "}
                  {shippingTerms.toLowerCase() === "ddu"
                    ? "(Delivered Duty Unpaid)"
                    : "(Delivered Duty Paid)"}
                </span>
                <span style={{ float: "right" }}>
                  {shippingTerm ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>
              {shippingTerm && (
                <div className="qa-mar-btm-15 qa-lh">
                  {shippingTerms.toLowerCase() === "ddu" ? (
                    <span>
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
                    </span>
                  ) : (
                    <span>
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
                    </span>
                  )}
                </div>
              )}
              <div
                className="cart-prod-title qa-pad-btm-05 qa-border-bottom qa-mar-btm-2 qa-cursor"
                onClick={() => setShowShip(!showShip)}
              >
                Shipping mode:{" "}
                <span className="qa-fw-b qa-tc-white qa-font-san">
                  {shippingMode}
                </span>
                <span style={{ float: "right" }}>
                  {showShip ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>

              {showShip && (
                <Row className="qa-mar-btm-4">
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className="c-item-list qa-pad-2"
                  >
                    <div className="qa-bg-light-theme qa-pad-2 qa-box-shadow shipping-mode-section">
                      <div className="qa-pad-btm-15 qa-border-bottom">
                        <span className="qa-va-m">{shippingMode}</span>
                        <span style={{ float: "right" }}>
                          {shippingMode === "SEA" ? (
                            <Icon
                              component={Sea}
                              style={{ width: "28px", verticalAlign: "middle" }}
                              className="air-icon"
                            />
                          ) : (
                            <Icon
                              component={Air}
                              style={{ width: "28px", verticalAlign: "middle" }}
                              className="air-icon"
                            />
                          )}
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
                            {data ? (
                              <span>
                                {getSymbolFromCurrency(convertToCurrency)}
                                {getConvertedCurrency(
                                  data["frightCostMin"],
                                  true
                                )}
                                -{getSymbolFromCurrency(convertToCurrency)}
                                {getConvertedCurrency(
                                  data["frightCostMax"],
                                  true
                                )}
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
                            {data ? (
                              <span>
                                {getSymbolFromCurrency(convertToCurrency)}
                                {getConvertedCurrency(data["dutyMin"], true)}-
                                {getSymbolFromCurrency(convertToCurrency)}
                                {getConvertedCurrency(data["dutyMax"], true)}
                              </span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </div>
                      </div> */}
                      <div className="qa-mar-top-15">
                        <div className="c-left-blk qa-txt-alg-lft">
                          <div className="cart-info-text">
                            Shipping lead time
                          </div>
                        </div>
                        <div className="c-right-blk">
                          <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                            {data ? (
                              <span>
                                {data["tat"]
                                  ? data["tat"] -
                                    (shippingMode === "SEA" ? 7 : 3)
                                  : "0"}
                                -{data["tat"] ? data["tat"] : "0"} days
                              </span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </div>
                      </div>
                      {/* <div className="qa-pad-015">
                        <div className="c-left-blk">
                          <div className="qa-fw-b">Total estimated charges</div>
                        </div>
                        <div className="c-right-blk">
                          <div className="cart-prod-name qa-txt-alg-rgt">
                            {data ? (
                              <span>
                                {getSymbolFromCurrency(convertToCurrency)}
                                {getConvertedCurrency(
                                  data["frightCostMin"] + data["dutyMin"],
                                  true
                                )}
                                -{getSymbolFromCurrency(convertToCurrency)}
                                {getConvertedCurrency(
                                  data["frightCostMax"] + data["dutyMax"],
                                  true
                                )}
                              </span>
                            ) : (
                              "-"
                            )}
                            *
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </Col>
                </Row>
              )}
              <div
                className="cart-prod-title qa-pad-btm-05 qa-border-bottom qa-mar-btm-2 qa-cursor"
                onClick={() => setEstimatedDelivery(!estimatedDelivery)}
              >
                Estimated delivery date:{" "}
                <span className="qa-fw-b qa-success">
                  {tat && shippingMode ? (
                    <span>
                      {moment(deliveryDateMin).format("DD MMM YY")} -{" "}
                      {moment(deliveryDateMax).format("DD MMM YY")}
                    </span>
                  ) : (
                    ""
                  )}
                </span>
                <span style={{ float: "right" }}>
                  {estimatedDelivery ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>
              {estimatedDelivery && (
                <div className="qa-pad-btm-2" style={{ width: "70%" }}>
                  <div className="qa-mar-btm-05">
                    <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                      <li>Estimated production/ dispatch time</li>
                    </div>
                    <div className="c-right-blk qa-txt-alg-rgt">
                      {typeOfOrder === "ERTM" ? "30-40" : "7-10"} days
                    </div>
                  </div>

                  <div className="qa-mar-btm-05">
                    <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                      <li>Estimated shipping lead time</li>
                    </div>
                    <div className="c-right-blk qa-txt-alg-rgt">
                      {tat && shippingMode ? (
                        <span>
                          {tat - (shippingMode === "AIR" ? 3 : 7)}-{tat} days
                        </span>
                      ) : (
                        "-"
                      )}
                    </div>
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
                  className="qa-mar-btm-2 qa-cursor"
                  onClick={() => setShowCart(!showCart)}
                >
                  <div className="qa-fw-b cart-prod-title qa-pad-btm-05 qa-border-bottom qa-cursor">
                    Shopping cart
                    <span style={{ float: "right" }}>
                      {showCart ? (
                        <UpOutlined style={{ fontSize: "12px" }} />
                      ) : (
                        <DownOutlined style={{ fontSize: "12px" }} />
                      )}
                    </span>
                  </div>
                </Col>
                {showCart && (
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
                                Seller ID: {sellerCode}
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
                                freeShippingEligible = false,
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
                                        {total
                                          ? getConvertedCurrency(total)
                                          : ""}
                                      </div>
                                      {(!sellerList.includes(sellerCode) ||
                                        !freeShippingEligible) && (
                                        <div className="cart-price-text">
                                          Base price per unit excl. margin and
                                          other charges
                                        </div>
                                      )}
                                      {(sellerList.includes(sellerCode) ||
                                        freeShippingEligible) && (
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

              <Row className="payment-section">
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  className="qa-mar-btm-2"
                >
                  <div className="qa-fw-b cart-prod-title qa-pad-btm-05 qa-border-bottom">
                    Select payment term:
                  </div>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="qa-pad-2 c-item-list">
                    <div className="qa-bg-light-theme qa-pad-2">
                      <Radio.Group onChange={onChange} value={paymentValue}>
                        {/* <Radio value="payNow" className="qa-disp-ib">
                        <span className="cart-prod-title qa-mar-btm-05">Pay now</span>
                      </Radio>
                      <div className="cart-subtitle payment-subtitle qa-mar-btm-2">
                        Pay early to avail discounts
                      </div> */}
                        <Radio value="payViaPaypal" className="qa-disp-ib">
                          <span className="cart-prod-title qa-mar-btm-05 qa-fw-b">
                            Pay 20% now and 80% on delivery*
                          </span>
                        </Radio>
                        <div className="cart-subtitle payment-subtitle qa-mar-btm-2">
                          A charge for{" "}
                          {getSymbolFromCurrency(convertToCurrency)}
                          {parseFloat(totalCartValue).toFixed(2)} is created
                          against your card but the amount debited from your
                          card is the advance payable amount of{" "}
                          {getSymbolFromCurrency(convertToCurrency)}
                          {parseFloat(totalCartValue * 0.2).toFixed(2)}.{" "}
                          <Link href="/FAQforwholesalebuyers">
                            <a target="_blank">
                              <span className="qa-sm-color qa-cursor">
                                Refer Payment FAQs
                              </span>
                            </a>
                          </Link>
                        </div>
                        {/* <Radio value="net30Terms" className="qa-disp-ib">
                        <span className="cart-prod-title qa-mar-btm-05">Net 30 terms</span>
                      </Radio>
                      <div className="cart-subtitle payment-subtitle qa-mar-btm-2">
                        You will be charge 30 days after the products are
                        delivered
                      </div> */}
                      </Radio.Group>
                    </div>
                  </div>
                  <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-btm-4 qa-mar-top-05">
                    secure payment by credit cards and other payment modes{" "}
                    <span style={{ float: "right", marginTop: "-5px" }}>
                      <Icon
                        component={paypalPayment}
                        className="paypal-icon"
                        style={{
                          width: "52px",
                          verticalAlign: "middle",
                          marginRight: "8px",
                        }}
                      />
                      <Icon
                        component={mcPayment}
                        className="mc-icon"
                        style={{
                          width: "36px",
                          verticalAlign: "middle",
                          marginRight: "8px",
                        }}
                      />
                      <Icon
                        component={visaPayment}
                        className="visa-icon"
                        style={{
                          width: "42px",
                          verticalAlign: "middle",
                          marginRight: "5px",
                        }}
                      />
                      <Icon
                        component={amexPayment}
                        className="amex-icon"
                        style={{
                          width: "35px",
                          verticalAlign: "middle",
                          marginRight: "8px",
                        }}
                      />
                      <Icon
                        component={discoverPayment}
                        className="discover-icon"
                        style={{
                          width: "29px",
                          verticalAlign: "middle",
                        }}
                      />
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            {mediaMatch.matches && (
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                {/* {isFulfillable === false && (
                  <div className="qa-pad-2 qa-mar-btm-2 cart-error-block display-flex cart-err">
                    <div>
                      <Icon
                        component={alertIcon}
                        className="alert-icon"
                        style={{
                          width: "15px",
                          verticalAlign: "middle",
                        }}
                      />
                    </div>
                    Please move out of stock products in order to proceed
                  </div>
                )} */}
                <PaymentBanner />
                <CartSummary
                  id="payment"
                  // enable={isFulfillable}
                  cart={cart}
                  user={user}
                  brandNames={brandNames}
                  currencyDetails={currencyDetails}
                />
              </Col>
            )}
          </Row>
        </Col>
      )}
      {mediaMatch.matches && <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>}

      {!mediaMatch.matches && (
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="qa-pad-0-20">
          <Row>
            {/* <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="cart-title qa-mar-btm-2 "
            >
              Payment mode
            </Col> */}
            <PaymentBanner />
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="payment-section"
            >
              <div className="qa-pad-1 c-item-list">
                <div className="qa-bg-light-theme qa-pad-1">
                  <Radio.Group onChange={onChange} value={paymentValue}>
                    {/* <Radio value="payNow" className="qa-disp-ib">
                    <span className="cart-prod-title qa-mar-btm-05">Pay now</span>
                  </Radio>
                  <div className="cart-subtitle payment-subtitle qa-mar-btm-2">
                    Pay early to avail discounts
                  </div> */}
                    <Radio value="payViaPaypal" className="qa-disp-ib">
                      <span className="cart-prod-title qa-mar-btm-05 qa-fw-b">
                        Pay 20% now and 80% on delivery*
                      </span>
                    </Radio>
                    <div className="cart-subtitle payment-subtitle qa-mar-btm-2">
                      A charge for {getSymbolFromCurrency(convertToCurrency)}
                      {parseFloat(totalCartValue).toFixed(2)} is created against
                      your card but the amount debited from your card is the
                      advance payable amount of{" "}
                      {getSymbolFromCurrency(convertToCurrency)}
                      {parseFloat(totalCartValue * 0.2).toFixed(2)}.{" "}
                      <Link href="/FAQforwholesalebuyers">
                        <a target="_blank">
                          <span className="qa-sm-color qa-cursor">
                            Refer Payment FAQs
                          </span>
                        </a>
                      </Link>
                    </div>

                    {/* <Radio value="net30Terms" className="qa-disp-ib">
                    <span className="cart-prod-title qa-mar-btm-05">Net 30 terms</span>
                  </Radio>
                  <div className="cart-subtitle payment-subtitle qa-mar-btm-2">
                    You will be charge 30 days after the products are delivered
                  </div> */}
                  </Radio.Group>
                </div>
              </div>
              <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-btm-4 qa-mar-top-05">
                secure payment by credit cards and other payment modes{" "}
                <span style={{ float: "right", marginTop: "-5px" }}>
                  <Icon
                    component={paypalPayment}
                    className="paypal-icon"
                    style={{
                      width: "52px",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  />
                  <Icon
                    component={mcPayment}
                    className="mc-icon"
                    style={{
                      width: "32px",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  />
                  <Icon
                    component={visaPayment}
                    className="visa-icon"
                    style={{
                      width: "32px",
                      verticalAlign: "middle",
                      marginRight: "5px",
                    }}
                  />
                  <Icon
                    component={amexPayment}
                    className="amex-icon"
                    style={{
                      width: "28px",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  />
                  <Icon
                    component={discoverPayment}
                    className="discover-icon"
                    style={{
                      width: "25px",
                      verticalAlign: "middle",
                    }}
                  />
                </span>
              </div>
            </Col>
            {/* <Button className="qa-button qa-fs-12 cart-opt-service qa-mar-top-2">
            Proceed to checkout
          </Button>
          <div className="qa-disp-ib cart-info-text qa-mar-top-05 qa-mar-btm-3">
            Transactions are secure and encrypted
          </div> */}
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="qa-pad-btm-2 qa-mar-btm-1"
            >
              {/* {isFulfillable === false && (
                <div className="qa-pad-2 qa-mar-btm-2 cart-error-block display-flex cart-err">
                  <div>
                    <Icon
                      component={alertIcon}
                      className="alert-icon"
                      style={{
                        width: "15px",
                        verticalAlign: "middle",
                      }}
                    />
                  </div>
                  Please move out of stock products in order to proceed
                </div>
              )} */}
              <CartSummary
                id="payment"
                // enable={isFulfillable}
                cart={cart}
                user={user}
                brandNames={brandNames}
                currencyDetails={currencyDetails}
              />
            </Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              className="shipping-section"
            >
              <div className="qa-tc-white cart-ship-pt">
                <div className="qa-fw-b qa-mar-btm-05">Shipping to:</div>
                <div className="qa-border-bottom qa-pad-btm-1">
                  {shippingAddr}
                </div>
              </div>
              <div
                className="cart-prod-title qa-pad-btm-1 qa-mar-btm-1 qa-border-bottom qa-cursor"
                onClick={() => setShippingTerm(!shippingTerm)}
              >
                Shipping term:{" "}
                <span className="qa-fw-b">
                  {shippingTerms.toUpperCase()}{" "}
                  {/* {shippingTerms.toLowerCase() === "ddu"
                    ? "(Delivered Duty Unpaid)"
                    : "(Delivered Duty Paid)"} */}
                </span>
                <span style={{ float: "right" }}>
                  {shippingTerm ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>
              {shippingTerm && (
                <div className="qa-pad-btm-2 qa-lh">
                  {shippingTerms.toLowerCase() === "ddu" ? (
                    <span>
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
                    </span>
                  ) : (
                    <span>
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
                    </span>
                  )}
                </div>
              )}
              <div
                className="cart-prod-title qa-pad-btm-1 qa-border-bottom qa-cursor"
                onClick={() => setShowShip(!showShip)}
              >
                Shipping mode: <span className="qa-fw-b">{shippingMode}</span>
                <span style={{ float: "right" }}>
                  {showShip ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>
              {showShip && (
                <div className="qa-pad-top-2 qa-pad-btm-2">
                  <div>
                    <div className="qa-bg-dark-theme qa-pad-2 qa-box-shadow">
                      <div className="qa-pad-btm-15 qa-border-bottom">
                        <span className="qa-va-m">{shippingMode}</span>
                        <span style={{ float: "right" }}>
                          {shippingMode === "SEA" ? (
                            <Icon
                              component={Sea}
                              style={{ width: "28px", verticalAlign: "middle" }}
                              className="air-icon"
                            />
                          ) : (
                            <Icon
                              component={Air}
                              style={{ width: "28px", verticalAlign: "middle" }}
                              className="air-icon"
                            />
                          )}
                        </span>
                      </div>
                      <div className="qa-pad-015 qa-dashed-border">
                        <div className="c-left-blk qa-txt-alg-lft">
                          <div className="cart-info-text">
                            Estimated freight fee*
                          </div>
                        </div>
                        <div className="c-right-blk qa-txt-alg-lft qa-fw-b">
                          <div className="cart-prod-title qa-txt-alg-rgt">
                            {getSymbolFromCurrency(convertToCurrency)}
                            {getConvertedCurrency(data["frightCostMin"], true)}-
                            {getSymbolFromCurrency(convertToCurrency)}
                            {getConvertedCurrency(data["frightCostMax"], true)}
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
                            {getSymbolFromCurrency(convertToCurrency)}
                            {getConvertedCurrency(data["dutyMin"], true)}-
                            {getSymbolFromCurrency(convertToCurrency)}
                            {getConvertedCurrency(data["dutyMax"], true)}
                          </div>
                        </div>
                      </div> */}
                      <div className="qa-mar-top-15">
                        <div className="c-left-blk qa-txt-alg-lft">
                          <div className="cart-info-text">
                            Shipping lead time
                          </div>
                        </div>
                        <div className="c-right-blk">
                          <div className="cart-prod-title qa-txt-alg-rgt qa-fw-b">
                            {data ? (
                              <span>
                                {data["tat"]
                                  ? data["tat"] -
                                    (shippingMode === "SEA" ? 7 : 3)
                                  : "0"}
                                -{data["tat"] ? data["tat"] : "0"} days
                              </span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </div>
                      </div>
                      {/* <div className="qa-pad-015">
                        <div className="c-left-blk">
                          <div className="qa-fw-b">Total estimated charges</div>
                        </div>
                        <div className="c-right-blk">
                          <div className="cart-prod-name qa-txt-alg-rgt">
                            {getSymbolFromCurrency(convertToCurrency)}
                            {getConvertedCurrency(
                              data["frightCostMin"] + data["dutyMin"],
                              true
                            )}
                            -{getSymbolFromCurrency(convertToCurrency)}
                            {getConvertedCurrency(
                              data["frightCostMax"] + data["dutyMax"],
                              true
                            )}
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
              )}
              <div
                className="cart-prod-title qa-pad-btm-1 qa-border-bottom qa-cursor qa-mar-top-1"
                onClick={() => setEstimatedDelivery(!estimatedDelivery)}
              >
                Estimated delivery date
                <span style={{ float: "right" }}>
                  {estimatedDelivery ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>
              {estimatedDelivery && (
                <div className="qa-pad-top-2 qa-pad-btm-1 edd-section">
                  <div className="qa-mar-btm-1">
                    <li>
                      <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                        Estimated production/ dispatch time
                      </div>
                      <div className="c-right-blk qa-txt-alg-rgt">
                        {typeOfOrder === "ERTM" ? "30-40" : "7-10"} days
                      </div>
                    </li>
                  </div>

                  <div className="qa-mar-btm-1">
                    <li>
                      <div className="c-left-blk qa-txt-alg-lft qa-stitle">
                        Estimated shipping lead time
                      </div>
                      <div className="c-right-blk qa-txt-alg-rgt">
                        {tat && shippingMode ? (
                          <span>
                            {tat - (shippingMode === "AIR" ? 3 : 7)}-{tat} days
                          </span>
                        ) : (
                          "-"
                        )}
                      </div>
                    </li>
                  </div>
                </div>
              )}
            </Col>
          </Row>

          <div
            className="cart-prod-title qa-pad-btm-1 qa-mar-btm-2 qa-border-bottom qa-cursor qa-mar-top-1"
            onClick={() => setShowCart(!showCart)}
          >
            Shopping cart
            <span style={{ float: "right" }}>
              {showCart ? (
                <UpOutlined style={{ fontSize: "12px" }} />
              ) : (
                <DownOutlined style={{ fontSize: "12px" }} />
              )}
            </span>
          </div>
          {showCart && (
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
                            freeShippingEligible = false,
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
                                {(sellerList.includes(sellerCode) ||
                                  freeShippingEligible) && (
                                  <div className="qa-mar-top-15 qa-offer-text">
                                    FREE shipping
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
                                {(!sellerList.includes(sellerCode) ||
                                  !freeShippingEligible) && (
                                  <div className="cart-price-text qa-mar-btm-1">
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
                            {total ? getConvertedCurrency(total) : ""}
                          </Col>
                        </Row>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
          )}
        </Col>
      )}
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    currencyDetails: state.currencyConverter,
    brandNames: state.userProfile.brandNameList,
  };
};

export default connect(mapStateToProps, null)(PaymentDetails);
