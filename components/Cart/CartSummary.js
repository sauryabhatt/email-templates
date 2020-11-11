/** @format */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button, Popover, Row, Modal, Checkbox, message, Spin } from "antd";
import Icon from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import PayWithPaypal from "../PayWithPayPal/PayWithPaypal";
import { useKeycloak } from "@react-keycloak/ssr";
import countries from "../../public/filestore/countryCodes_en.json";
import getSymbolFromCurrency from "currency-symbol-map";
import _ from "lodash";

const CartSummary = (props) => {
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const [popover, setPopover] = useState("");
  const [popoverData, setPopoverData] = useState({
    total: 0,
    qalaraSellerMargin: 0,
    qualityTestingCharge: 0,
  });
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [locale, setLocale] = useState(null);
  const [localeUpdated, setLocaleUpdated] = useState(false);
  const [estimateCharge, setEstimateCharge] = useState(0);
  const [sellerTotalAmount, setSellerTotalAmount] = useState(0);
  const [samplePrice, setSamplePrice] = useState(0);
  const [qualityPrice, setQualityPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [nonShippable, setNonShippable] = useState(false);
  const [orderModal, showOrderModal] = useState(false);
  const [reRender, setReRender] = useState(false);

  useEffect(() => {
    if (props.cart) {
      getCountryCode();
      getEstimateCharge();
    }
  }, [props]);

  useEffect(() => {
    if (reRender) {
      setReRender(false);
    } else {
      setReRender(true);
    }
  }, [props.currencyDetails]);

  let {
    enable = false,
    id = "",
    cart = "",
    user = {},
    brandNames = "",
    deliver = true,
    showCartError = false,
    currencyDetails = {},
    shippingMode = "",
    disablePayment = false,
    hideCreateOrder = false,
  } = props;
  let {
    subOrders = [],
    orderId = "",
    miscCharges = [],
    total = 0,
    priceQuoteRef = "",
    referralCode = "",
    shippingAddressDetails = {},
  } = cart || {};
  let frieghtCharge = 0;
  let dutyCharge = 0;
  let vatCharge = 0;
  let couponDiscount = 0;
  let freightDis = 0;

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
    }
  }

  if (couponDiscount > 0) {
    frieghtCharge = freightDis;
  }

  let { convertToCurrency = "" } = currencyDetails || {};
  let { orgName = "", email = "", firstName = "" } = user || {};
  let {
    addressLine1 = "",
    addressLine2 = "",
    city = "",
    state = "",
    zipCode = "",
    country = "",
  } = shippingAddressDetails || {};

  const getConvertedCurrency = (baseAmount) => {
    let { convertToCurrency = "", rates = [] } = currencyDetails;
    return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(2);
  };

  const popupHover = (value) => {
    setPopover(value);
  };

  const handleCheck = (e) => {
    setIsTermsAccepted(e.target.checked);
    document.getElementsByClassName("termsError")[0].style.display = "none";
  };

  const showError = (value) => {
    if (value) {
      document.getElementsByClassName("termsError")[0].style.display = "block";
    } else {
      document.getElementsByClassName("termsError")[0].style.display = "none";
    }
  };

  const checkCommitStatus = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/my/${orderId}/checkout/?mode=${shippingMode}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
      .then((result) => {
        let { status = "" } = result;
        if (status === "COMMITTED") {
          let url = "/payment";
          router.push(url);
        } else {
          console.log("Not shippable");
          setNonShippable(true);
        }
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  };

  const createOrder = () => {
    let url = process.env.REACT_APP_REDIRECT_APP_DOMAIN + "/product/";
    let productList = [];
    let currencyFormat = getSymbolFromCurrency(convertToCurrency);
    for (let orders of subOrders) {
      let { products = [] } = orders;
      for (let product of products) {
        let {
          productId = "",
          productName = "",
          quantity = "",
          priceMin = "",
          articleId = "",
        } = product;
        let obj = {
          productId: productId,
          productName: productName,
          quantity: quantity,
          priceMin: currencyFormat + priceMin,
          linkOfProduct: url + articleId,
        };
        productList.push(obj);
      }
    }

    let data = {
      buyerName: firstName,
      buyerEmailId: email,
      buyerOrgName: orgName,
      orderId: orderId,
      quoteId: priceQuoteRef,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: city,
      state: state,
      country: country,
      zipCode: zipCode,
      products: productList,
    };
    fetch(process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL + "/v1/orders/assist", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + keycloak.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          showOrderModal(true);
          // return res.json();
        } else {
          throw res.statusText || "Error in create order";
        }
      })
      // .then((res) => {
      //   showOrderModal(true);
      // })
      .catch((err) => {
        message.error(err.message || err, 5);
        // setLoading(false);
      });
  };

  const handleCancel = () => {
    showOrderModal(false);
    if (id === "cart") {
      props.clearCart();
    } else {
      router.push("/cart");
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
      .then((res) => {
        let url = "/order/" + cart.orderId + "/payment-success";
        router.push(url);
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  };

  const capturePayment = (authId, orderId, actions) => {
    let finalValue = getConvertedCurrency(cart.total);
    let data = {
      amount: {
        value: parseFloat((finalValue * 20) / 100).toFixed(2),
        currency_code: currencyDetails.convertToCurrency,
      },
      final_capture: false,
    };

    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        "/payments/paypal/" +
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
        }
      })
      .catch((err) => {
        voidPPOrder(orderId);
        let data = {
          gbOrderNo: cart.orderId,
        };
        updateOrder(data, "FAILED");
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
        let url = "/order/" + cart.orderId + "/payment-failure";
        router.push(url);
        // setIsProcessing(false);
        // router.push('/payment-success')
      })
      .catch((err) => {
        let url = "/order/" + cart.orderId + "/payment-failure";
        router.push(url);
        // setLoading(false);
      });
  };

  const authorizePayment = (orderId, actions) => {
    setIsProcessing(true);
    let finalValue = getConvertedCurrency(cart.total);
    let data = {
      amount: {
        value: parseFloat((finalValue * 20) / 100).toFixed(2),
        currency_code: currencyDetails.convertToCurrency,
      },
    };
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_PAYMENTS_URL +
        "/payments/paypal/" +
        cart.orderId +
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
          gbOrderNo: cart.orderId,
        };
        updateOrder(data, "FAILED");
        message.error(err.message || err, 5);
        // setLoading(false);
      });
  };

  const getEstimateCharge = () => {
    let sum = 0;
    if (cart) {
      cart.miscCharges &&
        cart.miscCharges.map((charges) => {
          if (charges.chargeId == "FREIGHT_CHARGES") {
            sum =
              sum +
                cart.miscCharges.find((x) => x.chargeId === "FREIGHT_CHARGES")
                  .amount || 0;
          } else if (charges.chargeId == "CUSTOM_CHARGES") {
            sum =
              sum +
                cart.miscCharges.find((x) => x.chargeId === "CUSTOM_CHARGES")
                  .amount || 0;
          }
        });
    }
    setEstimateCharge(sum);
  };

  const getCountryCode = () => {
    let { shippingAddressDetails = {} } = cart || {};
    let { country = "" } = shippingAddressDetails;
    let code = countries[country.toUpperCase()];
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

  const priceBreakup = (
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
          {getSymbolFromCurrency(convertToCurrency)}
          {basePrice ? getConvertedCurrency(basePrice) : ""}
        </div>
        <div className="c-left-blk qa-mar-btm-05">Qalara margin</div>
        <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
          <span style={{ textDecoration: "line-through", marginRight: "5px" }}>
            {getSymbolFromCurrency(convertToCurrency)}
            {popoverData["qalaraSellerMargin"]
              ? getConvertedCurrency(popoverData["qalaraSellerMargin"])
              : ""}
          </span>

          <span style={{ color: "#27AE60" }}>
            {getSymbolFromCurrency(convertToCurrency)}
            {popoverData["qalaraSellerMargin"] ? getConvertedCurrency(0) : ""}
          </span>
        </div>
        {qualityPrice > 0 && (
          <div className="c-left-blk qa-mar-btm-05">Quality testing</div>
        )}
        {qualityPrice > 0 && (
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(convertToCurrency)}
            {qualityPrice ? getConvertedCurrency(qualityPrice) : ""}
          </div>
        )}
        {samplePrice > 0 && (
          <div className="c-left-blk qa-mar-btm-05">Sample required</div>
        )}
        {samplePrice > 0 && (
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(convertToCurrency)}
            {samplePrice ? getConvertedCurrency(samplePrice) : ""}
          </div>
        )}
        <div className="c-left-blk qa-fw-b">Total</div>
        <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
          {getSymbolFromCurrency(convertToCurrency)}
          {sellerTotalAmount ? getConvertedCurrency(sellerTotalAmount) : ""}
        </div>
      </div>
      <div className="qa-tc-white qa-fs-12 qa-lh qa-txt-alg-cnt">
        Note: Qalara margin may vary by total cart value{" "}
        <span>
          <Link href="/FAQforwholesalebuyers">
            <a target="_blank" className="qa-sm-color">
              Refer FAQs here
            </a>
          </Link>
        </span>
      </div>
    </div>
  );

  if (isProcessing) {
    return (
      <Row justify="space-around" className="order-body">
        <Spin tip="Processing payment" size="large" />
      </Row>
    );
  }

  if (id === "empty-cart") {
    return (
      <div className="qa-pad-2 qa-mar-btm-1 cart-price-block empty-cart">
        <div className="cart-price-title qa-border-bottom qa-mar-btm-2">
          Your cart is empty!
        </div>
        <div className="e-cart-subtitle">
          You do not have any product added to your cart. Please add saved
          products to cart or start shopping.
        </div>
        <Link href="/account/profile">
          <div className="e-link">My account</div>
        </Link>
        <Link href="/FAQforwholesalebuyers">
          <div className="e-link qa-mar-btm-3">See FAQ</div>
        </Link>
        <Link href="/">
          <div className="qa-txt-alg-cnt">
            <Button
              className="qa-button qa-fs-12 qa-shop-btn"
              onClick={() => {}}
            >
              Start Shopping
            </Button>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="qa-pad-2 qa-mar-btm-1 cart-price-block">
      <div className="cart-price-title qa-border-bottom qa-mar-btm-2">
        Cart summary
      </div>

      <div>
        {_.map(subOrders, (order, i) => {
          let {
            products = "",
            sellerCode = "",
            total = "",
            qalaraSellerMargin = 0,
            basePrice = 0,
          } = order;
          let totalAmount = total;
          let samplePrice = 0;
          let testingPrice = 0;
          for (let items of products) {
            let {
              qualityTestingCharge = 0,
              sampleCost = 0,
              quantity = 0,
              exFactoryPrice = 0,
            } = items;
            samplePrice = samplePrice + sampleCost;
            testingPrice = testingPrice + qualityTestingCharge;
            basePrice = basePrice + exFactoryPrice * quantity;
          }
          return (
            <div className="qa-mar-btm-2" key={i}>
              <div className="cart-prod-name qa-mar-btm-1">
                {brandNames &&
                  brandNames[sellerCode] &&
                  brandNames[sellerCode].brandName}
              </div>
              <div className="cart-ship-pt qa-border-bottom">
                <div className="c-left-blk">Value of products purchased</div>
                <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                  {getSymbolFromCurrency(convertToCurrency)}
                  {totalAmount ? getConvertedCurrency(totalAmount) : ""}
                  <div className="qa-txt-alg-rgt">
                    <Popover
                      placement="bottomRight"
                      content={priceBreakup}
                      trigger="click"
                      visible={popover === sellerCode ? true : false}
                      overlayClassName="price-breakup-popup"
                    >
                      <div
                        className="c-breakup"
                        onClick={() => {
                          popupHover(sellerCode);
                          setPopoverData(order);
                          setSellerTotalAmount(totalAmount);
                          setSamplePrice(samplePrice);
                          setQualityPrice(testingPrice);
                          setBasePrice(basePrice);
                        }}
                      >
                        See breakup
                      </div>
                    </Popover>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="qa-mar-btm-05">
        <div className="cart-ship-pt">
          <div className="c-left-blk cart-prod-name">
            Estimated freight fees
          </div>

          <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
            {id !== "cart" && frieghtCharge > 0 ? (
              <span>
                <span>
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(frieghtCharge)}
                </span>
              </span>
            ) : (
              <span>
                {id === "cart" ? (
                  "TBD"
                ) : (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(0)}
                  </span>
                )}
              </span>
            )}
            *
          </div>
        </div>
      </div>

      <div className="qa-mar-btm-05">
        <div className="cart-ship-pt qa-border-bottom">
          <div className="c-left-blk cart-prod-name">
            Estimated custom, taxes & duties
          </div>
          <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
            {id !== "cart" && dutyCharge > 0 ? (
              <span>
                {getSymbolFromCurrency(convertToCurrency)}
                {getConvertedCurrency(dutyCharge)}
              </span>
            ) : (
              <span>
                {id === "cart" ? (
                  "TBD"
                ) : (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(0)}
                  </span>
                )}
              </span>
            )}
            *
          </div>
        </div>
      </div>

      <div className="qa-mar-top-2">
        <div className="cart-ship-pt">
          <div className="c-left-blk cart-prod-name font-size-17">SUBTOTAL</div>
          <div className="c-right-blk qa-fw-b qa-txt-alg-rgt font-size-17">
            {getSymbolFromCurrency(convertToCurrency)}
            {total
              ? getConvertedCurrency(total + couponDiscount - vatCharge)
              : ""}
          </div>
        </div>
      </div>
      <div
        className={`${
          referralCode || couponDiscount > 0 ? "" : "qa-mar-btm-2"
        }`}
      >
        <div
          className={`${
            referralCode || couponDiscount > 0
              ? "cart-ship-pt"
              : "cart-ship-pt qa-border-bottom"
          }`}
        >
          <div className="c-left-blk cart-prod-name qa-mar-btm-05">
            VAT/ GST
          </div>
          <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
            {id !== "cart" && vatCharge > 0 ? (
              <span>
                {getSymbolFromCurrency(convertToCurrency)}
                {getConvertedCurrency(vatCharge)}
              </span>
            ) : (
              <span>
                {id === "cart" ? (
                  "TBD"
                ) : (
                  <span>
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(vatCharge)}
                  </span>
                )}
              </span>
            )}
            *
          </div>
          <div className="c-left-blk">
            Part of these charges are refundable.{" "}
            <Link href="/FAQforwholesalebuyers">
              <a target="_blank">
                <span className="qa-sm-color qa-cursor">Know more</span>
              </a>
            </Link>
          </div>
        </div>
      </div>

      {id !== "cart" && (referralCode || couponDiscount > 0) && (
        <div className="qa-mar-btm-2">
          <div className="cart-ship-pt qa-border-bottom">
            <div className="c-left-blk cart-prod-name">Coupon discount</div>
            <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
              {id !== "cart" && couponDiscount > 0 ? (
                <span style={{ color: "#27AE60" }}>
                  -{getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(couponDiscount)}
                </span>
              ) : (
                <span style={{ color: "#27AE60" }}>
                  -{getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(couponDiscount)}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="cart-ship-pt">
          <div className="c-left-blk cart-prod-name qa-mar-btm-05 font-size-17">
            TOTAL CART VALUE
          </div>
          <div className="c-right-blk qa-fw-b qa-txt-alg-rgt font-size-17">
            {getSymbolFromCurrency(convertToCurrency)}
            {total ? getConvertedCurrency(total) : ""}
          </div>
          <div className="c-left-blk">With refundable taxes</div>
        </div>
      </div>
      {id === "cart" && (
        <div>
          {enable && deliver && !showCartError ? (
            <Link href="/shipping">
              <Button
                className={`${
                  enable && deliver && !showCartError
                    ? "qa-button qa-fs-12 qa-mar-top-1 proceed-to-ship active"
                    : "qa-button qa-fs-12 qa-mar-top-1 proceed-to-ship"
                }`}
              >
                Proceed to shipping
              </Button>
            </Link>
          ) : (
            <Button
              className={`${
                enable && deliver && !showCartError
                  ? "qa-button qa-fs-12 qa-mar-top-1 proceed-to-ship active"
                  : "qa-button qa-fs-12 qa-mar-top-1 proceed-to-ship"
              }`}
            >
              Proceed to shipping
            </Button>
          )}
        </div>
      )}
      {id === "shipping" && (
        <div>
          {enable && deliver && !showCartError && !disablePayment ? (
            <Button
              onClick={checkCommitStatus}
              className={`${
                enable && deliver && !showCartError && !disablePayment
                  ? "qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment active"
                  : "qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment"
              }`}
            >
              Proceed to payment
            </Button>
          ) : (
            <Button
              className={`${
                enable && deliver && !showCartError && !disablePayment
                  ? "qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment active"
                  : "qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment"
              }`}
            >
              Proceed to payment
            </Button>
          )}
        </div>
      )}

      {id === "payment" && (
        <div>
          <div className="qa-mar-top-2 qa-mar-btm-1">
            <Checkbox onChange={handleCheck} id="check"></Checkbox>

            <span className="qa-font-san qa-fs-12 qa-tc-white qa-mar-lft">
              I agree to the terms & conditions
            </span>

            <span
              className="qa-font-san qa-fs-14 termsError qa-error"
              style={{ display: "none" }}
            >
              Please accept this agreement
            </span>
          </div>

          {/* {order && localeUpdated ? ( */}
          <PayWithPaypal
            token={keycloak.token}
            saveOrder={saveOrder}
            order={cart}
            user={user}
            currency={currencyDetails.convertToCurrency}
            countryCode={
              cart &&
              cart["shippingAddressDetails"] &&
              countries[
                cart.shippingAddressDetails["country"].toString().toUpperCase()
              ]
            }
            termsAccepted={isTermsAccepted}
            showError={showError}
            locale={locale}
            isCartSummary={true}
            currencyDetails={currencyDetails}
          />
          {/* )} */}
        </div>
      )}

      {(!deliver || disablePayment) && !showCartError && !hideCreateOrder && (
        <Button
          onClick={createOrder}
          className="qa-button qa-fs-12 qa-mar-top-1 create-order-btn"
        >
          Create order
        </Button>
      )}
      {!deliver && id === "cart" && !showCartError && !hideCreateOrder && (
        <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 qa-txt-alg-cnt">
          *We currently don't have instant checkout enabled for your country.
          However, in most cases we can still arrange to deliver the order to
          you. Please click on 'Create Order' and we will share a link over
          email with the necessary details to process your order. The link will
          also be available in your Qalara Account section.
        </div>
      )}
      {disablePayment && id === "shipping" && (
        <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 qa-txt-alg-cnt">
          Please click on create order and we will get back within the next 24
          hours to complete your order
        </div>
      )}

      {deliver && !nonShippable ? (
        <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 qa-txt-alg-cnt">
          {id === "cart" ? (
            <span>*Proceed to review shipping mode and costs</span>
          ) : (
            <span>
              {!disablePayment && <span>*Proceed to review payment mode</span>}
            </span>
          )}
        </div>
      ) : (
        <div className="qa-lh qa-txt-alg-cnt qa-error"></div>
      )}
      <Modal
        visible={orderModal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "30px", background: "#f2f0eb" }}
        width={500}
        className="create-order-modal"
      >
        <div className="qa-font-san qa-rel-pos">
          <div
            onClick={handleCancel}
            style={{
              position: "absolute",
              right: "0px",
              top: "0px",
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
            <p className="create-order-title">Thank you!</p>
            <p className="create-order-stitle">
              We have received your order request. Our team will get back to you
              within the next 24 hours to help complete your order.
            </p>
          </div>
          <div className="qa-txt-alg-cnt">
            <Button
              className="qa-button qa-create-order-btn"
              onClick={() => {
                router.push("/");
              }}
            >
              Continue shopping
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartSummary;
