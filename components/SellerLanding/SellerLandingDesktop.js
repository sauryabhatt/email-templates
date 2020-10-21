/** @format */

import React, { useState, useEffect } from "react";
import {
  Button,
  Row,
  Col,
  Modal,
  message,
  Table,
  Tooltip,
  Alert,
  Menu,
  Layout,
} from "antd";
import { connect } from "react-redux";
import Icon, {
  MinusOutlined,
  StarOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import Certifications from "../common/Certifications";
import Slider from "react-slick";
import SellerBanner from "../common/SellerBanner";
import SellerContact from "../SellerContact/SellerContact";
import ScheduleMeeting from "../ScheduleMeeting/ScheduleMeeting";
import { loginToApp } from "../AuthWithKeycloak";
import { useSelector } from "react-redux";
import { getUserProfile, getMeetingCount } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import closeButton from "../../public/filestore/closeButton";
import playButton from "../../public/filestore/playButton";
import pdfOutline from "../../public/filestore/pdfOutline";
import lockOutline from "../../public/filestore/lockOutline";
import SCPLoader from "../../public/filestore/SCPLoader";
import moment from "moment";
import _ from "lodash";
import dynamic from 'next/dynamic'
import sellerProfileIcon from "../../public/filestore/sellerProfileIcon";
import productListingIcon from "../../public/filestore/productListingIcon";
import locationIcon from "../../public/filestore/locationIcon";
const DynamicPDFDocument = dynamic(() => import('../common/PDFDocument'), {
  ssr: false
})
import Link  from "next/link";
import { useRouter } from "next/router";
const isServer = () => typeof window == undefined;

const { Column, ColumnGroup } = Table;
const { Content } = Layout;

const SellerLandingDesktop = (props) => {
  const router = useRouter();
  const settings = {
    initialSlide: 0,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    speed: 500,
    arrows: false,
  };

  const [requestLoading, setRequestLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataSourceOLT, setDataSourceOLT] = useState([]);
  const [dataSourceOLTS, setDataSourceOLTS] = useState([]);
  const [columnsOLT, setColumnsOLT] = useState([]);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [ScheduleBenefits, setShowScheduleBenefits] = useState(false);
  const [scheduling, setShowScheduling] = useState(false);
  const [schedulingSuccess, setShowSchedulingSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const isAuthenticated = useSelector((state) => state.auth.authenticated);
  const {keycloak} = useKeycloak();
  const [smallBatchAvailable, setSmallBatchAvailable] = useState(false);
  const [productionKMM, setProductionKMM] = useState([]);

  const [logoUrl, setLogoUrl] = useState();
  const [productTypeDetails, setProductTypeDetails] = useState("");
  let mediaMatch;

  useEffect(() => {
    mediaMatch = window.matchMedia("(max-width: 1024px)");
    if (isAuthenticated) {
      props.getUserProfile(keycloak.token);
    }
  }, []);

  let slider;

  const next = (e) => {
    slider.slickNext();
  };

  const previous = (e) => {
    slider.slickPrev();
  };

  const signIn = () => {
    loginToApp({ currentPath: encodeURI(router.asPath) });
  };

  const sendQueryCancel = (status) => {
    if (status === "success") {
      setVisible(false);
      setSuccessQueryVisible(true);
    } else {
      setVisible(false);
    }
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
  };

  let sellerDetails = props.data;
  let {
    productPopupDetails = [],
    aboutCompany = "",
    userProfile = "",
    isLoading = true,
  } = props;
  let initialValues;

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

  let { profileType = "", verificationStatus = "" } = userProfile || {};

  let {
    orgName = "",
    brandName = "",
    companyDescription = "",
    bannerImage = {},
    brandLogo = {},
    categoryDescs = [],
    values = [],
    leadTimes = [],
    orderMinimums = [],
    keyMethods = [],
    keyMaterials = [],
    valueCertifications = [],
    city = "",
    country = "",
    privateOfferings = [],
    publicOfferings = [],
    showRoom = {},
    showcaseMedia = {},
    showSPLP = ""
  } = sellerDetails || {};

  let { sellerSubscriptions = [] } = props;
  orderMinimums = _.orderBy(orderMinimums, ["type"], ["desc"]);
  leadTimes = _.orderBy(leadTimes, ["type"], ["desc"]);
  let subscriptions = 3 - sellerSubscriptions.length;

  let leftTitle = "Sign up / Sign in to unlock access to product catalogs";
  let leftCopy =
    "Access to some product portfolios are restricted for viewing only by verified buyers in order to protect the seller and to ensure exclusivity to you as a buyer.";

  if (profileType === "BUYER" && verificationStatus === "IN_PROGRESS") {
    leftTitle = "Temporary access to restricted product catalogs";
    leftCopy = `Your account verification is in progress but you have temporary (48 hr) access to restricted catalogs of 3 suppliers, of which ${subscriptions}/3 is remaining.`;
  } else if (profileType === "BUYER" && verificationStatus === "ON_HOLD") {
    leftTitle = "Sorry, you cannot access this information!";
    leftCopy =
      "Your request for access has been put on hold. This could be due to missing / incorrect information. Please write to us at buyers@qalara.com to resolve the issue.";
  } else if (profileType === "BUYER" && verificationStatus === "REJECTED") {
    leftTitle = "Sorry, you cannot access this information!";
    leftCopy =
      "Your request for access has been rejected. This could be because your credentials did not meet our verification criteria. You can read more about it here (link). You may write to us at buyers@qalara.com to resolve the issue.";
  }

  const [visible, setVisible] = useState(false);
  const [showMoreModal, setShowMoreModal] = useState(false);
  const [type, setType] = useState("pdf");
  const [title, setTitle] = useState("");
  const [pdfValue, setPdfValue] = useState("");
  const [modalWidth, setModalWidth] = useState("750px");
  const [itemsToShow, setItemsToShow] = useState(2);
  const [videoType, setVideoType] = useState("");
  const [videoName, setVideoName] = useState("");
  let offerings = [showRoom, ...publicOfferings, ...privateOfferings];

  let { altName = "", seoTitle = "" } = showcaseMedia || {};

  const [showroomMediaUrl, setShowroomMediaUrl] = useState(
    props.data &&
      props.data.showRoom &&
      props.data.showRoom.catalogMedia &&
      props.data.showRoom.catalogMedia.media &&
      props.data.showRoom.catalogMedia.media.mediaUrl &&
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
        props.data.showRoom.catalogMedia.media.mediaUrl
  );

  const [showcaseMediaUrl, setShowcaseMediaUrl] = useState(
    props.data &&
      props.data.showcaseMedia &&
      props.data.showcaseMedia.media &&
      props.data.showcaseMedia.media.mediaUrl &&
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
        props.data.showcaseMedia.media.mediaUrl
  );

  useEffect(() => {
    setLogoUrl(
      props.data &&
        props.data.brandLogo &&
        props.data.brandLogo.media &&
        props.data.brandLogo.media.mediaUrl &&
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
          props.data.brandLogo.media.mediaUrl
    );
    setShowroomMediaUrl(
      props.data &&
        props.data.showRoom &&
        props.data.showRoom.catalogMedia &&
        props.data.showRoom.catalogMedia.media &&
        props.data.showRoom.catalogMedia.media.mediaUrl &&
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
          props.data.showRoom.catalogMedia.media.mediaUrl
    );
    setShowcaseMediaUrl(
      props.data &&
        props.data.showcaseMedia &&
        props.data.showcaseMedia.media &&
        props.data.showcaseMedia.media.mediaUrl &&
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
          props.data.showcaseMedia.media.mediaUrl
    );
    for (let orderDetails of orderMinimums) {
      if (orderDetails["smallBatches"]) {
        setSmallBatchAvailable(true);
      }
    }
    let productTypes = _.groupBy(props.productPopupDetails, "l2Desc");

    let values = [];
    for (let list in productTypes) {
      let obj = {};
      obj["productType"] = list;
      let pDetails = "";
      let l1Desc = "";
      for (let items of productTypes[list]) {
        let { productTypeDesc = "" } = items;
        l1Desc = items["l1Desc"];
        pDetails = pDetails + productTypeDesc + ", ";
      }
      let pName = pDetails.trim().slice(0, -1);
      obj["productName"] = pName;
      obj["l1Desc"] = l1Desc;
      values.push(obj);
    }
    setProductTypeDetails(values);
  }, [props]);

  const requestLeadTimes = () => {
    setTitle("Lead times");
    let column = [
      {
        title: "Order type",
        dataIndex: "orderType",
      },
      {
        title: "Production/Dispatch time",
        dataIndex: "productionTime",
      },
      {
        title: "TOTAL TIME = Production time + Shipping time",
        dataIndex: "totalTime",
      },
    ];
    setColumnsOLT(column);
    let data = [
      {
        key: "1",
        orderType:
          "Ready to ship - orders where inventory is readily available with sellers",
        productionTime: "5 days",
        totalTime: "15 days",
      },
      {
        key: "2",
        orderType:
          "Ready to make - custom orders where raw material is readily available for production and hence faster to make.",
        productionTime: "20 days",
        totalTime: "30 days",
      },
      {
        key: "3",
        orderType:
          "Made to order - custom orders where suppliers may need to procure raw material before starting  production and hence takes longer.",
        productionTime: "50 days",
        totalTime: "60 days",
      },
      {
        key: "4",
        orderType:
          "Design to order - custom orders which are designed as per buyer's specifications and hence involves time for design finalization and production.",
        productionTime: "70 days",
        totalTime: "80 days",
      },
    ];
    setDataSourceOLT(data);
    let dataOLT = [
      {
        key: "1",
        orderType:
          "Ready to ship - orders where inventory is readily available with sellers",
        productionTime: "5 days",
        euporeRegion: "25 days",
        eastCoastRegion: "35 days",
        westCoastRegin: "45 days",
      },
      {
        key: "2",
        orderType:
          "Ready to make - custom orders where raw material is readily available for production and hence faster to make.",
        productionTime: "20 days",
        euporeRegion: "40 days",
        eastCoastRegion: "50 days",
        westCoastRegin: "60 days",
      },
      {
        key: "3",
        orderType:
          "Made to order - custom orders where suppliers may need to procure raw material before starting  production and hence takes longer.",
        productionTime: "50 days",
        euporeRegion: "70 days",
        eastCoastRegion: "80 days",
        westCoastRegin: "90 days",
      },
      {
        key: "4",
        orderType:
          "Design to order - custom orders which are designed as per buyer's specifications and hence involves time for design finalization and production.",
        productionTime: "70 days",
        euporeRegion: "90 days",
        eastCoastRegion: "100 days",
        westCoastRegin: "110 days",
      },
    ];
    setDataSourceOLTS(dataOLT);
    setShowMoreModal(true);
  };

  const requestCategoryDetails = (type) => {
    setTitle(type);
    if (type === "Product types") {
      let column = [
        {
          title: "Category",
          dataIndex: "l1Desc",
        },
        {
          title: "Sub-category",
          dataIndex: "l2Desc",
        },
        {
          title: "Product type",
          dataIndex: "productTypeDesc",
        },
      ];
      setColumns(column);
    } else if (type === "Order minimum") {
      let column = [
        {
          title: "Category",
          dataIndex: "l1Desc",
        },
        {
          title: "Sub-category",
          dataIndex: "l2Desc",
        },
        {
          title: "Ready to make",
          dataIndex: "rtmRange",
        },
        {
          title: "Made to order",
          dataIndex: "mtoRange",
        },
        {
          title: "Design to order",
          dataIndex: "dtoRange",
        },
      ];
      setColumns(column);
    } else {
      let column = [
        {
          title: "Sub-category",
          dataIndex: "l2Desc",
          width: 150,
        },
        {
          title: "Materials",
          dataIndex: "keyMaterials",
          width: 150,
        },
        {
          title: "Methods",
          dataIndex: "keyMethods",
          width: 150,
        },
      ];
      setColumns(column);
    }

    let data = [];
    for (let [i, list] of productPopupDetails.entries()) {
      let obj = { ...list, key: i };
      data.push(obj);
    }

    let productionMethods = _.groupBy(productPopupDetails, "l2Desc");
    let keyMethods = [];
    for (let list in productionMethods) {
      let obj = {};
      obj["key"] = list;
      obj["l2Desc"] = list;
      let methods = [];
      let materials = [];
      for (let details of productionMethods[list]) {
        methods = _.concat(methods, details["keyMethods"]);
        materials = _.concat(materials, details["keyMaterials"]);
      }
      methods = methods.toString().split(",");
      materials = materials.toString().split(",");

      let trimmedMethods = _.map(methods, function (x) {
        return x.trim();
      });

      let trimmedMaterials = _.map(materials, function (x) {
        return x.trim();
      });
      obj["keyMethods"] = _.uniq(trimmedMethods).join(", ");
      obj["keyMaterials"] = _.uniq(trimmedMaterials).join(", ");
      keyMethods.push(obj);
    }
    setDataSource(data);
    setProductionKMM(keyMethods);
    setShowMoreModal(true);
  };

  const requestSellerAccess = () => {
    setRequestLoading(true);
    let data = { profileId: props.sellerId };
    fetch(
      process.env.REACT_APP_API_PROFILE_URL + "/profiles/my/subscriptions",
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          setRequestLoading(false);
        } else {
          throw res.statusText || "Error while sending e-mail.";
        }
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        setRequestLoading(false);
      });
  };

  const showPdfModal = (type, value = 0, name = "") => {
    setVisible(true);
    if (type === "pdf") {
      setPdfValue(value);
      setModalWidth("90%");
    } else if (type === "video" && value) {
      setVideoType(value);
      setVideoName(name);
      setModalWidth("750px");
    } else {
      setModalWidth("750px");
    }
    setType(type);
  };

  const showScheduleBenefits = () => {
    setShowScheduleBenefits(true);
  };

  const handleCancel = (status) => {
    setShowMoreModal(false);
    setPdfValue("");
    setVisible(false);
    setShowScheduleBenefits(false);
    setShowSchedulingSuccess(false);
    setShowScheduling(false);
  };

  const scheduleCall = () => {
    if (isAuthenticated) {
      setShowScheduleBenefits(false);
      setShowScheduling(true);
    } else {
      loginToApp({ currentPath: router.asPath.split("?")[0] });
    }
  };

  const onFinish = (
    values,
    selectedSlot,
    selectedDate,
    sellerStartTime,
    sellerEndTime
  ) => {
    let data = {
      registrants: [
        {
          profileType: props.userProfile.profileType,
          profileId: props.userProfile.profileId,
          timeZone: values.timezone,
          slotStart: selectedSlot.split(",")[3].split("-")[0].trim(),
          slotEnd: selectedSlot.split(",")[3].split("-")[1].trim(),
          slotDate: selectedDate,
          orgName: props.userProfile.orgName,
          country: props.userProfile.country,
        },
      ],
      presenters: [
        {
          profileType: "SELLER",
          profileId: props.sellerId,
          slotDate: sellerStartTime.split(" ")[0],
          slotStart: moment(sellerStartTime.split(" ")[1].toString(), [
            "HH:mm",
          ]).format("hh:mm A"),
          slotEnd: moment(sellerEndTime.split(" ")[1].toString(), [
            "HH:mm",
          ]).format("hh:mm A"),
          timeZone: "Asia/Kolkata",
          orgName: orgName,
          kcId: props.sellerIdentity,
          brandName: brandName,
        },
      ],
      appointmentType: "ONE_TO_ONE",
      dayOfTheWeek: selectedSlot.split(",")[0],
      timeZone: "Asia/Kolkata",
      slotStart: moment(sellerStartTime.split(" ")[1].toString(), [
        "HH:mm",
      ]).format("hh:mm A"),
      slotEnd: moment(sellerEndTime.split(" ")[1].toString(), ["HH:mm"]).format(
        "hh:mm A"
      ),
      slotDate: selectedDate,
    };
    fetch(process.env.REACT_APP_API_MEETING_URL + "/events/meeting ", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + keycloak.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          setSelectedSlot(selectedSlot);
          setShowScheduling(false);
          setShowSchedulingSuccess(true);
          props.getMeetingCount(props.userProfile.profileId, keycloak.token);
        } else {
          throw res.statusText || "Error while fetching user profile.";
        }
      })
      .catch((err) => {
        // console.log("Error ", err);
      });
  };

  const offeringDetails = offerings.map((item, i) => {
    let { displayMedia = {}, catalogMedia = {} } = item || {};
    let imageUrl =
      displayMedia &&
      displayMedia.media &&
      displayMedia.media.mediaUrl &&
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL + displayMedia.media.mediaUrl;

    let pdfFile = false;
    let { altName = "", seoTitle = "", media = {} } = catalogMedia;
    let mediaUrl = "";
    if (media && Object.keys(media).length) {
      mediaUrl = media["mediaUrl"];
    }
    if (
      (displayMedia &&
        displayMedia.media &&
        displayMedia.media.mediaType === "PDF") ||
      (displayMedia &&
        displayMedia.media &&
        displayMedia.media.mediaType === "IMAGE")
    ) {
      pdfFile = true;
    }
    if (imageUrl) {
      return (
        <div
          key={i}
          className="slider-slide qa-rel-pos qa-cursor"
          onClick={() => {
            if (item.isPublic || item.catalogMedia) {
              setPdfValue("");
              showPdfModal("pdf", i);
            }
          }}
        >
          <div
            className={`slider-image qa-rel-pos ${
              !mediaUrl ? "lock-img-section" : ""
            }`}
            style={{ backgroundImage: `url(${imageUrl})` }}
          ></div>
          {!mediaUrl && (
            <div className="lock-outline-sec">
              <Tooltip
                overlayClassName="qa-tooltip scp"
                placement="bottom"
                trigger="click"
                title="This catalog has restricted access. Sign up / Sign in to unlock access to product catalogs (for buyers only)."
              >
                <span className="qa-tc-f">
                  <span className="qa-va-m">
                    <Icon
                      component={lockOutline}
                      style={{ width: "20px", height: "25px" }}
                    />
                  </span>
                  <span className="qa-va-m qa-pad-1 qa-font-san">
                    Sign in to unlock access
                  </span>
                </span>
              </Tooltip>
            </div>
          )}
          <div
            className="qa-pad-1 qa-bg-dark-theme"
            style={{ minHeight: "82px" }}
          >
            <div
              className={
                pdfFile
                  ? "qa-disp-table-cell"
                  : "qa-disp-table-cell qa-disp-none"
              }
              style={{ paddingRight: "3px" }}
            >
              <Icon component={pdfOutline} style={{ width: "46px" }} />
            </div>
            <div className="qa-disp-table-cell">
              <div className="qa-tc-white qa-text-ellipsis">
                {item.title || altName}
              </div>
              <div className="qa-fs-13 qa-text-ellipsis">
                {item.desc || seoTitle}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (showroomMediaUrl) {
      return (
        <div
          key={i}
          onClick={() => {
            setPdfValue("");
            showPdfModal("video", showroomMediaUrl, altName);
          }}
        >
          <div className="qa-rel-pos">
            <div className="scp-video-container">
              <video
                id="qa-showroom-video"
                className="qa-showroom-video"
                src={showroomMediaUrl}
                preload="meta"
              ></video>
            </div>

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
                style={{ width: "132px", height: "131px" }}
              />
            </span>
          </div>
          <div
            className="qa-pad-2 qa-bg-dark-theme"
            style={{ minHeight: "82px" }}
          >
            <div className="qa-disp-tc" style={{ width: "80%" }}>
              <div className="qa-tc-white qa-text-ellipsis">{altName}</div>
              <div className="qa-fs-13 qa-text-ellipsis">{seoTitle}</div>
            </div>
          </div>
        </div>
      );
    }
  });

  const [selectedKey, setSelectedKey] = useState("seller-home");
  const handleClick = (e) => {
    setSelectedKey(e.key);
    let { sellerId = "" } = props;
    sellerId = sellerId.replace("SELLER::", "");
    if (e.key !== "seller-home") {
      router.push(
        "/seller/" + sellerId + "/" + encodeURIComponent("All Categories")
      );
    }
  };

  if (isLoading) {
    return (
      <Icon
        component={SCPLoader}
        style={{ width: "100%" }}
        className="scp-loader-icon"
      />
    );
  }

  return (
    <div
      id="seller-landing-desktop"
      className="seller-landing-container qa-font-san"
    >
      <div className="qa-rel-pos">
        <SellerBanner
          orgName={brandName || orgName}
          companyDescription={companyDescription}
          bannerImage={bannerImage}
          brandLogo={brandLogo}
          city={city}
          country={country}
          id="SELLER-LANDING"
        />
      </div>
      <div className="seller-org-section">
        <Row
          className="qa-border-bottom qa-mar-btm-1 qa-pad-btm-2"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Col
            xs={24}
            sm={24}
            md={15}
            lg={15}
            xl={15}
            style={{ paddingRight: "50px" }}
          >
            <div
              className="qa-txt-alg-cnt qa-full-width"
              style={{ display: "inline-block" }}
            >
              {logoUrl && (
                <div
                  className="qa-disp-tc qa-scp-logo"
                  style={{ paddingRight: "10px", marginBottom: "10px" }}
                >
                  <img src={logoUrl} height="26px" alt="Company logo" />
                </div>
              )}
              <div className="qa-disp-tc qa-scp-text qa-font-butler qa-fs-24 qa-mar-btm-1">
                <span className="qa-titlecase">
                  {brandName.toLowerCase() || orgName.toLowerCase()}
                </span>
              </div>
            </div>

            <div className="qa-text-2line banner-text-small qa-font-san qa-fs-12 qa-mar-btm-1">
              {companyDescription}
            </div>
            <div>
              {values.map((list, i) => {
                return (
                  <span
                    key={i}
                    className="qa-sm-color qa-titlecase qa-pad-rgt-1"
                  >
                    #{list.replace(/_/gi, "").toLowerCase()}
                  </span>
                );
              })}
            </div>
          </Col>

          <Col xs={24} sm={24} md={9} lg={9} xl={9}>
            {(city || country) && (
              <div className="banner-text-small qa-font-san qa-fs-12 qa-fw-b qa-mar-btm-1 qa-txt-alg-rgt">
                <Icon
                  component={locationIcon}
                  style={{ width: "9px", marginRight: "5px" }}
                />
                {city}
                {city && country && <span>, </span>} {country}
              </div>
            )}
            <div
              className="qa-txt-alg-rgt"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                className="qa-button button-contact-seller"
                onClick={() => {
                  showPdfModal("contact-seller");
                }}
              >
                Send Order Query
              </Button>

              <Button
                className="qa-button go-to-cart"
                onClick={() => {
                  router.push("/cart");
                }}
              >
                Go to cart
              </Button>
            </div>
          </Col>
        </Row>
        {showSPLP==true? (
            <Content>
              <Menu
                onClick={handleClick}
                mode="horizontal"
                selectedKeys={[selectedKey]}
                className="qa-navigation-tab"
              >
                <Menu.Item key="seller-home" className="qa-fw-b">
                  <div className="qa-txt-alg-cnt">
                    <Icon
                      className="menu-icons"
                      component={sellerProfileIcon}
                      style={{
                        width: "22px",
                        marginRight: "0px",
                        fill: "#191919",
                      }}
                    />
                    <div style={{ padding: "3px 0px" }}>Seller profile</div>
                  </div>
                </Menu.Item>
                <Menu.Item key="catalog">
                  <div className="qa-txt-alg-cnt">
                    <Icon
                      className="menu-icons"
                      component={productListingIcon}
                      style={{
                        width: "16px",
                        marginRight: "0px",
                        fill: "#979797",
                      }}
                    />
                    <div style={{ padding: "3px 0px" }}>Product listing</div>
                  </div>
                </Menu.Item>
              </Menu>
            </Content>
          ):null}
      </div>

      <div className="seller-container qa-mar-auto-40">
        <div className="seller-product-section qa-pad-24">
          <h3 className="qa-font-butler qa-mar-btm-2 qa-fs-but-22">
            Product range
          </h3>

          <Row className="qa-mar-btm-2">
            <Col
              className="qa-mar-btm-2 qa-rel-pos qa-bg-dark-theme"
              xs={24}
              sm={24}
              md={12}
              lg={12}
              xl={12}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="qa-bg-dark-theme qa-pad-2 qa-pad-btm-1">
                    <h4 className="qa-tc-white qa-uppercase">Product types</h4>
                    <div className="qa-fs-13">
                      <ul className="qa-mar-btm-0 qa-ul-p0">
                        {productTypeDetails.length > 0 &&
                          productTypeDetails
                            .slice(0, itemsToShow)
                            .map((list, i) => {
                              return (
                                <li key={i}>
                                  {list.productType} - {list.productName}
                                </li>
                              );
                            })}
                      </ul>
                      {productPopupDetails.length > 2 && (
                        <div
                          onClick={() =>
                            requestCategoryDetails("Product types")
                          }
                          className="qa-txt-alg-rgt button-show-more"
                        >
                          <MinusOutlined />
                          <MinusOutlined />
                          <MinusOutlined />
                          &nbsp;&nbsp;Show More
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="break-section"></div>
              <Row>
                <Col
                  style={{ backgroundColor: "#f2f0eb" }}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <div className="qa-pad-2 qa-pad-btm-1">
                    <h4 className="qa-tc-white qa-uppercase">Order minimum</h4>
                    <div className="qa-fs-13">
                      <ul className="qa-mar-btm-0 qa-ul-p0 qa-pad-btm-2">
                        {/* {orderMinimums.slice(0, itemsToShow).map((list, i) => {
                          return (
                            <li key={i}>
                              {list.type === "READY TO SHIP"
                                ? "Ready to ship"
                                : "Custom orders"}{" "}
                              - {list.value}
                              {list.type === "Custom Orders" &&
                                smallBatchAvailable && (
                                  <span
                                    onClick={() =>
                                      requestCategoryDetails("Order minimum")
                                    }
                                    className="qa-cursor qa-sm-color"
                                  >
                                    {" "}
                                    &nbsp; See minimum details
                                  </span>
                                )}
                            </li>
                          );
                        })} */}
                        <li>
                          Minimum Order Quantity (MOQ) is mentioned for each
                          product listed on Qalara.
                        </li>
                        <li>
                          For custom requirements, MOQ can vary based on the
                          designs.
                        </li>
                      </ul>
                    </div>
                    <div className="break-section"></div>
                    <h4 className="qa-tc-white qa-uppercase qa-pad-top-2">
                      Lead times
                    </h4>
                    <div className="qa-fs-13">
                      <ul className="qa-mar-btm-0 qa-ul-p0">
                        {leadTimes.slice(0, itemsToShow).map((list, i) => {
                          return (
                            <li key={i}>
                              {list.type === "READY TO SHIP"
                                ? "Ready to ship"
                                : "Custom orders"}{" "}
                              - {list.value}{" "}
                              {list.type === "Custom Orders" && (
                                <span
                                  onClick={requestLeadTimes}
                                  className="qa-cursor qa-sm-color"
                                >
                                  &nbsp;See lead time details
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={1}
                  lg={1}
                  xl={1}
                  style={{ backgroundColor: "#f9f7f2", marginBottom: "-80px" }}
                ></Col>
                <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                  <div className="qa-pad-2 qa-height-full qa-rel-pos qa-pad-btm-1">
                    <h4 className="qa-tc-white qa-uppercase">Production</h4>
                    <div className="qa-fs-013 qa-mar-btm-05">Key methods</div>
                    <div className="qa-fs-13 qa-mar-btm-2">
                      <ul className="qa-ul-p0">
                        {keyMethods.slice(0, 3).map((list, i) => {
                          return <li key={i}>{list}</li>;
                        })}
                      </ul>
                    </div>
                    <div className="qa-fs-013 qa-mar-btm-05">Key materials</div>
                    <div className="qa-fs-13">
                      <ul className="qa-mar-btm-0 qa-ul-p0">
                        {keyMaterials.slice(0, 3).map((list, i) => {
                          return <li key={i}>{list}</li>;
                        })}
                      </ul>
                    </div>
                    {keyMethods.length > 3 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          right: "20px",
                        }}
                        onClick={() => requestCategoryDetails("Production")}
                        className="qa-txt-alg-rgt button-show-more"
                      >
                        <MinusOutlined />
                        <MinusOutlined />
                        <MinusOutlined />
                        &nbsp;&nbsp;Show More
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>

            <Col
              className="qa-mar-btm-2 qa-rel-pos"
              xs={24}
              sm={24}
              md={1}
              lg={1}
              xl={1}
            ></Col>
            <Col
              className="qa-mar-btm-2 qa-rel-pos qa-bg-dark-theme"
              xs={24}
              sm={24}
              md={11}
              lg={11}
              xl={11}
            >
              <div>
                <div
                  className="qa-rel-pos qa-cursor"
                  onClick={() => {
                    setPdfValue("");
                    showPdfModal("video", showcaseMediaUrl, altName);
                  }}
                >
                  <video
                    id="qa-showcase-video"
                    className="qa-showcase-video"
                    src={showcaseMediaUrl}
                    preload="meta"
                    height="100%"
                    width="100%"
                  ></video>
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
                      style={{ width: "132px", height: "131px" }}
                    />
                  </span>
                </div>
                <div className="qa-pad-2">
                  <div
                    className={
                      mediaMatch?.matches ? "qa-mar-btm-1" : "scp-video-title"
                    }
                  >
                    <div className="qa-tc-white qa-text-ellipsis qa-uppercase qa-mar-btm-05">
                      {altName}
                    </div>
                    <div className="qa-fs-13 qa-text-3line">{seoTitle}</div>
                  </div>
                  <div
                    className={
                      mediaMatch?.matches ? "qa-mar-btm-1" : "scp-book-demo"
                    }
                  >
                    <Button
                      className={
                        props.userProfile == null ||
                        (props.userProfile && props.userProfile.profileType) ===
                          "BUYER"
                          ? "qa-button book-video-btn"
                          : "qa-seller-button"
                      }
                      onClick={() => {
                        showScheduleBenefits();
                      }}
                      style={{ height: "40px" }}
                      disabled={
                        props.userProfile &&
                        props.userProfile.verificationStatus == "ON_HOLD"
                      }
                    >
                      Book video demo
                    </Button>
                    {
                      props.userProfile &&
                      props.userProfile.verificationStatus == "ON_HOLD" ? (
                        <div
                          style={{ marginTop: "5px", textAlign: "center" }}
                          className={
                            props.userProfile == null ||
                            (props.userProfile &&
                              props.userProfile.profileType) == "BUYER"
                              ? "qa-fs-12 qa-font-san"
                              : "qa-seller-button"
                          }
                        >
                          <span
                            className="qa-font-san qa-fs-12"
                            style={{ color: "#33f2f2f" }}
                          >
                            You will be able to book video demos once your Buyer
                            account is verified.
                          </span>
                        </div>
                      ) : (
                        ""
                      )
                      // <div
                      //   style={{ marginTop: "5px" }}
                      //   className={
                      //     props.userProfile == null ||
                      //       (props.userProfile && props.userProfile.profileType) ==
                      //       "BUYER"
                      //       ? "qa-fs-12 qa-font-san qa-txt-alg-rgt"
                      //       : "qa-seller-button"
                      //   }
                      // >
                      //   <Tooltip
                      //     overlayClassName="qa-tooltip"
                      //     title={() => (
                      //       <div>
                      //         <div style={{ marginBottom: "10px" }}>
                      //           Qalara buyers can now book a VIDEO DEMO to
                      //           interact with sellers via real time video meetings
                      //           beaming directly from the seller’s facility/
                      //           office.
                      //       </div>
                      //         <div>
                      //           This will help you get to know the seller and
                      //           their product ranges closely and finalize your
                      //           order requirements.
                      //       </div>
                      //       </div>
                      //     )}
                      //   >
                      //     <span style={{ color: "#874439" }}>What's this?</span>
                      //   </Tooltip>
                      // </div>}
                    }
                  </div>
                  <div
                    className={
                      mediaMatch?.matches ? "qa-mar-btm-1" : "scp-question"
                    }
                  >
                    <Tooltip
                      className={
                        props.userProfile == null ||
                        (props.userProfile && props.userProfile.profileType) ==
                          "BUYER"
                          ? ""
                          : "qa-seller-button"
                      }
                      overlayClassName="qa-tooltip"
                      title={() => (
                        <div>
                          <div style={{ marginBottom: "10px" }}>
                            Qalara buyers can now book a VIDEO DEMO to interact
                            with sellers via real time video meetings beaming
                            directly from the seller’s facility/ office.
                          </div>
                          <div>
                            This will help you get to know the seller and their
                            product ranges closely and finalize your order
                            requirements.
                          </div>
                        </div>
                      )}
                    >
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {!(profileType === "BUYER" && verificationStatus === "VERIFIED") ? (
          <Row className="qa-pad-24 qa-pad-top-1">
            <Col
              className="qa-pad-rgt-1 qa-mar-btm-2"
              xs={24}
              sm={24}
              md={16}
              lg={16}
              xl={16}
            >
              <div className="qa-tc-white qa-fs-16">{leftTitle}</div>
              <div className="qa-fs-13">{leftCopy}</div>
            </Col>
            <Col
              className="qa-pad-lft-1 qa-mar-btm-2"
              xs={24}
              sm={24}
              md={8}
              lg={8}
              xl={8}
              style={{ lineHeight: "72px" }}
            >
              {profileType === "BUYER" &&
              verificationStatus === "IN_PROGRESS" ? (
                <Button
                  className="qa-button button-get-verified"
                  onClick={requestSellerAccess}
                  loading={requestLoading}
                  disabled={requestLoading}
                >
                  Request Access
                </Button>
              ) : (
                <Button
                  className="qa-button button-get-verified"
                  onClick={signIn}
                >
                  Sign in / Sign up
                </Button>
              )}
            </Col>
          </Row>
        ) : (
          <Row className="qa-pad-24 qa-pad-top-1">
            <Col
              className="qa-pad-rgt-1 qa-mar-btm-2"
              xs={24}
              sm={24}
              md={16}
              lg={16}
              xl={16}
            >
              <div className="qa-tc-white qa-fs-16">
                Explore product catalog(s) with curated collections
              </div>
              <div className="qa-fs-13">
                Glance through curated product collections showcasing the range
                of the seller's products and design capabilities, and some of
                the stories behind them.
              </div>
            </Col>
          </Row>
        )}

        <div style={{}}>
          <div className="seller-carousel-main">
            <Slider ref={(c) => (slider = c)} {...settings}>
              {offeringDetails}
            </Slider>
          </div>
          {((showroomMediaUrl && offerings.length > 3) ||
            offerings.length > 4) && (
            <div className="qa-txt-alg-cnt qa-mar-top-1">
              <Button className="qa-slick-button" onClick={(e) => previous(e)}>
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
              <Button className="qa-slick-button" onClick={(e) => next(e)}>
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
        </div>
      </div>

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

      {aboutCompany && (
        <div className="about-seller-section qa-disp-ib">
          <div
            dangerouslySetInnerHTML={{
              __html: aboutCompany,
            }}
          />
        </div>
      )}

      <div className="suggestion-block qa-disp-n">
        <div className="banner">
          <div className="banner-text">
            <div>
              <StarOutlined style={{ fontSize: "18px", marginRight: "5px" }} />
              <StarOutlined style={{ fontSize: "18px", marginRight: "5px" }} />
              <StarOutlined style={{ fontSize: "18px", marginRight: "5px" }} />
              <StarOutlined style={{ fontSize: "18px", marginRight: "5px" }} />
              <StarOutlined style={{ fontSize: "18px", marginRight: "5px" }} />
            </div>
            <div className="suggestion-text">
              Provide your <br></br>suggestion
            </div>
            <Button
              className="qa-button button-provide-feedback"
              onClick={() => {}}
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
      <Modal
        visible={showMoreModal}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "20px", background: "#f2f0eb" }}
        width={750}
        style={{ top: 5 }}
        className="product-category-modal qa-font-san"
      >
        <div className="qa-rel-pos qa-pad-2">
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

          {title === "Lead times" ? (
            <div>
              <h5 className="qa-tc-white qa-font-san qa-fs-20 qa-uppercase qa-pad-04">
                {title}
              </h5>
              <div className="qa-font-san qa-fs-14 qa-tc-white qa-uppercase qa-fw-sb qa-pad-04 qa-mar-btm-2">
                <div
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    verticalAlign: "middle",
                  }}
                >
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
                </div>
                <div style={{ display: "inline-block" }}>Shipped by air</div>
              </div>
              <div className="qa-pad-04 qa-mar-btm-1 qa-fs-13">
                <div
                  style={{
                    display: "inline-block",
                    width: "100px",
                    verticalAlign: "top",
                    fontWeight: "bold",
                    lineHeight: "120%",
                  }}
                >
                  Estimated shipping time
                </div>
                <div style={{ display: "inline-block" }}>
                  Max 10 days to anywhere in the world subject to compliance and
                  customs.
                </div>
              </div>

              <Table
                dataSource={dataSourceOLT}
                columns={columnsOLT}
                pagination={false}
                size="small"
                rowClassName="qa-fs-13"
                tableLayout="fixed"
              />
              <br></br>
              <div className="qa-font-san qa-fs-14 qa-tc-white qa-uppercase qa-fw-sb qa-pad-04 qa-mar-btm-2">
                <div
                  style={{
                    display: "inline-block",
                    marginRight: "8px",
                    verticalAlign: "middle",
                  }}
                >
                  <svg
                    width="34"
                    height="23"
                    viewBox="0 0 34 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.31731 21.8739C8.602 22.1218 8.98006 22.2582 9.38146 22.2582C9.78333 22.2582 10.1604 22.1218 10.4441 21.8749L10.5856 21.7517L12.7134 19.8974C12.7926 19.8279 12.8976 19.7896 13.0108 19.7896C13.1235 19.7896 13.229 19.8279 13.3092 19.8989L15.2467 21.5866C15.2472 21.5866 15.2472 21.5866 15.2477 21.5866L15.5781 21.8744C15.8633 22.1218 16.2403 22.2587 16.6427 22.2587C17.0436 22.2587 17.4207 22.1228 17.7069 21.8754L18.6036 21.0939C18.6137 21.0898 18.6223 21.0852 18.6335 21.0816L19.992 19.8984C20.0721 19.8284 20.1772 19.7901 20.2893 19.7901C20.402 19.7901 20.5076 19.8289 20.5882 19.8994L22.6171 21.6653L22.8581 21.8744C23.1428 22.1223 23.5204 22.2587 23.9218 22.2587C24.3242 22.2587 24.7017 22.1223 24.9854 21.8754L25.127 21.7522L26.9488 20.1642L27.035 20.0896L27.2543 19.8984C27.3344 19.8289 27.4395 19.7906 27.5516 19.7906C27.6648 19.7906 27.7698 19.8289 27.851 19.9L29.7885 21.5876L30.1194 21.8754C30.4041 22.1228 30.7827 22.2598 31.1841 22.2598C31.5855 22.2598 31.963 22.1238 32.2477 21.8764L33.3073 20.9523H31.7768L31.4824 21.2084C31.3231 21.3484 31.0445 21.3484 30.8857 21.2084L28.6158 19.2335C28.2895 18.9472 27.8221 18.8312 27.375 18.8742L30.7172 13.4467H27.2751L23.4772 7.62207H20.1813V5.56025H18.0509L13.1793 1.11921H8.94454V0H8.00776V1.11921H4.26269V5.56025V6.36883V13.4472H2.10445L4.05463 19.7829L2.41654 21.2099C2.41451 21.212 2.41349 21.2145 2.41095 21.2161C2.24857 21.3479 1.98063 21.3469 1.82382 21.2094L1.53 20.9534H0L1.05907 21.8764C1.34325 22.1238 1.72131 22.2608 2.12373 22.2608C2.52412 22.2608 2.90167 22.1248 3.18737 21.8774L4.24645 20.9534H4.24239L5.45319 19.8994C5.53236 19.8294 5.6374 19.7911 5.75006 19.7911C5.86272 19.7911 5.96827 19.8299 6.04895 19.9005L8.0783 21.6664L8.31731 21.8739ZM20.1797 8.56405H22.9703L24.1369 10.3539H21.8188V11.2969H24.7525L26.1003 13.3644H20.1797V8.56405ZM5.19845 2.06067H12.817L16.5067 5.42481H5.19845V2.06067ZM5.19845 6.50223H19.2435V13.2504H5.19845V6.50223ZM7.07758 19.4619L6.8137 19.2324C6.29051 18.7755 5.41412 18.7438 4.83409 19.1277L3.37564 14.3892H29.0329L25.5492 20.0487L24.2181 21.2089C24.0593 21.3474 23.7832 21.3464 23.6224 21.2079C23.6224 21.2074 23.6224 21.2074 23.6224 21.2069L23.4371 21.0459L21.6194 19.4609C21.6184 19.4614 21.6184 19.4619 21.6174 19.4619L21.3535 19.2324C20.7851 18.7362 19.7961 18.7346 19.2262 19.2304L18.3153 20.0242C18.3128 20.0231 18.3082 20.0221 18.3047 20.0201L16.9411 21.2079C16.7813 21.3479 16.5037 21.3479 16.3438 21.2079H16.3433L16.3225 21.19L15.3472 20.34L15.3467 20.3405L14.0744 19.233C13.5081 18.7367 12.5181 18.7341 11.9477 19.2304L9.67681 21.2089C9.51898 21.3474 9.24191 21.3464 9.08206 21.2079C9.08206 21.2074 9.08155 21.2074 9.08155 21.2069L8.89633 21.0459L7.07758 19.4609C7.0786 19.4614 7.07809 19.4619 7.07758 19.4619Z"
                      fill="#332F2F"
                    />
                  </svg>
                </div>
                <div style={{ display: "inline-block" }}>Shipped by sea</div>
              </div>
              <div className="qa-pad-04 qa-mar-btm-1 qa-fs-13">
                <div
                  style={{
                    display: "inline-block",
                    width: "100px",
                    verticalAlign: "top",
                    fontWeight: "bold",
                    lineHeight: "120%",
                  }}
                >
                  Estimated shipping time
                </div>
                <div style={{ display: "inline-block" }}>
                  20 days to Europe | 30 days to East Coast US | 40 days to West
                  Coast US
                </div>
              </div>
              <Table
                pagination={false}
                size="small"
                tableLayout="fixed"
                rowClassName="qa-fs-13"
                dataSource={dataSourceOLTS}
              >
                <Column
                  title="Order type"
                  dataIndex="orderType"
                  key="orderType"
                />
                <Column
                  title="Production/Dispatch time"
                  dataIndex="productionTime"
                  key="productionTime"
                />
                <ColumnGroup title="TOTAL TIME = Production time + Shipping time">
                  <Column
                    title="Europe"
                    dataIndex="euporeRegion"
                    key="euporeRegion"
                  />
                  <Column
                    title="East Coast Us"
                    dataIndex="eastCoastRegion"
                    key="eastCoastRegion"
                  />
                  <Column
                    title="West Coast Us"
                    dataIndex="westCoastRegin"
                    key="westCoastRegin"
                  />
                </ColumnGroup>
              </Table>
              <div className="qa-mar-top-1">
                <b>Disclaimers:</b>
              </div>
              <ul className="qa-fs-13 qa-pad-lft-1">
                <li>
                  These are generally specified lead times, and may occasionally
                  vary based on specific products or quantities
                </li>
                <li>
                  Shipping times may be impacted by customs and related
                  considerations in destination country.
                </li>
                <li>
                  Additional services like custom packaging etc. may involve
                  additional time.
                </li>
              </ul>
            </div>
          ) : (
            <div>
              <h5 className="qa-tc-white qa-font-san qa-fs-20 qa-uppercase qa-pad-04">
                {title}
              </h5>
              {title === "Production" ? (
                <Table
                  dataSource={productionKMM}
                  columns={columns}
                  pagination={false}
                  size="small"
                  rowClassName="qa-fs-13"
                  title={() => (
                    <span>
                      <span className="qa-tc-white qa-fw-sb">Seller: </span>
                      {orgName}
                    </span>
                  )}
                />
              ) : (
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                  size="small"
                  rowClassName="qa-fs-13"
                  title={() => (
                    <span>
                      <span className="qa-tc-white qa-fw-sb">Seller: </span>
                      {orgName}
                    </span>
                  )}
                />
              )}
              {title === "Order minimum" && (
                <div className="qa-fs-13">
                  <br></br>
                  <div>
                    Ready to make orders: Supplier has almost all the raw
                    material inventory available.
                    <br></br>Made to order: Orders involving minor customization
                    to an existing product line that a supplier has.
                    <br></br>Design to order: Orders where suppliers will
                    manufacture to a specific design and material composition
                    requested by the buyer.
                  </div>
                  <br></br>
                  <p>
                    *Please note that the above values may differ for
                    specialized products or high quantities. Exact details for
                    such orders will be communicated to you when the order
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
      <Modal
        visible={visible}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "0px" }}
        width={modalWidth}
        style={{ top: 5 }}
        className={
          type === "contact-seller"
            ? "scp seller-order-query catalog-modal qa-font-san"
            : "catalog-modal qa-font-san"
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

          {type === "pdf" ? (
            <div style={{ padding: "20px" }}>
              <h5 className="qa-tc-white qa-font-san qa-fs-20 qa-uppercase">
                {offerings &&
                  offerings.length > 0 &&
                  offerings[pdfValue] &&
                  offerings[pdfValue].title}
              </h5>
              <div className="scroll-wrapper">
                <div>
                  {offerings &&
                  offerings.length > 0 &&
                  offerings[pdfValue] &&
                  offerings[pdfValue].catalogMedia &&
                  offerings[pdfValue].catalogMedia.media &&
                  offerings[pdfValue].catalogMedia.media.mediaUrl &&
                  process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                    offerings[pdfValue].catalogMedia.media.mediaUrl ? 
                   (<DynamicPDFDocument
                      url={
                        offerings &&
                        offerings.length > 0 &&
                        offerings[pdfValue] &&
                        offerings[pdfValue].catalogMedia &&
                        offerings[pdfValue].catalogMedia.media &&
                        offerings[pdfValue].catalogMedia.media.mediaUrl &&
                        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                          offerings[pdfValue].catalogMedia.media.mediaUrl
                      }
                    />) : (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "80px",
                        fontFamily: "senregular",
                      }}
                    >
                      Catalog is not avaliable!
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {type === "video" ? (
                <div style={{ padding: "40px" }}>
                  <h5 className="qa-tc-white qa-font-san qa-fs-20 qa-uppercase">
                    {videoName}
                  </h5>
                  <video
                    id="showcaseMovie"
                    className="video-container"
                    src={videoType}
                    controls
                    autoPlay
                  ></video>
                </div>
              ) : (
                <SellerContact
                  initialValues={initialValues}
                  token={props.token}
                  sellerDetails={sellerDetails}
                  userId={props.userProfile && props.userProfile.profileId}
                  sendQueryCancel={sendQueryCancel}
                />
              )}
            </div>
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
        className="scp seller-order-query-submission"
      >
        <div id="send-query-success-modal">
          <div className="send-query-success-modal-content">
            <p className="send-query-success-modal-para1">Thank you!</p>
            <p className="send-query-success-modal-para2">
              We have received your order query and will revert within the next
              48 to 72 hours.
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
        visible={ScheduleBenefits}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={750}
        className="schedule-benefits-modal"
      >
        <div className="qa-rel-pos">
          <div
            onClick={handleCancel}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
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
        <Row>
          <Col xs={22} sm={22} md={22} lg={22} style={{ marginTop: "25px" }}>
            <span className="benefits-header qa-font-butler qa-fs-22 qa-fw-b">
              Introduction to Qalara Video demo
            </span>
          </Col>
        </Row>
        <Row justify="space-between" className="qa-mar-top-3">
          <Col xs={22} sm={22} md={21} lg={21} style={{ marginLeft: "50px" }}>
            <p
              className="qa-font-san qa-fs-14"
              style={{ lineHeight: "20px", color: "#332f2f", opacity: "80%" }}
            >
              {" "}
              The Qalara Video demo is a live video meeting that allows the
              buyer to have a one-on-one interaction with the seller. You can
              share your target product segments and the sellers can share their
              experience and achievements with similar product lines. This also
              helps you understand the production methods and materials better,
              and to know the story behind the product and the seller.
            </p>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: "16px" }}>
          <Col xs={22} sm={22} md={22} lg={22} style={{ marginLeft: "50px" }}>
            <span
              className="qa-font-san qa-fs-17 qa-fw-b"
              style={{ color: "#191919", letterSpacing: "0.2px" }}
            >
              Benefits
            </span>
          </Col>
        </Row>
        <Row
          justify="space-between"
          style={{ marginTop: "10px", marginLeft: "40px" }}
        >
          <Col xs={22} sm={22} md={22} lg={22}>
            <span
              className="qa-font-san qa-fs-14"
              style={{ lineHeight: "24px" }}
            >
              <ul>
                <li>
                  Check out the seller's product offering live and understand
                  the specifications and details
                </li>
                <li>
                  {" "}
                  Help supplier understand your design preferences and
                  expectations
                </li>
                <li>
                  Interact and build your customised requirements and finalize
                  pricing and other order details
                </li>
                <li>
                  You may even request a facility tour to get a first hand view
                  of behind the scenes operations
                </li>
              </ul>
            </span>
          </Col>
        </Row>
        {!isAuthenticated ? (
          <Row justify="space-between" className="qa-mar-top-3">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ textAlign: "center" }}
            >
              <span
                className="qa-fs-12 qa-font-san"
                style={{ color: "#332f2f", opacity: "80%" }}
              >
                You are not signed in. Please Sign in or Sign up as a Buyer to
                schedule a video demo
              </span>
            </Col>
          </Row>
        ) : (
          ""
        )}
        <Row justify="space-between" className="qa-mar-top-3">
          <Col xs={24} sm={24} md={24} lg={24} style={{ marginBottom: "32px" }}>
            <div className="button-div">
              <Button
                className="qa-button button-schedule"
                onClick={() => {
                  scheduleCall();
                }}
              >
                {isAuthenticated ? "Schedule video call" : "Sign in / Sign up"}
              </Button>
            </div>
            {!isAuthenticated ? (
              <span
                className="qa-font-san qa-fs-12"
                style={{ display: "flex", justifyContent: "center" }}
              >
                (Access for buyers only)
              </span>
            ) : (
              ""
            )}

            {isAuthenticated ? (
              <span
                className="qa-font-san qa-fs-12"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                If you're a buyer with exclusive Invite-only access, after
                scheduling the video demo please write to us at
                buyers@qalara.com from your official email address. This will
                help us confirm the video meeting and share updates with you.
              </span>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Modal>
      {scheduling ? (
        <ScheduleMeeting
          orgName={orgName}
          onFinish={onFinish}
          handleCancel={handleCancel}
        />
      ) : (
        ""
      )}
      <Modal
        visible={schedulingSuccess}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={1000}
        className="schedule-success-modal"
      >
        <div className="qa-rel-pos">
          <div
            onClick={handleCancel}
            style={{
              position: "absolute",
              right: "10px",
              top: "10px",
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
        <Row>
          <Col xs={22} sm={22} md={22} lg={22}>
            <span
              className="qa-font-san qa-fs-12 qa-fw-b"
              style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                textAlign: "center",
                marginLeft: "30%",
                marginRight: "20%",
                marginTop: "50px",
              }}
            >
              If you're a buyer with exclusive Invite-only access, after
              scheduling the video demo please write to us at
              buyers@qalara.com from your official email address. This will help
              us confirm the video meeting and share updates with you.
            </span>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <img
              className="qa-rel-pos image-container"
              style={{ height: "50px" }}
              src={process.env.PUBLIC_URL + "/tick.png"}
            />
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: "16px" }}>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <span
              className="qa-font-butler qa-fs-24 qa-fw-b"
              style={{
                color: "#191919",
                letterSpacing: "0.2px",
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              Video demo request submitted successfully
            </span>
          </Col>
        </Row>
        <Row
          justify="space-between"
          style={{ marginTop: "10px", marginBottom: "50px" }}
        >
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <p
              className="qa-font-san qa-fs-17"
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              Thank you for your interest for a live demo with {orgName} on{" "}
              {selectedSlot}.
            </p>
          </Col>
        </Row>
        <Row
          justify="space-between"
          style={{ marginTop: "10px", marginBottom: "50px" }}
        >
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <p
              className="qa-font-san qa-fs-17"
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Alert
                className="alert-info-top seller-timezone"
                type="info"
                description={
                  <p
                    className="alert-paragraph qa-fs-12 qa-font-san"
                    style={{ color: "#332f2f", opacity: "80%" }}
                  >
                    Your request has been successfuly submitted and we will get
                    back to you within the next 24-48 hours with a response from
                    the seller at your registered email address and in your
                    Qalara My Account section.
                  </p>
                }
              />
            </p>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile.userProfile,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
  };
};

export default connect(mapStateToProps, { getUserProfile, getMeetingCount })(
  SellerLandingDesktop
);
