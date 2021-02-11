/** @format */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Button,
  Row,
  Col,
  Input,
  Form,
  Modal,
  Checkbox,
  Select,
  Radio,
  message,
  Tooltip,
} from "antd";
import Icon, { EditOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import getSymbolFromCurrency from "currency-symbol-map";
import deleteIcon from "../../public/filestore/deleteIcon";
import closeButton from "../../public/filestore/closeButton";
import alertIcon from "../../public/filestore/alertIcon";
import couponIcon from "../../public/filestore/couponIcon";
import cartIcon from "../../public/filestore/cartIcon";
import CartSummary from "./CartSummary";
import SavedForLater from "./SavedForLater";
import { useKeycloak } from "@react-keycloak/ssr";
import {
  getAddresses,
  getCart,
  getSavedForLater,
  updateCart,
  checkInventory,
} from "../../store/actions";
import { QuantityInput } from "./QuantityInput";
import _ from "lodash";
import states from "../../public/filestore/stateCodes_en.json";
import Spinner from "../Spinner/Spinner";
import deliveredCountryList from "../../public/filestore/deliveredCountries.json";
import PromotionCarousel from "../PromotionCarousel/PromotionCarousel";
import { loginToApp } from "../AuthWithKeycloak";
import signUp_icon from "../../public/filestore/Sign_Up";
import CheckoutSteps from "../common/CheckoutSteps";
import PaymentBanner from "../common/PaymentBanner";

const { Option } = Select;

const countryList = getCountries().map((country) => {
  if (country === "US") {
    return (
      <Option key={country} value={en[country] + " (US)"}>
        {en[country] + " (US)"}
      </Option>
    );
  }
  if (country === "GB") {
    return (
      <Option key={country} value={en[country] + " (UK)"}>
        {en[country] + " (UK)"}
      </Option>
    );
  }
  if (
    country !== "CU" &&
    country !== "IR" &&
    country !== "KP" &&
    country !== "SD" &&
    country !== "SY" &&
    country !== "PK" &&
    country !== "SO" &&
    country !== "SS"
  ) {
    return (
      <Option key={country} value={en[country]}>
        {en[country]}
      </Option>
    );
  }
});

const CartDetails = (props) => {
  let {
    cart = {},
    isLoading = true,
    app_token = "",
    addresses = [],
    brandNames = "",
    currencyDetails = {},
    sfl = {},
    userProfile = {},
    isGuest = false,
  } = props;
  const router = useRouter();
  const { keycloak } = useKeycloak();
  const [addressFunc, setAddressFunc] = useState("");
  const [modal, showModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);
  const [defaultValue, setDefaultValue] = useState();
  const [form] = Form.useForm();
  const [addform] = Form.useForm();
  const mediaMatch = window.matchMedia("(min-width: 1024px)");
  const [selCountryCode, setSelCountryCode] = useState("us");
  const [dialCode, setDialCode] = useState("+1");
  const [contactId, setContactId] = useState(null);
  const [selCountryExpectedLength, setSelCountryExpectedLength] = useState(
    "success"
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState("");
  const [deleteProduct, setDeleteProduct] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [update, setUpdate] = useState("");
  const [bulkdelete, setBulkdelete] = useState(false);
  const [selectedShippingId, setSelectedShippingId] = useState();
  const [optService, setOptService] = useState("");
  const [selectedServices, setSelectedServices] = useState({});
  const [enable, setEnable] = useState(false);
  const [error, setError] = useState({});
  const [selCountry, setSelCountry] = useState("");
  const [selPincode, setSelPincode] = useState("");
  const [deliver, setDeliver] = useState(false);
  const [serviceTotal, setServiceTotal] = useState(0);
  const [hCountry, setHCountry] = useState([]);
  const [zipCodeList, setZipcodeList] = useState([]);
  const [inventoryQty, setInventoryQty] = useState();
  let showError = false;
  useEffect(() => {
    if (app_token) {
      props.getAddresses(app_token);
    }
  }, [app_token]);

  useEffect(() => {
    let { cart = {} } = props;
    let { shippingAddressDetails = "", shippingAddressId, subOrders = [] } =
      cart || {};
    if (shippingAddressDetails && addresses.length > 0) {
      let {
        countryCode = "",
        phoneNumber = "",
        country = "",
        zipCode = "",
        dialCode = "",
      } = shippingAddressDetails || {};
      setSelectedShippingId(shippingAddressId);
      setSelCountryCode(countryCode);
      setSelCountryExpectedLength("success");
      setSelPincode(zipCode);
      setSelCountry(country);
      handleCountry(country);
      setDialCode(dialCode);

      if (deliveredCountryList.includes(country)) {
        setDeliver(true);
      }
    }

    if (subOrders.length > 0) {
      let productIds = [];
      for (let orders of subOrders) {
        let { products = [] } = orders;
        for (let product of products) {
          let { productId = "" } = product;
          productIds.push(productId);
        }
      }

      props.checkInventory(app_token, productIds, (result) => {
        setInventoryQty(result);
      });
    }
  }, [props.cart]);

  let {
    subOrders = [],
    shippingAddressDetails = "",
    shippingAddressId = "",
    orderId = "",
    isFulfillable = true,
    referralCode = "",
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
    dunsNumber = "",
  } = shippingAddressDetails || {};
  let shippingId = id;
  let mov = 0;
  let addressFlag = false;
  if (
    shippingAddressDetails &&
    Object.keys(shippingAddressDetails).length > 0 &&
    addresses.length > 0
  ) {
    addressFlag = true;
  }

  if (subOrders && subOrders.length) {
    for (let orders of subOrders) {
      let orderMov = 0;
      let { total = 0, sellerCode = "", products = [] } = orders;

      for (let product of products) {
        let { productType = "" } = product || {};
        let sellerMov =
          brandNames[sellerCode] &&
          brandNames[sellerCode].mov &&
          brandNames[sellerCode].mov.find((x) => x.productType === productType)
            .amount;

        if (orderMov < sellerMov) {
          orderMov = sellerMov;
        }
      }
      if (total < orderMov) {
        showError = true;
        mov = orderMov;
      }
    }
  }

  let shippingAddr = "";
  let pls = phoneNumber.indexOf("+") >= 0 ? "" : "+";
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
    pls +
    phoneNumber;

  let { convertToCurrency = "" } = currencyDetails || {};
  let { products = [] } = sfl || {};
  let { verificationStatus = "", profileType = "" } = userProfile || {};
  let notificationMsg = "You do not have any product added to your cart";
  let buttonName = "Start shopping";
  if (
    (profileType === "BUYER" && verificationStatus === "ON_HOLD") ||
    (profileType === "BUYER" && verificationStatus === "REJECTED")
  ) {
    notificationMsg =
      "You can add products to your cart as soon as your account is verified";
    buttonName = "Go to home page";
  } else if (
    (profileType === "BUYER" &&
      verificationStatus === "VERIFIED" &&
      isGuest === "true") ||
    profileType === "SELLER"
  ) {
    notificationMsg =
      "In order to checkout and place an order please signup as a buyer";
    buttonName = "Sign up as a buyer";
  }

  const getConvertedCurrency = (baseAmount) => {
    let { convertToCurrency = "", rates = [] } = props.currencyDetails;
    return Number.parseFloat(
      (baseAmount *
        Math.round((rates[convertToCurrency] + Number.EPSILON) * 100)) /
        100
    ).toFixed(2);
  };

  const handlePhoneNumber = (value, country) => {
    /*let dialCode = "+" + country.dialCode;
    let { format = "", countryCode = "" } = country;
    console.log(country, value);
    let length = (format.match(/\./g) || []).length;
    setSelCountryCode(countryCode);
    setDialCode(dialCode);
    setSelCountryExpectedLength(length);*/
  };

  const countryCheck = (e) => {
    if (deliveredCountryList.includes(e)) {
      setDeliver(true);
    } else {
      setDeliver(false);
    }
  };

  const onChange = (e) => {
    let { value = "", id = "" } = e.target;
    setSelectedShippingId(value);
    let details = id.split("-");
    setSelCountry(details[1]);
    setSelPincode(details[0]);
    countryCheck(details[1]);
  };

  const optForServices = () => {
    let { sellerCode = "" } = optService;
    updateCart("OPT_SERVICES", sellerCode, selectedServices);
  };

  const handleCountry = (e) => {
    let value = e;
    let obj = states.find((state) => {
      return state.country === value;
    });
    let { stateCodes = [] } = obj || {};
    if (obj && stateCodes && stateCodes.length) {
      setHCountry(stateCodes);
    } else {
      setHCountry([]);
    }
    form.setFieldsValue({ state: "" });
    form.setFieldsValue({ zipCode: "" });
    addform.setFieldsValue({ zipCode: "" });
    addform.setFieldsValue({ state: "" });
    if (deliveredCountryList.includes(value)) {
      setDeliver(true);
    } else {
      setDeliver(false);
    }
    setSelCountry(value);
    setZipcodeList([]);
  };

  const handleCancel = () => {
    showModal(false);
    setAddressModal(false);
    setDeleteModal(false);
    setDeleteItem("");
    setDeleteName("");
    setDeleteProduct("");
    setBulkdelete(false);
  };

  const enableUpdateQty = (id) => {
    setUpdate(id);
  };

  const signIn = () => {
    loginToApp(keycloak, { currentPath: router.asPath.split("?")[0] });
  };

  const onOptServiceChange = (checkedValues, index) => {
    let services = { ...selectedServices };
    services[index] = checkedValues;
    setSelectedServices(services);
    let total = 0;
    for (let key in services) {
      total = total + 50 * services[key].length;
    }
    setServiceTotal(total);
  };

  const onFinish = (
    selectedShippingId,
    zipcode = selPincode,
    country = selCountry
  ) => {
    fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/my/${orderId}/?addr_Id=${selectedShippingId}&postal_code=${zipcode}&country=${country}`,
      {
        method: "PUT",
        // body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + app_token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          setAddressModal(false);
          props.getCart(app_token);
        } else {
          throw res.statusText || "Error while sending e-mail.";
        }
      })
      .catch((err) => {
        setAddressModal(false);
        message.error("Error updating info!", 5);
      });
  };

  const onCheckDefault = (event) => {
    setDefaultValue(event.target.value);
  };

  const getStates =
    hCountry &&
    hCountry.map((state, index) => {
      return (
        <Option key={index} value={state.state}>
          {state.state}
        </Option>
      );
    });

  const addSFL = (order) => {
    let { products = [], sellerCode = "" } = order || {};
    let data = [];
    for (let items of products) {
      let {
        productId = "",
        quantity = "",
        productName = "",
        minimumOrderQuantity = "",
        size = "",
        color = "",
        image = "",
        articleId = "",
        total = 0,
        productType = "",
      } = items;
      let obj = {
        quantity: quantity.toString(),
        sellerCode: sellerCode,
        productId: productId,
        minimumOrderQuantity: minimumOrderQuantity,
        isSampleDeliveryRequired: false,
        isQualityTestingRequired: false,
        productName: productName,
        color: color,
        size: size,
        image: image,
        articleId: articleId,
        total: total,
        productType: productType,
      };
      data.push(obj);
    }
    fetch(`${process.env.NEXT_PUBLIC_REACT_APP_WISHLIST_URL}/v1/my/wish-list`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app_token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while signing up.";
        }
      })
      .then((res) => {
        updateCart("SFL_DELETE", sellerCode);
        message.success("Products have been moved to your wishlist!", 5);
      })
      .catch((err) => {
        message.error("Error moving products to your wishlist!", 5);
      });
  };

  const saveAddress = (values) => {
    setSelCountry(values.country);
    setSelPincode(values.zipCode);
    countryCheck(values.country);
    let zip = values.zipCode.replace(/[^a-z0-9]/gi, "");
    let data = {
      profileId: profileId,
      fullName: values.fullName,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      country: values.country,
      state: values.state,
      city: values.city,
      zipCode: zip,
      phoneNumber: values.phoneNumber,
      isDefault: values.isDefault === "yes" ? true : false,
      countryCode: selCountryCode,
      dialCode: dialCode,
      dunsNumber: values.dunsNumber,
    };
    fetch(process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + app_token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        if (res && res.body) {
          let { id = "" } = res.body || {};
          onFinish(id, values.zipCode, values.country);
          setAddressModal(false);
          props.getAddresses(app_token);
        }
      })
      .catch((err) => {
        message.error("Error updating info!", 5);
      });
  };

  const updateAddress = (values) => {
    setSelCountry(values.country);
    setSelPincode(values.zipCode);
    countryCheck(values.country);
    let zip = values.zipCode.replace(/[^a-z0-9]/gi, "");
    let data = {
      profileId: profileId,
      fullName: values.fullName,
      addressLine1: values.addressLine1,
      addressLine2: values.addressLine2,
      country: values.country,
      state: values.state,
      city: values.city,
      zipCode: zip,
      phoneNumber: values.phoneNumber,
      isDefault: values.isDefault === "yes" ? true : false,
      countryCode: selCountryCode,
      dialCode: dialCode,
      dunsNumber: values.dunsNumber,
    };
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts/" + contactId,
      {
        method: "PATCH",
        body: JSON.stringify(data),
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
      .then((res) => {
        // message.success('Your info has been updated successfully.', 5);
        // setSuccessUpdateVisible(true);
        setAddressModal(false);
        props.getCart(app_token);
      })
      .catch((err) => {
        message.error("Error updating info!", 5);
      });
  };

  const handleZipCode = (e) => {
    if (!selCountry) {
      alert("Enter Country first!!");
      //handleError("zipCode", state.zipCode, "Please enter Country name first!!")
      return;
    }
    let value = e.target ? e.target.value.toUpperCase() : e.toUpperCase();
    /*setState((prevState) => ({
      ...prevState,
      zipCode: value,
    }));*/

    if (value.toString().length >= 3) {
      if (!value.replace(/[^a-z0-9]/gi, "")) {
        setZipcodeList([value]);
        return;
      }
      fetch(
        process.env.NEXT_PUBLIC_REACT_APP_DUTY_COST_URL +
          "/country/" +
          selCountry +
          "/zipcode/" +
          value,
        {
          method: "GET",
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
        .then((res) => {
          if (res.zipcodes && res.zipcodes.length > 0) {
            let a = res.zipcodes.slice(0);
            if (a.indexOf(value) < 0) a.push(value);
            setZipcodeList(a);
          } else {
            setZipcodeList([value]);
          }
        })
        .catch((err) => {
          message.error(err.message || err, 5);
          setLoading(false);
        });
    } else {
      setZipcodeList([value]);
    }
  };

  const updateCart = (action = "", sellerCode = "", services = "") => {
    let sellerId = sellerCode || deleteItem;
    let skuid = deleteProduct;
    let p_data = {};
    let s_count = 0;

    if (action === "OPT_SERVICES") {
      action = "UPDATE";
      for (let order of subOrders) {
        let {
          sellerCode = "",
          products = [],
          id = "",
          orderId = "",
          status = "",
          expectedDeliveryDate = "",
          sellerMinOrderValue = "",
          sellerOrgName = "",
          isSMOVMet = "",
          total = "",
        } = order;

        let obj = {};
        if (sellerCode === sellerId) {
          obj["expectedDeliveryDate"] = expectedDeliveryDate;
          obj["sellerMinOrderValue"] = sellerMinOrderValue;
          obj["sellerOrgName"] = sellerOrgName;
          obj["isSMOVMet"] = isSMOVMet;
          obj["id"] = id;
          obj["orderId"] = orderId;
          obj["status"] = status;
          obj["total"] = total;
          obj["sellerCode"] = sellerCode;

          let prodArr = [];
          for (let list of products) {
            let {
              quantity = "",
              productId = "",
              minimumOrderQuantity = "",
              isSampleDeliveryRequired = "",
              isQualityTestingRequired = "",
              productName = "",
              color = "",
              size = "",
              image = "",
              articleId = "",
              productType = "",
            } = list;
            let prodObj = {
              quantity: quantity.toString(),
              sellerCode: sellerCode,
              productId: productId,
              minimumOrderQuantity: minimumOrderQuantity,
              isSampleDeliveryRequired: isSampleDeliveryRequired,
              isQualityTestingRequired: isQualityTestingRequired,
              productName: productName,
              color: color,
              size: size,
              image: image,
              articleId: articleId,
              productType: productType,
            };
            if (services[productId]) {
              let sample = `${productId}-sample`;
              let test = `${productId}-test`;

              if (services[productId].includes(sample)) {
                prodObj["isSampleDeliveryRequired"] = true;
              } else {
                prodObj["isSampleDeliveryRequired"] = false;
              }
              if (services[productId].includes(test)) {
                prodObj["isQualityTestingRequired"] = true;
              } else {
                prodObj["isQualityTestingRequired"] = false;
              }
            }
            prodArr.push(prodObj);
          }
          obj["products"] = prodArr;
          props.updateCart(app_token, action, obj, (response) => {
            showModal(false);
            props.getCart(app_token);
          });
        }
        s_count++;
      }
    } else if (action === "UPDATE") {
      let u_action = action;
      for (let order of subOrders) {
        let {
          sellerCode = "",
          products = [],
          id = "",
          orderId = "",
          status = "",
          expectedDeliveryDate = "",
          sellerMinOrderValue = "",
          sellerOrgName = "",
          isSMOVMet = "",
          total = "",
        } = order;

        let obj = {};
        if (sellerCode === sellerId) {
          obj["expectedDeliveryDate"] = expectedDeliveryDate;
          obj["sellerMinOrderValue"] = sellerMinOrderValue;
          obj["sellerOrgName"] = sellerOrgName;
          obj["isSMOVMet"] = isSMOVMet;
          obj["id"] = id;
          obj["orderId"] = orderId;
          obj["status"] = status;
          obj["total"] = total;
          obj["sellerCode"] = sellerCode;

          let p_count = 0;
          let prodArr = [];
          let productIds = [];
          for (let list of products) {
            let {
              quantity = "",
              productId = "",
              minimumOrderQuantity = "",
              isSampleDeliveryRequired = "",
              isQualityTestingRequired = "",
              productName = "",
              color = "",
              size = "",
              image = "",
              articleId = "",
              productType = "",
            } = list;
            let prodObj = {
              quantity: quantity.toString(),
              sellerCode: sellerCode,
              productId: productId,
              minimumOrderQuantity: minimumOrderQuantity,
              isSampleDeliveryRequired: isSampleDeliveryRequired,
              isQualityTestingRequired: isQualityTestingRequired,
              productName: productName,
              color: color,
              size: size,
              image: image,
              articleId: articleId,
              productType: productType,
            };

            let newQty = document.getElementById(
              `quantity_${s_count}${p_count}`
            ).value;
            p_count++;
            prodObj["quantity"] = newQty.toString();
            prodArr.push(prodObj);
            productIds.push(productId);
          }
          obj["products"] = prodArr;
          props.checkInventory(app_token, productIds, (result) => {
            let doNotDelete = false;
            let errorObjFinal = {};
            for (let list of prodArr) {
              let { productId = "", quantity = "" } = list;
              if (result[productId] < parseInt(quantity)) {
                doNotDelete = true;
                let errObj = {};
                errObj[productId] = result[productId];
                errorObjFinal = { ...errObj, ...errorObjFinal };
              }
              setError(errorObjFinal);
            }
            if (!doNotDelete) {
              props.updateCart(app_token, u_action, obj, (response) => {
                props.getCart(app_token);
                setUpdate("");
                message.success("Quantity updated!", 5);
              });
            }
          });
        }
        s_count++;
      }
    } else if (action === "SFL_DELETE" || bulkdelete) {
      action = "DELETE";
      for (let order of subOrders) {
        let {
          sellerCode = "",
          products = [],
          id = "",
          orderId = "",
          status = "",
          expectedDeliveryDate = "",
          sellerMinOrderValue = "",
          sellerOrgName = "",
          isSMOVMet = "",
          total = "",
        } = order;

        let obj = {};
        if (sellerCode === sellerId) {
          obj["expectedDeliveryDate"] = expectedDeliveryDate;
          obj["sellerMinOrderValue"] = sellerMinOrderValue;
          obj["sellerOrgName"] = sellerOrgName;
          obj["isSMOVMet"] = isSMOVMet;
          obj["id"] = id;
          obj["orderId"] = orderId;
          obj["status"] = status;
          obj["total"] = total;
          obj["sellerCode"] = sellerCode;

          let productList = [];
          for (let list of products) {
            let {
              quantity = "",
              productId = "",
              minimumOrderQuantity = "",
              isSampleDeliveryRequired = "",
              isQualityTestingRequired = "",
              productName = "",
              color = "",
              size = "",
              image = "",
              articleId = "",
              productType = "",
            } = list;
            let prodObj = {
              quantity: quantity.toString(),
              sellerCode: sellerCode,
              productId: productId,
              minimumOrderQuantity: minimumOrderQuantity,
              isSampleDeliveryRequired: isSampleDeliveryRequired,
              isQualityTestingRequired: isQualityTestingRequired,
              productName: productName,
              color: color,
              size: size,
              image: image,
              articleId: articleId,
              productType: productType,
            };
            productList.push(prodObj);
          }
          obj["products"] = productList;
          props.updateCart(app_token, action, obj, (response) => {
            setDeleteModal(false);
            props.getCart(app_token);
            props.getSavedForLater(app_token);
          });
        }
      }
    } else {
      for (let order of subOrders) {
        let { products = [], sellerCode = "" } = order;

        if (sellerCode === sellerId) {
          for (let product of products) {
            let {
              quantity = "",
              productId = "",
              minimumOrderQuantity = "",
              isSampleDeliveryRequired = "",
              isQualityTestingRequired = "",
              productName = "",
              color = "",
              size = "",
              articleId = "",
              image = "",
              productType = "",
              sellerCategory = "",
              smallBatchesAvailable = false,
            } = product;
            if (productId === skuid) {
              p_data = {
                quantity: -quantity,
                sellerCode: sellerCode,
                productId: productId,
                minimumOrderQuantity: minimumOrderQuantity,
                isSampleDeliveryRequired: isSampleDeliveryRequired,
                isQualityTestingRequired: isQualityTestingRequired,
                productName: productName,
                color: color,
                size: size,
                articleId: articleId,
                image: image,
                productType: productType,
                typeOfOrder: productType,
                sellerCategory: sellerCategory,
                smallBatchesAvailable: smallBatchesAvailable,
              };
            }
          }
        }
      }

      fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL}/v1/orders/my/${orderId}/product`,
        {
          method: "POST",
          body: JSON.stringify(p_data),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + app_token,
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            message.success(
              "Product has been successfully deleted from cart!",
              5
            );
            setDeleteModal(false);
            props.getCart(app_token);
            // return res.json();
          } else {
            throw res.statusText || "Error while signing up.";
          }
        })

        .catch((err) => {
          message.error("Error deleting product from cart!", 5);
        });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (
    subOrders &&
    subOrders.length === 0 &&
    products.length &&
    keycloak.authenticated
  ) {
    return (
      <div id="cart-details" className="cart-section qa-font-san">
        {mediaMatch.matches ? (
          <Row>
            <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
            <Col xs={0} sm={0} md={20} lg={20} xl={20}>
              <Row>
                <Col xs={24} sm={24} md={15} lg={15} xl={15}>
                  <SavedForLater brandNames={brandNames} />
                </Col>
                <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                  <CartSummary id="empty-cart" />
                </Col>
              </Row>
            </Col>
            <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
          </Row>
        ) : (
          <div className="qa-pad-0-20 qa-mar-top-3">
            <div className="qa-mar-btm-3">
              <CartSummary id="empty-cart" />
            </div>
            <div>
              <SavedForLater brandNames={brandNames} />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (subOrders && subOrders.length === 0 && keycloak.authenticated) {
    return (
      <div id="cart-details" className="cart-section qa-font-san empty-cart">
        <div className="e-cart-title qa-txt-alg-cnt qa-mar-btm-1">
          Your cart is empty!
        </div>
        <div className="qa-txt-alg-cnt e-cart-stitle">{notificationMsg}</div>
        <Link href="/account/profile">
          <div className="qa-txt-alg-cnt e-link">My account</div>
        </Link>
        <Link href="/FAQforwholesalebuyers">
          <div className="qa-txt-alg-cnt e-link qa-mar-btm-2">See FAQ</div>
        </Link>
        <div className="qa-txt-alg-cnt qa-mar-btm-4">
          <Button
            className="qa-button qa-fs-12 qa-shop-btn"
            onClick={(e) => {
              if (buttonName === "Sign up as a buyer") {
                router.push("/signup");
              } else {
                router.push("/");
              }
              e.preventDefault();
            }}
          >
            {buttonName}
          </Button>
        </div>
      </div>
    );
  }

  if (!keycloak.authenticated) {
    return (
      <div id="cart-details" className="cart-section qa-font-san empty-cart">
        <div className="e-cart-title qa-txt-alg-cnt qa-mar-btm-2 qa-fs48">
          Sign up to add products to your cart
        </div>
        <div className="qa-txt-alg-cnt e-cart-stitle">
          In order to checkout and place an order please signup as a buyer
        </div>

        <div className="qa-txt-alg-cnt">
          <Button
            className="qa-button qa-fs-12 qa-shop-btn"
            onClick={(e) => {
              router.push("/signup");
            }}
          >
            <span className="sign-up-cart-icon">{signUp_icon()} </span>
            <span className="qa-va-m">sign up as a buyer</span>
          </Button>
        </div>
        <div className="qa-signin-link qa-mar-top-05">
          Already have an account?{" "}
          <span className="c-breakup" onClick={signIn}>
            Sign in here
          </span>
        </div>
      </div>
    );
  }

  return (
    <Row id="cart-details" className="cart-section qa-font-san">
      <CheckoutSteps pageId="cart" />
      {mediaMatch.matches && <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>}
      {mediaMatch.matches && (
        <Col xs={0} sm={0} md={20} lg={20} xl={20}>
          <Row>
            <PromotionCarousel />
            <Col xs={24} sm={24} md={15} lg={15} xl={15}>
              <div className="qa-dark-theme qa-pad-2 qa-mar-btm-2">
                {addressFlag ? (
                  <div className="qa-disp-table-cell qa-ship-addr">
                    <div className="cart-ship-st qa-fw-b qa-mar-btm-05">
                      Shipping to:
                    </div>
                    <div className="cart-ship-st">{shippingAddr}</div>
                  </div>
                ) : (
                  <div className="qa-disp-table-cell qa-ship-addr-text">
                    <div className="cart-ship-st qa-fw-b qa-mar-btm-05">
                      Shipping to:
                    </div>
                    <div
                      className="add-shipping-addr"
                      onClick={() => {
                        setAddressModal(true);
                        setAddressFunc("add");
                      }}
                    >
                      +Add a new address
                    </div>
                  </div>
                )}

                {/* {!addressFlag && (
                  <div className="qa-disp-table-cell c-edit-address addr-error">
                    <div className="display-flex qa-tc1">
                      <div className="qa-lh qa-fw-b">
                        Please enter your shipping address in order to proceed
                        to the next page
                      </div>
                      <div className="qa-mar-lft15">
                        <Icon
                          component={alertIcon}
                          className="alert-icon"
                          style={{
                            width: "25px",
                            marginTop: "3px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )} */}
                {addressFlag && (
                  <div
                    className="qa-disp-table-cell c-edit-address qa-cursor"
                    onClick={() => {
                      setContactId(id);
                      setAddressModal(true);
                      setAddressFunc("edit");
                      form.setFieldsValue({
                        fullName,
                        addressLine1,
                        addressLine2,
                        city,
                        country,
                        state,
                        zipCode,
                        phoneNumber,
                        isDefault: "no",
                        dunsNumber,
                      });
                      if (isDefault) {
                        form.setFieldsValue({ isDefault: "yes" });
                      }
                    }}
                  >
                    <EditOutlined />
                  </div>
                )}
              </div>
              {subOrders && subOrders.length > 0 && (
                <div className="qa-pad-2 c-item-list qa-mar-btm-4">
                  {_.map(subOrders, (order, i) => {
                    let { products = "", sellerCode = "", total = 0 } = order;
                    let servicesTotal = 0;
                    let servicesOpted = {};
                    let mov = 0;
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
                      let sellerMov =
                        brandNames[sellerCode] &&
                        brandNames[sellerCode].mov &&
                        brandNames[sellerCode].mov.find(
                          (x) => x.productType === productType
                        ).amount;

                      if (mov < sellerMov) {
                        mov = sellerMov;
                      }

                      samplePrice =
                        samplePrice +
                        parseFloat(getConvertedCurrency(sampleCost));
                      testingPrice =
                        testingPrice +
                        parseFloat(getConvertedCurrency(qualityTestingCharge));

                      if (priceApplied && priceApplied !== null) {
                        basePrice =
                          basePrice +
                          parseFloat(getConvertedCurrency(priceApplied)) *
                            quantity;
                      } else {
                        basePrice =
                          basePrice +
                          parseFloat(getConvertedCurrency(exfactoryListPrice)) *
                            quantity;
                      }
                      totalSellerAmount =
                        basePrice + samplePrice + testingPrice;
                    }

                    return (
                      <div
                        className={`qa-bg-light-theme qa-pad-3 ${
                          total < mov ? " qa-error-border" : ""
                        } ${i < subOrders.length - 1 ? "qa-mar-btm-2" : ""}`}
                        key={i}
                      >
                        <div className="cart-ship-pt qa-border-bottom">
                          <div
                            style={{ display: "inline-block", width: "50%" }}
                          >
                            <div className="cart-icon-top">
                              <Icon
                                component={cartIcon}
                                className="cart-icon"
                                style={{
                                  width: "20px",
                                  verticalAlign: "top",
                                  marginRight: "8px",
                                  paddingTop: "7%",
                                }}
                              />
                            </div>
                            <div className="qa-disp-table-cell">
                              Seller ID: {sellerCode}
                              {total < mov && (
                                <div className="cart-sub-text">
                                  Add {getSymbolFromCurrency(convertToCurrency)}
                                  {getConvertedCurrency(mov - total)} more to
                                  reach seller's minimum order value
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            style={{
                              display: "inline-block",
                              width: "50%",
                            }}
                          >
                            <span
                              className="cart-delete qa-cursor"
                              onClick={() => {
                                setBulkdelete(true);
                                setDeleteItem(sellerCode);
                                setDeleteModal(true);
                                setDeleteName(
                                  brandNames &&
                                    brandNames[sellerCode] &&
                                    brandNames[sellerCode].brandName
                                );
                              }}
                            >
                              Delete cart
                            </span>
                            <span
                              className={`${
                                update === sellerCode
                                  ? "cart-update qa-cursor active"
                                  : "cart-update qa-cursor"
                              }`}
                              onClick={() => {
                                if (update) updateCart("UPDATE", sellerCode);
                              }}
                            >
                              Update quantity
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
                            productId = "",
                            productName = "",
                            quantity = "",
                            size = "",
                            isFulfillable = false,
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
                          minimumOrderQuantity = parseInt(minimumOrderQuantity);

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

                          if (
                            inventoryQty &&
                            inventoryQty[productId] &&
                            inventoryQty[productId] <= minimumOrderQuantity
                          ) {
                            minimumOrderQuantity = inventoryQty[productId];
                          }
                          let services = [];
                          if (isQualityTestingRequired) {
                            servicesTotal = servicesTotal + 50;
                            services.push(productId + "-test");
                          }
                          if (isSampleDeliveryRequired) {
                            servicesTotal = servicesTotal + 50;
                            services.push(productId + "-sample");
                          }
                          servicesOpted[productId] = services;
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
                                    alt={productName}
                                  ></img>
                                </div>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={10}
                                lg={10}
                                xl={10}
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
                                <div>
                                  <QuantityInput
                                    quantity={quantity}
                                    sellerCode={sellerCode}
                                    minQty={minimumOrderQuantity}
                                    maxQty={error[productId]}
                                    name={`quantity_${i}${j}`}
                                    enableUpdateQty={enableUpdateQty}
                                  />
                                </div>
                                <div className="qa-error">
                                  {error[productId] ? (
                                    <span>
                                      We have {error[productId]} units of
                                      inventory available.
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={8}
                                lg={8}
                                xl={8}
                                className="qa-mar-top-05"
                              >
                                <div
                                  className="qa-disp-table-cell qa-txt-alg-rgt"
                                  style={{ width: "90%" }}
                                >
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
                                  {freeShippingEligible && (
                                    <div className="qa-mar-top-15 qa-offer-text">
                                      FREE shipping
                                    </div>
                                  )}
                                </div>
                                <div
                                  className="qa-txt-alg-rgt qa-disp-table-cell qa-cart-delete"
                                  onClick={() => {
                                    setDeleteItem(sellerCode);
                                    setDeleteProduct(productId);
                                    setDeleteName(productName);
                                    setDeleteModal(true);
                                  }}
                                >
                                  <Icon
                                    component={deleteIcon}
                                    className="delete-icon qa-cursor"
                                    style={{
                                      width: "15px",
                                    }}
                                  />
                                </div>
                                {isFulfillable === false && (
                                  <div className="cart-sub-text p-out-of-stock">
                                    This product is currently out of stock
                                  </div>
                                )}
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
                        <Button
                          className="qa-button qa-fs-12 cart-opt-service qa-mar-top-2 qa-vs-hide"
                          onClick={() => {
                            setOptService(order);
                            showModal(true);
                            setServiceTotal(servicesTotal);
                            setSelectedServices(servicesOpted);
                          }}
                        >
                          Opt for services
                        </Button>
                        <Button
                          className="qa-button qa-fs-12 cart-save-later qa-mar-top-2"
                          onClick={() => addSFL(order)}
                        >
                          Save for later
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
              <SavedForLater brandNames={brandNames} />
            </Col>
            <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              {showError && (
                <div className="qa-pad-2 qa-mar-btm-2 cart-error-block cart-err display-flex">
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
                  {getConvertedCurrency(mov)} to 'Save for later' in order to
                  proceed
                </div>
              )}
              {isFulfillable === false && (
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
              )}
              {referralCode && (
                <div className="qa-pad-020 qa-mar-btm-2 cart-price-block">
                  <div className="cart-price-title">Available coupons</div>
                  <div className="margin-right-2p qa-lh">
                    <Icon
                      component={couponIcon}
                      className="coupon-icon"
                      style={{
                        width: "15px",
                        verticalAlign: "top",
                        marginRight: "5px",
                      }}
                    />
                    Proceed to shipping page to apply coupons
                  </div>
                </div>
              )}
              <PaymentBanner />
              {/*<div className="cart-price-block permot-text">
                <span className="sdf">
                  Black Friday offer discount automatically applied on Shipping page.
                </span>
              </div>*/}
              <CartSummary
                id="cart"
                enable={enable && isFulfillable && addressFlag}
                cart={cart}
                brandNames={brandNames}
                deliver={deliver}
                showCartError={showError}
                currencyDetails={currencyDetails}
                user={userProfile}
                hideCreateOrder={!addressFlag}
                clearCart={() => {
                  props.getCart(app_token);
                }}
                showAddrModal={() => {
                  setAddressModal(true);
                  setAddressFunc("add");
                }}
              />
              <div className=" qa-mar-btm-2">
                <Checkbox
                  className="check-box-tnc"
                  onChange={(e) => {
                    let { checked = "" } = e.target;
                    setEnable(checked);
                  }}
                >
                  I agree to{" "}
                  <Link className="c-breakup" href="/TermsOfUse">
                    <a target="_blank">
                      <span className="c-breakup">terms and conditions</span>
                    </a>
                  </Link>
                </Checkbox>
              </div>
            </Col>
          </Row>
        </Col>
      )}
      {mediaMatch.matches && <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>}

      {!mediaMatch.matches && (
        <div style={{ width: "100%" }}>
          <PromotionCarousel />
          <Col span={24} className="qa-pad-0-20">
            {/*<div className="cart-price-block permot-text">
              <span className="sdf">
                Black Friday offer discount automatically applied on Shipping page.
              </span>
            </div>*/}
            <Row>
              <Col span={24}>
                <PaymentBanner />
              </Col>
              <Col
                span={24}
                className="qa-border-bottom qa-pad-btm-2 qa-mar-btm-2"
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
                    {getConvertedCurrency(mov)} to 'Save for later' in order to
                    proceed
                  </div>
                )}
                {isFulfillable === false && (
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
                )}
                <CartSummary
                  id="cart"
                  enable={enable && isFulfillable && addressFlag}
                  cart={cart}
                  brandNames={brandNames}
                  deliver={deliver}
                  showCartError={showError}
                  currencyDetails={currencyDetails}
                  user={userProfile}
                  hideCreateOrder={!addressFlag}
                  clearCart={() => {
                    props.getCart(app_token);
                  }}
                  showAddrModal={() => {
                    setAddressModal(true);
                    setAddressFunc("add");
                  }}
                />
                <div className="qa-mar-top-05">
                  <Checkbox
                    className="check-box-tnc"
                    onChange={(e) => {
                      let { checked = "" } = e.target;
                      setEnable(checked);
                    }}
                  >
                    I agree to{" "}
                    <Link className="c-breakup" href="/TermsOfUse">
                      <a target="_blank">
                        <span className="c-breakup">terms and conditions</span>
                      </a>
                    </Link>
                  </Checkbox>
                </div>
              </Col>
              {referralCode && (
                <Col span={24}>
                  <div className="cart-coupon-sec qa-mar-btm-2 cart-price-block qa-lh">
                    <div className="cart-price-title">Available coupons</div>
                    <div className="margin-right-2p">
                      <Icon
                        component={couponIcon}
                        className="coupon-icon"
                        style={{
                          width: "15px",
                          verticalAlign: "top",
                          marginRight: "5px",
                        }}
                      />
                      Proceed to shipping page to apply coupons
                    </div>
                  </div>
                </Col>
              )}

              <Col span={24}>
                <div className="qa-dark-theme qa-pad-2 qa-mar-btm-2">
                  <div className="qa-disp-table-cell qa-width-80">
                    <div className="cart-ship-st qa-fw-b qa-mar-btm-05">
                      Shipping to:
                    </div>
                    {addressFlag ? (
                      <div className="cart-ship-st">{shippingAddr}</div>
                    ) : (
                      <div
                        className="add-shipping-addr"
                        onClick={() => {
                          setAddressModal(true);
                          setAddressFunc("add");
                        }}
                      >
                        +Add a new address
                      </div>
                    )}
                  </div>

                  {addressFlag && (
                    <div
                      className="qa-disp-table-cell c-edit-address"
                      onClick={() => {
                        setContactId(id);
                        setAddressModal(true);
                        setAddressFunc("edit");
                        form.setFieldsValue({
                          fullName,
                          addressLine1,
                          addressLine2,
                          city,
                          country,
                          state,
                          zipCode,
                          phoneNumber,
                          isDefault: "no",
                          dunsNumber,
                        });
                        if (isDefault) {
                          form.setFieldsValue({ isDefault: "yes" });
                        }
                      }}
                    >
                      <EditOutlined />
                    </div>
                  )}
                </div>
                <div className="cart-prod-title qa-fw-b qa-pad-btm-1 qa-mar-btm-2 qa-border-bottom">
                  Shopping cart
                </div>
                <div className="qa-mar-btm-2">
                  {_.map(subOrders, (order, i) => {
                    let { products = "", sellerCode = "", total = 0 } = order;
                    let servicesTotal = 0;
                    let servicesOpted = {};
                    let mov = 0;
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
                      let sellerMov =
                        brandNames[sellerCode] &&
                        brandNames[sellerCode].mov &&
                        brandNames[sellerCode].mov.find(
                          (x) => x.productType === productType
                        ).amount;

                      if (mov < sellerMov) {
                        mov = sellerMov;
                      }

                      samplePrice =
                        samplePrice +
                        parseFloat(getConvertedCurrency(sampleCost));
                      testingPrice =
                        testingPrice +
                        parseFloat(getConvertedCurrency(qualityTestingCharge));

                      if (priceApplied && priceApplied !== null) {
                        basePrice =
                          basePrice +
                          parseFloat(getConvertedCurrency(priceApplied)) *
                            quantity;
                      } else {
                        basePrice =
                          basePrice +
                          parseFloat(getConvertedCurrency(exfactoryListPrice)) *
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
                              verticalAlign: "top",
                              marginRight: "8px",
                              paddingTop: "0.35%",
                            }}
                          />

                          <div className="qa-disp-tc" style={{ width: "80%" }}>
                            Seller ID: {sellerCode}
                            {total < mov && (
                              <div className="cart-sub-text">
                                Add {getSymbolFromCurrency(convertToCurrency)}
                                {getConvertedCurrency(mov - total)} more to
                                reach seller's minimum order value
                              </div>
                            )}
                          </div>
                          <div className="qa-txt-alg-cnt qa-pad-top-05 qa-pad-btm-1">
                            <span
                              className="cart-delete qa-cursor"
                              onClick={() => {
                                setDeleteModal(true);
                                setBulkdelete(true);
                                setDeleteItem(sellerCode);
                                setDeleteName(
                                  brandNames &&
                                    brandNames[sellerCode] &&
                                    brandNames[sellerCode].brandName
                                );
                              }}
                            >
                              Delete cart
                            </span>
                            <span
                              className={`${
                                update === sellerCode
                                  ? "cart-update qa-cursor active"
                                  : "cart-update qa-cursor"
                              }`}
                              onClick={() => {
                                if (update) updateCart("UPDATE", sellerCode);
                              }}
                            >
                              Update quantity
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
                            productId = "",
                            productName = "",
                            quantity = "",
                            size = "",
                            total = "",
                            isFulfillable = false,
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
                          minimumOrderQuantity = parseInt(minimumOrderQuantity);

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

                          totalProductAmount = basePrice;

                          if (
                            inventoryQty &&
                            inventoryQty[productId] &&
                            inventoryQty[productId] <= minimumOrderQuantity
                          ) {
                            minimumOrderQuantity = inventoryQty[productId];
                          }
                          let services = [];
                          if (isQualityTestingRequired) {
                            servicesTotal = servicesTotal + 50;
                            services.push(productId + "-test");
                          }
                          if (isSampleDeliveryRequired) {
                            servicesTotal = servicesTotal + 50;
                            services.push(productId + "-sample");
                          }
                          servicesOpted[productId] = services;
                          return (
                            <Row className="qa-pad-20-0" key={j}>
                              <Col xs={9} sm={9} md={4} lg={9} xl={9}>
                                <div className="aspect-ratio-box">
                                  <img
                                    className="images"
                                    src={image}
                                    alt={productName}
                                  ></img>
                                </div>
                              </Col>
                              <Col
                                xs={15}
                                sm={15}
                                md={10}
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
                              </Col>
                              <Col xs={24} sm={24} md={10} lg={24} xl={24}>
                                <div className="cart-prod-title qa-mar-top-05 qa-fw-b">
                                  {getSymbolFromCurrency(convertToCurrency)}
                                  {totalProductAmount
                                    ? parseFloat(totalProductAmount).toFixed(2)
                                    : ""}
                                </div>
                                {!freeShippingEligible && (
                                  <div className="cart-price-text qa-mar-btm-1">
                                    Base price per unit excl. margin and other
                                    charges
                                  </div>
                                )}
                                <div>
                                  <div
                                    className="qa-disp-tc"
                                    style={{ width: "50%" }}
                                  >
                                    <QuantityInput
                                      quantity={quantity}
                                      sellerCode={sellerCode}
                                      minQty={minimumOrderQuantity}
                                      maxQty={error[productId]}
                                      name={`quantity_${i}${j}`}
                                      enableUpdateQty={enableUpdateQty}
                                    />
                                    <div className="qa-error">
                                      {error[productId] ? (
                                        <span>
                                          We have {error[productId]} units of
                                          inventory available.
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div
                                    className="qa-disp-tc"
                                    style={{ width: "40%" }}
                                  >
                                    {isFulfillable === false && (
                                      <div className="cart-sub-text p-out-of-stock qa-pad-0-20">
                                        This product is currently out of stock
                                      </div>
                                    )}
                                  </div>
                                  <div
                                    className="qa-txt-alg-rgt qa-disp-tc"
                                    style={{ width: "10%" }}
                                    onClick={() => {
                                      setDeleteProduct(productId);
                                      setDeleteItem(sellerCode);
                                      setDeleteModal(true);
                                      setDeleteName(productName);
                                    }}
                                  >
                                    <Icon
                                      component={deleteIcon}
                                      className="delete-icon"
                                      style={{
                                        width: "15px",
                                      }}
                                    />
                                  </div>
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
                            {totalSellerAmount
                              ? parseFloat(totalSellerAmount).toFixed(2)
                              : ""}
                          </Col>
                        </Row>

                        {/* <Button
                        className="qa-button qa-fs-12 cart-opt-service qa-mar-top-2 qa-vs-hide"
                        onClick={() => {
                          setOptService(order);
                          showModal(true);
                          setServiceTotal(servicesTotal);
                          setSelectedServices(servicesOpted);
                        }}
                      >
                        Opt for services
                      </Button> */}
                        <Button
                          className="qa-button qa-fs-12 cart-save-later qa-mar-top-2"
                          onClick={() => addSFL(order)}
                        >
                          Save for later
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Col>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
            </Row>
            <SavedForLater brandNames={brandNames} />
          </Col>
        </div>
      )}

      <Modal
        visible={modal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "20px", backgroundColor: "#f9f7f2" }}
        width={650}
        style={{ top: 5 }}
        className="opt-service-modal"
      >
        <div className="qa-rel-pos">
          <div className="cart-prod-name qa-border-bottom qa-pad-btm-2">
            Services:
          </div>
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

          <Row className="qa-font-san qa-mar-top-2">
            <Col xs={20} sm={20} md={20} lg={20} xl={20}>
              <div className="cart-prod-title qa-mar-btm-2">
                <div className="qa-disp-table-cell">
                  <CheckCircleOutlined
                    style={{
                      color: "#d9bb7f",
                      marginRight: "10px",
                      fontSize: "18px",
                    }}
                  />
                </div>
                <div className="qa-disp-table-cell qa-pad-rgt-1">
                  Production monitoring,{" "}
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(50)} per seller order
                  <div className="cart-subtitle">
                    Launch offer, this service is on us!
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={4} sm={4} md={4} lg={4} xl={4}>
              <Tooltip
                placement="top"
                overlayClassName="qa-font-san"
                title="Monitoring of the entire production process is available for this product. Write to us at buyers@qalara.com to know more"
              >
                <div className="qa-sm-color qa-fs-12 qa-font-san">
                  What's this?
                </div>
              </Tooltip>
            </Col>

            <Col xs={20} sm={20} md={20} lg={20} xl={20}>
              <div className="cart-prod-title qa-mar-btm-2">
                <div className="qa-disp-table-cell">
                  <CheckCircleOutlined
                    style={{
                      color: "#d9bb7f",
                      marginRight: "10px",
                      fontSize: "18px",
                    }}
                  />
                </div>
                <div className="qa-disp-table-cell qa-pad-rgt-1">
                  Quality inspection, {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(50)} per seller order order
                  <div className="cart-subtitle">
                    Launch offer, this service is on us!
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={4} sm={4} md={4} lg={4} xl={4}>
              <Tooltip
                placement="top"
                overlayClassName="qa-font-san"
                title="Quality testing is available for this product. Write to us at buyers@qalara.com to know more."
              >
                <div className="qa-sm-color qa-fs-12 qa-font-san">
                  What's this?
                </div>
              </Tooltip>
            </Col>
          </Row>

          <Row>
            <Col xs={0} sm={0} md={24} lg={24} xl={24}>
              <Row className="qa-font-san qa-mar-top-1 qa-pad-btm-1 qa-border-bottom">
                <Col
                  xs={6}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  className="qa-pad-rgt-1"
                >
                  <div className="cart-prod-title qa-fw-b">Products</div>
                </Col>
                <Col
                  xs={9}
                  sm={9}
                  md={9}
                  lg={9}
                  xl={9}
                  className="qa-pad-rgt-1"
                >
                  <div className="cart-prod-title qa-fw-b">
                    Request sample{" "}
                    <Tooltip
                      placement="top"
                      overlayClassName="qa-font-san"
                      title="Sample delivery is available for this product. To request for a sample, please write to us at buyers@qalara.com and mention the product id or the webpage address. We will take care of the rest."
                    >
                      <span className="qa-sm-color qa-fs-12 qa-font-san">
                        What's this?
                      </span>
                    </Tooltip>
                  </div>
                </Col>
                <Col xs={9} sm={9} md={9} lg={9} xl={9}>
                  <div className="cart-prod-title qa-fw-b">
                    Quality testing{" "}
                    <Tooltip
                      placement="top"
                      overlayClassName="qa-font-san"
                      title="Quality testing is available for this product. Write to us at buyers@qalara.com to know more."
                    >
                      <span className="qa-sm-color qa-fs-12 qa-font-san">
                        What's this?
                      </span>
                    </Tooltip>
                  </div>
                </Col>
              </Row>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {_.map(optService["products"], (product, j) => {
                  let {
                    image = "",
                    productName = "",
                    productId = "",
                    isQualityTestingRequired = false,
                    isSampleDeliveryRequired = false,
                  } = product;
                  let defaultValue = [];
                  if (isQualityTestingRequired) {
                    defaultValue.push(productId + "-test");
                  }
                  if (isSampleDeliveryRequired) {
                    defaultValue.push(productId + "-sample");
                  }
                  return (
                    <Checkbox.Group
                      defaultValue={defaultValue}
                      onChange={(e) => onOptServiceChange(e, productId)}
                      name={`checkbox-${j}`}
                      key={j}
                      style={{ width: "100%" }}
                    >
                      <Row className="qa-font-san qa-pad-btm-1 qa-pad-top-1 qa-border-bottom">
                        <Col
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          className="qa-pad-rgt-1"
                        >
                          <div className="aspect-ratio-box">
                            <img
                              className="images"
                              src={image}
                              alt={productName}
                            ></img>
                          </div>
                        </Col>

                        <Col
                          xs={9}
                          sm={9}
                          md={9}
                          lg={9}
                          xl={9}
                          className="qa-pad-rgt-1"
                        >
                          <div className="cart-prod-title">
                            <Checkbox
                              className="check-box-tnc"
                              value={`${productId}-sample`}
                            ></Checkbox>
                            <span className="qa-va-m qa-mar-lft">
                              {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(50)} per sample
                            </span>
                          </div>
                        </Col>
                        <Col xs={9} sm={9} md={9} lg={9} xl={9}>
                          <div className="cart-prod-title">
                            <Checkbox
                              className="check-box-tnc"
                              value={`${productId}-test`}
                            ></Checkbox>
                            <span className="qa-va-m qa-mar-lft">
                              {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(50)} per product
                            </span>
                          </div>
                        </Col>
                        <Col
                          span={24}
                          className="cart-prod-title qa-mar-top-05 qa-text-2line"
                        >
                          {productName}
                        </Col>
                      </Row>
                    </Checkbox.Group>
                  );
                })}
              </Col>
            </Col>
            <Col xs={24} sm={24} md={0} lg={0} xl={0}>
              {_.map(optService["products"], (product, j) => {
                let {
                  image = "",
                  productName = "",
                  productId = "",
                  isQualityTestingRequired = false,
                  isSampleDeliveryRequired = false,
                } = product;
                let defaultValue = [];
                if (isQualityTestingRequired) {
                  defaultValue.push(productId + "-test");
                }
                if (isSampleDeliveryRequired) {
                  defaultValue.push(productId + "-sample");
                }
                return (
                  <Checkbox.Group
                    defaultValue={defaultValue}
                    onChange={(e) => onOptServiceChange(e, productId)}
                    name={`checkbox-${j}`}
                    key={j}
                    style={{ width: "100%" }}
                  >
                    <Row className="qa-font-san qa-pad-btm-1 qa-pad-top-1 qa-border-bottom">
                      <Col
                        xs={9}
                        sm={9}
                        md={9}
                        lg={9}
                        xl={9}
                        className="qa-pad-rgt-1"
                      >
                        <div className="aspect-ratio-box">
                          <img
                            className="images"
                            src={image}
                            alt={productName}
                          ></img>
                        </div>
                      </Col>

                      <Col
                        xs={11}
                        sm={11}
                        md={11}
                        lg={11}
                        xl={11}
                        className="qa-pad-rgt-1"
                      >
                        <div className="qa-mar-btm-1">
                          <div className="qa-disp-table-cell">
                            <Checkbox
                              className="check-box-tnc"
                              value={`${productId}-sample`}
                            ></Checkbox>
                          </div>
                          <div className="qa-disp-table-cell">
                            <div className="cart-prod-title qa-mar-lft">
                              <div className="qa-fw-b">Request sample</div>
                              {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(50)}
                              per sample
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="qa-disp-table-cell">
                            <Checkbox
                              className="check-box-tnc"
                              value={`${productId}-test`}
                            ></Checkbox>
                          </div>
                          <div className="qa-disp-table-cell">
                            <div className="cart-prod-title qa-mar-lft">
                              <div className="qa-fw-b">Quality testing</div>
                              {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(50)} per sample
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xs={4} sm={4} md={4} lg={4} xl={4}>
                        <div className="qa-sm-color qa-fs-12 qa-mar-btm-1 qa-font-san">
                          <Tooltip
                            placement="top"
                            overlayClassName="qa-font-san"
                            title="Sample delivery is available for this product. To request for a sample, please write to us at buyers@qalara.com and mention the product id or the webpage address. We will take care of the rest."
                          >
                            What's this?
                          </Tooltip>
                        </div>

                        <div className="qa-sm-color qa-fs-12 qa-font-san">
                          <Tooltip
                            placement="top"
                            overlayClassName="qa-font-san"
                            title="Quality testing is available for this product. Write to us at buyers@qalara.com to know more."
                          >
                            What's this?
                          </Tooltip>
                        </div>
                      </Col>
                      <Col
                        span={24}
                        className="cart-prod-title qa-mar-top-05 qa-text-2line"
                      >
                        {productName}
                      </Col>
                    </Row>
                  </Checkbox.Group>
                );
              })}
            </Col>
          </Row>

          <Row className="qa-pad-20-0">
            <Col
              xs={18}
              sm={18}
              md={18}
              lg={18}
              xl={18}
              className="cart-prod-name qa-fw-b"
            >
              TOTAL VALUE FOR SERVICES
            </Col>
            <Col
              xs={6}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              className="qa-txt-alg-rgt cart-prod-name qa-fw-b"
            >
              {getSymbolFromCurrency(convertToCurrency)}
              {optService ? getConvertedCurrency(serviceTotal) : ""}
            </Col>
          </Row>
          <div className="qa-txt-alg-rgt qa-mar-btm-2">
            <Button
              className="qa-button qa-fs-12 cart-opt-service qa-mar-top-2"
              onClick={optForServices}
            >
              Opt for services
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        visible={addressModal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={620}
        style={{ top: 5 }}
        className="cart-address-modal"
        forceRender
      >
        <div className="qa-rel-pos qa-font-san">
          <div className="qa-pad-btm-2">
            {addressFunc === "edit" ? (
              <span className="cart-prod-name">EDIT ADDRESS</span>
            ) : addressFunc === "add" ? (
              <span className="cart-prod-name">ADD NEW ADDRESS</span>
            ) : (
              <span className="cart-prod-name">SELECT ADDRESS</span>
            )}
            <span className="edit-address-blk">
              {(addressFunc === "edit" || addressFunc === "add") &&
                addresses.length > 0 && (
                  <div
                    className="c-breakup"
                    onClick={() => {
                      setAddressFunc("select");
                    }}
                  >
                    Select from address book
                  </div>
                )}
              {(addressFunc === "edit" || addressFunc === "select") && (
                <div
                  className="c-breakup"
                  onClick={() => {
                    setAddressFunc("add");
                    setSelCountryCode("us");
                    setDialCode("+1");
                    setHCountry([]);
                    form.resetFields();
                  }}
                >
                  Add new address
                </div>
              )}
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
        </div>
        {addressFunc === "select" ? (
          <Form name="select_address_form" form={addform} scrollToFirstError>
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Radio.Group onChange={onChange} value={selectedShippingId}>
                  {_.map(addresses, (address, i) => {
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
                      dunsNumber = "",
                    } = address || {};

                    let shippingAddr = "";
                    let pls = phoneNumber.indexOf("+") >= 0 ? "" : "+";
                    shippingAddr =
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
                      pls +
                      phoneNumber;

                    return (
                      <div
                        className="qa-bg-dark-theme qa-pad-01 qa-mar-btm-2"
                        key={i}
                      >
                        <div className="qa-disp-table-cell qa-cursor">
                          <Radio
                            value={id}
                            className="qa-radio-home"
                            id={`${zipCode}-${country}`}
                          ></Radio>
                        </div>
                        <div
                          className="qa-disp-table-cell"
                          style={{ width: "90%" }}
                        >
                          <div className="cart-address-label qa-mar-btm-05">
                            {fullName}
                          </div>
                          <div className="cart-prod-title">{shippingAddr}</div>
                        </div>
                        <div
                          className="qa-disp-table-cell c-edit-address qa-cursor"
                          onClick={() => {
                            setAddressModal(true);
                            setAddressFunc("edit");
                            setContactId(id);
                            form.setFieldsValue({
                              fullName,
                              addressLine1,
                              addressLine2,
                              city,
                              country,
                              state,
                              zipCode,
                              phoneNumber,
                              isDefault: "no",
                              dunsNumber,
                            });
                            if (isDefault) {
                              form.setFieldsValue({ isDefault: "yes" });
                            }
                          }}
                        >
                          <EditOutlined />
                        </div>
                      </div>
                    );
                  })}
                </Radio.Group>
              </Col>

              <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                <Col
                  xs={24}
                  sm={24}
                  md={9}
                  lg={9}
                  xl={9}
                  className="qa-pad-1"
                  onClick={() => onFinish(selectedShippingId)}
                >
                  <Button
                    htmlType="submit"
                    className="qa-button qa-cart-ship-btn"
                  >
                    Select and Ship to
                  </Button>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={9}
                  lg={9}
                  xl={9}
                  className="qa-pad-1 qa-mar-btm-4"
                  onClick={handleCancel}
                >
                  <Button className="qa-button qa-cart-cancel">Cancel</Button>
                </Col>
              </Col>
              <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                <Row>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6}></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={9}
                    lg={9}
                    xl={9}
                    className="qa-pad-rgt-20"
                    onClick={handleCancel}
                  >
                    <Button className="qa-button qa-cart-cancel">Cancel</Button>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={9}
                    lg={9}
                    xl={9}
                    onClick={() => onFinish(selectedShippingId)}
                  >
                    <Button
                      htmlType="submit"
                      className="qa-button qa-cart-ship-btn"
                    >
                      Select and Ship to
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        ) : (
          <Form
            name="address_form"
            onFinish={addressFunc === "add" ? saveAddress : updateAddress}
            form={form}
            scrollToFirstError
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div className="address-label">Full name</div>
                <Form.Item
                  name="fullName"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-rgt-08"
              >
                <div className="address-label">Address line 1</div>
                <Form.Item
                  name="addressLine1"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-lft-08"
              >
                <div className="address-label">Address line 2</div>
                <Form.Item
                  name="addressLine2"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-rgt-08"
              >
                <div className="address-label">Country</div>
                <Form.Item
                  name="country"
                  className="form-item modified-selector"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    dropdownClassName="qa-light-menu-theme"
                    onChange={(e) => handleCountry(e)}
                  >
                    {countryList}
                  </Select>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-lft-08"
              >
                <div className="address-label">State</div>
                <Form.Item
                  name="state"
                  className="modified-selector"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                  ]}
                >
                  {!hCountry.length ? (
                    <Input />
                  ) : (
                    <Select placeholder="Select state" showSearch>
                      {getStates}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-rgt-08"
              >
                <div className="address-label">City</div>
                <Form.Item
                  name="city"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-lft-08"
              >
                <div className="address-label">Pincode</div>
                <Form.Item
                  name="zipCode"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                  ]}
                >
                  {deliver ? (
                    <Select showSearch onSearch={handleZipCode}>
                      {zipCodeList && zipCodeList.length > 0 ? (
                        zipCodeList.map((e) => {
                          return (
                            <Option key={e} value={e}>
                              {e}
                            </Option>
                          );
                        })
                      ) : (
                        <Option value="">
                          Enter min 3 digits to view list
                        </Option>
                      )}
                    </Select>
                  ) : (
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-rgt-08"
              >
                <div className="address-label">Phone number</div>
                <Form.Item
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                    {
                      pattern: new RegExp(/^(?=.*[0-9])[- +()0-9]+$/), //(/^[0-9\s]*$/),
                      message: "Please enter value phoneNumber",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-lft-08"
              >
                <div className="address-label">
                  ABN / VAT / EORI / UEN / Tax Number
                </div>
                <Form.Item name="dunsNumber">
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={12}
                lg={12}
                xl={12}
                className="qa-pad-rgt-08"
              >
                <div className="address-label">Default address</div>
                <Form.Item
                  name="isDefault"
                  className="form-item"
                  rules={[
                    {
                      required: true,
                      message: "Field is required.",
                      whitespace: true,
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={onCheckDefault}
                    value={defaultValue}
                    className="radio-group"
                  >
                    <Radio value="yes" className="qa-radio-home">
                      Yes (default)
                    </Radio>
                    <Radio value="no" className="qa-radio-home">
                      No
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={0} lg={0} xl={0}>
                <Col xs={24} sm={24} md={9} lg={9} xl={9} className="qa-pad-1">
                  <Button
                    htmlType="submit"
                    className="qa-button qa-cart-ship-btn"
                  >
                    {addressFunc === "edit"
                      ? "Save and Ship to"
                      : "Add and ship to"}
                  </Button>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={9}
                  lg={9}
                  xl={9}
                  className="qa-pad-1 qa-mar-btm-4"
                  onClick={handleCancel}
                >
                  <Button className="qa-button qa-cart-cancel">Cancel</Button>
                </Col>
              </Col>
              <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                <Row>
                  <Col xs={24} sm={24} md={6} lg={6} xl={6}></Col>
                  <Col
                    xs={24}
                    sm={24}
                    md={9}
                    lg={9}
                    xl={9}
                    className="qa-pad-rgt-20"
                    onClick={handleCancel}
                  >
                    <Button className="qa-button qa-cart-cancel">Cancel</Button>
                  </Col>
                  <Col xs={24} sm={24} md={9} lg={9} xl={9}>
                    <Button
                      htmlType="submit"
                      className="qa-button qa-cart-ship-btn"
                    >
                      {addressFunc === "edit"
                        ? "Save and Ship to"
                        : "Add and ship to"}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

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
              <b>{deleteName}</b>
            </div>
            <Button
              className="qa-button qa-fs-12 cart-cancel-delete qa-mar-top-2"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="qa-button qa-fs-12 cart-delete qa-mar-top-2"
              onClick={() => updateCart("DELETE")}
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
    addresses: state.userProfile.addresses,
    sfl: state.checkout.sfl,
    userProfile: state.userProfile.userProfile,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
  };
};

export default connect(mapStateToProps, {
  getAddresses,
  getCart,
  getSavedForLater,
  updateCart,
  checkInventory,
})(CartDetails);
