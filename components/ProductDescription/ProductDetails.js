/** @format */

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Button,
  Row,
  Col,
  Input,
  Form,
  Select,
  Modal,
  Tooltip,
  InputNumber,
  message,
} from "antd";
import Icon, {
  MinusOutlined,
  CheckCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../common/BreadCrumb";
import Accordion from "../common/Accordion";
import ProductCard from "../common/ProductCard";
import Certifications from "../common/Certifications";
import ImageGallery from "react-image-gallery";
import Slider from "react-slick";
import { connect } from "react-redux";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import closeButton from "../../public/filestore/closeButton";
import { loginToApp } from "../AuthWithKeycloak";
import infoIcon from "../../public/filestore/infoIcon";
import amexPayment from "../../public/filestore/amexPayment";
import visaPayment from "../../public/filestore/visaPayment";
import stripePayment from "../../public/filestore/stripePayment";
import paypalPayment from "../../public/filestore/paypalPayment";
import mcPayment from "../../public/filestore/mcPayment";
import discoverPayment from "../../public/filestore/discoverPayment";
import moreInfoIcon from "../../public/filestore/moreInfoIcon";
import SellerContact from "../SellerContact/SellerContact";
import ProductContact from "../ProductContact/ProductContact";
import getSymbolFromCurrency from "currency-symbol-map";
import PDPLoader from "../../public/filestore/PDPLoader";
import PDPLoaderMobile from "../../public/filestore/PDPLoaderMobile";
import PDPZoom from "../../public/filestore/PDPZoom";
import Air from "../../public/filestore/air";
import Sea from "../../public/filestore/sea";
import alertIcon from "../../public/filestore/alertIcon";
import { useRouter } from "next/router";
import { useKeycloak } from "@react-keycloak/ssr";
import { checkInventory } from "../../store/actions";
import playButton from "./../../public/filestore/playButton";

const { Option } = Select;

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 3.2,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2.1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1.2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1.2,
        slidesToScroll: 1,
      },
    },
  ],
};

const countriesList = getCountries().map((country) => {
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
    country !== "SO"
  ) {
    return (
      <Option key={country} value={en[country]}>
        {en[country]}
      </Option>
    );
  }
});

const filteredCountry = getCountries().map((country) => {
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
    country === "AU" ||
    country === "CA" ||
    country === "PT" ||
    country === "ES" ||
    country === "RO" ||
    country === "PL" ||
    country === "SE" ||
    country === "NL" ||
    country === "LV" ||
    country === "IE" ||
    country === "DE" ||
    country === "CZ" ||
    country === "AT"
  )
    return (
      <Option key={country} value={en[country]}>
        {en[country]}
      </Option>
    );
});

const ProductDetails = (props) => {
  let {
    data = {},
    userProfile = "",
    sellerDetails = "",
    token = "",
    authenticated = false,
    currencyDetails = {},
    cart = {},
    listingPage = {},
    isLoading = true,
    isGuest = false,
  } = props;

  let {
    companyDescription = "",
    valueCertifications = [],
    vanityId = "",
    brandName = "",
  } = sellerDetails || {};

  let { orderId = "" } = cart;
  const router = useRouter();
  const {keycloak} = useKeycloak();
  const ImgGalleryM = useRef(null);
  const ImgGalleryD = useRef(null);
  const [form] = Form.useForm();
  const [rtsform] = Form.useForm();
  const [calculateform] = Form.useForm();
  const [pincodeModal, setPincodeModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [pincodeSuccess, setPincodeSuccess] = useState(false);
  const [accordionView, setAccordionView] = useState("");
  const [activeKeys, setActiveKeys] = useState(["1", "2"]);
  const [count, setCount] = useState(0);
  const [rfqModal, setRfqModal] = useState(false);
  const [rfqType, setRfqType] = useState("");
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [thumbnail, setThumbnail] = useState(false);
  const [uCountry, setUCountry] = useState("");
  // const [uZipcode, setUZipcode] = useState("");
  const [nonServiceable, setNonServiceable] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [mobile, setMobile] = useState(false);
  const [calculationModal, setCalculationModal] = useState(false);
  const [qtyErr, setQtyErr] = useState(false);
  const [sizeErr, setSizeErr] = useState(false);
  const [airData, setAirData] = useState();
  const [seaData, setSeaData] = useState();
  const [skuId, setSkuId] = useState("");
  const [variantId, setVariantId] = useState();
  const [zoomImg, setZoomImg] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [nonServiceableCountry, setNonServiceableCountry] = useState(false);
  const [selProductId, setSelProductId] = useState("");
  const [showCart, setCart] = useState(false);
  const [inStock, setInStock] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  // let mediaMatch;
  const url = process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL;

  const node = useRef();

  const [open, setOpen] = useState(false);

  const handleClickOutside = (e) => {
    setOpen(false);
    setSelProductId("");
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const selectProduct = (productId) => {
    setSelProductId(productId);
    setOpen(!open);
  };

  useEffect(() => {
    // mediaMatch= typeof window && window.matchMedia('(min-width: 1024px)');
    let width = window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }
  }, []);

  useEffect(() => {
    let { data = {}, userProfile = {} } = props;
    let { country = "", verificationStatus = "" } = userProfile || {};
    let destinationCountry = sessionStorage.getItem("destinationCountry");

    let { variants = [], skus = [], deliveryExclusions = [] } = data || {};
    let color = "";
    let variantId = "";

    let index = 0;

    if (destinationCountry && deliveryExclusions) {
      setUCountry(destinationCountry);
      index = deliveryExclusions.findIndex(
        (item) => destinationCountry.toLowerCase() === item.toLowerCase()
      );
      if (index >= 0) {
        setNonServiceableCountry(true);
      }
    } else if (country && deliveryExclusions) {
      setUCountry(country);
      index = deliveryExclusions.findIndex(
        (item) => country.toLowerCase() === item.toLowerCase()
      );
      if (index >= 0) {
        setNonServiceableCountry(true);
      }
    }

    if (
      profileType === "BUYER" &&
      verificationStatus === "VERIFIED" &&
      isGuest === "true"
    ) {
      setErrorMsg(
        "In order to activate your account and place an order please "
      );
    } else if (
      (profileType === "BUYER" && verificationStatus === "ON_HOLD") ||
      (profileType === "BUYER" && verificationStatus === "REJECTED")
    ) {
      setErrorMsg(
        "You will be able to checkout once your Buyer account is verified. "
      );
    } else if (profileType === "SELLER" || !authenticated) {
      setErrorMsg(
        "In order to activate your account and place an order please "
      );
    }

    if (skus.length > 0) {
      let skuId = skus[0]["id"];

      props.checkInventory(token, [skuId], (result) => {
        let qty = result[skuId];
        if (qty > 0) {
          setSkuId(skuId);
        } else {
          setSkuId("");
        }
        setInStock(qty);
      });
    }

    if (variants.length) {
      color = variants[0]["color"];
      variantId = variants[0]["sequenceId"];
      let imageList = [];
      let zoomedImages = [...variants[0]["zoomedImages"]];
      for (let i = 0; i < zoomedImages.length; i++) {
        let obj = {};
        obj["fullscreen"] = url + zoomedImages[i];
        obj["original"] =
          url + (variants[0]["mediaUrls"][i] || zoomedImages[i]);
        obj["thumbnail"] = url + variants[0]["thumbNails"][i];
        imageList.push(obj);
      }
      setGalleryImages(imageList);
      rtsform.setFieldsValue({ color: variants[0].color });
    }

    setSelectedColor(color);
    setVariantId(variantId);
  }, [props.data]);

  let {
    articleId = "",
    colors = [],
    packType = "",
    productName = "",
    productType = "",
    qualityInspection = "",
    qualityTesting = "",
    sampleDelivery = "",
    minimumOrderQuantity = "",
    moqUnit = "",
    sampleCost = "",
    shippingMethods = [],
    variants = [],
    colorCustomizationAvailable = "",
    sizeCustomizationAvailable = "",
    packagingCustomizationAvailable = "",
    suggestedRetailPrice = "",
    exfactoryListPrice = "",
    sellerCode = "",
    priceMin = "",
    offers = "",
    minOrderValue = "",
    deliveryExclusions = [],
    info = {},
    skus = [],
    hsnCode = "",
    casePackBreadth = "",
    casePackHeight = "",
    casePackLength = "",
    exFactoryPrice = "",
    casePackWeight = "",
    casePackQty = "",
    casePackLBHUnit = "",
    casePackWeightUnit = "",
    visibleTo = "",
  } = data || {};

  let sizes = [];
  let productNameSC =
    productName.toLowerCase().charAt(0).toUpperCase() +
    productName.toLowerCase().slice(1);

  let brandNameSC =
    brandName.toLowerCase().charAt(0).toUpperCase() +
    brandName.toLowerCase().slice(1);

  let sampleCostSC =
    sampleCost.toLowerCase().charAt(0).toUpperCase() +
    sampleCost.toLowerCase().slice(1);

  if (info && info["size"] && info["size"].toString().trim().length > 0) {
    sizes = info["size"];
  }

  let splpLink =
    "/seller/" + sellerCode + "/" + encodeURIComponent("All Categories");
  let displayPrice = priceMin || exfactoryListPrice;

  let initialValues;
  let slider;
  let mslider;

  if (!minOrderValue) {
    minOrderValue =
      productType === "RTS" ? 250 : productType === "ERTM" ? 500 : 1000;
  }

  let { slp_content = [] } = listingPage || {};

  const next = () => {
    slider.slickNext();
    mslider.slickNext();
  };

  const previous = () => {
    slider.slickPrev();
    mslider.slickPrev();
  };

  const getConvertedCurrency = (baseAmount, roundOff = false) => {
    let { convertToCurrency = "", rates = [] } = currencyDetails || {};
    if (roundOff) {
      return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(
        0
      );
    } else {
      return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(
        2
      );
    }
  };

  let { convertToCurrency = "" } = currencyDetails || {};
  let { profileId = "", profileType = "", verificationStatus = "" } =
    userProfile || {};

  if (profileType === "SELLER") {
    profileId = profileId.replace("SELLER::", "");
  } else {
    profileId = profileId.replace("BUYER::", "");
  }

  if (userProfile) {
    initialValues = {
      profileId: userProfile && userProfile.profileId,
      profileType: userProfile && userProfile.profileType,
      category: "",
      requirementDetails: "",
      upload: {},
      quantity: "",
      pricePerItem: "",
      deliveryDate: "",
      firstName: userProfile && userProfile.firstName,
      requesterName: userProfile.firstName + " " + userProfile.lastName,
      companyName: userProfile && userProfile.orgName,
      emailId: userProfile && userProfile.email,
      country: userProfile && userProfile.country,
      city: "",
      mobileNo: userProfile && userProfile.orgPhone,
      orgType: userProfile && userProfile.orgType,
      orgName: userProfile && userProfile.orgName,
      verificationStatus: userProfile && userProfile.verificationStatus,
      profileImage: userProfile && userProfile.profileImage,
    };
  }
  let notificationMsg = "";
  let showPrice = true;

  if (
    !authenticated ||
    (profileType === "BUYER" && verificationStatus === "ON_HOLD") ||
    (profileType === "BUYER" && verificationStatus === "REJECTED") ||
    (profileType === "SELLER" && profileId !== sellerCode)
  ) {
    showPrice = false;
  }
  if (
    profileType === "BUYER" &&
    verificationStatus === "IN_PROGRESS" &&
    visibleTo === "VERIFIED"
  ) {
    notificationMsg =
      "You will be able to view the prices once your Buyer account is verified.";
  } else if (profileType === "BUYER" && verificationStatus === "ON_HOLD") {
    notificationMsg =
      "You will be able to view the price once your Buyer account is verified.";
  } else if (profileType === "BUYER" && verificationStatus === "REJECTED") {
    notificationMsg =
      "You will be able to view the prices once your Buyer account is verified.";
  } else if (profileType === "SELLER" && profileId !== sellerCode) {
    notificationMsg =
      "You will be able to view the price if you signup as a buyer";
  }

  const hidePincodeModal = () => {
    setPincodeModal(false);
  };

  const signIn = () => {
    loginToApp(keycloak, { currentPath: router.asPath.split("?")[0] });
    localStorage.setItem("productUrl", router.asPath.split("?")[0]);
  };

  const signUp = () => {
    router.push("/signup");
  };

  const onCheck = () => {
    let image = galleryImages.length ? galleryImages[0]["thumbnail"] : "";
    if (authenticated) {
      rtsform
        .validateFields(["quantity", "color", "size"])
        .then((values) => {
          let { quantity = "", size = "", color = "" } = values;
          let p_data = {
            quantity: quantity,
            sellerCode: sellerCode,
            articleId: articleId,
            productId: skuId,
            minimumOrderQuantity: minimumOrderQuantity,
            isSampleDeliveryRequired: false,
            isQualityTestingRequired: false,
            productName: productName,
            color: color,
            size: size,
            image: image,
            productType: productType,
          };
          setQtyErr(false);
          setSizeErr(false);

          if (authenticated) {
            if (orderId) {
              let sku = [];
              sku.push(skuId);
              props.checkInventory(token, sku, (result) => {
                if (result[skuId] >= quantity) {
                  fetch(
                    `${process.env.REACT_APP_ORDER_URL}/v1/orders/my/${orderId}/product`,
                    {
                      method: "POST",
                      body: JSON.stringify(p_data),
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                      },
                    }
                  )
                    .then((res) => {
                      if (res.ok) {
                        // message.success(
                        //   "Product has been successfully added to cart!",
                        //   5
                        // );
                        setCart(true);
                      } else {
                        throw res.statusText || "Error while signing up.";
                      }
                    })
                    .catch((err) => {
                      console.log(err.message);
                    });
                } else {
                  rtsform.setFieldsValue({ quantity: result[skuId] });
                  message.success(
                    `Sorry, we currently have ${result[skuId]} units available for instant checkout. If you need more units please raise a custom quote request`,
                    5
                  );
                }
              });
            } else {
              let sku = [];
              sku.push(skuId);
              props.checkInventory(token, sku, (result) => {
                if (result[skuId] >= quantity) {
                  fetch(
                    `${process.env.REACT_APP_ORDER_ORC_URL}/orders/rts/` +
                      profileId,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                      },
                    }
                  )
                    .then((res) => {
                      if (res.ok) {
                        return res.json();
                      } else {
                        throw res.statusText || "Error while signing up.";
                      }
                    })
                    .then((res) => {
                      let { orderId = "" } = res;

                      fetch(
                        `${process.env.REACT_APP_ORDER_URL}/v1/orders/my/${orderId}/product`,
                        {
                          method: "POST",
                          body: JSON.stringify(p_data),
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token,
                          },
                        }
                      )
                        .then((res) => {
                          if (res.ok) {
                            // message.success(
                            //   "Product has been successfully added to cart!",
                            //   5
                            // );
                            setCart(true);
                          } else {
                            throw res.statusText || "Error while signing up.";
                          }
                        })
                        .catch((err) => {
                          console.log(err);
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  rtsform.setFieldsValue({ quantity: result[skuId] });
                  message.success(
                    `Sorry, we currently have ${result[skuId]} units available for instant checkout. If you need more units please raise a custom quote request`,
                    5
                  );
                }
              });
            }
          } else {
            signIn();
          }
        })
        .catch((err) => {
          let { values = "" } = err;
          let { quantity = "", size = "", color = "" } = values;
          if (!quantity) {
            setQtyErr(true);
          } else {
            setQtyErr(false);
          }
          if (!size) {
            setSizeErr(true);
          } else {
            setSizeErr(false);
          }
        });
    } else {
      setLoginModal(true);
    }
  };

  const hideCalculationModal = () => {
    setCalculationModal(false);
  };

  const onCalculateCharges = (values) => {
    let { quantity = "", country = "", postalCode = "" } = values || {};
    let a_data = {
      country: country,
      mode: "AIR",
      postalCode: postalCode,
      products: [
        {
          hsnCode: hsnCode,
          casePackLength: parseInt(casePackLength),
          exFactoryPrice: exFactoryPrice,
          casePackBreadth: parseInt(casePackBreadth),
          casePackWeight: parseInt(casePackWeight),
          casePackHeight: parseInt(casePackHeight),
          casePackQty: parseInt(casePackQty),
          numOfUnits: parseInt(quantity),
          casePackLBHUnit: casePackLBHUnit,
          casePackWeightUnit: casePackWeightUnit,
        },
      ],
    };

    let s_data = { ...a_data, mode: "SEA" };

    fetch(`${process.env.REACT_APP_DUTY_COST_URL}/dutycost`, {
      method: "POST",
      body: JSON.stringify(a_data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
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
        setAirData(res);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(`${process.env.REACT_APP_DUTY_COST_URL}/dutycost`, {
      method: "POST",
      body: JSON.stringify(s_data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
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
        setSeaData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinish = (values) => {
    let { country = "", postalCode = "" } = values;
    let index = deliveryExclusions.findIndex(
      (item) => country.toLowerCase() === item.toLowerCase()
    );

    if (index >= 0) {
      setNonServiceable(true);
      setNonServiceableCountry(true);
    } else {
      setNonServiceable(false);
      setNonServiceableCountry(false);
      // setUZipcode(postalCode);
      setUCountry(country);
      setPincodeSuccess(true);
      sessionStorage.setItem("destinationCountry", country);
    }
  };

  const setActiveKey = (key) => {
    setActiveKeys(key);
    if (key.includes("3")) {
      setCount(0);
    }
    setAccordionView("");
  };

  const setAccordion = (name) => {
    let keys = [...activeKeys, "3"];
    setActiveKeys(keys);
    if (count === 0) {
      setTimeout(() => {
        setAccordionView(name);
      }, 200);
    } else {
      setAccordionView(name);
    }
    setCount(1);
  };

  const handleCancel = () => {
    setRfqModal(false);
    setLoginModal(false);
  };

  const sendQueryCancel = (status) => {
    if (status === "success") {
      setSuccessQueryVisible(true);
    }
    setRfqModal(false);
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
  };

  const onClickImage = (e) => {
    ImgGalleryD.current.toggleFullScreen();
    ImgGalleryM.current.toggleFullScreen();
  };

  const onScreenChange = (value) => {
    if (value === false) {
      setThumbnail(false);
      setZoomImg(false);
    } else {
      setThumbnail(true);
      setZoomImg(true);
    }
  };

  const renderThumbInner = (item) => {
    if (item.fullscreen.includes(".mp4") || item.original.includes(".mp4")) {
      return (
        <div className="image-gallery-thumbnail-inner qa-rel-pos">
          <img
            className="image-gallery-thumbnail-image"
            src={item.thumbnail}
            alt={item.thumbnail}
          />
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Icon
              component={playButton}
              style={{ width: "60px", height: "60px" }}
            />
          </span>
        </div>
      );
    } else {
      return (
        <div className="image-gallery-thumbnail-inner">
          <img
            className="image-gallery-thumbnail-image"
            src={item.thumbnail}
            alt={item.thumbnail}
          />
        </div>
      );
    }
  };

  const renderItem = (item) => {
    if (item.fullscreen.includes(".mp4") || item.original.includes(".mp4")) {
      return (
        <div className="slp-video-wrapper" onClick={onClickImage}>
          <span className="qa-zoom-icon">
            <Icon
              component={PDPZoom}
              style={{ width: "35px" }}
              className="pdp-zoom-icon"
            />
          </span>
          <video
            src={item.original || item.fullscreen}
            controls
            width="100%"
            autoPlay
            className="slp-video"
          ></video>
        </div>
      );
    } else {
      let imgSrc = zoomImg ? item.fullscreen : item.original || item.fullscreen;
      return (
        <div className="image-gallery-image" onClick={onClickImage}>
          <span className="qa-zoom-icon">
            <Icon
              component={PDPZoom}
              style={{ width: "35px" }}
              className="pdp-zoom-icon"
            />
          </span>
          <img alt={imgSrc} className="image-gallery-image" src={imgSrc} />
        </div>
      );
    }
  };

  const onSelectSize = (value, e) => {
    setSelectedSize(value);
    for (let sku of skus) {
      if (sku["variantId"] === variantId) {
        if (
          sku["variantInfo"] &&
          sku["variantInfo"]["size"] &&
          sku["variantInfo"]["size"] === value
        ) {
          let skuId = sku["id"];
          props.checkInventory(token, [skuId], (result) => {
            let qty = result[skuId];
            if (qty > 0) {
              setSkuId(skuId);
            } else {
              setSkuId("");
            }
            setInStock(qty);
          });
        }
      }
    }
  };

  const onSelectItem = (value, e) => {
    setSelectedColor(value);
    rtsform.setFieldsValue({ size: "" });
    if (variants.length) {
      let imageList = [];
      for (let list of variants) {
        if (list["color"] === value) {
          let { sequenceId = "" } = list;
          setVariantId(sequenceId);
          let zoomedImages = [...list["zoomedImages"]];
          for (let i = 0; i < zoomedImages.length; i++) {
            let obj = {};
            obj["fullscreen"] = url + zoomedImages[i];
            obj["original"] = url + (list["mediaUrls"][i] || zoomedImages[i]);
            obj["thumbnail"] = url + list["thumbNails"][i];
            imageList.push(obj);
          }
        }
        setGalleryImages(imageList);
      }
    }
  };

  if (isLoading) {
    if (mobile) {
      return (
        <Icon
          component={PDPLoaderMobile}
          style={{ width: "100%" }}
          className="pdp-loader-icon"
        />
      );
    } else {
      return (
        <Icon
          component={PDPLoader}
          style={{ width: "100%", marginTop: "20px" }}
          className="pdp-loader-icon"
        />
      );
    }
  }

  return (
    <div id="product-description" className="product-description qa-font-san">
      <Row>
        <Col xs={0} sm={0} md={0} lg={24} xl={24}>
          <Row className="product-org-section qa-mar-auto-4">
            <Col
              className=""
              xs={24}
              sm={24}
              md={4}
              lg={4}
              xl={4}
              style={{ alignItems: "center", display: "flex" }}
            >
              <div>
                <div className="qa-fw-sb qa-tc-white qa-fs-12">
                  Explore seller:
                </div>

                <Link href={`/seller/${vanityId}`} target="_blank">
                  <span className="qa-text-2line qa-p-title qa-cursor qa-fs-12">
                    {brandNameSC}
                  </span>
                </Link>
              </div>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={13}
              lg={13}
              xl={13}
              style={{
                paddingRight: "40px",
                alignItems: "center",
                display: "flex",
              }}
            >
              <div className="qa-tc-white qa-text-2line qa-fs-12">
                {companyDescription}
              </div>
            </Col>

            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              xs={24}
              sm={24}
              md={7}
              lg={7}
              xl={7}
            >
              <Button
                className="qa-button button-contact-seller"
                onClick={() => {
                  setRfqModal(true);
                  setRfqType("Seller RFQ");
                }}
              >
                send order query
              </Button>

              <Button
                className="qa-button go-to-cart"
                onClick={() => {
                  router.push("/cart");
                }}
              >
                Go to cart
              </Button>
            </Col>
          </Row>
          <div className="p-breadcrumb qa-mar-auto-4">
            <BreadCrumb
              pageId="product-description"
              categoryName={productNameSC}
              vanityId={vanityId}
              brandName={brandNameSC}
            />
          </div>
          <Row className="qa-mar-auto-4 qa-mar-btm-4 image-gallery img-section">
            {galleryImages.length > 0 && (
              <Col
                className="pdp-zoom-image"
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={10}
                style={{ paddingRight: "30px", position: "relative" }}
              >
                <div className="product-list-details">
                  <span className="product-order-type">
                    {productType === "RTS"
                      ? "Ready to ship"
                      : productType === "ERTM"
                      ? "Express custom"
                      : "Custom order"}
                  </span>
                </div>

                <ImageGallery
                  ref={ImgGalleryD}
                  items={galleryImages}
                  showPlayButton={false}
                  showFullscreenButton={false}
                  useBrowserFullscreen={false}
                  renderItem={renderItem}
                  renderThumbInner={renderThumbInner}
                  onScreenChange={onScreenChange}
                />
              </Col>
            )}
            <Col
              xs={24}
              sm={24}
              md={9}
              lg={9}
              xl={9}
              style={{ paddingRight: "30px" }}
            >
              <div className="qa-fs-28 qa-font-butler product-title">
                {productNameSC}
                {packType && <div className="product-s-title">{packType}</div>}
              </div>
              {authenticated ? (
                <div>
                  {(profileType === "BUYER" &&
                    verificationStatus === "VERIFIED") ||
                  (profileType === "BUYER" &&
                    verificationStatus === "IN_PROGRESS") ||
                  (profileType === "SELLER" && profileId === sellerCode) ||
                  showPrice ? (
                    <div style={{ marginBottom: "10px" }}>
                      <span
                        style={{
                          fontSize: "30px",
                          fontFamily: "Butler",
                          color: "#191919",
                          verticalAlign: "middle",
                        }}
                      >
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(displayPrice)}
                      </span>
                      {priceMin && (
                        <span className="qa-fs-20 qa-font-butler qa-va-m">
                          {" "}
                          - {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(exfactoryListPrice)}
                        </span>
                      )}
                      <div
                        className="qa-font-butler"
                        style={{
                          textDecoration: "line-through",
                          display: "none",
                        }}
                      >
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(500)} -
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(600)}
                      </div>
                      <div className="qa-font-san qa-fs-12">
                        Base price per unit excl. margin, freight and other
                        charges
                      </div>
                      <div className="qa-tc-white qa-font-san qa-fs-12">
                        Suggested retail price:{" "}
                        <b>
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(suggestedRetailPrice)}
                        </b>
                      </div>
                    </div>
                  ) : (
                    <div className="qa-mar-btm-1">
                      <span
                        style={{
                          fontSize: "30px",
                          fontFamily: "Butler",
                          color: "#191919",
                          verticalAlign: "middle",
                          marginRight: "5px",
                        }}
                      >
                        {getSymbolFromCurrency(convertToCurrency)}
                      </span>
                      <span className="product-s-block buyer-notify">
                        {notificationMsg}
                      </span>
                      {profileType === "SELLER" && profileId !== sellerCode && (
                        <span
                          style={{
                            verticalAlign: "middle",
                            background: "#d9bb7f",
                            padding: "3px 10px",
                            display: "inline-block",
                            cursor: "pointer",
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{ marginTop: "6px" }}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"
                              fill="#191919"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="qa-mar-btm-1" onClick={signIn}>
                  <span
                    style={{
                      fontSize: "30px",
                      fontFamily: "Butler",
                      color: "#191919",
                      verticalAlign: "middle",
                      marginRight: "5px",
                    }}
                  >
                    {getSymbolFromCurrency(convertToCurrency)}
                  </span>
                  <span className="product-s-block">
                    To reveal price please sign in/sign up
                  </span>
                  <span
                    style={{
                      verticalAlign: "middle",
                      background: "#d9bb7f",
                      padding: "3px 10px",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ marginTop: "6px" }}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"
                        fill="#191919"
                      />
                    </svg>
                  </span>
                </div>
              )}
              <Form
                name="product_details_form_large"
                form={rtsform}
                scrollToFirstError
              >
                {productType === "RTS" || productType === "ERTM" ? (
                  <div>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div style={{ width: "42%" }}>
                          <div className="label-paragraph qa-fs-12">
                            Quantity{" "}
                            {qtyErr && (
                              <Icon
                                component={alertIcon}
                                className="alert-icon"
                                style={{
                                  width: "12px",
                                  verticalAlign: "sub",
                                }}
                              />
                            )}
                            {showPrice && (
                              <span
                                className="qa-fs-12"
                                style={{ float: "right" }}
                              >
                                Minimum{" "}
                                {inStock > 0 && inStock < minimumOrderQuantity
                                  ? inStock
                                  : minimumOrderQuantity}{" "}
                                {moqUnit}
                              </span>
                            )}
                          </div>
                          <Form.Item
                            name="quantity"
                            className="form-item"
                            rules={[
                              {
                                required: true,
                                message: "Please select quantity",
                              },
                              {
                                min:
                                  inStock > 0 && inStock < minimumOrderQuantity
                                    ? parseInt(inStock)
                                    : parseInt(minimumOrderQuantity),
                                type: "number",
                                message:
                                  "Please add quantity equal or greater than the minimum",
                              },
                              {
                                pattern: new RegExp("^[0-9]*$"),
                                message: "Wrong format!",
                              },
                            ]}
                          >
                            <InputNumber type="number" className="p-text-box" />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {colors.length > 0 && (
                        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                          <div className="label-paragraph qa-fs-12">Color</div>
                          <Form.Item
                            name="color"
                            className="form-item color-form-item"
                            rules={[
                              {
                                required: true,
                                message: "Please select color",
                              },
                            ]}
                          >
                            <Select
                              dropdownClassName="qa-light-menu-theme"
                              placeholder="Select"
                              onSelect={(value, event) =>
                                onSelectItem(value, event)
                              }
                            >
                              {colors.map((color, i) => (
                                <Option value={color} key={i}>
                                  {color}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                      <Col xs={24} sm={24} md={2} lg={2} xl={2}></Col>

                      {sizes.length > 0 && (
                        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                          <div className="label-paragraph qa-fs-12">
                            Size{" "}
                            {sizeErr && (
                              <Icon
                                component={alertIcon}
                                className="alert-icon"
                                style={{
                                  width: "12px",
                                  verticalAlign: "sub",
                                }}
                              />
                            )}
                          </div>
                          <Form.Item
                            name="size"
                            className="form-item color-form-item"
                            rules={[
                              { required: true, message: "Please select size" },
                            ]}
                          >
                            <Select
                              dropdownClassName="qa-light-menu-theme"
                              placeholder="Select"
                              onSelect={(value, event) =>
                                onSelectSize(value, event)
                              }
                            >
                              {sizes.map((size, i) => (
                                <Option key={i} value={size}>
                                  {size}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div className="custom-section">
                    {showPrice && (
                      <div className="qa-font-san qa-tc-white qa-font-12">
                        Minimum order quantity: {minimumOrderQuantity} {moqUnit}
                        <span
                          style={{
                            marginRight: "5px",
                            fontWeight: "bold",
                            fontFamily: "Butler",
                          }}
                        ></span>
                        <Tooltip
                          overlayClassName="qa-tooltip"
                          placement="top"
                          trigger="hover"
                          title="If your requirement is below the minimum quantity mentioned please raise a Custom Quote"
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              verticalAlign: "text-top",
                            }}
                          >
                            <Icon
                              component={infoIcon}
                              className="info-icon"
                              style={{ width: "18px" }}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    )}
                    {colors.length > 0 && (
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <div className="label-paragraph qa-fs-12">Color</div>
                        <Form.Item
                          name="color"
                          className="form-item color-form-item"
                          rules={[
                            { required: true, message: "Field is required." },
                          ]}
                        >
                          <Select
                            dropdownClassName="qa-light-menu-theme"
                            placeholder="Select"
                            onSelect={(value, event) =>
                              onSelectItem(value, event)
                            }
                          >
                            {colors.map((color, i) => (
                              <Option value={color} key={i}>
                                {color}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    )}

                    {colorCustomizationAvailable && (
                      <div className="p-custom-size-stitle">
                        Customization options
                      </div>
                    )}
                    {colorCustomizationAvailable && (
                      <div
                        className="p-custom qa-pad-top-1 qa-cursor"
                        onClick={() => setAccordion("color")}
                      >
                        Colors/Prints
                      </div>
                    )}
                    {sizeCustomizationAvailable && (
                      <div
                        className="p-custom qa-pad-top-1 qa-cursor"
                        onClick={() => {
                          setAccordion("size");
                        }}
                      >
                        Sizes
                      </div>
                    )}

                    {packagingCustomizationAvailable && (
                      <div
                        className="p-custom qa-pad-top-1 qa-cursor last"
                        onClick={() => {
                          setAccordion("packaging");
                        }}
                      >
                        Packaging
                      </div>
                    )}
                  </div>
                )}
                {(productType === "RTS" || productType === "ERTM") && (
                  <div
                    className="p-custom qa-cursor"
                    onClick={() => {
                      setAccordion("custom");
                    }}
                  >
                    More customization available
                  </div>
                )}
                <div
                  style={{
                    display: "inline-block",
                    width: "50%",
                    verticalAlign: "middle",
                    marginBottom: "3px",
                  }}
                  className="qa-font-san qa-fs-14 qa-tc-white qa-mar-top-2"
                >
                  Available shipping modes
                </div>
                {(productType === "RTS" || productType === "ERTM") && (
                  <div
                    style={{
                      display: "inline-block",
                      width: "50%",
                      verticalAlign: "middle",
                      marginTop: "20px",
                      textAlign: "right",
                    }}
                  >
                    <div
                      style={{
                        lineHeight: "110%",
                        display: "inline-block",
                        textAlign: "right",
                        paddingRight: "15px",
                        color: "#191919",
                        verticalAlign: "middle",
                        width: "80%",
                        fontFamily: "senregular",
                      }}
                    >
                      {!uCountry ? (
                        <span>Check serviceability </span>
                      ) : (
                        <span>
                          {nonServiceableCountry ? (
                            <span className="qa-error">
                              Non serviceable to{" "}
                            </span>
                          ) : (
                            <span>Serviceable to </span>
                          )}
                          {uCountry && <b>{uCountry}</b>}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        lineHeight: "110%",
                        display: "inline-block",
                        textAlign: "right",
                        cursor: "pointer",
                        verticalAlign: "middle",
                      }}
                    >
                      <span
                        onClick={() => {
                          setModalType("edit-pincode");
                          setPincodeModal(true);
                        }}
                        style={{
                          border: "1px solid #d9bb7f",
                          height: "25px",
                          display: "inline-block",
                          cursor: "pointer",
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 16.0837V19H7.91626L16.5173 10.399L13.601 7.48271L5 16.0837ZM18.7725 8.14373C19.0758 7.84044 19.0758 7.35051 18.7725 7.04722L16.9528 5.22747C16.6495 4.92418 16.1596 4.92418 15.8563 5.22747L14.4331 6.6506L17.3494 9.56687L18.7725 8.14373Z"
                            fill="#191919"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                )}
                <div className="qa-mar-btm-15">
                  {shippingMethods.includes("Air") && (
                    <span>
                      <Icon
                        component={Air}
                        style={{ width: "35px", verticalAlign: "middle" }}
                        className="air-icon"
                      />
                      <span className="p-shipBy">Air</span>
                    </span>
                  )}
                  {shippingMethods.includes("Sea") && (
                    <span>
                      <Icon
                        component={Sea}
                        style={{ width: "35px", verticalAlign: "middle" }}
                        className="sea-icon"
                      />
                      <span className="p-shipBy">Sea</span>
                    </span>
                  )}
                  {/* <span
                    className="p-custom"
                    onClick={() => setCalculationModal(true)}
                  >
                    Check lead time, freight and duties
                  </span> */}
                </div>
                <div>
                  <Button
                    className={`${
                      (productType === "RTS" || productType === "ERTM") && skuId
                        ? "rfq-button"
                        : "rfq-button rfq-active"
                    }`}
                    // disabled={!authenticated}
                    onClick={() => {
                      setRfqModal(true);
                      setRfqType("Product RFQ");
                    }}
                  >
                    <div className="">get custom quote</div>
                  </Button>
                  {(productType === "RTS" || productType === "ERTM") && skuId && (
                    <span>
                      {(profileType === "BUYER" &&
                        verificationStatus === "VERIFIED" &&
                        isGuest !== "true") ||
                      (profileType === "BUYER" &&
                        verificationStatus === "IN_PROGRESS" &&
                        skuId) ? (
                        <Button
                          className="add-to-bag-button"
                          htmlType="submit"
                          onClick={onCheck}
                        >
                          <div>Add to cart</div>
                        </Button>
                      ) : (
                        <Button className="add-to-bag-button atc-diable">
                          <div>Add to cart</div>
                        </Button>
                      )}
                    </span>
                  )}
                </div>

                {errorMsg && skuId && (
                  <div className="qa-error-atc qa-mar-top-05">
                    {errorMsg}{" "}
                    {isGuest === "true" ||
                    profileType === "SELLER" ||
                    !authenticated ? (
                      <span onClick={signUp} className="p-custom">
                        signup as a buyer
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                )}
                {showCart && (
                  <div className="qa-font-san qa-mar-top-05 qa-txt-alg-cnt qa-lh qa-tc-white">
                    Product has been successfully added! <br></br>Please{" "}
                    <Link href="/cart" className="p-custom">
                      Click here
                    </Link>{" "}
                    to 'Go to Cart'
                  </div>
                )}
              </Form>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={5}
              lg={5}
              xl={5}
              style={{
                paddingLeft: "30px",
                borderLeft: "0.5px solid rgba(25, 25, 25, 0.6)",
              }}
            >
              {(productType === "RTS" || productType === "ERTM") && (
                <div className="p-minimum-order">
                  Minimum order value with this seller:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Butler",
                    }}
                  >
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(minOrderValue)}
                  </span>
                  <div className="qa-font-san qa-tc-white qa-fs-12 qa-mar-top-05">
                    You need to purchase single or multiple products from this
                    Seller adding up to this total order value for instant
                    checkout. If your requirement is lower, please write to us
                    or raise a custom quote.
                  </div>
                </div>
              )}
              {offers && (
                <div className="p-minimum-order qa-pad-top-2">
                  <div className="qa-mar-btm-1">Offers from Qalara</div>
                  <div style={{ fontSize: "14px" }}>
                    Buy 20 units and get 20% off
                  </div>
                </div>
              )}
              {sampleDelivery === "Y" && (
                <div
                  className="p-custom qa-pad-top-2 product-sample-text qa-cursor"
                  onClick={() => {
                    setModalType("sample-delivery");
                    setPincodeModal(true);
                  }}
                >
                  Sample available
                </div>
              )}
              {
                <div className="product-list">
                  <div className="qa-disp-table-cell" style={{ width: "100%" }}>
                    Qalara production monitoring available
                  </div>
                  <div className="qa-disp-table-cell">
                    <Tooltip
                      overlayClassName="qa-tooltip"
                      placement="top"
                      trigger="hover"
                      title="Monitoring of the entire production process is available for this product. Write to us at buyers@qalara.com to know more"
                    >
                      <Icon
                        component={moreInfoIcon}
                        className="more-info-icon"
                        style={{
                          width: "10px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              }
              {qualityTesting === "Y" && (
                <div className="product-list">
                  <div className="qa-disp-table-cell" style={{ width: "100%" }}>
                    Qalara quality testing available
                  </div>
                  <div className="qa-disp-table-cell">
                    <Tooltip
                      overlayClassName="qa-tooltip"
                      placement="top"
                      trigger="hover"
                      title="Quality testing is available for this product. Write to us at buyers@qalara.com to know more."
                    >
                      <Icon
                        component={moreInfoIcon}
                        className="more-info-icon"
                        style={{
                          width: "10px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              )}
              {qualityInspection === "Y" && (
                <div className="product-list last">
                  <div className="qa-disp-table-cell" style={{ width: "100%" }}>
                    Qalara quality inspection available
                  </div>
                  <div className="qa-disp-table-cell">
                    <Tooltip
                      overlayClassName="qa-tooltip"
                      placement="top"
                      trigger="hover"
                      title="Quality inspection is available for this product, for both in line production (if applicable) and final line post production. Write to us at buyers@qalara.com to know more."
                    >
                      <Icon
                        component={moreInfoIcon}
                        className="more-info-icon"
                        style={{
                          width: "10px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              )}
              <div className="qa-pad-top-2">
                <div>Payment options supported:</div>
                <div className="qa-mar-btm-05">
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
                  {/* </div> */}
                  {/* <div> */}
                  {/* <Icon
                    component={stripePayment}
                    className="stripe-icon"
                    style={{
                      width: "42px",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  /> */}

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
                      // marginRight: "8px",
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={24} lg={0} xl={0}>
          <Row className="product-org-section">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Link href={`/seller/${vanityId}`} target="_blank">
                <>
                  <div
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      width: "95%",
                    }}
                  >
                    <div className="qa-tc-white qa-fs-12">Explore seller:</div>

                    <span className="qa-text-2line qa-p-title qa-cursor">
                      {brandNameSC}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      verticalAlign: "middle",
                      width: "5%",
                    }}
                  >
                    <span style={{ float: "right" }}>
                      <RightOutlined style={{ color: "#191919" }} />
                    </span>
                  </div>
                </>
              </Link>
            </Col>
          </Row>
          <Row className="qa-mar-btm-4">
            {galleryImages.length > 0 && (
              <Col
                className="pdp-zoom-image"
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
              >
                <ImageGallery
                  ref={ImgGalleryM}
                  items={galleryImages}
                  showPlayButton={false}
                  showNav={false}
                  showThumbnails={thumbnail}
                  useBrowserFullscreen={false}
                  showFullscreenButton={false}
                  showBullets={true}
                  renderItem={renderItem}
                  renderThumbInner={renderThumbInner}
                  onScreenChange={onScreenChange}
                />
                <div className="product-list-details">
                  <span className="product-order-type">
                    {productType === "RTS"
                      ? "Ready to ship"
                      : productType === "ERTM"
                      ? "Express custom"
                      : "Custom order"}
                  </span>
                </div>
              </Col>
            )}
            <Col
              className="qa-pad-0-30"
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              {authenticated ? (
                <div>
                  {(profileType === "BUYER" &&
                    verificationStatus === "VERIFIED") ||
                  (profileType === "BUYER" &&
                    verificationStatus === "IN_PROGRESS") ||
                  (profileType === "SELLER" && profileId === sellerCode) ||
                  showPrice ? (
                    <div className="qa-mar-btm-1">
                      <span
                        style={{
                          fontSize: "30px",
                          fontFamily: "Butler",
                          color: "#191919",
                          verticalAlign: "middle",
                        }}
                      >
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(displayPrice)}
                      </span>
                      {priceMin && (
                        <span className="qa-fs-20 qa-font-butler qa-va-m">
                          {" "}
                          - {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(exfactoryListPrice)}
                        </span>
                      )}
                      <div
                        className="qa-font-butler"
                        style={{
                          textDecoration: "line-through",
                          display: "none",
                        }}
                      >
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(500)} -
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(600)}
                      </div>
                      <div className="qa-font-san qa-fs-12">
                        Base price per unit excl. margin, freight and other
                        charges
                      </div>
                      <div className="qa-tc-white qa-font-san qa-fs-12">
                        Suggested retail price:{" "}
                        <b>
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(suggestedRetailPrice)}
                        </b>
                      </div>
                    </div>
                  ) : (
                    <div className="qa-mar-btm-1">
                      <span
                        style={{
                          fontSize: "30px",
                          fontFamily: "Butler",
                          color: "#191919",
                          verticalAlign: "middle",
                          marginRight: "5px",
                        }}
                      >
                        {getSymbolFromCurrency(convertToCurrency)}
                      </span>
                      <span className="product-s-block buyer-notify">
                        {notificationMsg}
                      </span>
                      {profileType === "SELLER" && profileId !== sellerCode && (
                        <span
                          style={{
                            verticalAlign: "middle",
                            background: "#d9bb7f",
                            padding: "3px 10px",
                            display: "inline-block",
                            cursor: "pointer",
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{ marginTop: "6px" }}
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"
                              fill="#191919"
                            />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="qa-mar-btm-1" onClick={signIn}>
                  <span
                    style={{
                      fontSize: "30px",
                      fontFamily: "Butler",
                      color: "#191919",
                      verticalAlign: "middle",
                      marginRight: "5px",
                    }}
                  >
                    {getSymbolFromCurrency(convertToCurrency)}
                  </span>
                  <span className="product-s-block">
                    To reveal price please sign in/sign up
                  </span>
                  <span
                    style={{
                      verticalAlign: "middle",
                      background: "#d9bb7f",
                      padding: "3px 10px",
                      display: "inline-block",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ marginTop: "6px" }}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 7L9.6 8.4L12.2 11H2V13H12.2L9.6 15.6L11 17L16 12L11 7ZM20 19H12V21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H12V5H20V19Z"
                        fill="#191919"
                      />
                    </svg>
                  </span>
                </div>
              )}
              <div className="qa-fs-28 qa-font-butler product-title">
                {productNameSC}
                {packType && (
                  <span className="product-s-title">{packType}</span>
                )}
              </div>
              <Form
                name="product_details_form_mobile"
                form={rtsform}
                scrollToFirstError
              >
                {productType === "RTS" || productType === "ERTM" ? (
                  <div>
                    <Row>
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <div className="label-paragraph qa-fs-12">
                          Quantity{" "}
                          {qtyErr && (
                            <Icon
                              component={alertIcon}
                              className="alert-icon"
                              style={{
                                width: "12px",
                                verticalAlign: "sub",
                              }}
                            />
                          )}
                          {showPrice && (
                            <span
                              className="qa-fs-12"
                              style={{ float: "right" }}
                            >
                              Minimum{" "}
                              {inStock > 0 && inStock < minimumOrderQuantity
                                ? inStock
                                : minimumOrderQuantity}{" "}
                              {moqUnit}
                            </span>
                          )}
                        </div>
                        <Form.Item
                          name="quantity"
                          className="form-item"
                          rules={[
                            {
                              required: true,
                              message: "Please select quantity",
                            },
                            {
                              min:
                                inStock > 0 && inStock < minimumOrderQuantity
                                  ? parseInt(inStock)
                                  : parseInt(minimumOrderQuantity),
                              type: "number",
                              message:
                                "Please add quantity equal or greater than the minimum",
                            },
                            {
                              pattern: new RegExp("^[0-9]*$"),
                              message: "Wrong format!",
                            },
                          ]}
                        >
                          <InputNumber type="number" className="p-text-box" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      {colors.length > 0 && (
                        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                          <div className="label-paragraph qa-fs-12">Color</div>
                          <Form.Item
                            name="color"
                            className="form-item"
                            rules={[
                              {
                                required: true,
                                message: "Please select color",
                              },
                            ]}
                          >
                            <Select
                              dropdownClassName="qa-light-menu-theme"
                              placeholder="Select"
                              onSelect={(value, event) =>
                                onSelectItem(value, event)
                              }
                            >
                              {colors.map((color, i) => (
                                <Option value={color} key={i}>
                                  {color}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                      <Col xs={24} sm={24} md={2} lg={2} xl={2}></Col>
                      {sizes.length > 0 && (
                        <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                          <div className="label-paragraph qa-fs-12">
                            Size{" "}
                            {sizeErr && (
                              <Icon
                                component={alertIcon}
                                className="alert-icon"
                                style={{
                                  width: "12px",
                                  verticalAlign: "sub",
                                }}
                              />
                            )}
                          </div>
                          <Form.Item
                            name="size"
                            className="form-item"
                            rules={[
                              { required: true, message: "Please select size" },
                            ]}
                          >
                            <Select
                              dropdownClassName="qa-light-menu-theme"
                              placeholder="Select"
                              onSelect={(value, event) =>
                                onSelectSize(value, event)
                              }
                            >
                              {sizes.map((size, i) => (
                                <Option key={i} value={size}>
                                  {size}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    {showPrice && (
                      <div className="qa-font-san qa-tc-white qa-font-12">
                        Minimum order quantity: {minimumOrderQuantity} {moqUnit}
                        <span
                          style={{
                            marginRight: "5px",
                            fontWeight: "bold",
                            fontFamily: "Butler",
                          }}
                        ></span>
                        <Tooltip
                          overlayClassName="qa-tooltip"
                          placement="top"
                          trigger="hover"
                          title="If your requirement is below the minimum quantity mentioned please raise a Custom Quote"
                        >
                          <span
                            style={{
                              cursor: "pointer",
                              verticalAlign: "text-top",
                            }}
                          >
                            <Icon
                              component={infoIcon}
                              className="info-icon"
                              style={{ width: "18px" }}
                            />
                          </span>
                        </Tooltip>
                      </div>
                    )}
                    {colors.length > 0 && (
                      <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                        <div className="label-paragraph qa-fs-12">Color</div>
                        <Form.Item
                          name="color"
                          className="form-item color-form-item"
                          rules={[
                            { required: true, message: "Field is required." },
                          ]}
                        >
                          <Select
                            dropdownClassName="qa-light-menu-theme"
                            placeholder="Select"
                            onSelect={(value, event) =>
                              onSelectItem(value, event)
                            }
                          >
                            {colors.map((color, i) => (
                              <Option value={color} key={i}>
                                {color}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                    )}

                    {colorCustomizationAvailable && (
                      <div className="p-custom-size-stitle">
                        Customization options
                      </div>
                    )}
                    {colorCustomizationAvailable && (
                      <div
                        className="p-custom qa-pad-top-1 qa-cursor"
                        onClick={() => setAccordion("color")}
                      >
                        Colors/Prints
                      </div>
                    )}
                    {sizeCustomizationAvailable && (
                      <div
                        className="p-custom qa-pad-top-1 qa-cursor"
                        onClick={() => setAccordion("size")}
                      >
                        Sizes
                      </div>
                    )}
                    {packagingCustomizationAvailable && (
                      <div
                        className="p-custom qa-pad-top-1 qa-cursor last"
                        onClick={() => {
                          setAccordion("packaging");
                        }}
                      >
                        Packaging
                      </div>
                    )}
                  </div>
                )}
                {(productType === "RTS" || productType === "ERTM") && (
                  <div
                    className="p-custom"
                    onClick={() => setAccordion("custom")}
                  >
                    More customization available
                  </div>
                )}
                <div className="qa-font-san qa-fs-14 qa-tc-white qa-mar-top-2 qa-mar-btm-05">
                  Available shipping modes
                </div>

                <div className="qa-mar-btm-15">
                  {shippingMethods.includes("Air") && (
                    <span>
                      <Icon
                        component={Air}
                        style={{ width: "35px", verticalAlign: "middle" }}
                        className="air-icon"
                      />
                      <span className="p-shipBy">Air</span>
                    </span>
                  )}
                  {shippingMethods.includes("Sea") && (
                    <span>
                      <Icon
                        component={Sea}
                        style={{ width: "35px", verticalAlign: "middle" }}
                        className="sea-icon"
                      />
                      <span className="p-shipBy">Sea</span>
                    </span>
                  )}
                  {/* <div
                    className="p-custom qa-mar-btm-1 qa-mar-top-1"
                    onClick={() => setCalculationModal(true)}
                  >
                    Check lead time, freight and duties
                  </div> */}
                </div>
                <div>
                  {(productType === "RTS" || productType === "ERTM") && (
                    <div className="qa-mar-btm-2 qa-font-san">
                      <span
                        style={{
                          lineHeight: "110%",
                          paddingRight: "15px",
                          color: "#191919",
                          verticalAlign: "middle",
                        }}
                      >
                        {!uCountry ? (
                          <span>Check serviceability </span>
                        ) : (
                          <span>
                            {nonServiceableCountry ? (
                              <span className="qa-error">
                                Non serviceable to{" "}
                              </span>
                            ) : (
                              <span>Serviceable to </span>
                            )}
                            {uCountry && <b>{uCountry}</b>}
                          </span>
                        )}
                      </span>
                      <span
                        onClick={() => {
                          setModalType("edit-pincode");
                          setPincodeModal(true);
                        }}
                        style={{
                          border: "1px solid #d9bb7f",
                          height: "25px",
                          display: "inline-block",
                          cursor: "pointer",
                          verticalAlign: "middle",
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 16.0837V19H7.91626L16.5173 10.399L13.601 7.48271L5 16.0837ZM18.7725 8.14373C19.0758 7.84044 19.0758 7.35051 18.7725 7.04722L16.9528 5.22747C16.6495 4.92418 16.1596 4.92418 15.8563 5.22747L14.4331 6.6506L17.3494 9.56687L18.7725 8.14373Z"
                            fill="#191919"
                          />
                        </svg>
                      </span>
                    </div>
                  )}
                  <Button
                    className={`${
                      (productType === "RTS" || productType === "ERTM") && skuId
                        ? "rfq-button"
                        : "rfq-button rfq-active"
                    }`}
                    // disabled={!authenticated}
                    onClick={() => {
                      setRfqModal(true);
                      setRfqType("Product RFQ");
                    }}
                  >
                    <div>Get custom quote</div>
                  </Button>
                  {(productType === "RTS" || productType === "ERTM") && skuId && (
                    <span>
                      {(profileType === "BUYER" &&
                        verificationStatus === "VERIFIED" &&
                        isGuest !== "true") ||
                      (profileType === "BUYER" &&
                        verificationStatus === "IN_PROGRESS" &&
                        skuId) ? (
                        <Button
                          htmlType="submit"
                          onClick={onCheck}
                          className="add-to-bag-button"
                        >
                          <div>Add to cart</div>
                        </Button>
                      ) : (
                        <Button className="add-to-bag-button atc-diable">
                          <div>Add to cart</div>
                        </Button>
                      )}
                    </span>
                  )}

                  {errorMsg && skuId && (
                    <div className="qa-error-atc qa-mar-top-25 qa-mar-btm-3">
                      {errorMsg}{" "}
                      {isGuest === "true" ||
                      profileType === "SELLER" ||
                      !authenticated ? (
                        <span onClick={signUp} className="p-custom">
                          signup as a buyer
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  )}

                  {showCart && (
                    <div className="qa-font-san qa-mar-top-25 qa-txt-alg-cnt qa-lh qa-mar-btm-3 qa-tc-white">
                      Product has been successfully added! <br></br>Please{" "}
                      <Link href="/cart" className="p-custom">
                        Click here
                      </Link>{" "}
                      to 'Go to Cart'
                    </div>
                  )}
                </div>

                <div className="qa-border-bottom"></div>
              </Form>
            </Col>
            <Col
              className="qa-pad-0-30"
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              {(productType === "RTS" || productType === "ERTM") && (
                <div className="p-minimum-order">
                  Minimum order value with this seller:{" "}
                  <span
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Butler",
                    }}
                  >
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(minOrderValue)}
                  </span>
                  <div className="qa-font-san qa-tc-white qa-fs-12 qa-mar-top-05">
                    You need to purchase single or multiple products from this
                    Seller adding up to this total order value for instant
                    checkout. If your requirement is lower, please write to us
                    or raise a custom quote.
                  </div>
                </div>
              )}
              {offers && (
                <div className="p-minimum-order qa-pad-top-2">
                  <div className="qa-mar-btm-1">Offers from Qalara</div>
                  <div style={{ fontSize: "14px" }}>
                    Buy 20 units and get 20% off
                  </div>
                </div>
              )}
              {sampleDelivery === "Y" && (
                <div
                  className="p-custom qa-pad-top-2 product-sample-text qa-cursor"
                  onClick={() => {
                    setModalType("sample-delivery");
                    setPincodeModal(true);
                  }}
                >
                  Sample available
                </div>
              )}
              {
                <div className="product-list">
                  <div className="qa-disp-table-cell" style={{ width: "100%" }}>
                    Qalara production monitoring available
                  </div>
                  <div className="qa-disp-table-cell">
                    <Tooltip
                      overlayClassName="qa-tooltip"
                      placement="top"
                      trigger="hover"
                      title="Monitoring of the entire production process is available for this product. Write to us at buyers@qalara.com to know more"
                    >
                      <Icon
                        component={moreInfoIcon}
                        className="more-info-icon"
                        style={{
                          width: "10px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              }
              {qualityTesting === "Y" && (
                <div className="product-list">
                  <div className="qa-disp-table-cell" style={{ width: "100%" }}>
                    Qalara quality testing available
                  </div>
                  <div className="qa-disp-table-cell">
                    <Tooltip
                      overlayClassName="qa-tooltip"
                      placement="top"
                      trigger="hover"
                      title="Quality testing is available for this product. Write to us at buyers@qalara.com to know more."
                    >
                      <Icon
                        component={moreInfoIcon}
                        className="more-info-icon"
                        style={{
                          width: "10px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              )}
              {qualityInspection === "Y" && (
                <div className="product-list last">
                  <div className="qa-disp-table-cell" style={{ width: "100%" }}>
                    Qalara quality inspection available
                  </div>
                  <div className="qa-disp-table-cell">
                    <Tooltip
                      overlayClassName="qa-tooltip"
                      placement="top"
                      trigger="hover"
                      title="Quality inspection is available for this product, for both in line production (if applicable) and final line post production. Write to us at buyers@qalara.com to know more."
                    >
                      <Icon
                        component={moreInfoIcon}
                        className="more-info-icon"
                        style={{
                          width: "10px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
              )}

              <div className="qa-pad-top-2">
                <div>Payment options supported:</div>
                <div className="qa-mar-btm-05">
                  <Icon
                    component={paypalPayment}
                    className="paypal-icon"
                    style={{
                      width: "68px",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  />
                  <Icon
                    component={mcPayment}
                    className="mc-icon"
                    style={{
                      width: "46px",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  />
                  <Icon
                    component={visaPayment}
                    className="visa-icon"
                    style={{
                      width: "52px",
                      verticalAlign: "middle",
                      marginRight: "5px",
                    }}
                  />
                  {/* </div> */}
                  {/* <div style={{ display: "none" }}> */}
                  {/* <Icon
                    component={stripePayment}
                    className="stripe-icon"
                    style={{
                      width: "52px",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  /> */}
                  <Icon
                    component={amexPayment}
                    className="amex-icon"
                    style={{
                      width: "38px",
                      verticalAlign: "middle",
                      marginRight: "8px",
                    }}
                  />
                  <Icon
                    component={discoverPayment}
                    className="discover-icon"
                    style={{
                      width: "36px",
                      verticalAlign: "middle",
                      // marginRight: "8px",
                    }}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ backgroundColor: "#F2F0EB", padding: "30px" }}>
        <Col span={24}>
          <Accordion
            accordionView={accordionView}
            keys={activeKeys}
            setActiveKey={setActiveKey}
            accData={data}
          />
        </Col>
      </Row>
      {valueCertifications.length > 0 && (
        <div className="certification-block">
          <div className="qa-mar-auto-40">
            <h3 className="qa-font-butler qa-mar-btm-2 qa-pad-top-3 qa-fs-but-22 qa-pad-24">
              Awards & Certifications
            </h3>
            <Certifications mobile={false} certificates={valueCertifications} />
          </div>
        </div>
      )}
      {slp_content && slp_content.length > 0 && (
        <Row style={{ backgroundColor: "#F9F7F2" }}>
          <Col xs={24} sm={24} md={24} lg={0} xl={0}>
            <Row>
              <Col span={24} className="catalogue-section">
                <div className="pc-subtitle">More from</div>
                <div className="pc-title">{brandNameSC}</div>
                <Link href={splpLink}>
                  <div className="pc-link qa-cursor">
                    <MinusOutlined />
                    <MinusOutlined />
                    <MinusOutlined />
                    &nbsp;&nbsp;See catalog page
                  </div>
                </Link>
              </Col>
              <Col span={24}>
                <Row
                  style={{ padding: "45px 10px" }}
                  className="seller-product-list"
                >
                  <Slider ref={(c) => (mslider = c)} {...settings}>
                    {slp_content.map((item, i) => {
                      return (
                        <Col
                          className="qa-pad-3"
                          key={i}
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                          ref={node}
                        >
                          <ProductCard
                            key={i}
                            data={item}
                            pageId="seller-product-listing"
                            selectedProductId={selProductId}
                            selectProduct={selectProduct}
                            sellerId={sellerCode}
                          />
                        </Col>
                      );
                    })}
                  </Slider>
                  {slp_content && slp_content.length > 1 && (
                    <div className="qa-txt-alg-cnt qa-disp-ib">
                      <Button className="qa-slick-button" onClick={previous}>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 50 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="49"
                            height="49"
                            rx="14.5"
                            stroke="#D9BB7F"
                          />
                          <path
                            d="M32.4023 17.1523V22.0039L22.6992 27.3477L32.4023 33.1484V38L17.1094 28.2969V26.5039L32.4023 17.1523Z"
                            fill="#D9BB7F"
                          />
                        </svg>
                      </Button>
                      <Button className="qa-slick-button" onClick={next}>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 50 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="49"
                            height="49"
                            rx="14.5"
                            stroke="#D9BB7F"
                          />
                          <path
                            d="M16.7578 17.1523V22.0039L26.4609 27.3477L16.7578 33.1484V38L32.0508 28.2969V26.5039L16.7578 17.1523Z"
                            fill="#D9BB7F"
                          />
                        </svg>
                      </Button>
                    </div>
                  )}
                </Row>
              </Col>
            </Row>
          </Col>

          <Col xs={0} sm={0} md={0} lg={24} xl={24}>
            <Row>
              <Col span={6} className="catalogue-section">
                <div className="pc-subtitle">More from</div>
                <div className="pc-title">{brandNameSC}</div>
                <Link href={splpLink}>
                  <div className="pc-link qa-cursor">
                    <MinusOutlined />
                    <MinusOutlined />
                    <MinusOutlined />
                    &nbsp;&nbsp;See catalog page
                  </div>
                </Link>
              </Col>
              <Col span={18}>
                <Row
                  style={{ padding: "50px 10px" }}
                  className="seller-product-list"
                >
                  <Slider ref={(d) => (slider = d)} {...settings}>
                    {slp_content.map((item, i) => {
                      return (
                        <Col
                          className="qa-pad-3"
                          key={i}
                          xs={24}
                          sm={24}
                          md={24}
                          lg={24}
                          xl={24}
                        >
                          <ProductCard
                            key={i}
                            data={item}
                            pageId="seller-product-listing"
                            selectedProductId={selProductId}
                            selectProduct={selectProduct}
                            sellerId={sellerCode}
                          />
                        </Col>
                      );
                    })}
                  </Slider>
                  {slp_content && slp_content.length > 3 && (
                    <div className="qa-txt-alg-cnt qa-disp-ib">
                      <Button className="qa-slick-button" onClick={previous}>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 50 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="49"
                            height="49"
                            rx="14.5"
                            stroke="#D9BB7F"
                          />
                          <path
                            d="M32.4023 17.1523V22.0039L22.6992 27.3477L32.4023 33.1484V38L17.1094 28.2969V26.5039L32.4023 17.1523Z"
                            fill="#D9BB7F"
                          />
                        </svg>
                      </Button>
                      <Button className="qa-slick-button" onClick={next}>
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 50 50"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="49"
                            height="49"
                            rx="14.5"
                            stroke="#D9BB7F"
                          />
                          <path
                            d="M16.7578 17.1523V22.0039L26.4609 27.3477L16.7578 33.1484V38L32.0508 28.2969V26.5039L16.7578 17.1523Z"
                            fill="#D9BB7F"
                          />
                        </svg>
                      </Button>
                    </div>
                  )}
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      )}

      <Modal
        visible={pincodeModal}
        className="pd-pincode-modal"
        footer={null}
        closable={false}
        onCancel={hidePincodeModal}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={600}
      >
        <div>
          <div
            onClick={hidePincodeModal}
            style={{
              position: "absolute",
              right: "18px",
              top: "18px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <div className="heading qa-mar-btm-2">
            {modalType === "sample-delivery"
              ? "Sample delivery"
              : "Check serviceability"}
          </div>
          {modalType === "sample-delivery" ? (
            <div>
              <div className="p-title">
                Sample delivery is available for this product.
              </div>
              <div className="p-s-title">
                Estimated sample delivery cost:{" "}
                <span className="p-price">{sampleCostSC}</span>
              </div>
              <div className="p-note">
                To request for a sample, please write to us at buyers@qalara.com
                and mention the product id or the webpage address. We will take
                care of the rest.
              </div>
            </div>
          ) : (
            <Row>
              <Col xs={0} sm={0} md={5} lg={5} xl={5}></Col>
              <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                {!pincodeSuccess ? (
                  <Form
                    name="delivery_pincode_form"
                    onFinish={onFinish}
                    form={form}
                    scrollToFirstError
                    style={{ padding: "0px 30px" }}
                  >
                    <div className="qa-font-san">
                      Select Destination Country
                    </div>
                    <Form.Item
                      name="country"
                      className="form-item"
                      rules={[
                        { required: true, message: "Field is required." },
                      ]}
                    >
                      <Select
                        showSearch
                        dropdownClassName="qa-light-menu-theme"
                      >
                        {countriesList}
                      </Select>
                    </Form.Item>
                    {/* <div className="qa-font-san">
                      Enter destination zip code
                    </div>
                    <Form.Item
                      name="postalCode"
                      rules={[
                        { required: true, message: "Field is required." },
                      ]}
                    >
                      <Input />
                    </Form.Item> */}
                    {nonServiceable && (
                      <div className="qa-text-error">
                        This country doesn't appear in our list. Please use 'Get
                        custom quote' to send us your order requirements
                      </div>
                    )}
                    <Button
                      className="pincode-check-btn qa-mar-btm-2 qa-mar-top-1"
                      htmlType="submit"
                    >
                      Save Country
                    </Button>
                  </Form>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <CheckCircleOutlined
                      style={{
                        fontSize: "100px",
                        marginTop: "10px",
                        marginBottom: "20px",
                      }}
                    />
                    <div className="qa-mar-btm-3 qa-font-san">
                      Country <b>{uCountry}</b> is saved
                      <span
                        onClick={() => {
                          setPincodeSuccess(false);
                        }}
                        style={{
                          border: "1px solid #d9bb7f",
                          height: "25px",
                          display: "inline-block",
                          cursor: "pointer",
                          verticalAlign: "bottom",
                          marginLeft: "8px",
                        }}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 16.0837V19H7.91626L16.5173 10.399L13.601 7.48271L5 16.0837ZM18.7725 8.14373C19.0758 7.84044 19.0758 7.35051 18.7725 7.04722L16.9528 5.22747C16.6495 4.92418 16.1596 4.92418 15.8563 5.22747L14.4331 6.6506L17.3494 9.56687L18.7725 8.14373Z"
                            fill="#191919"
                          />
                        </svg>
                      </span>
                    </div>

                    <Button
                      className="pincode-check-btn qa-mar-btm-2 qa-mar-top-1"
                      onClick={() => setPincodeModal(false)}
                    >
                      Done
                    </Button>
                  </div>
                )}
              </Col>
              <Col xs={0} sm={0} md={5} lg={5} xl={5}></Col>
            </Row>
          )}
        </div>
      </Modal>
      <Modal
        visible={calculationModal}
        className="calculation-modal pd-pincode-modal qa-font-san"
        footer={null}
        closable={false}
        onCancel={hideCalculationModal}
        centered
        bodyStyle={{ padding: "30px 10px", backgroundColor: "#f9f7f2" }}
        width={900}
        style={{ top: 5 }}
      >
        <div>
          <div
            onClick={hideCalculationModal}
            style={{
              position: "absolute",
              right: "15px",
              top: "15px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <div className="heading qa-mar-btm-05">
            Calculate lead time, freight and duties
          </div>
          <div className="qa-mar-btm-2 qa-font-san qa-txt-alg-cnt qa-lh">
            If your country/pincode does not appear in the list below please use
            'Get custom quote' to send us your order requirements
          </div>

          <Row className="qa-font-san">
            <Col xs={24} sm={24} md={24} lg={6} xl={6} className="frieght-form">
              <Form
                name="calculate_charges_form"
                onFinish={onCalculateCharges}
                form={calculateform}
                scrollToFirstError
              >
                <div>
                  <div className="label-paragraph">
                    Quantity
                    {showPrice && (
                      <span style={{ float: "right" }}>
                        Minimum{" "}
                        {inStock > 0 && inStock < minimumOrderQuantity
                          ? inStock
                          : minimumOrderQuantity}{" "}
                        {moqUnit}
                      </span>
                    )}
                  </div>
                  <Form.Item
                    name="quantity"
                    className="form-item"
                    rules={[
                      { required: true, message: "Please select quantity" },
                      {
                        min:
                          inStock > 0 && inStock < minimumOrderQuantity
                            ? parseInt(inStock)
                            : parseInt(minimumOrderQuantity),
                        type: "number",
                        message:
                          "Please add quantity equal or greater than the minimum",
                      },
                      {
                        pattern: new RegExp("^[0-9]*$"),
                        message: "Wrong format!",
                      },
                    ]}
                  >
                    <InputNumber type="number" className="p-text-box" />
                  </Form.Item>
                </div>
                <div className="qa-font-san">Select Country</div>
                <Form.Item
                  name="country"
                  className="form-item"
                  rules={[{ required: true, message: "Please select country" }]}
                >
                  <Select showSearch dropdownClassName="qa-light-menu-theme">
                    {filteredCountry}
                  </Select>
                </Form.Item>
                <div className="qa-font-san">Enter destination zip code</div>
                <Form.Item
                  name="postalCode"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Input />
                </Form.Item>
                {nonServiceable && (
                  <div className="qa-text-error">
                    This zipcode/ pincode doesn't appear in our list. Please use
                    'Get custom quote' to send us your order requirements
                  </div>
                )}
                <Button
                  className="pincode-check-btn qa-mar-btm-2 qa-mar-top-1"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Form>
            </Col>
            <Col xs={24} sm={24} md={24} lg={9} xl={9} className="frieght-form">
              <div>
                <div className="qa-mar-top-12 qa-mar-btm-2">
                  <Icon
                    component={Air}
                    style={{
                      width: "35px",
                      verticalAlign: "middle",
                      marginRight: "5px",
                    }}
                    className="air-icon"
                  />
                  <span className="p-shipBy">Air</span>
                </div>
                <div className="qa-pad-015 qa-dashed-border">
                  <div className="c-left-blk">Estimated freight charges</div>
                  <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                    {airData ? (
                      <span>
                        {getSymbolFromCurrency(convertToCurrency)}
                        {airData["frightCostMin"]
                          ? getConvertedCurrency(airData["frightCostMin"], true)
                          : "0"}
                        -{getSymbolFromCurrency(convertToCurrency)}
                        {airData["frightCostMax"]
                          ? getConvertedCurrency(airData["frightCostMax"], true)
                          : "0"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="qa-pad-015 qa-dashed-border">
                  <div className="c-left-blk">Estimated duty charges</div>
                  <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                    {airData ? (
                      <span>
                        {getSymbolFromCurrency(convertToCurrency)}
                        {airData["dutyMin"]
                          ? getConvertedCurrency(airData["dutyMin"], true)
                          : "0"}
                        -{getSymbolFromCurrency(convertToCurrency)}
                        {airData["dutyMax"]
                          ? getConvertedCurrency(airData["dutyMax"], true)
                          : "0"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="qa-pad-015 qa-dashed-border">
                  <div className="c-left-blk">Total estimated charges</div>
                  <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                    {airData &&
                    airData["frightCostMin"] !== undefined &&
                    airData["dutyMin"] !== undefined ? (
                      <span>
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(
                          airData["frightCostMin"] + airData["dutyMin"],
                          true
                        )}
                        -{getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(
                          airData["frightCostMax"] + airData["dutyMax"],
                          true
                        )}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="qa-pad-015">
                  <div className="c-left-blk">Shipping lead time</div>
                  <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
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
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={9}
              xl={9}
              className="frieght-sea-sec"
            >
              <div>
                <div className="qa-mar-top-2 qa-mar-btm-2">
                  <Icon
                    component={Sea}
                    style={{
                      width: "35px",
                      verticalAlign: "middle",
                      marginRight: "5px",
                    }}
                    className="sea-icon"
                  />
                  <span className="p-shipBy">Sea</span>
                </div>
                <div className="qa-pad-015 qa-dashed-border">
                  <div className="c-left-blk">Estimated freight charges</div>
                  <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                    {seaData ? (
                      <span>
                        {getSymbolFromCurrency(convertToCurrency)}
                        {seaData["frightCostMin"]
                          ? getConvertedCurrency(seaData["frightCostMin"], true)
                          : "0"}
                        -{getSymbolFromCurrency(convertToCurrency)}
                        {seaData["frightCostMax"]
                          ? getConvertedCurrency(seaData["frightCostMax"], true)
                          : "0"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="qa-pad-015 qa-dashed-border">
                  <div className="c-left-blk">Estimated duty charges</div>
                  <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                    {seaData ? (
                      <span>
                        {getSymbolFromCurrency(convertToCurrency)}
                        {seaData["dutyMin"]
                          ? getConvertedCurrency(seaData["dutyMin"], true)
                          : "0"}
                        -{getSymbolFromCurrency(convertToCurrency)}
                        {seaData["dutyMax"]
                          ? getConvertedCurrency(seaData["dutyMax"], true)
                          : "0"}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="qa-pad-015 qa-dashed-border">
                  <div className="c-left-blk">Total estimated charges</div>
                  <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
                    {seaData &&
                    seaData["frightCostMin"] !== undefined &&
                    seaData["dutyMin"] !== undefined ? (
                      <span>
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(
                          seaData["frightCostMin"] + seaData["dutyMin"],
                          true
                        )}
                        -{getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(
                          seaData["frightCostMax"] + seaData["dutyMax"],
                          true
                        )}
                      </span>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
                <div className="qa-pad-015">
                  <div className="c-left-blk">Shipping lead time</div>
                  <div className="c-right-blk qa-fw-b qa-txt-alg-rgt">
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
            </Col>

            <Col span={24} className="cart-fr-detail">
              Estimated time to prepare and ship your order is{" "}
              {productType === "RTS"
                ? "4-5 days"
                : productType === "ERTM"
                ? "20-30 days"
                : "20-30 days"}
            </Col>
            <Col span={24} className="qa-pad-2 qa-mar-top-1">
              <div className="qa-tc-white qa-fs-20">Disclaimer</div>
              <div className="qa-tc-white qa-fs-14">
                *Freight and duties charges mentioned are estimates. You will be
                charged at actuals. <br></br>*Lead time mentioned is applicable
                once your order is shipped.
              </div>
            </Col>
          </Row>
        </div>
      </Modal>

      <Modal
        visible={rfqModal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "0px" }}
        width={750}
        style={{ top: 5 }}
        className={
          rfqType === "Seller RFQ"
            ? "seller-order-query"
            : "product-order-query"
        }
      >
        <div className="qa-rel-pos qa-bg-dark-theme">
          <div
            onClick={handleCancel}
            style={{
              position: "absolute",
              right: "15px",
              top: "15px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>

          {rfqType === "Seller RFQ" ? (
            <SellerContact
              initialValues={initialValues}
              token={token}
              sellerDetails={sellerDetails}
              sendQueryCancel={sendQueryCancel}
              userId={props.userProfile && props.userProfile.profileId}
            />
          ) : (
            <ProductContact
              initialValues={initialValues}
              token={token}
              sellerDetails={sellerDetails}
              userId={props.userProfile && props.userProfile.profileId}
              sendQueryCancel={sendQueryCancel}
              productDetails={data}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
            />
          )}
        </div>
      </Modal>
      <Modal
        visible={successQueryVisible}
        footer={null}
        closable={true}
        onCancel={successQueryCancel}
        centered
        bodyStyle={{ padding: "0" }}
        width={400}
        className={
          rfqType === "Seller RFQ"
            ? "seller-order-query-submission"
            : "product-order-query-submission"
        }
      >
        <div id="send-query-success-modal">
          <div className="send-query-success-modal-content">
            <p className="send-query-success-modal-para1">Thank you!</p>
            <p className="send-query-success-modal-para2">
              {rfqType === "Seller RFQ"
                ? "We have received your order query and will revert within the next 48 to 72 hours."
                : "We have received your request for a custom quote and will revert within the next 48 to 72 hours."}
            </p>
          </div>
          <Link href="/">
            <Button
              className="send-query-success-modal-button"
              onClick={() => {
                successQueryCancel();
              }}
            >
              Back to home page
            </Button>
          </Link>
        </div>
      </Modal>
      <Modal
        visible={loginModal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "30px" }}
        width={400}
        className="product-login-modal"
      >
        <div className="qa-rel-pos">
          <div
            onClick={handleCancel}
            style={{
              position: "absolute",
              right: "-5px",
              top: "-20px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <div id="product-login-modal">
            <div className="product-login-modal-content">
              <p className="product-login-modal-para">
                Please signin/signup to proceed
              </p>
            </div>
            <Button className="qa-button product-sign-in-btn" onClick={signIn}>
              Sign in / Sign up
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cart: state.checkout.cart,
    currencyDetails: state.currencyConverter,
    userProfile: state.userProfile.userProfile,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
  };
};

export default connect(mapStateToProps, { checkInventory })(ProductDetails);
