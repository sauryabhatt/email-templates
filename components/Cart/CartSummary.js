/** @format */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Popover,
  Row,
  Modal,
  Checkbox,
  message,
  Spin,
  Tooltip,
} from "antd";
import Icon, { CheckCircleOutlined } from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import infoIcon from "../../public/filestore/infoSuccess";
import PayWithPaypal from "../PayWithPayPal/PayWithPaypal";
import { useKeycloak } from "@react-keycloak/ssr";
import countries from "../../public/filestore/countryCodes_en.json";
import getSymbolFromCurrency from "currency-symbol-map";
import sellerList from "../../public/filestore/freeShippingSellers.json";
import alertIcon from "../../public/filestore/alertIcon";
import _ from "lodash";
import OtpInput from "react-otp-input";

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
  const [sellers, setSellers] = useState([]);
  const [qalaraMargin, setQalaraMargin] = useState(0);
  const [otpVerificationModal, setOtpVerificationModal] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  const [otpLengthError, setOtpLengthError] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  let retryCount = 0;
  let retryCountCP = 0;
  let retryCountAP = 0;
  let retryCountOR = 0;

  useEffect(() => {
    if (props.cart) {
      getCountryCode();
      getEstimateCharge();
      if (
        props.cart.subOrders &&
        props.cart.subOrders.length &&
        props.brandNames
      ) {
        let sellers = [];
        for (let orders of props.cart.subOrders) {
          let { sellerCode = "" } = orders;
          if (sellerList.includes(sellerCode)) {
            let sellerName = brandNames[sellerCode]
              ? brandNames[sellerCode].brandName
                ? brandNames[sellerCode].brandName
                : ""
              : "";
            sellers.push(sellerName);
          }
        }
        setSellers(sellers);
      }
    }
  }, [props]);

  useEffect(() => {
    setPopover("");
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
    tat = "",
    shippingTerm = "",
    rfqReason = "",
  } = props;
  let {
    subOrders = [],
    orderId = "",
    miscCharges = [],
    total = 0,
    priceQuoteRef = "",
    referralCode = "",
    shippingAddressDetails = {},
    promoDiscount = "",
    promoCode = "",
    shippingTerms = "",
  } = cart || {};
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
  if (id === "payment" && shippingTerms) {
    shippingTerm = shippingTerms.toLowerCase();
  }

  if (cart && cart.shippingMode) {
    shippingMode = cart.shippingMode;
  }

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

  if (couponDiscount > 0 || sellerDiscount > 0 || productDiscount > 0) {
    frieghtCharge = freightDis;
  }

  let { convertToCurrency = "" } = currencyDetails || {};
  let {
    addressLine1 = "",
    addressLine2 = "",
    city = "",
    state = "",
    zipCode = "",
    country = "",
    phoneNumber = "",
  } = shippingAddressDetails || {};

  let { verifiedEmail = false, email = "" } = user || {};

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

  const proceedToShipping = () => {
    setBtnLoading(true);
    router.push("/shipping");
  };

  const checkCommitStatus = () => {
    setBtnLoading(true);
    let cartId = orderId || subOrders.length > 0 ? subOrders[0]["orderId"] : "";
    let url = `${
      process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL
    }/orders/my/${cartId}/checkout/?mode=${shippingMode}&promoCode=${promoCode}&promoDiscount=${couponDiscount}&tat=${tat}&shippingTerms=${shippingTerm.toUpperCase()}`;

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + keycloak.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Something went wrong please try again!";
        }
      })
      .then((result) => {
        let { status = "" } = result;
        if (status === "COMMITTED") {
          let url = "/payment";
          router.push(url);
        } else {
          setNonShippable(true);
          message.error("Something went wrong please try again!", 5);
        }
        setBtnLoading(false);
      })
      .catch((err) => {
        setBtnLoading(false);
        message.error(err.message || err, 5);
      });
  };

  const createOrder = async () => {
    setBtnLoading(true);
    let shippingRemarks = rfqReason
      ? rfqReason
      : "RFQ created from Shipping page";
    let cartRemarks = "Country/Zipcode not serviceable";

    let {
      profileId = "",
      profileType = "",
      email = "",
      firstName = "",
      orgName = "",
      orgPhone = "",
    } = user || {};
    let buyerId = profileId.replace("BUYER::", "");

    let shippingAddr = "";
    shippingAddr =
      firstName +
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

    let data = {
      profileId: profileId,
      profileType: profileType,
      targetDeliveryDate: "",
      requesterName: firstName,
      companyName: orgName,
      emailId: email,
      mobileNo: orgPhone,
      destinationCountry: country,
      destinationCity: city,
      zipcode: zipCode,
      rfqType: id === "shipping" ? "SHIPMENT RFQ" : "CART RFQ",
      buyerId: buyerId,
      remarks: id === "shipping" ? shippingRemarks : cartRemarks,
      collectionName: "",
      deliveryAddress: shippingAddr,
    };

    let productList = [];
    let i = 0;
    for (let orders of subOrders) {
      let { products = [] } = orders;
      for (let product of products) {
        let {
          articleId = "",
          quantity = "",
          priceApplied = "",
          exfactoryListPrice = "",
        } = product;
        let price = exfactoryListPrice;
        if (priceApplied && priceApplied !== null) {
          price = priceApplied;
        }
        let obj = {};
        obj["articleId"] = articleId;
        obj["quantity"] = quantity;
        obj["priceApplied"] = price;
        obj["remarks"] = "";
        productList.push(obj);
        i++;
      }
    }

    data.products = productList;

    let userDetails = "";
    const response = await fetch("https://ipapi.co/json/", {
      method: "GET",
    });
    userDetails = await response.json();
    let { ip = "", country: ipCountry = "" } = userDetails || {};
    data.fromIP = ip || "";
    data.ipCountry = ipCountry || "";

    const rfqResp = await fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/forms/queries",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        },
      }
    );
    const rfqResponse = await rfqResp;
    if (rfqResponse && rfqResponse["status"] === 200) {
      const cartResp = await fetch(
        process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL +
          "/v1/orders/status/" +
          orderId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + keycloak.token,
          },
        }
      );
      const cartResponse = await cartResp;
      if (cartResponse && cartResponse["status"] === 200) {
        showOrderModal(true);
        setBtnLoading(false);
      } else {
        setBtnLoading(false);
      }
    }
  };

  const hideOtpModal = () => {
    setOtpVerificationModal(false);
  };

  const sendOtp = () => {
    setOtpError(false);
    setBtnLoading(true);
    setOtpInput("");
    setOtpLengthError(false);
    fetch(process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + keycloak.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.text();
        } else {
          throw res.statusText || "Error while signing up.";
        }
      })
      .then((res) => {
        setOtpVerificationModal(true);
        setBtnLoading(false);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        setBtnLoading(false);
      });
  };

  const handleOtpChange = (otp) => {
    setOtpInput(otp);
  };

  const validateOtp = () => {
    if (otpInput.length !== 6) {
      setOtpLengthError(true);
    } else {
      setBtnLoading(true);
      setOtpLengthError(false);
      fetch(
        process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/otp/validate",
        {
          method: "POST",
          body: otpInput,
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
            throw res.statusText || "Error while signing up.";
          }
        })
        .then((res) => {
          setOtpVerificationModal(true);
          setOtpError(false);
          setOtpValidated(true);
          props.getUserProfile();
          setBtnLoading(false);
        })
        .catch((err) => {
          setOtpError(true);
          setOtpValidated(false);
          setBtnLoading(false);
          // message.error(err.message || err, 5);
        });
    }
  };

  // const createOrder = () => {
  //   console.log("Create order id ", id);
  //   let url =
  //     process.env.NEXT_PUBLIC_REACT_APP_REDIRECT_APP_DOMAIN + "/product/";
  //   let productList = [];
  //   let currencyFormat = getSymbolFromCurrency(convertToCurrency);
  //   for (let orders of subOrders) {
  //     let { products = [] } = orders;
  //     for (let product of products) {
  //       let {
  //         productId = "",
  //         productName = "",
  //         quantity = "",
  //         priceMin = "",
  //         articleId = "",
  //         exfactoryListPrice = 0,
  //         priceApplied = 0,
  //       } = product;
  //       let obj = {
  //         productId: productId,
  //         productName: productName,
  //         quantity: quantity,
  //         priceMin: currencyFormat + priceMin,
  //         exfactoryListPrice:
  //           priceApplied && priceApplied !== null
  //             ? priceApplied
  //             : exfactoryListPrice,
  //         linkOfProduct: url + articleId,
  //       };
  //       productList.push(obj);
  //     }
  //   }

  //   let data = {
  //     buyerName: firstName,
  //     buyerEmailId: email,
  //     buyerOrgName: orgName,
  //     orderId: orderId,
  //     quoteId: priceQuoteRef,
  //     addressLine1: addressLine1,
  //     addressLine2: addressLine2,
  //     city: city,
  //     state: state,
  //     country: country,
  //     zipCode: zipCode,
  //     products: productList,
  //   };
  //   // fetch(process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL + "/v1/orders/assist", {
  //   //   method: "POST",
  //   //   body: JSON.stringify(data),
  //   //   headers: {
  //   //     "Content-Type": "application/json",
  //   //     Authorization: "Bearer " + keycloak.token,
  //   //   },
  //   // })
  //   //   .then((res) => {
  //   //     if (res.ok) {
  //   //       showOrderModal(true);
  //   //       // return res.json();
  //   //     } else {
  //   //       throw res.statusText || "Error in create order";
  //   //     }
  //   //   })
  //   // .then((res) => {
  //   //   showOrderModal(true);
  //   // })
  //   // .catch((err) => {
  //   //   message.error(err.message || err, 5);
  //   //   // setLoading(false);
  //   // });
  // };

  const handleCancel = () => {
    showOrderModal(false);
    if (id === "cart") {
      props.clearCart();
    } else {
      router.push("/cart");
    }
  };

  const updateOrder = (data, status) => {
    let formData = { ...data };
    let { shippingMode = "" } = cart || {};
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
        let url = "/order/" + cart.orderId + "/payment-success";
        router.push(url);
      })
      .catch((err) => {
        if (retryCountOR < 3) {
          updateOrder(data, status);
        }
        retryCountOR++;
        // setLoading(false);
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
          voidPPOrder(orderId);
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
          voidPPOrder(orderId);
          let data = {
            gbOrderNo: cart.orderId,
          };
          updateOrder(data, "FAILED");
        }
        retryCountCP++;
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
          voidPPOrder(orderId);
          let data = {
            gbOrderNo: cart.orderId,
          };
          updateOrder(data, "FAILED");
          message.error(
            "There was an error authorizing the amount please try again"
          );
        }
      })
      .catch((err) => {
        if (retryCountAP < 3) {
          checkAuthorizePaymentStatus(orderId, actions);
        } else {
          voidPPOrder(orderId);
          let data = {
            gbOrderNo: cart.orderId,
          };
          updateOrder(data, "FAILED");
          message.error(err.message || err, 5);
        }
        retryCountAP++;
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
          priceApplied = 0,
        } = items;
        samplePrice =
          samplePrice + parseFloat(getConvertedCurrency(sampleCost));
        testingPrice =
          testingPrice + parseFloat(getConvertedCurrency(qualityTestingCharge));

        if (priceApplied && priceApplied !== null) {
          basePrice =
            basePrice +
            parseFloat(getConvertedCurrency(priceApplied)) * quantity;
        } else {
          basePrice =
            basePrice +
            parseFloat(getConvertedCurrency(exfactoryListPrice)) * quantity;
        }
      }

      sellerTotal = basePrice + samplePrice + testingPrice;

      subTotal = subTotal + sellerTotal;
      totalCartValue = totalCartValue + sellerTotal;
    }
  }

  subTotal =
    subTotal +
    parseFloat(getConvertedCurrency(frieghtCharge)) +
    parseFloat(getConvertedCurrency(dutyCharge)) -
    parseFloat(getConvertedCurrency(couponDiscount)) -
    parseFloat(getConvertedCurrency(sellerDiscount)) -
    parseFloat(getConvertedCurrency(productDiscount));

  totalCartValue =
    totalCartValue +
    parseFloat(getConvertedCurrency(frieghtCharge)) +
    parseFloat(getConvertedCurrency(dutyCharge)) -
    parseFloat(getConvertedCurrency(sellerDiscount)) -
    parseFloat(getConvertedCurrency(productDiscount)) -
    parseFloat(getConvertedCurrency(couponDiscount)) +
    parseFloat(getConvertedCurrency(vatCharge)) -
    parseFloat(getConvertedCurrency(promoDiscount));

  let maskid = "";
  let prefix = email ? email.substring(0, email.lastIndexOf("@")) : "";
  let postfix = email ? email.substring(email.lastIndexOf("@")) : "";

  for (let i = 0; i < prefix.length; i++) {
    if (i == 0 || i == prefix.length - 1) {
      ////////
      maskid = maskid + prefix[i].toString();
    } else {
      maskid = maskid + "*";
    }
  }
  maskid = maskid + postfix;

  const dduContent = (
    <div className="breakup-popup qa-font-san qa-tc-white">
      <div className="qa-border-bottom qa-pad-btm-15 qa-fs-14 qa-lh">
        Estimated custom taxes and duties
      </div>
      <div className="qa-mar-top-1 qa-lh">
        Estimated custom duties for this order is{" "}
        <b>
          {getSymbolFromCurrency(convertToCurrency)}
          {dutyMin}
          {dutyMax > 0 ? (
            <span>
              {" "}
              to {getSymbolFromCurrency(convertToCurrency)}
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
          {getSymbolFromCurrency(convertToCurrency)}
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
          {basePrice ? parseFloat(basePrice).toFixed(2) : ""}
        </div>
        <div className="c-left-blk qa-mar-btm-05">Qalara margin</div>
        <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
          <span style={{ textDecoration: "line-through", marginRight: "5px" }}>
            {getSymbolFromCurrency(convertToCurrency)}
            {qalaraMargin
              ? parseFloat(qalaraMargin).toFixed(2)
              : parseFloat(0).toFixed(2)}
          </span>

          {qalaraMargin > 0 && (
            <span style={{ color: "#02873A" }} className="qa-fw-b">
              {getSymbolFromCurrency(convertToCurrency)}
              {parseFloat(0).toFixed(2)}
            </span>
          )}
        </div>
        {qualityPrice > 0 && (
          <div className="c-left-blk qa-mar-btm-05">Quality testing</div>
        )}
        {qualityPrice > 0 && (
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(convertToCurrency)}
            {qualityPrice ? parseFloat(qualityPrice).toFixed(2) : ""}
          </div>
        )}
        {samplePrice > 0 && (
          <div className="c-left-blk qa-mar-btm-05">Sample required</div>
        )}
        {samplePrice > 0 && (
          <div className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(convertToCurrency)}
            {samplePrice ? parseFloat(samplePrice).toFixed(2) : ""}
          </div>
        )}
        <div className="c-left-blk">Total</div>
        <div className="c-right-blk qa-txt-alg-rgt qa-fw-b">
          {getSymbolFromCurrency(convertToCurrency)}
          {sellerTotalAmount ? parseFloat(sellerTotalAmount).toFixed(2) : ""}
        </div>
      </div>
      <div className="qa-tc-white qa-fs-12 qa-lh qa-txt-alg-cnt">
        Note: Qalara margin may vary by total cart value{" "}
        <span>
          <Link href="/FAQforwholesalebuyers">
            <a target="_blank" className="qa-sm-color qa-cursor">
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
            <Button className="qa-button qa-fs-12 qa-shop-btn">
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
            qalaraSellerMargin = 0,
            total = 0,
          } = order;

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
              priceApplied = 0,
            } = items;
            samplePrice =
              samplePrice + parseFloat(getConvertedCurrency(sampleCost));
            testingPrice =
              testingPrice +
              parseFloat(getConvertedCurrency(qualityTestingCharge));

            if (priceApplied && priceApplied !== null) {
              basePrice =
                basePrice +
                parseFloat(getConvertedCurrency(priceApplied)) * quantity;
            } else {
              basePrice =
                basePrice +
                parseFloat(getConvertedCurrency(exfactoryListPrice)) * quantity;
            }
          }
          qalaraSellerMargin = parseFloat(
            getConvertedCurrency(qalaraSellerMargin)
          );
          totalAmount = basePrice + samplePrice + testingPrice;
          let mov = 0;
          for (let product of products) {
            let { productType = "" } = product || {};
            let sellerMov =
              brandNames[sellerCode] &&
              brandNames[sellerCode].mov &&
              brandNames[sellerCode].mov.find(
                (x) => x.productType === productType
              ) &&
              brandNames[sellerCode].mov.find(
                (x) => x.productType === productType
              ).amount;

            if (mov < sellerMov) {
              mov = sellerMov;
            }
          }
          return (
            <div className="qa-mar-btm-2" key={i}>
              <div className="cart-prod-name qa-mar-btm-1">
                <div className="c-left-blk">Seller ID- {sellerCode} </div>
                {/* <div className="c-right-blk qa-fw-b qa-txt-alg-rgt qa-fs-14">
                  {sellerCode}
                </div> */}
              </div>

              <div className="cart-ship-pt qa-border-bottom">
                <div className="c-left-blk">
                  {total < mov ? (
                    <span style={{ color: "#AF0000" }}>
                      Add {getSymbolFromCurrency(convertToCurrency)}
                      {getConvertedCurrency(mov - total)} more to reach seller's
                      minimum order value
                    </span>
                  ) : (
                    <span>Value of products purchased</span>
                  )}
                </div>
                <div className="c-right-blk qa-txt-alg-rgt qa-fw-b">
                  {getSymbolFromCurrency(convertToCurrency)}
                  {parseFloat(totalAmount).toFixed(2)}
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
                          setQalaraMargin(qalaraSellerMargin);
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

      {!disablePayment && (
        <div className="qa-mar-btm-05">
          <div
            className={`${
              (referralCode && couponDiscount > 0) ||
              sellerDiscount > 0 ||
              productDiscount > 0
                ? "cart-ship-pt qa-pd-0"
                : "cart-ship-pt"
            }`}
          >
            <div className="c-left-blk">Estimated freight fees</div>
            <div className="c-right-blk qa-txt-alg-rgt">
              {id !== "cart" && frieghtCharge > 0 ? (
                <span className="qa-fw-b">
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(frieghtCharge)}
                </span>
              ) : (
                <span>
                  {id === "cart" || !shippingMode ? (
                    "TBD*"
                  ) : (
                    <span className="qa-fw-b">
                      {getSymbolFromCurrency(convertToCurrency)}
                      {getConvertedCurrency(0)}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {id !== "cart" && !disablePayment && referralCode && couponDiscount > 0 && (
        <div className="qa-mar-btm-2 qa-fw-b">
          <div className="cart-ship-pt">
            <div style={{ color: "#02873A" }} className="c-left-blk">
              {referralCode} discount applied
            </div>
            <div className="c-right-blk qa-txt-alg-rgt">
              <span style={{ color: "#02873A" }}>
                -{getSymbolFromCurrency(convertToCurrency)}
                {getConvertedCurrency(couponDiscount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {id !== "cart" && sellerDiscount > 0 && !disablePayment && (
        <div className="qa-fw-b">
          <div className="cart-ship-pt">
            <div style={{ color: "#02873A" }} className="c-left-blk">
              <span
                style={{
                  verticalAlign: "middle",
                }}
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
            </div>
            <div className="c-right-blk qa-txt-alg-rgt">
              <span style={{ color: "#02873A" }}>
                -{getSymbolFromCurrency(convertToCurrency)}
                {getConvertedCurrency(sellerDiscount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {id !== "cart" && productDiscount > 0 && !disablePayment && (
        <div className="qa-fw-b">
          <div className="cart-ship-pt">
            <div style={{ color: "#02873A" }} className="c-left-blk">
              <span
                style={{
                  verticalAlign: "middle",
                }}
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
            </div>
            <div className="c-right-blk qa-txt-alg-rgt">
              <span style={{ color: "#02873A" }}>
                -{getSymbolFromCurrency(convertToCurrency)}
                {getConvertedCurrency(productDiscount)}
              </span>
            </div>
          </div>
        </div>
      )}

      {!disablePayment && (
        <div className="qa-mar-btm-05">
          <div className="cart-ship-pt qa-border-bottom">
            <div className="c-left-blk">
              {shippingTerm === "ddu"
                ? "Customs duties excluded*"
                : "Estimated custom, taxes & duties"}
              {shippingTerm === "ddu" && (
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
            </div>
            <div className="c-right-blk qa-txt-alg-rgt">
              {id !== "cart" && dutyCharge > 0 ? (
                <span className="qa-fw-b">
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(dutyCharge)}
                </span>
              ) : (
                <span>
                  {id === "cart" || !shippingMode ? (
                    "TBD*"
                  ) : (
                    <span>
                      {shippingTerm === "ddu" ? (
                        "NA"
                      ) : (
                        <span className="qa-fw-b">
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(dutyCharge)}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {!disablePayment && (
        <div className="qa-mar-top-2 qa-fw-b">
          <div className="cart-ship-pt">
            <div className="c-left-blk font-size-17">SUBTOTAL</div>
            <div className="c-right-blk qa-txt-alg-rgt font-size-17">
              {getSymbolFromCurrency(convertToCurrency)}
              {parseFloat(subTotal).toFixed(2)}
            </div>
          </div>
        </div>
      )}
      {!disablePayment && (
        <div
          className={`${
            (referralCode && couponDiscount > 0) || promoDiscount > 0
              ? ""
              : "qa-mar-btm-2"
          }`}
        >
          <div
            className={`${
              (referralCode && couponDiscount > 0) || promoDiscount > 0
                ? "cart-ship-pt"
                : "cart-ship-pt qa-border-bottom"
            }`}
          >
            <div className="c-left-blk qa-mar-btm-05">
              {shippingTerm === "ddu"
                ? "VAT/ GST / Taxes excluded*"
                : "VAT/ GST / Taxes*"}
            </div>
            <div className="c-right-blk qa-txt-alg-rgt">
              {id !== "cart" && vatCharge > 0 ? (
                <span className="qa-fw-b">
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(vatCharge)}
                </span>
              ) : (
                <span>
                  {id === "cart" || !shippingMode ? (
                    "TBD*"
                  ) : (
                    <span>
                      {shippingTerm === "ddu" ? (
                        "NA"
                      ) : (
                        <span className="qa-fw-b">
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(vatCharge)}
                        </span>
                      )}
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="c-left-blk">
              Refundable for some countries like UK/AU.{" "}
              <Link href="/FAQforwholesalebuyers">
                <a target="_blank">
                  <span className="qa-sm-color qa-cursor">Learn more</span>
                </a>
              </Link>
            </div>
          </div>
        </div>
      )}

      {id !== "cart" && promoDiscount > 0 && !disablePayment && (
        <div className="qa-mar-btm-2 qa-fw-b">
          <div className="cart-ship-pt qa-border-bottom">
            <div
              style={{ textTransform: "uppercase" }}
              className="c-left-blk"
              style={{ color: "#02873A" }}
            >
              {promoCode}
            </div>
            <div className="c-left-blk" style={{ color: "#02873A" }}>
              discount applied
            </div>
            <div className="c-right-blk qa-txt-alg-rgt">
              <span style={{ color: "#02873A" }}>
                -{getSymbolFromCurrency(convertToCurrency)}
                {getConvertedCurrency(promoDiscount)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="cart-ship-pt qa-fw-b">
        <div className="c-left-blk qa-mar-btm-05 font-size-17">
          TOTAL CART VALUE{" "}
          {id !== "cart" && shippingTerm && (
            <span className="qa-fw-n qa-uppercase">({shippingTerm})</span>
          )}
        </div>
        <div className="c-right-blk qa-txt-alg-rgt font-size-17">
          {getSymbolFromCurrency(convertToCurrency)}
          {parseFloat(totalCartValue).toFixed(2)}
        </div>
        {/* <div className="c-left-blk">With refundable taxes</div> */}
      </div>
      {id === "payment" && (
        <div className="cart-ship-pt qa-fw-b">
          <div className="c-left-blk font-size-17 qa-blue">PAY NOW</div>
          <div className="c-right-blk qa-txt-alg-rgt font-size-17 qa-blue">
            {getSymbolFromCurrency(convertToCurrency)}
            {parseFloat(totalCartValue * 0.2).toFixed(2)}
          </div>
        </div>
      )}
      {id === "payment" && (
        <div className="cart-ship-pt">
          <div className="c-left-blk qa-mar-btm-05 font-size-17">PAY LATER</div>
          <div className="c-right-blk qa-txt-alg-rgt font-size-17">
            {getSymbolFromCurrency(convertToCurrency)}
            {parseFloat(totalCartValue * 0.8).toFixed(2)}
          </div>
        </div>
      )}
      {id === "cart" && (
        <div>
          {enable && deliver && !showCartError && verifiedEmail === true ? (
            <Button
              className="qa-button qa-fs-12 qa-mar-top-1 proceed-to-ship active"
              onClick={proceedToShipping}
              disabled={btnLoading}
            >
              Proceed to shipping
            </Button>
          ) : (
            <Button className="qa-button qa-fs-12 qa-mar-top-1 proceed-to-ship">
              Proceed to shipping
            </Button>
          )}
          {hideCreateOrder && (
            <div className="qa-error qa-txt-alg-cnt display-flex qa-mar-top-1">
              <div>
                <Icon
                  component={alertIcon}
                  className="alert-icon"
                  style={{
                    width: "15px",
                  }}
                />
              </div>
              <div
                className="qa-mar-lft qa-cursor qa-shipping-err"
                onClick={props.showAddrModal}
              >
                Click here to enter your shipping address in order to proceed to
                the next page
              </div>
            </div>
          )}
        </div>
      )}
      {id === "shipping" && (
        <div>
          {enable && deliver && !showCartError && !disablePayment ? (
            <Button
              onClick={checkCommitStatus}
              disabled={btnLoading}
              className="qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment active"
            >
              Proceed to payment
            </Button>
          ) : (
            <Button className="qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment">
              Proceed to payment
            </Button>
          )}
        </div>
      )}

      {id === "payment" && (
        <div>
          <div className="qa-mar-top-1 qa-mar-btm-1">
            <Checkbox onChange={handleCheck} id="check"></Checkbox>

            <span className="qa-font-san qa-fs-14 qa-tc-white qa-mar-lft">
              I agree to the{" "}
              <Link href="/TermsOfUse" className="c-breakup">
                <a target="_blank" className="qa-sm-color qa-cursor c-breakup">
                  terms & conditions
                </a>
              </Link>
            </span>

            <span
              className="qa-font-san qa-fs-14 termsError qa-error"
              style={{ display: "none" }}
            >
              Please accept T&C
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
              cart.shippingAddressDetails["country"] &&
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

      {(verifiedEmail === false || verifiedEmail === null) && (
        <div className="otp-error-cart qa-mar-top-2">
          Please validate your email address to proceed to the shipping
          page.Please click on the button below to receive a One Time Password
          (OTP) at your registered email address and follow instructions to
          validate your email.
        </div>
      )}
      {(verifiedEmail === false || verifiedEmail === null) && (
        <Button
          onClick={sendOtp}
          disabled={btnLoading}
          className="qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment active"
        >
          SEND VALIDATION OTP
        </Button>
      )}

      {(!deliver || disablePayment) &&
        !showCartError &&
        !hideCreateOrder &&
        verifiedEmail === true && (
          <Button
            onClick={createOrder}
            disabled={btnLoading}
            className="qa-button qa-fs-12 qa-mar-top-1 proceed-to-payment active"
          >
            ORDER QUOTE REQUEST
          </Button>
        )}

      {!deliver &&
        id === "cart" &&
        !showCartError &&
        !hideCreateOrder &&
        verifiedEmail === true && (
          <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 qa-txt-alg-cnt">
            *We currently don't have instant checkout enabled for your country.
            However, in most cases we can still arrange to deliver the order to
            you. Please click on 'Order Quote Request' and we will share a link
            over email with the necessary details to process your order. The
            link will also be available in your Qalara Account section.
          </div>
        )}
      {disablePayment && id === "shipping" && (
        <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 qa-txt-alg-cnt">
          Freight cost appears to be high for this order. Please click on 'Order
          Quote Request' and we will share a link over email with the necessary
          details to process your order. The link will also be available in your
          Qalara Account section.
        </div>
      )}

      {deliver && !nonShippable && verifiedEmail === true ? (
        <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05 qa-txt-alg-cnt">
          {id === "cart" ? (
            <span>
              {!hideCreateOrder
                ? "*Please check the T&C box to review shipping mode and costs"
                : ""}
            </span>
          ) : (
            <span>
              {id === "shipping" && !disablePayment && (
                <span>*Proceed to review payment mode</span>
              )}
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
      <Modal
        visible={otpVerificationModal}
        className="otp-verification-modal"
        footer={null}
        closable={false}
        onCancel={hideOtpModal}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={props.isMobile ? "100%" : 800}
      >
        <div className="qa-rel-pos">
          <div
            onClick={hideOtpModal}
            style={{
              position: "absolute",
              right: "0px",
              top: "-15px",
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
            <div className="otp-email-title">Validate your email address</div>
            {!otpValidated ? (
              <div>
                <div className="otp-email-detail">
                  Enter the One Time Password (OTP) sent to your registered
                  email address {maskid}
                </div>
                <div className="otp-input-field">
                  <OtpInput
                    value={otpInput}
                    onChange={handleOtpChange}
                    numInputs={6}
                    separator={<span></span>}
                    focusStyle="focussed-input"
                    shouldAutoFocus={true}
                  />
                </div>
                {otpLengthError && (
                  <div className="email-verification-text">
                    Please enter 6 digits OTP
                  </div>
                )}
                {otpError && (
                  <div className="email-verification-text">
                    The OTP entered is incorrect. Please enter the correct OTP
                  </div>
                )}
                <div className="otp-btn-section qa-mar-top-2">
                  <Button
                    onClick={validateOtp}
                    className="qa-button qa-send-otp"
                    disabled={btnLoading}
                  >
                    VALIDATE OTP
                  </Button>
                </div>
                <div
                  className="resend-otp-btn"
                  onClick={() => {
                    setOtpInput("");
                    sendOtp();
                  }}
                >
                  RESEND OTP
                </div>
                <div className="otp-help-section">
                  Please check your promotions/spam/junk folder if you have not
                  received the OTP in your primary inbox. If you haven't
                  received the OTP or are facing any issues please write to us
                  at{" "}
                  <a
                    href="mailto:help@qalara.com"
                    className="qa-sm-color qa-underline"
                  >
                    help@qalara.com
                  </a>{" "}
                  from your registered email address.
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <CheckCircleOutlined
                  style={{
                    fontSize: "100px",
                    marginTop: "10px",
                    marginBottom: "20px",
                  }}
                />
                <div className="qa-mar-btm-3 otp-validated">
                  Thank you for validating your email address. Online checkout
                  is now enabled for your Qalara account.
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartSummary;
