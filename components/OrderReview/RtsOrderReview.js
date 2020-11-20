/** @format */

import React, { useState, useEffect } from "react";
import { Button, Row, Col, Radio, Modal } from "antd";
import Icon, {
  UpOutlined,
  DownOutlined,
  CheckCircleOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { Steps } from "antd";
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
import alertIcon from "../../public/filestore/alertIcon";
import deliveredCountryList from "./../../public/filestore/deliveredCountries.json";
import { useKeycloak } from "@react-keycloak/ssr";
import { getOrderByOrderId } from "../../store/actions";
import { useRouter } from "next/router";

const { Step } = Steps;

const RtsOrderReview = (props) => {
  const { keycloak } = useKeycloak();
  const router = useRouter();
  let { orderId: orderIdParam } = router.query;
  let { cart = {}, brandNames = "", user = {}, currencyDetails = {} } = props;
  useEffect(() => {
    props.getOrderByOrderId(keycloak.token, orderIdParam);
  }, [keycloak.token]);
  let {
    subOrders = [],
    shippingAddressDetails = "",
    orderId = "",
    shippingMode = "",
    isFulfillable = false,
  } = cart || {};
  let {
    fullName = "",
    addressLine1 = "",
    addressLine2 = "",
    city = "",
    country = "",
    id = "",
    isDefault = "",
    state = "",
    zipCode = "",
    phoneNumber = "",
    profileId = "",
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
  const [modal, showModal] = useState(false);
  const [paymentValue, setPaymentValue] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showShip, setShowShip] = useState(false);
  const mediaMatch = window.matchMedia("(min-width: 1024px)");
  const [data, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [deliver, setDeliver] = useState(false);

  useEffect(() => {
    setPaymentValue("payViaPaypal");
  }, []);

  useEffect(() => {
    let { cart = "", app_token = "" } = props;
    let { priceQuoteRef = "", shippingMode = "", shippingAddressDetails = {} } =
      cart || {};
    if (priceQuoteRef && shippingMode) {
      let { country = "" } = shippingAddressDetails || {};
      if (deliveredCountryList.includes(country)) {
        setDeliver(true);
      }

      fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=${shippingMode}`,
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
            return res.json();
          } else {
            throw res.statusText || "COntent not found";
          }
        })
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((error) => {
          // message.error(error)
          setLoading(false);
        });
    }
  }, [props.cart]);

  let { convertToCurrency = "" } = currencyDetails || {};
  let showError = false;
  if (subOrders && subOrders.length) {
    for (let orders of subOrders) {
      let { total = 0 } = orders;
      if (total < 250) {
        showError = true;
      }
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

  const customDot = (dot, { status, index }) => (
    <span className="qa-ant-steps-icon">
      {status === "finish" ? <CheckOutlined /> : index + 1}
    </span>
  );

  const onChange = (e) => {
    setPaymentValue(e.target.value);
  };

  const handleCancel = () => {
    showModal(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Row id="cart-details" className="cart-section qa-font-san">
      <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
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
            Payment
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
              <div className="">{shippingAddr}</div>
            </div>
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
                      <span>
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
                        <span className="qa-va-m">{shippingMode}</span>
                      </span>
                    </div>
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">
                          Estimated freight fees
                        </div>
                      </div>
                      <div className="c-right-blk qa-txt-alg-lft">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
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
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">
                          Estimated custom duties
                        </div>
                      </div>
                      <div className="c-right-blk">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
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
                    </div>
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">Total lead time</div>
                      </div>
                      <div className="c-right-blk">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                          {data ? <span>{data["tat"]} Days</span> : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="qa-pad-015">
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
                    </div>
                  </div>
                </Col>
              </Row>
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
                            total < 250 ? " qa-error-border" : ""
                          } ${i < subOrders.length - 1 ? "qa-mar-btm-2" : ""}`}
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
                            <div
                              className="qa-disp-table-cell"
                              style={{ width: "80%" }}
                            >
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
                                    <div className="cart-sub-text p-out-of-stock">
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
                                        <CheckCircleOutlined /> Quality testing
                                      </div>
                                    )}
                                    {isSampleDeliveryRequired && (
                                      <div className="cart-subtitle qa-mar-btm-2">
                                        <CheckCircleOutlined /> Sample required
                                      </div>
                                    )}
                                    <div className="cart-prod-title qa-fw-b">
                                      {getSymbolFromCurrency(convertToCurrency)}
                                      {total ? getConvertedCurrency(total) : ""}
                                    </div>
                                    <div className="cart-price-text">
                                      Base price per unit excl. margin and other
                                      charges
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
                        <span className="cart-prod-title qa-mar-btm-05">
                          Pay 20% now and 80% later
                        </span>
                      </Radio>
                      <div className="cart-subtitle payment-subtitle qa-mar-btm-2">
                        20% advance will be charged now. Balance 80% will be
                        charged once customs clearance is done at destination, a
                        few days before delivery.
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
              {showError && (
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
                  Please move the seller cart with value less than{" "}
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(250)} to 'Save for later' in order to
                  proceed
                </div>
              )}
              {isFulfillable === false && (
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
              )}
              <CartSummary
                id="payment"
                enable={isFulfillable}
                cart={cart}
                user={user}
                brandNames={brandNames}
                currencyDetails={currencyDetails}
                deliver={deliver}
              />
            </Col>
          )}
        </Row>
      </Col>
      <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>

      <Col xs={24} sm={24} md={0} lg={0} xl={0} className="qa-pad-0-20">
        <Row>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            className="cart-title qa-mar-btm-2 "
          >
            Payment mode
          </Col>
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
                    <span className="cart-prod-title qa-mar-btm-05">
                      Pay 20% now and 80% later
                    </span>
                  </Radio>
                  <div className="cart-subtitle payment-subtitle qa-mar-btm-2">
                    20% advance will be charged now. Balance 80% will be charged
                    once customs clearance is done at destination, a few days
                    before delivery.
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
            md={8}
            lg={8}
            xl={8}
            className="qa-pad-btm-2 qa-mar-btm-1"
          >
            {showError && (
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
                Please move the seller cart with value less than{" "}
                {getSymbolFromCurrency(convertToCurrency)}
                {getConvertedCurrency(250)} to 'Save for later' in order to
                proceed
              </div>
            )}
            {isFulfillable === false && (
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
            )}
            <CartSummary
              id="payment"
              enable={isFulfillable}
              cart={cart}
              user={user}
              brandNames={brandNames}
              currencyDetails={currencyDetails}
              deliver={deliver}
            />
          </Col>

          <Col
            xs={24}
            sm={24}
            md={15}
            lg={15}
            xl={15}
            className="shipping-section"
          >
            <div className="qa-tc-white qa-mar-btm-1 cart-ship-pt">
              <div className="qa-fw-b qa-mar-btm-05">Shipping to:</div>
              <div className="qa-border-bottom qa-pad-btm-1">
                {shippingAddr}
              </div>
            </div>
            <div
              className="cart-ship-pt qa-border-bottom qa-cursor qa-tc-white qa-font-san"
              onClick={() => setShowShip(!showShip)}
            >
              <span className="qa-fw-b">Shipping mode:</span> {shippingMode}
              <span style={{ float: "right" }}>
                {showShip ? (
                  <UpOutlined style={{ fontSize: "12px" }} />
                ) : (
                  <DownOutlined style={{ fontSize: "12px" }} />
                )}
              </span>
            </div>
            {showShip && (
              <div className="qa-pad-top-2 qa-pad-btm-2 qa-horizontal-scroll">
                <div>
                  <div className="qa-bg-dark-theme qa-pad-2 qa-box-shadow">
                    <div className="qa-pad-btm-15 qa-border-bottom">
                      <span>
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
                        <span className="qa-va-m">{shippingMode}</span>
                      </span>
                    </div>
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">
                          Estimated freight fees
                        </div>
                      </div>
                      <div className="c-right-blk qa-txt-alg-lft">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(data["frightCostMin"], true)}-
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(data["frightCostMax"], true)}
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
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(data["dutyMin"], true)}-
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(data["dutyMax"], true)}
                        </div>
                      </div>
                    </div>
                    <div className="qa-pad-015 qa-dashed-border">
                      <div className="c-left-blk qa-txt-alg-lft">
                        <div className="cart-info-text">Total lead time</div>
                      </div>
                      <div className="c-right-blk">
                        <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                          {data ? <span>{data["tat"]} Days</span> : "-"}
                        </div>
                      </div>
                    </div>
                    <div className="qa-pad-015">
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
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Col>
        </Row>

        <div
          className="cart-prod-title qa-fw-b qa-pad-btm-1 qa-mar-btm-2 qa-border-bottom qa-cursor qa-mar-top-1"
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
            <Col xs={24} sm={24} md={15} lg={15} xl={15}>
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

                        <div className="qa-disp-tc" style={{ width: "80%" }}>
                          {brandNames &&
                            brandNames[sellerCode] &&
                            brandNames[sellerCode].brandName}
                          {total < 250 && (
                            <div className="cart-sub-text">
                              Add {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(250 - total)} more to reach
                              seller’s minimum order value
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
                                <div className="cart-sub-text p-out-of-stock qa-pad-0-20">
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
                              className="qa-mar-top-15"
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
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        )}
      </Col>

      <Modal
        visible={modal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "20px 30px", backgroundColor: "#f9f7f2" }}
        width={750}
        style={{ top: 5 }}
        className="opt-service-modal"
      ></Modal>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    currencyDetails: state.currencyConverter,
    cart: state.userProfile.order,
    user: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, { getOrderByOrderId })(RtsOrderReview);
