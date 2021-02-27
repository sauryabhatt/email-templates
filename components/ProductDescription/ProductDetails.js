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
  Drawer,
  message,
} from "antd";
import Icon, { MinusOutlined, CloseOutlined } from "@ant-design/icons";
import Accordion from "../common/Accordion";
import ProductCard from "../common/ProductCard";
import Certifications from "../common/Certifications";
import ImageGallery from "react-image-gallery";
import Slider from "react-slick";
import { connect } from "react-redux";
import closeButton from "../../public/filestore/closeButton";
import { loginToApp } from "../AuthWithKeycloak";
import infoIcon from "../../public/filestore/infoIcon";
import amexPayment from "../../public/filestore/amexPayment";
import visaPayment from "../../public/filestore/visaPayment";
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
import addToCollectionIcon from "../../public/filestore/addToCollectionIcon";
import savedToCollectionIcon from "../../public/filestore/savedToCollectionIcon";
import Air from "../../public/filestore/air";
import Sea from "../../public/filestore/sea";
import alertIcon from "../../public/filestore/alertIcon";
import { useRouter } from "next/router";
import { useKeycloak } from "@react-keycloak/ssr";
import { checkInventory } from "../../store/actions";
import playButton from "./../../public/filestore/playButton";
import AddToCollection from "../common/AddToCollection";
import sellerList from "../../public/filestore/freeShippingSellers.json";
import AddToCollectionSignUp from "./AddToCollectionSignUp";
import FreightChargeCalculator from "./FreightChargeCalculator";
import { getConvertedCurrency } from "../../utils/currencyConverter";
import ServiceabilityCheck from "./ServiceabilityCheck";

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

const ProductDetails = (props) => {
  let {
    data = {},
    userProfile = "",
    sellerDetails,
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
    sellerCategory = "",
    smallBatchesAvailable = false,
  } = sellerDetails || {};

  let { orderId = "" } = cart;
  const router = useRouter();
  const { keycloak } = useKeycloak();
  const ImgGalleryM = useRef(null);
  const ImgGalleryD = useRef(null);
  const [rtsform] = Form.useForm();
  const [pincodeModal, setPincodeModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [accordionView, setAccordionView] = useState("");
  const [activeKeys, setActiveKeys] = useState(["1", "2"]);
  const [count, setCount] = useState(0);
  const [rfqModal, setRfqModal] = useState(false);
  const [rfqType, setRfqType] = useState("");
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [thumbnail, setThumbnail] = useState(false);
  const [uCountry, setUCountry] = useState("");
  const [nonServiceable, setNonServiceable] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [mobile, setMobile] = useState(false);
  const [calculationModal, setCalculationModal] = useState(false);
  const [qtyErr, setQtyErr] = useState(false);
  const [sizeErr, setSizeErr] = useState(false);
  const [skuId, setSkuId] = useState("");
  const [variantId, setVariantId] = useState();
  const [zoomImg, setZoomImg] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [overlayDiv, setOverlayDiv] = useState(false);
  const [nonServiceableCountry, setNonServiceableCountry] = useState(false);
  const [selProductId, setSelProductId] = useState("");
  const [showCart, setCart] = useState(false);
  const [inStock, setInStock] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [qtyError, setQtyError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCollection, setCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [collections, setCollections] = useState([]);
  const [moqList, setMoqList] = useState([]);
  const [selectedQty, setSelectedQty] = useState(0);
  const [displayPrice, setDisplayPrice] = useState("");
  const [shippingMode, setShippingMode] = useState("");
  const [inRange, setInRange] = useState("");

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

  useEffect(() => {
    if (props.authenticated) {
      setErrorMsg("");
    }
  }, [props.authenticated]);

  const selectProduct = (productId) => {
    setSelProductId(productId);
    setOpen(!open);
  };

  useEffect(() => {
    const width = window.screen ? window.screen.width : window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }
  }, []);

  useEffect(() => {
    setSelectedQty(0);
    setSkuId("");
    setInStock(0);
    setActiveKeys(["1", "2"]);
    setAccordionView("");
    setQtyErr(false);
    setInRange("");
    let pdpOverlay = localStorage.getItem("pdpOverlay");
    if (pdpOverlay) {
      setOverlayDiv(false);
    } else {
      setOverlayDiv(true);
      localStorage.setItem("pdpOverlay", true);
    }
    rtsform.resetFields();
    setCart(false);
    let { data = {}, userProfile = {} } = props;
    let { country = "", verificationStatus = "", profileId = "" } =
      userProfile || {};
    let destinationCountry = sessionStorage.getItem("destinationCountry");

    let {
      variants = [],
      skus = [],
      deliveryExclusions = [],
      productMOQPriceDetail = [],
      exfactoryListPrice = "",
      productType = "",
    } = data || {};
    let { smallBatchesAvailable = false } = sellerDetails || {};
    setDisplayPrice(exfactoryListPrice);
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
      setErrorMsg("To place an order, please ");
      setQtyError("To place an order, please signup as a buyer");
    } else if (
      (profileType === "BUYER" && verificationStatus === "ON_HOLD") ||
      (profileType === "BUYER" && verificationStatus === "REJECTED")
    ) {
      setErrorMsg(
        "You will be able to checkout once your Buyer account is verified. "
      );
      setQtyError(
        "You will be able to checkout once your Buyer account is verified. "
      );
    } else if (profileType === "SELLER" || !authenticated) {
      setErrorMsg("To place an order, please ");
      setQtyError("To place an order, please signup as a buyer");
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
    } else {
      setSkuId("");
      setInStock(0);
    }

    if (variants.length) {
      color = variants[0]["color"];
      variantId = variants[0]["sequenceId"];
      let imageList = [];
      let zoomedImages = [...variants[0]["mediaUrls"]];
      if (variants[0]["zoomedImages"] && variants[0]["zoomedImages"].length) {
        zoomedImages = [...variants[0]["zoomedImages"]];
      }
      for (let i = 0; i < zoomedImages.length; i++) {
        let obj = {};
        obj["fullscreen"] =
          url + (zoomedImages[i] || variants[0]["mediaUrls"][i]);
        obj["original"] =
          url + (variants[0]["mediaUrls"][i] || zoomedImages[i]);
        obj["thumbnail"] =
          url + (variants[0]["thumbNails"][i] || variants[0]["mediaUrls"][i]);
        imageList.push(obj);
      }
      setGalleryImages(imageList);
      rtsform.setFieldsValue({ color: variants[0].color });
    }
    if (
      smallBatchesAvailable &&
      productMOQPriceDetail &&
      productMOQPriceDetail.length > 0
    ) {
      setDisplayPrice(productMOQPriceDetail[0]["price"]);
      setShippingMode(productMOQPriceDetail[0]["shippingMode"]);
    }

    setSelectedColor(color);
    setVariantId(variantId);
    setMoqList(productMOQPriceDetail);
  }, [props.data]);

  useEffect(() => {
    let { collections = [] } = props || {};
    setCollections(collections);
  }, [props.collections]);

  useEffect(() => {
    setSelectedCollection("");
    let { articleId = "" } = router.query;
    if (collections && collections.length) {
      for (let list of collections) {
        let { products = [], name = "" } = list;
        for (let product of products) {
          let { articleId: pArticleId = "" } = product;
          if (pArticleId === articleId) {
            setSelectedCollection(name);
          }
        }
      }
    }
  }, [router.query, collections]);

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
    switchMoq = "",
    shippingMethods = [],
    variants = [],
    suggestedRetailPrice = "",
    exfactoryListPrice = "",
    sellerCode = "",
    priceMin = "",
    offers = "",
    sellerMOV = "",
    info = {},
    skus = [],
    exFactoryPrice = "",
    visibleTo = "",
    length = "",
    breadth = "",
    height = "",
    lbhUnit = "",
    freeShippingEligible = false,
    productMOQPriceDetail = [],
  } = data || {};
  let sizes = [];
  let standardSize = "Standard (l*b*h)";
  let lbh = [];

  if (length && length != "0") {
    lbh.push(length);
  }
  if (breadth && breadth != "0") {
    lbh.push(breadth);
  }
  if (height && height != "0") {
    lbh.push(height);
  }
  standardSize = lbh.join("*");
  let productNameSC =
    productName.toLowerCase().charAt(0).toUpperCase() +
    productName.toLowerCase().slice(1);

  if (info && info["size"] && info["size"].toString().trim().length > 0) {
    sizes = info["size"];
  }

  let splpLink = "/seller/" + sellerCode + "/all-categories";
  // let displayPrice = priceMin || exfactoryListPrice;

  let discount = 0;
  if (exFactoryPrice > exfactoryListPrice) {
    discount = ((exFactoryPrice - exfactoryListPrice) / exFactoryPrice) * 100;
  }

  let initialValues;
  let slider;
  let mslider;

  if (!sellerMOV) {
    sellerMOV =
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

  if (
    productMOQPriceDetail &&
    productMOQPriceDetail.length > 0 &&
    smallBatchesAvailable
  ) {
    minimumOrderQuantity =
      productMOQPriceDetail[productMOQPriceDetail.length - 1]["qtyMin"];
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
    setLoading(true);
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
            typeOfOrder: productType,
            sellerCategory: sellerCategory,
            smallBatchesAvailable: smallBatchesAvailable,
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
                    `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL}/v1/orders/my/${orderId}/product`,
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
                        setCart(true);
                        rtsform.setFieldsValue({ quantity: "" });
                        setTimeout(() => {
                          setCart(false);
                        }, 5000);
                        setLoading(false);
                      } else {
                        throw res.statusText || "Error while signing up.";
                      }
                    })
                    .catch((err) => {
                      console.log(err.message);
                    });
                } else {
                  setLoading(false);
                  setCart(false);
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
                    `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/rts/` +
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
                        `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL}/v1/orders/my/${orderId}/product`,
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
                            setCart(true);
                            rtsform.setFieldsValue({ quantity: "" });
                            setTimeout(() => {
                              setCart(false);
                            }, 5000);
                            setLoading(false);
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
                  setLoading(false);
                  setCart(false);
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
          setLoading(false);
        });
    } else {
      setLoginModal(true);
    }
  };

  const hideCalculationModal = () => {
    setCalculationModal(false);
  };
  {
    /**overlay div */
  }
  const hideOverlayDiv = () => {
    setOverlayDiv(false);
    localStorage.setItem("pdpOverlay", true);
  };

  const setActiveKey = (key) => {
    setActiveKeys(key);
    setAccordionView("");
  };

  const setAccordion = (name) => {
    let keys = [...activeKeys, "3"];
    setActiveKeys(keys);
    setAccordionView(name);
    let clickCount = count + 1;
    setCount(clickCount);
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
          {item.thumbnail.includes(".mp4") ? (
            <video
              className="qa-thumbnail-video image-gallery-thumbnail-image"
              src={item.thumbnail}
              preload="meta"
            ></video>
          ) : (
            <img
              className="image-gallery-thumbnail-image"
              src={item.thumbnail}
              alt={item.thumbnail}
            />
          )}
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
          let zoomedImages = [...list["mediaUrls"]];
          if (list["zoomedImages"] && list["zoomedImages"].length) {
            zoomedImages = [...list["zoomedImages"]];
          }
          for (let i = 0; i < zoomedImages.length; i++) {
            let obj = {};
            obj["fullscreen"] = url + (zoomedImages[i] || list["mediaUrls"][i]);
            obj["original"] = url + (list["mediaUrls"][i] || zoomedImages[i]);
            obj["thumbnail"] =
              url + (list["thumbNails"][i] || list["mediaUrls"][i]);
            imageList.push(obj);
          }
        }
        setGalleryImages(imageList);
      }
    }
  };

  const inRangeQty = (x, min, max) => {
    if (max === -1) {
      max = Infinity;
    }
    return x >= min && x <= max;
  };

  const changeMOQQty = (value) => {
    let range = false;
    let priceList = moqList;
    let index = 0;
    for (let details of priceList) {
      let { qtyMin = "", qtyMax = "", price = "", shippingMode = "" } = details;
      if (inRangeQty(value, qtyMin, qtyMax)) {
        range = true;
        setDisplayPrice(price);
        setShippingMode(shippingMode);
        setSelectedQty(index);
      }
      index++;
    }
    if (range) {
      setInRange(range);
    } else {
      setInRange(range);
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
              xs={24}
              sm={24}
              md={4}
              lg={4}
              xl={4}
              style={{ alignItems: "center", display: "flex" }}
            >
              <div>
                <div className="qa-fw-sb qa-tc-white qa-fs-14">
                  <Link href={`/seller/${vanityId}`}>
                    <span
                      style={{
                        color: "#874439",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Explore seller profile
                    </span>
                  </Link>
                </div>
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
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
              xs={24}
              sm={24}
              md={7}
              lg={7}
              xl={7}
            >
              {/* <Button
                className="qa-button button-contact-seller"
                onClick={() => {
                  setRfqModal(true);
                  setRfqType("Seller RFQ");
                }}
              >
                send order query
              </Button> */}

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

          <Row>
            <Col
              xs={24}
              sm={24}
              md={10}
              lg={10}
              xl={10}
              style={{ paddingRight: "20px", textAlign: "right" }}
            >
              <div
                style={{
                  display: "inline-block",
                  visibility: overlayDiv ? "hidden" : "visible",
                }}
                className="atc-section"
                onClick={() => {
                  if (showPrice) {
                    setCollection(true);
                  } else {
                    setLoginModal(true);
                  }
                }}
              >
                <span className="save-collection">
                  {selectedCollection ? "SAVED" : "SAVE TO COLLECTION"}
                </span>
                {selectedCollection ? (
                  <Icon
                    component={savedToCollectionIcon}
                    style={{
                      width: "12px",
                      verticalAlign: "middle",
                    }}
                  />
                ) : (
                  <Icon
                    component={addToCollectionIcon}
                    style={{
                      width: "12px",
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </div>
              <div
                style={{
                  display: overlayDiv ? "flex" : "none",
                  textAlign: "left",
                }}
                className="overlay-div"
              >
                <div className="cross-icon">
                  <CloseOutlined onClick={hideOverlayDiv} />
                </div>
                <div className="overlay" onClick={hideOverlayDiv}>
                  <div
                    className="save-to-overlay qa-cursor"
                    onClick={() => {
                      if (showPrice) {
                        setCollection(true);
                      } else {
                        setLoginModal(true);
                      }
                    }}
                  >
                    <div className="save-overlay-collection">
                      <span className="qa-va-m">Save to collection</span>
                      <Icon
                        component={addToCollectionIcon}
                        className="overlay-atc-icon"
                        style={{
                          width: "12px",
                          height: "12px",
                          verticalAlign: "middle",
                          marginLeft: "5px",
                        }}
                      />
                    </div>
                  </div>
                  <div className="save-col-overlay">
                    <div>
                      <div className="overlay-heading">Qalara tips</div>
                      <p className="overlay-click" onClick={hideOverlayDiv}>
                        (Click to dismiss)
                      </p>
                      <p className="overlay-para">
                        Easily send a single Request for Quote for multiple
                        products using the new
                        <b> 'save to collection'</b> feature!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="qa-mar-auto-4 qa-mar-btm-4 image-gallery img-section">
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
                  {productType === "RTS" && skuId
                    ? "Ready to ship"
                    : productType === "ERTM" && skuId
                    ? "Express custom"
                    : "Custom order"}
                </span>
              </div>
              {galleryImages.length > 0 ? (
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
              ) : (
                <div className="qa-pdp-box">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 163 102"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M95.1665 42.4999V31.7532L92.3332 28.9199L97.9998 23.2533V43.9166C97.9998 44.6986 97.3652 45.3332 96.5832 45.3332H75.9199L78.7532 42.4999H95.1665ZM100.833 56.6664H64.5867L61.7534 59.4997H102.25C103.032 59.4997 103.666 58.8651 103.666 58.0831V17.5867L100.833 20.42V56.6664ZM114.585 2.41858L49.4186 67.5846C48.8661 68.1385 47.9679 68.1385 47.4154 67.5846C46.8615 67.0307 46.8615 66.1353 47.4154 65.5814L55.5003 57.4966V4.25031C55.5003 3.46832 56.1349 2.83366 56.9169 2.83366H102.25C103.032 2.83366 103.666 3.46832 103.666 4.25031V9.33042L112.581 0.415433C113.135 -0.138478 114.031 -0.138478 114.585 0.415433C115.138 0.969344 115.138 1.86467 114.585 2.41858ZM58.3336 54.6633L67.6636 45.3332H62.5835C61.8015 45.3332 61.1669 44.6986 61.1669 43.9166V9.91692C61.1669 9.13493 61.8015 8.50027 62.5835 8.50027H96.5832C97.3652 8.50027 97.9998 9.13493 97.9998 9.91692V14.997L100.833 12.1637V5.66696H58.3336V54.6633ZM87.6682 24.2548C87.1143 23.7009 86.2189 23.7009 85.665 24.2548L75.3334 34.5865L70.6103 29.8634C70.0564 29.3095 69.1596 29.3095 68.6071 29.8634L64.0002 34.4689V42.4999H70.4969L88.2051 24.7918L87.6682 24.2548Z"
                      fill="#191919"
                    />
                    <path
                      d="M5.82422 96.8379V98H1.50391V96.8379H3.04883V90.002H1.50391V88.8398H5.82422V90.002H4.2793V96.8379H5.82422ZM17.3496 88.8398V98H16.1191V91.3691L13.2891 94.3906H12.9609L10.0625 91.3691V98H8.83203V88.8398H9.21484L13.125 93.0371L16.9668 88.8398H17.3496ZM23.8848 88.8398L28.1641 98H26.6875L25.7305 95.8125H21.4375L20.4668 98H18.9902L23.2695 88.8398H23.8848ZM23.5977 90.918L21.9434 94.6504H25.2246L23.5977 90.918ZM33.3047 92.9961H37.3379V96.7559C37.1191 96.9928 36.8366 97.2253 36.4902 97.4531C36.1439 97.6719 35.7428 97.8542 35.2871 98C34.8405 98.1367 34.3483 98.2051 33.8105 98.2051C33.1178 98.2051 32.4798 98.082 31.8965 97.8359C31.3132 97.5807 30.8027 97.2344 30.3652 96.7969C29.9277 96.3594 29.5859 95.8535 29.3398 95.2793C29.1029 94.696 28.9844 94.0762 28.9844 93.4199C28.9844 92.7637 29.1029 92.1484 29.3398 91.5742C29.5859 90.9909 29.9277 90.4805 30.3652 90.043C30.8027 89.6055 31.3132 89.2637 31.8965 89.0176C32.4798 88.7624 33.1178 88.6348 33.8105 88.6348C34.4759 88.6348 35.0182 88.7259 35.4375 88.9082C35.8659 89.0905 36.2396 89.3275 36.5586 89.6191V90.9727C36.3581 90.8268 36.1302 90.6673 35.875 90.4941C35.6289 90.321 35.3372 90.1706 35 90.043C34.6719 89.9062 34.2754 89.8379 33.8105 89.8379C33.127 89.8379 32.5163 89.9928 31.9785 90.3027C31.4408 90.6126 31.0169 91.041 30.707 91.5879C30.3971 92.1257 30.2422 92.7363 30.2422 93.4199C30.2422 94.1035 30.3971 94.7142 30.707 95.252C31.0169 95.7897 31.4408 96.2181 31.9785 96.5371C32.5163 96.847 33.127 97.002 33.8105 97.002C34.2754 97.002 34.6491 96.9564 34.9316 96.8652C35.2142 96.765 35.4375 96.6556 35.6016 96.5371C35.7656 96.4095 35.8978 96.3047 35.998 96.2227L36.0117 94.0898H33.3047V92.9961ZM45.0762 92.7227V93.8848H40.6191V96.8379H45.6641V98H39.3887V88.8398H45.6641V90.002H40.6191V92.7227H45.0762ZM60.0059 88.8398V98H59.541L53.5938 91.4512V98H52.3633V88.8398H52.8281L58.7754 95.4707V88.8398H60.0059ZM67.0195 88.6348C67.7122 88.6348 68.3503 88.7624 68.9336 89.0176C69.5169 89.2637 70.0273 89.6055 70.4648 90.043C70.9023 90.4805 71.2396 90.9909 71.4766 91.5742C71.7227 92.1484 71.8457 92.7637 71.8457 93.4199C71.8457 94.0762 71.7227 94.696 71.4766 95.2793C71.2396 95.8535 70.9023 96.3594 70.4648 96.7969C70.0273 97.2344 69.5169 97.5807 68.9336 97.8359C68.3503 98.082 67.7122 98.2051 67.0195 98.2051C66.3268 98.2051 65.6888 98.082 65.1055 97.8359C64.5221 97.5807 64.0117 97.2344 63.5742 96.7969C63.1367 96.3594 62.7949 95.8535 62.5488 95.2793C62.3118 94.696 62.1934 94.0762 62.1934 93.4199C62.1934 92.7637 62.3118 92.1484 62.5488 91.5742C62.7949 90.9909 63.1367 90.4805 63.5742 90.043C64.0117 89.6055 64.5221 89.2637 65.1055 89.0176C65.6888 88.7624 66.3268 88.6348 67.0195 88.6348ZM67.0195 89.8379C66.3359 89.8379 65.7253 89.9928 65.1875 90.3027C64.6497 90.6126 64.2259 91.041 63.916 91.5879C63.6061 92.1257 63.4512 92.7363 63.4512 93.4199C63.4512 94.1035 63.6061 94.7142 63.916 95.252C64.2259 95.7897 64.6497 96.2181 65.1875 96.5371C65.7253 96.847 66.3359 97.002 67.0195 97.002C67.7031 97.002 68.3138 96.847 68.8516 96.5371C69.3893 96.2181 69.8132 95.7897 70.123 95.252C70.4329 94.7142 70.5879 94.1035 70.5879 93.4199C70.5879 92.7363 70.4329 92.1257 70.123 91.5879C69.8132 91.041 69.3893 90.6126 68.8516 90.3027C68.3138 89.9928 67.7031 89.8379 67.0195 89.8379ZM79.9395 88.8398V90.002H76.7812V97.959H75.5508V90.002H72.3926V88.8398H79.9395ZM89.4688 88.8398L93.748 98H92.2715L91.3145 95.8125H87.0215L86.0508 98H84.5742L88.8535 88.8398H89.4688ZM89.1816 90.918L87.5273 94.6504H90.8086L89.1816 90.918ZM101.965 88.8398L97.6855 98H97.0703L92.791 88.8398H94.2676L97.3574 95.9219L100.488 88.8398H101.965ZM106.039 88.8398L110.318 98H108.842L107.885 95.8125H103.592L102.621 98H101.145L105.424 88.8398H106.039ZM105.752 90.918L104.098 94.6504H107.379L105.752 90.918ZM116.279 96.8379V98H111.959V96.8379H113.504V90.002H111.959V88.8398H116.279V90.002H114.734V96.8379H116.279ZM120.518 88.8398V96.8379H125.562V98H119.287V88.8398H120.518ZM131.51 88.8398L135.789 98H134.312L133.355 95.8125H129.062L128.092 98H126.615L130.895 88.8398H131.51ZM131.223 90.918L129.568 94.6504H132.85L131.223 90.918ZM140.656 88.6211C141.331 88.6211 141.914 88.735 142.406 88.9629C142.908 89.1816 143.295 89.4824 143.568 89.8652C143.842 90.248 143.979 90.6901 143.979 91.1914C143.979 91.638 143.851 92.0482 143.596 92.4219C143.34 92.7865 143.021 93.0599 142.639 93.2422C142.912 93.2969 143.181 93.4108 143.445 93.584C143.71 93.7572 143.928 93.9941 144.102 94.2949C144.284 94.5957 144.375 94.9694 144.375 95.416C144.375 95.9264 144.229 96.3867 143.938 96.7969C143.646 97.207 143.227 97.5352 142.68 97.7812C142.142 98.0182 141.504 98.1367 140.766 98.1367C140.201 98.1367 139.608 98.1003 138.988 98.0273C138.378 97.9635 137.858 97.8861 137.43 97.7949V88.9629C137.904 88.8535 138.419 88.7715 138.975 88.7168C139.54 88.653 140.1 88.6211 140.656 88.6211ZM140.574 89.7832C140.191 89.7832 139.845 89.7969 139.535 89.8242C139.234 89.8516 138.943 89.8926 138.66 89.9473V92.8184H140.807C141.426 92.8184 141.9 92.6634 142.229 92.3535C142.557 92.0345 142.721 91.6654 142.721 91.2461C142.721 90.918 142.62 90.6491 142.42 90.4395C142.219 90.2207 141.955 90.0566 141.627 89.9473C141.308 89.8379 140.957 89.7832 140.574 89.7832ZM138.66 96.8105C138.988 96.8743 139.353 96.9199 139.754 96.9473C140.155 96.9655 140.483 96.9746 140.738 96.9746C141.422 96.9746 141.987 96.8333 142.434 96.5508C142.889 96.2682 143.117 95.89 143.117 95.416C143.117 94.9147 142.894 94.541 142.447 94.2949C142.01 94.0397 141.472 93.9121 140.834 93.9121H138.66V96.8105ZM148.025 88.8398V96.8379H153.07V98H146.795V88.8398H148.025ZM161.178 92.7227V93.8848H156.721V96.8379H161.766V98H155.49V88.8398H161.766V90.002H156.721V92.7227H161.178Z"
                      fill="black"
                    />
                  </svg>
                </div>
              )}
            </Col>

            <Col
              xs={24}
              sm={24}
              md={9}
              lg={9}
              xl={9}
              style={{ paddingRight: "30px" }}
            >
              <div className="qa-fs-24 qa-font-butler product-title">
                <span className="qa-mar-rgt-05">{productNameSC}</span>
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
                    <div className="qa-mar-btm-05">
                      <span
                        style={{
                          fontSize: "26px",
                          fontFamily: "Butler",
                          color: "#191919",
                          verticalAlign: "middle",
                        }}
                      >
                        {getSymbolFromCurrency(convertToCurrency)}
                        {getConvertedCurrency(displayPrice, currencyDetails)}*
                      </span>
                      {/* {priceMin && (
                        <span className="qa-fs-20 qa-font-butler qa-va-m">
                          {" "}
                          - {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(exfactoryListPrice, currencyDetails)}
                        </span>
                      )} */}
                      {(sellerList.includes(sellerCode) ||
                        freeShippingEligible) && (
                        <div className="qa-offer-text qa-pad-0-10 qa-disp-inline">
                          FREE shipping
                        </div>
                      )}
                      {exFactoryPrice > exfactoryListPrice &&
                        !(moqList.length > 0 && smallBatchesAvailable) && (
                          <div>
                            <span
                              className="qa-font-butler"
                              style={{
                                textDecoration: "line-through",
                                fontSize: "17px",
                                color: "rgba(25, 25, 25, 0.8)",
                                marginRight: "10px",
                                verticalAlign: "middle",
                              }}
                            >
                              {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(
                                exFactoryPrice,
                                currencyDetails
                              )}
                            </span>
                            <span className="qa-discount">
                              {parseFloat(discount).toFixed(0)}% off
                            </span>
                          </div>
                        )}
                      {!sellerList.includes(sellerCode) &&
                      !freeShippingEligible &&
                      moqList.length === 0 &&
                      !smallBatchesAvailable ? (
                        <div className="qa-font-san qa-fs-12 qa-lh">
                          Base price per unit excl. freight and other charges
                        </div>
                      ) : (
                        <div>
                          {!freeShippingEligible &&
                          moqList.length > 0 &&
                          smallBatchesAvailable ? (
                            <div className="qa-font-san qa-fs-12 qa-lh">
                              Price excl. shipping, taxes & duties, if
                              applicable
                              <Tooltip
                                overlayClassName="qa-tooltip"
                                placement="top"
                                trigger="hover"
                                title="Price varies based on the quantity ordered and may exclude certain remote regions. For large quantities or special requirements, please send us a Get quote request."
                              >
                                <span
                                  style={{
                                    cursor: "pointer",
                                    verticalAlign: "middle",
                                    marginLeft: "5px",
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
                          ) : (
                            <div className="qa-font-san qa-fs-12 qa-lh">
                              Price excl. taxes & duties, if applicable
                              <Tooltip
                                overlayClassName="qa-tooltip"
                                placement="top"
                                trigger="hover"
                                title="Price is inclusive of shipping for small quantities and may exclude certain remote regions. For large quantities, please send us a Get quote request."
                              >
                                <span
                                  style={{
                                    cursor: "pointer",
                                    verticalAlign: "middle",
                                    marginLeft: "5px",
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
                        </div>
                      )}
                      {/* <div className="qa-tc-white qa-font-san qa-fs-12">
                        Suggested retail price:{" "}
                        <b>
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(suggestedRetailPrice, currencyDetails)}
                        </b>
                      </div> */}
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
              {showPrice && moqList.length > 0 && smallBatchesAvailable && (
                <div>
                  <div className="qa-font-san qa-tc-white qa-fs-12 qa-fw-b qa-mar-top-1 qa-mar-btm-05">
                    Select quantity range to view applicable price and shipping
                    mode (units):{" "}
                  </div>
                  {moqList.map((moq, i) => (
                    <div
                      className={
                        selectedQty === i
                          ? "pdp-moq-range qa-mar-rgt-2 selected"
                          : "pdp-moq-range qa-mar-rgt-2"
                      }
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedQty(i);
                        setDisplayPrice(moq.price);
                        setShippingMode(moq.shippingMode);
                        rtsform.setFieldsValue({ quantity: "" });
                      }}
                    >
                      {moq.qtyMin}{" "}
                      {moq.qtyMax > 0 ? (
                        <span>- {moq.qtyMax}</span>
                      ) : (
                        <span> +</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Form
                name="product_details_form_large"
                form={rtsform}
                scrollToFirstError
              >
                {(productType === "RTS" || productType === "ERTM") && skuId ? (
                  <div>
                    <Row>
                      <Col xs={24} sm={24} md={11} lg={11} xl={11}>
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
                          {showPrice &&
                            !(moqList.length > 0 && smallBatchesAvailable) && (
                              <span
                                className="qa-fs-12"
                                style={{ float: "right" }}
                              >
                                Minimum{" "}
                                {switchMoq && inStock === 0
                                  ? switchMoq
                                  : inStock > 0 &&
                                    inStock < minimumOrderQuantity
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
                          {showPrice ? (
                            <InputNumber
                              type="number"
                              className="p-text-box"
                              onChange={(value) => {
                                if (
                                  moqList.length > 0 &&
                                  smallBatchesAvailable
                                ) {
                                  changeMOQQty(value);
                                }
                              }}
                            />
                          ) : (
                            <Tooltip
                              trigger={["focus"]}
                              title={qtyError}
                              placement="top"
                              overlayClassName="qa-tooltip qty-tooltip"
                            >
                              <Input value="" className="p-text-box" />
                            </Tooltip>
                          )}
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                        <div className="qa-font-san qa-fs-12 qa-blue qa-mar-lft1 qa-lh qa-mar-top-2">
                          *For large quantities, please submit the{" "}
                          <b>'get quote'</b> form for unbeatable prices!
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {colors.length > 0 && (
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
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
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
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
                      {sizes.length === 0 && lbh.length > 0 && (
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                          <div className="label-paragraph qa-fs-12">
                            Size ({lbhUnit})
                          </div>

                          <Input disabled={true} value={standardSize} />
                        </Col>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div className="custom-section">
                    {showPrice && (
                      <div className="qa-font-san qa-tc-white">
                        {!(moqList.length > 0 && smallBatchesAvailable) && (
                          <span>
                            Minimum order quantity:{" "}
                            {switchMoq && inStock === 0
                              ? switchMoq
                              : minimumOrderQuantity}{" "}
                            {moqUnit}{" "}
                            {/* <span
                              style={{
                                marginRight: "5px",
                                fontWeight: "bold",
                                fontFamily: "Butler",
                              }}
                            >
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
                            </span> */}
                          </span>
                        )}
                        <div className="qa-font-san qa-fs-12 qa-blue qa-mar-top-05 qa-lh qa-mar-btm-1">
                          *For large quantities, please submit the{" "}
                          <b>'get quote'</b> form for unbeatable prices!
                        </div>
                      </div>
                    )}

                    <Row>
                      {colors.length > 0 && (
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
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
                      <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
                      {sizes.length === 0 && lbh.length > 0 && (
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                          <div className="label-paragraph qa-fs-12">
                            Size ({lbhUnit})
                          </div>

                          <Input disabled={true} value={standardSize} />
                        </Col>
                      )}
                    </Row>
                  </div>
                )}

                <div>
                  <span
                    className="p-custom qa-cursor"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAccordion("custom");
                    }}
                  >
                    More customization available
                  </span>
                </div>

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
                {(productType === "RTS" || productType === "ERTM") && skuId && (
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
                {shippingMode === "Air" && showPrice && (
                  <div className="qa-mar-btm-15">
                    <span>
                      <Icon
                        component={Air}
                        style={{ width: "34px", verticalAlign: "middle" }}
                        className="air-icon"
                      />
                      <span className="p-shipBy">Air</span>
                    </span>
                  </div>
                )}
                {shippingMode === "Sea" && showPrice && (
                  <div className="qa-mar-btm-15">
                    <span>
                      <Icon
                        component={Sea}
                        style={{ width: "32px", verticalAlign: "middle" }}
                        className="sea-icon"
                      />
                      <span className="p-shipBy">Sea</span>
                    </span>
                  </div>
                )}
                {(!shippingMode || !showPrice) && (
                  <div className="qa-mar-btm-15">
                    {shippingMethods.includes("Air") && (
                      <span>
                        <Icon
                          component={Air}
                          style={{ width: "34px", verticalAlign: "middle" }}
                          className="air-icon"
                        />
                        <span className="p-shipBy">Air</span>
                      </span>
                    )}
                    {shippingMethods.includes("Sea") && (
                      <span>
                        <Icon
                          component={Sea}
                          style={{ width: "32px", verticalAlign: "middle" }}
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
                )}
                <div>
                  <Button
                    className={`${
                      (productType === "RTS" || productType === "ERTM") && skuId
                        ? "rfq-button"
                        : "rfq-button rfq-active"
                    }`}
                    onClick={() => {
                      setRfqModal(true);
                      setRfqType("Product RFQ");
                    }}
                  >
                    <div>Get Quote</div>
                  </Button>
                  {(productType === "RTS" || productType === "ERTM") && skuId && (
                    <span>
                      {(profileType === "BUYER" &&
                        verificationStatus === "VERIFIED" &&
                        isGuest !== "true") ||
                      (profileType === "BUYER" &&
                        verificationStatus === "IN_PROGRESS" &&
                        skuId) ? (
                        <span>
                          {showCart ? (
                            <Button
                              onClick={() => {
                                router.push("/cart");
                              }}
                              className="go-to-cart-button"
                            >
                              Go to cart{" "}
                              <span style={{ marginLeft: "10px" }}>
                                <svg
                                  width="18"
                                  height="8"
                                  viewBox="0 0 18 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                                    fill="black"
                                  />
                                </svg>
                              </span>
                            </Button>
                          ) : (
                            <Button
                              htmlType="submit"
                              onClick={onCheck}
                              className={
                                inRange !== false
                                  ? "add-to-bag-button"
                                  : "add-to-bag-button atc-diable"
                              }
                              loading={loading}
                            >
                              Add to cart
                            </Button>
                          )}
                        </span>
                      ) : (
                        <Button className="add-to-bag-button atc-diable">
                          <div>Add to cart</div>
                        </Button>
                      )}
                    </span>
                  )}
                </div>

                {inRange === false && (
                  <div className="qa-text-error">
                    Please enter a quantity value as per the quantity range
                    mentioned
                  </div>
                )}
                {errorMsg &&
                  (productType === "RTS" || productType === "ERTM") &&
                  skuId && (
                    <div className="qa-error-atc qa-mar-top-05">
                      {isGuest === "true" ||
                      profileType === "SELLER" ||
                      !authenticated ? (
                        <>
                          {errorMsg}{" "}
                          <span onClick={signUp} className="p-custom">
                            signup as a buyer
                          </span>
                        </>
                      ) : (
                        ""
                      )}
                    </div>
                  )}
                {showCart && (
                  <div className="add-to-cart-success">
                    Product added successfully!
                    <span
                      onClick={() => setCart(false)}
                      className="pdp-cart-close"
                    >
                      <Icon
                        component={closeButton}
                        style={{ width: "30px", height: "30px" }}
                      />
                    </span>
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
              <div className="p-minimum-order">
                Minimum order value with this seller:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Butler",
                  }}
                >
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(sellerMOV, currencyDetails)}
                </span>
                <div className="qa-font-san qa-tc-white qa-fs-12 qa-mar-top-05">
                  You need to purchase single or multiple products from this
                  Seller adding up to this total order value for instant
                  checkout. If your requirement is lower, please write to us or
                  raise a custom quote.
                </div>
              </div>

              {offers && (
                <div className="p-minimum-order qa-pad-top-2">
                  <div className="qa-mar-btm-1">Offers from Qalara</div>
                  <div style={{ fontSize: "14px" }}>
                    Buy 20 units and get 20% off
                  </div>
                </div>
              )}
              {sampleDelivery === "Y" && (
                <div className="qa-pad-top-2 product-sample-text">
                  <span
                    className="p-custom qa-cursor"
                    onClick={() => {
                      setModalType("sample-delivery");
                      setPincodeModal(true);
                    }}
                  >
                    Check sample availability
                  </span>
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
              <div
                className={`${
                  showPrice ? "pdp-explore-sec" : "pdp-explore-sec pdp-fw"
                }`}
              >
                <Link href={`/seller/${vanityId}`}>
                  <a target="_blank">
                    <div
                      style={{
                        color: "#874439",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      className="qa-tc-white qa-fs-14"
                    >
                      Explore seller profile
                    </div>
                  </a>
                </Link>
              </div>

              <div
                style={{ visibility: overlayDiv ? "hidden" : "visible" }}
                className={
                  selectedCollection
                    ? "pdp-collection-sec pdp-save-icon"
                    : "pdp-collection-sec"
                }
                onClick={() => {
                  if (showPrice) {
                    setCollection(true);
                  } else {
                    setLoginModal(true);
                  }
                }}
              >
                <div className="pdp-stc">
                  <div className="pdp-stc-btn">
                    {selectedCollection ? "Saved" : "Save to collection"}
                  </div>
                </div>
                <div className="pdp-stc-icon">
                  {selectedCollection ? (
                    <Icon
                      component={savedToCollectionIcon}
                      style={{
                        width: "15px",
                      }}
                    />
                  ) : (
                    <Icon
                      component={addToCollectionIcon}
                      style={{
                        width: "15px",
                      }}
                    />
                  )}
                </div>
              </div>
              <div
                style={{ display: overlayDiv ? "block" : "none" }}
                className="pdp-overlay-div"
              >
                <div className="pdp-overlay" onClick={hideOverlayDiv}>
                  <div className="pdp-save-col-overlay">
                    <div
                      className="pdp-save-to-overlay"
                      onClick={() => {
                        if (showPrice) {
                          setCollection(true);
                        } else {
                          setLoginModal(true);
                        }
                      }}
                    >
                      <div className="pdp-save-overlay-collection">
                        <div className="pdp-stc">
                          <div className="pdp-stc-btn">
                            {selectedCollection
                              ? "Saved"
                              : "Save to collection"}
                          </div>
                        </div>
                        <div className="pdp-stc-icon">
                          <Icon
                            component={addToCollectionIcon}
                            className="pdp-overlay-atc-icon"
                            style={{
                              width: "15px",
                              height: "15px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={{ paddingRight: "30px" }}>
                      <div className="pdp-overlay-heading">Qalara tips</div>
                      <p className="overlay-click" onClick={hideOverlayDiv}>
                        (Click to dismiss)
                      </p>
                      <p className="overlay-para">
                        Easily send a single Request for Quote for multiple
                        products using the new <b>'save to collection'</b>{" "}
                        feature!
                      </p>
                    </div>
                  </div>
                </div>
                <CloseOutlined
                  className="pdp-cross-icon"
                  onClick={hideOverlayDiv}
                />
              </div>
            </Col>
          </Row>
          <Row className="qa-mar-btm-4">
            <Col className="pdp-zoom-image" span={24}>
              {galleryImages.length > 0 ? (
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
              ) : (
                <div className="qa-pdp-box">
                  <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 163 102"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M95.1665 42.4999V31.7532L92.3332 28.9199L97.9998 23.2533V43.9166C97.9998 44.6986 97.3652 45.3332 96.5832 45.3332H75.9199L78.7532 42.4999H95.1665ZM100.833 56.6664H64.5867L61.7534 59.4997H102.25C103.032 59.4997 103.666 58.8651 103.666 58.0831V17.5867L100.833 20.42V56.6664ZM114.585 2.41858L49.4186 67.5846C48.8661 68.1385 47.9679 68.1385 47.4154 67.5846C46.8615 67.0307 46.8615 66.1353 47.4154 65.5814L55.5003 57.4966V4.25031C55.5003 3.46832 56.1349 2.83366 56.9169 2.83366H102.25C103.032 2.83366 103.666 3.46832 103.666 4.25031V9.33042L112.581 0.415433C113.135 -0.138478 114.031 -0.138478 114.585 0.415433C115.138 0.969344 115.138 1.86467 114.585 2.41858ZM58.3336 54.6633L67.6636 45.3332H62.5835C61.8015 45.3332 61.1669 44.6986 61.1669 43.9166V9.91692C61.1669 9.13493 61.8015 8.50027 62.5835 8.50027H96.5832C97.3652 8.50027 97.9998 9.13493 97.9998 9.91692V14.997L100.833 12.1637V5.66696H58.3336V54.6633ZM87.6682 24.2548C87.1143 23.7009 86.2189 23.7009 85.665 24.2548L75.3334 34.5865L70.6103 29.8634C70.0564 29.3095 69.1596 29.3095 68.6071 29.8634L64.0002 34.4689V42.4999H70.4969L88.2051 24.7918L87.6682 24.2548Z"
                      fill="#191919"
                    />
                    <path
                      d="M5.82422 96.8379V98H1.50391V96.8379H3.04883V90.002H1.50391V88.8398H5.82422V90.002H4.2793V96.8379H5.82422ZM17.3496 88.8398V98H16.1191V91.3691L13.2891 94.3906H12.9609L10.0625 91.3691V98H8.83203V88.8398H9.21484L13.125 93.0371L16.9668 88.8398H17.3496ZM23.8848 88.8398L28.1641 98H26.6875L25.7305 95.8125H21.4375L20.4668 98H18.9902L23.2695 88.8398H23.8848ZM23.5977 90.918L21.9434 94.6504H25.2246L23.5977 90.918ZM33.3047 92.9961H37.3379V96.7559C37.1191 96.9928 36.8366 97.2253 36.4902 97.4531C36.1439 97.6719 35.7428 97.8542 35.2871 98C34.8405 98.1367 34.3483 98.2051 33.8105 98.2051C33.1178 98.2051 32.4798 98.082 31.8965 97.8359C31.3132 97.5807 30.8027 97.2344 30.3652 96.7969C29.9277 96.3594 29.5859 95.8535 29.3398 95.2793C29.1029 94.696 28.9844 94.0762 28.9844 93.4199C28.9844 92.7637 29.1029 92.1484 29.3398 91.5742C29.5859 90.9909 29.9277 90.4805 30.3652 90.043C30.8027 89.6055 31.3132 89.2637 31.8965 89.0176C32.4798 88.7624 33.1178 88.6348 33.8105 88.6348C34.4759 88.6348 35.0182 88.7259 35.4375 88.9082C35.8659 89.0905 36.2396 89.3275 36.5586 89.6191V90.9727C36.3581 90.8268 36.1302 90.6673 35.875 90.4941C35.6289 90.321 35.3372 90.1706 35 90.043C34.6719 89.9062 34.2754 89.8379 33.8105 89.8379C33.127 89.8379 32.5163 89.9928 31.9785 90.3027C31.4408 90.6126 31.0169 91.041 30.707 91.5879C30.3971 92.1257 30.2422 92.7363 30.2422 93.4199C30.2422 94.1035 30.3971 94.7142 30.707 95.252C31.0169 95.7897 31.4408 96.2181 31.9785 96.5371C32.5163 96.847 33.127 97.002 33.8105 97.002C34.2754 97.002 34.6491 96.9564 34.9316 96.8652C35.2142 96.765 35.4375 96.6556 35.6016 96.5371C35.7656 96.4095 35.8978 96.3047 35.998 96.2227L36.0117 94.0898H33.3047V92.9961ZM45.0762 92.7227V93.8848H40.6191V96.8379H45.6641V98H39.3887V88.8398H45.6641V90.002H40.6191V92.7227H45.0762ZM60.0059 88.8398V98H59.541L53.5938 91.4512V98H52.3633V88.8398H52.8281L58.7754 95.4707V88.8398H60.0059ZM67.0195 88.6348C67.7122 88.6348 68.3503 88.7624 68.9336 89.0176C69.5169 89.2637 70.0273 89.6055 70.4648 90.043C70.9023 90.4805 71.2396 90.9909 71.4766 91.5742C71.7227 92.1484 71.8457 92.7637 71.8457 93.4199C71.8457 94.0762 71.7227 94.696 71.4766 95.2793C71.2396 95.8535 70.9023 96.3594 70.4648 96.7969C70.0273 97.2344 69.5169 97.5807 68.9336 97.8359C68.3503 98.082 67.7122 98.2051 67.0195 98.2051C66.3268 98.2051 65.6888 98.082 65.1055 97.8359C64.5221 97.5807 64.0117 97.2344 63.5742 96.7969C63.1367 96.3594 62.7949 95.8535 62.5488 95.2793C62.3118 94.696 62.1934 94.0762 62.1934 93.4199C62.1934 92.7637 62.3118 92.1484 62.5488 91.5742C62.7949 90.9909 63.1367 90.4805 63.5742 90.043C64.0117 89.6055 64.5221 89.2637 65.1055 89.0176C65.6888 88.7624 66.3268 88.6348 67.0195 88.6348ZM67.0195 89.8379C66.3359 89.8379 65.7253 89.9928 65.1875 90.3027C64.6497 90.6126 64.2259 91.041 63.916 91.5879C63.6061 92.1257 63.4512 92.7363 63.4512 93.4199C63.4512 94.1035 63.6061 94.7142 63.916 95.252C64.2259 95.7897 64.6497 96.2181 65.1875 96.5371C65.7253 96.847 66.3359 97.002 67.0195 97.002C67.7031 97.002 68.3138 96.847 68.8516 96.5371C69.3893 96.2181 69.8132 95.7897 70.123 95.252C70.4329 94.7142 70.5879 94.1035 70.5879 93.4199C70.5879 92.7363 70.4329 92.1257 70.123 91.5879C69.8132 91.041 69.3893 90.6126 68.8516 90.3027C68.3138 89.9928 67.7031 89.8379 67.0195 89.8379ZM79.9395 88.8398V90.002H76.7812V97.959H75.5508V90.002H72.3926V88.8398H79.9395ZM89.4688 88.8398L93.748 98H92.2715L91.3145 95.8125H87.0215L86.0508 98H84.5742L88.8535 88.8398H89.4688ZM89.1816 90.918L87.5273 94.6504H90.8086L89.1816 90.918ZM101.965 88.8398L97.6855 98H97.0703L92.791 88.8398H94.2676L97.3574 95.9219L100.488 88.8398H101.965ZM106.039 88.8398L110.318 98H108.842L107.885 95.8125H103.592L102.621 98H101.145L105.424 88.8398H106.039ZM105.752 90.918L104.098 94.6504H107.379L105.752 90.918ZM116.279 96.8379V98H111.959V96.8379H113.504V90.002H111.959V88.8398H116.279V90.002H114.734V96.8379H116.279ZM120.518 88.8398V96.8379H125.562V98H119.287V88.8398H120.518ZM131.51 88.8398L135.789 98H134.312L133.355 95.8125H129.062L128.092 98H126.615L130.895 88.8398H131.51ZM131.223 90.918L129.568 94.6504H132.85L131.223 90.918ZM140.656 88.6211C141.331 88.6211 141.914 88.735 142.406 88.9629C142.908 89.1816 143.295 89.4824 143.568 89.8652C143.842 90.248 143.979 90.6901 143.979 91.1914C143.979 91.638 143.851 92.0482 143.596 92.4219C143.34 92.7865 143.021 93.0599 142.639 93.2422C142.912 93.2969 143.181 93.4108 143.445 93.584C143.71 93.7572 143.928 93.9941 144.102 94.2949C144.284 94.5957 144.375 94.9694 144.375 95.416C144.375 95.9264 144.229 96.3867 143.938 96.7969C143.646 97.207 143.227 97.5352 142.68 97.7812C142.142 98.0182 141.504 98.1367 140.766 98.1367C140.201 98.1367 139.608 98.1003 138.988 98.0273C138.378 97.9635 137.858 97.8861 137.43 97.7949V88.9629C137.904 88.8535 138.419 88.7715 138.975 88.7168C139.54 88.653 140.1 88.6211 140.656 88.6211ZM140.574 89.7832C140.191 89.7832 139.845 89.7969 139.535 89.8242C139.234 89.8516 138.943 89.8926 138.66 89.9473V92.8184H140.807C141.426 92.8184 141.9 92.6634 142.229 92.3535C142.557 92.0345 142.721 91.6654 142.721 91.2461C142.721 90.918 142.62 90.6491 142.42 90.4395C142.219 90.2207 141.955 90.0566 141.627 89.9473C141.308 89.8379 140.957 89.7832 140.574 89.7832ZM138.66 96.8105C138.988 96.8743 139.353 96.9199 139.754 96.9473C140.155 96.9655 140.483 96.9746 140.738 96.9746C141.422 96.9746 141.987 96.8333 142.434 96.5508C142.889 96.2682 143.117 95.89 143.117 95.416C143.117 94.9147 142.894 94.541 142.447 94.2949C142.01 94.0397 141.472 93.9121 140.834 93.9121H138.66V96.8105ZM148.025 88.8398V96.8379H153.07V98H146.795V88.8398H148.025ZM161.178 92.7227V93.8848H156.721V96.8379H161.766V98H155.49V88.8398H161.766V90.002H156.721V92.7227H161.178Z"
                      fill="black"
                    />
                  </svg>
                </div>
              )}
              <div className="product-list-details">
                <span className="product-order-type">
                  {productType === "RTS" && skuId
                    ? "Ready to ship"
                    : productType === "ERTM" && skuId
                    ? "Express custom"
                    : "Custom order"}
                </span>
              </div>
            </Col>

            <Col
              className="qa-pad-0-30"
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
            >
              <div className="qa-fs-24 qa-font-butler product-title">
                <span className="qa-mar-rgt-05">{productNameSC}</span>
                {packType && (
                  <span className="product-s-title">{packType}</span>
                )}
              </div>
              {authenticated ? (
                <div>
                  {(profileType === "BUYER" &&
                    verificationStatus === "VERIFIED") ||
                  (profileType === "BUYER" &&
                    verificationStatus === "IN_PROGRESS") ||
                  (profileType === "SELLER" && profileId === sellerCode) ||
                  showPrice ? (
                    <div className="qa-mar-btm-1">
                      <Row>
                        <Col span={12}>
                          <span
                            style={{
                              fontSize: "24px",
                              fontFamily: "Butler",
                              color: "#191919",
                              verticalAlign: "middle",
                            }}
                          >
                            {getSymbolFromCurrency(convertToCurrency)}
                            {getConvertedCurrency(
                              displayPrice,
                              currencyDetails
                            )}
                            *
                          </span>
                          {/* {priceMin && (
                            <span className="qa-fs-20 qa-font-butler qa-va-m">
                              {" "}
                              - {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(exfactoryListPrice, currencyDetails)}
                            </span>
                          )} */}
                        </Col>
                        {(sellerList.includes(sellerCode) ||
                          freeShippingEligible) && (
                          <Col
                            span={12}
                            className="qa-txt-alg-rgt qa-mar-top-05"
                          >
                            <span className="qa-offer-text">FREE shipping</span>
                          </Col>
                        )}
                      </Row>

                      {exFactoryPrice > exfactoryListPrice &&
                        !(moqList.length > 0 && smallBatchesAvailable) && (
                          <div>
                            <span
                              className="qa-font-butler"
                              style={{
                                textDecoration: "line-through",
                                fontSize: "17px",
                                color: "rgba(25, 25, 25, 0.8)",
                                marginRight: "10px",
                                verticalAlign: "middle",
                              }}
                            >
                              {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(
                                exFactoryPrice,
                                currencyDetails
                              )}
                            </span>
                            <span className="qa-discount">
                              {parseFloat(discount).toFixed(0)}% off
                            </span>
                          </div>
                        )}
                      {!sellerList.includes(sellerCode) &&
                      !freeShippingEligible &&
                      moqList.length === 0 &&
                      !smallBatchesAvailable ? (
                        <div className="qa-font-san qa-fs-12 qa-lh">
                          Base price per unit excl. freight and other charges
                        </div>
                      ) : (
                        <div>
                          {!freeShippingEligible &&
                          moqList.length > 0 &&
                          smallBatchesAvailable ? (
                            <div className="qa-font-san qa-fs-12 qa-lh">
                              Price excl. shipping, taxes & duties, if
                              applicable
                              <Tooltip
                                overlayClassName="qa-tooltip"
                                placement="top"
                                trigger="hover"
                                title="Price varies based on the quantity ordered and may exclude certain remote regions. For large quantities or special requirements, please send us a Get quote request."
                              >
                                <span
                                  style={{
                                    cursor: "pointer",
                                    verticalAlign: "middle",
                                    marginLeft: "5px",
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
                          ) : (
                            <div className="qa-font-san qa-fs-12 qa-lh">
                              Price excl. taxes & duties, if applicable
                              <Tooltip
                                overlayClassName="qa-tooltip"
                                placement="top"
                                trigger="hover"
                                title="Price is inclusive of shipping for small quantities and may exclude certain remote regions. For large quantities, please send us a Get quote request."
                              >
                                <span
                                  style={{
                                    cursor: "pointer",
                                    verticalAlign: "middle",
                                    marginLeft: "5px",
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
                        </div>
                      )}
                      {/* <div className="qa-tc-white qa-font-san qa-fs-12">
                        Suggested retail price:{" "}
                        <b>
                          {getSymbolFromCurrency(convertToCurrency)}
                          {getConvertedCurrency(suggestedRetailPrice, currencyDetails)}
                        </b>
                      </div> */}
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
              {showPrice && moqList.length > 0 && smallBatchesAvailable && (
                <div>
                  <div className="qa-font-san qa-tc-white qa-fs-12 qa-fw-b qa-mar-top-15 qa-mar-btm-05">
                    Select quantity range to view applicable price and shipping
                    mode (units):{" "}
                  </div>
                  {moqList.map((moq, i) => (
                    <div
                      className={
                        selectedQty === i
                          ? "pdp-moq-range qa-mar-rgt-2 selected"
                          : "pdp-moq-range qa-mar-rgt-2"
                      }
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setSelectedQty(i);
                        setDisplayPrice(moq.price);
                        setShippingMode(moq.shippingMode);
                        rtsform.setFieldsValue({ quantity: "" });
                      }}
                    >
                      {moq.qtyMin}{" "}
                      {moq.qtyMax > 0 ? (
                        <span>- {moq.qtyMax}</span>
                      ) : (
                        <span> +</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <Form
                name="product_details_form_mobile"
                form={rtsform}
                scrollToFirstError
              >
                {(productType === "RTS" || productType === "ERTM") && skuId ? (
                  <div>
                    <Row>
                      <Col xs={24} sm={24} md={11} lg={11} xl={11}>
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
                          {showPrice &&
                            !(moqList.length > 0 && smallBatchesAvailable) && (
                              <span
                                className="qa-fs-12"
                                style={{ float: "right" }}
                              >
                                Minimum{" "}
                                {switchMoq && inStock === 0
                                  ? switchMoq
                                  : inStock > 0 &&
                                    inStock < minimumOrderQuantity
                                  ? inStock
                                  : minimumOrderQuantity}{" "}
                                {moqUnit}
                              </span>
                            )}
                        </div>
                        <Form.Item
                          name="quantity"
                          className="form-item m-product-qty"
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
                          {showPrice ? (
                            <InputNumber
                              type="number"
                              className="p-text-box"
                              onChange={(value) => {
                                if (
                                  moqList.length > 0 &&
                                  smallBatchesAvailable
                                ) {
                                  changeMOQQty(value);
                                }
                              }}
                            />
                          ) : (
                            <Tooltip
                              trigger={["focus"]}
                              title={qtyError}
                              placement="top"
                              overlayClassName="qa-tooltip qty-tooltip"
                            >
                              <Input value="" className="p-text-box" />
                            </Tooltip>
                          )}
                        </Form.Item>
                        <div
                          className="qa-font-san qa-fs-12 qa-blue qa-mar-btm-1 qa-lh"
                          style={{ marginTop: "-10px" }}
                        >
                          *For large quantities, please submit the{" "}
                          <b>'get quote'</b> form for unbeatable prices!
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      {colors.length > 0 && (
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
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
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
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
                      {sizes.length === 0 && lbh.length > 0 && (
                        <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                          <div className="label-paragraph qa-fs-12">
                            Size ({lbhUnit})
                          </div>

                          <Input disabled={true} value={standardSize} />
                        </Col>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    {showPrice && (
                      <div className="qa-font-san qa-tc-white">
                        {!(moqList.length > 0 && smallBatchesAvailable) && (
                          <span>
                            Minimum order quantity:{" "}
                            {switchMoq && inStock === 0
                              ? switchMoq
                              : minimumOrderQuantity}{" "}
                            {moqUnit}{" "}
                            {/* <span
                              style={{
                                marginRight: "5px",
                                fontWeight: "bold",
                                fontFamily: "Butler",
                              }}
                            >
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
                            </span>
                         */}
                          </span>
                        )}
                        <div className="qa-font-san qa-fs-12 qa-blue qa-mar-top-05 qa-lh qa-mar-btm-1">
                          *For large quantities, please submit the{" "}
                          <b>'get quote'</b> form for unbeatable prices!
                        </div>
                      </div>
                    )}
                    {colors.length > 0 && (
                      <Col xs={24} sm={24} md={11} lg={11} xl={11}>
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
                    {sizes.length === 0 && lbh.length > 0 && (
                      <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                        <div className="label-paragraph qa-fs-12">
                          Size ({lbhUnit})
                        </div>

                        <Input disabled={true} value={standardSize} />
                      </Col>
                    )}
                  </div>
                )}
                <div className="p-custom">
                  <span
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAccordion("custom");
                    }}
                  >
                    More customization available
                  </span>
                </div>

                <div className="qa-font-san qa-fs-14 qa-tc-white qa-mar-top-2 qa-mar-btm-05">
                  Available shipping modes
                </div>

                {shippingMode === "Air" && showPrice && (
                  <div className="qa-mar-btm-15">
                    <span>
                      <Icon
                        component={Air}
                        style={{ width: "34px", verticalAlign: "middle" }}
                        className="air-icon"
                      />
                      <span className="p-shipBy">Air</span>
                    </span>
                  </div>
                )}
                {shippingMode === "Sea" && showPrice && (
                  <div className="qa-mar-btm-15">
                    <span>
                      <Icon
                        component={Sea}
                        style={{ width: "32px", verticalAlign: "middle" }}
                        className="sea-icon"
                      />
                      <span className="p-shipBy">Sea</span>
                    </span>
                  </div>
                )}
                {(!shippingMode || !showPrice) && (
                  <div className="qa-mar-btm-15">
                    {shippingMethods.includes("Air") && (
                      <span>
                        <Icon
                          component={Air}
                          style={{ width: "34px", verticalAlign: "middle" }}
                          className="air-icon"
                        />
                        <span className="p-shipBy">Air</span>
                      </span>
                    )}
                    {shippingMethods.includes("Sea") && (
                      <span>
                        <Icon
                          component={Sea}
                          style={{ width: "32px", verticalAlign: "middle" }}
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
                )}

                <div>
                  {(productType === "RTS" || productType === "ERTM") && skuId && (
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
                    onClick={() => {
                      setRfqModal(true);
                      setRfqType("Product RFQ");
                    }}
                  >
                    <div>Get Quote</div>
                  </Button>
                  {(productType === "RTS" || productType === "ERTM") && skuId && (
                    <span>
                      {(profileType === "BUYER" &&
                        verificationStatus === "VERIFIED" &&
                        isGuest !== "true") ||
                      (profileType === "BUYER" &&
                        verificationStatus === "IN_PROGRESS" &&
                        skuId) ? (
                        <span>
                          {showCart ? (
                            <Button
                              onClick={() => {
                                router.push("/cart");
                              }}
                              className="go-to-cart-button"
                            >
                              Go to cart{" "}
                              <span style={{ marginLeft: "10px" }}>
                                <svg
                                  width="18"
                                  height="8"
                                  viewBox="0 0 18 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                                    fill="black"
                                  />
                                </svg>
                              </span>
                            </Button>
                          ) : (
                            <Button
                              htmlType="submit"
                              onClick={onCheck}
                              className={
                                inRange !== false
                                  ? "add-to-bag-button"
                                  : "add-to-bag-button atc-diable"
                              }
                              loading={loading}
                            >
                              Add to cart
                            </Button>
                          )}
                        </span>
                      ) : (
                        <Button className="add-to-bag-button atc-diable">
                          <div>Add to cart</div>
                        </Button>
                      )}
                    </span>
                  )}
                  {inRange === false && (
                    <div
                      className="qa-text-error"
                      style={{ marginTop: "-20px" }}
                    >
                      Please enter a quantity value as per the quantity range
                      mentioned
                    </div>
                  )}
                  {errorMsg &&
                    (productType === "RTS" || productType === "ERTM") &&
                    skuId && (
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
                    <div className="add-to-cart-success">
                      <span className="m-cart-success">
                        Product added successfully!
                      </span>
                      <span
                        onClick={() => setCart(false)}
                        className="pdp-cart-close"
                      >
                        <Icon
                          component={closeButton}
                          style={{ width: "30px", height: "30px" }}
                        />
                      </span>
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
              <div className="p-minimum-order">
                Minimum order value with this seller:{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    fontFamily: "Butler",
                  }}
                >
                  {getSymbolFromCurrency(convertToCurrency)}
                  {getConvertedCurrency(sellerMOV, currencyDetails)}
                </span>
                <div className="qa-font-san qa-tc-white qa-fs-12 qa-mar-top-05">
                  You need to purchase single or multiple products from this
                  Seller adding up to this total order value for instant
                  checkout. If your requirement is lower, please write to us or
                  raise a custom quote.
                </div>
              </div>

              {offers && (
                <div className="p-minimum-order qa-pad-top-2">
                  <div className="qa-mar-btm-1">Offers from Qalara</div>
                  <div style={{ fontSize: "14px" }}>
                    Buy 20 units and get 20% off
                  </div>
                </div>
              )}
              {sampleDelivery === "Y" && (
                <div className="qa-pad-top-2 product-sample-text">
                  <span
                    className="p-custom qa-cursor"
                    onClick={() => {
                      setModalType("sample-delivery");
                      setPincodeModal(true);
                    }}
                  >
                    Check sample availability
                  </span>
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
            count={count}
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
                <div className="pc-title">
                  View more products from this seller
                </div>
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
                <div className="pc-title">
                  View more products from this seller
                </div>
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
        <ServiceabilityCheck
          hidePincodeModal={hidePincodeModal}
          modalType={modalType}
          nonServiceable={nonServiceable}
          productDetails={data}
          uCountry={uCountry}
          setNonServiceable={(status) => setNonServiceable(status)}
          setNonServiceableCountry={(status) =>
            setNonServiceableCountry(status)
          }
          setUCountry={(country) => setUCountry(country)}
          setPincodeModal={(status) => setPincodeModal(status)}
        />
      </Modal>
      <Modal
        visible={calculationModal}
        className="calculation-modal pd-pincode-modal qa-font-san"
        footer={null}
        closable={false}
        onCancel={hideCalculationModal}
        centered
        bodyStyle={{ padding: "30px 10px", backgroundColor: "#f9f7f2" }}
        width={!mobile ? 900 : "98%"}
        style={{ top: 5 }}
      >
        <FreightChargeCalculator
          hideCalculationModal={hideCalculationModal}
          showPrice={showPrice}
          productDetails={data}
          token={token}
          inStock={inStock}
          qtyError={qtyError}
          nonServiceable={nonServiceable}
        />
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
              showPrice={showPrice}
              currencyDetails={currencyDetails}
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
            ? "pdp seller-order-query-submission"
            : "pdp product-order-query-submission"
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
        bodyStyle={{ padding: "40px", backgroundColor: "#F9F7F2" }}
        width={700}
        className="product-login-modal"
      >
        <AddToCollectionSignUp handleCancel={handleCancel} />
      </Modal>
      <Drawer
        placement={mobile ? "bottom" : "right"}
        closable={false}
        width={mobile ? "100%" : "330px"}
        bodyStyle={{ padding: "20px" }}
        onClose={() => setCollection(false)}
        visible={showCollection}
      >
        <AddToCollection
          onClose={() => setCollection(false)}
          savedProductToCollection={(name) => setSelectedCollection(name)}
          userCollections={collections}
          userProfile={userProfile}
          articleId={articleId}
          sellerCode={sellerCode}
          selectedCollection={selectedCollection}
          token={token}
          refreshCollection={(collections) => setCollections(collections)}
        />
      </Drawer>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    cart: state.checkout.cart,
    collections: state.userProfile.collections,
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
