/** @format */

import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Drawer,
  Tooltip,
  Row,
  Col,
  Alert,
  Modal,
  Menu,
} from "antd";
import ProductFacets from "../common/ProductFacets";
import BreadCrumb from "../common/BreadCrumb";
import ContentSection from "../common/ContentSection";
import SellerBanner from "../common/SellerBanner";
import SEOFooter from "../common/SEOFooter";
import _ from "lodash";
import Icon from "@ant-design/icons";
import { useSelector, connect } from "react-redux";
import ScheduleMeetingMobile from "../mobile/ScheduleMeetingMobile";
import { useKeycloak } from "@react-keycloak/ssr";
import SellerContact from "../SellerContact/SellerContact";
import { loginToApp } from "../AuthWithKeycloak";
import closeButton from "../../public/filestore/closeButton";
import { getUserProfile } from "../../store/actions";
import moment from "moment";
import SPLPLoaderMobile from "../../public/filestore/SPLPLoaderMobile";
import sellerProfileIcon from "../../public/filestore/sellerProfileIcon";
import productListingIcon from "../../public/filestore/productListingIcon";
import locationIcon from "../../public/filestore/locationIcon";
import {useRouter} from "next/router";
const { Content } = Layout;

function SellerProductListingMobile(props) {
  let productList = props.data;
  const router = useRouter();
  const [drawer, setDrawer] = useState(false);
  const [sellerModal, setSellerModal] = useState(false);
  const [ScheduleBenefits, setShowScheduleBenefits] = useState(false);
  const [scheduling, setShowScheduling] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.authenticated);
  const {keycloak} = useKeycloak();
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [schedulingSuccess, setShowSchedulingSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedKey, setSelectedKey] = useState("catalog");

  let {
    queryParams = {},
    getFilterData,
    loadMoreData,
    setCategoryName,
    category,
    sellerId = "",
    sellerDetails,
    userProfile = {},
    isLoading = true,
  } = props;

  let {
    slp_content = [],
    slp_count = 0,
    slp_facets = [],
    slp_categories = {},
  } = productList || {};

  let {
    brandLogo = {},
    bannerImage = {},
    brandName = "",
    orgName = "",
    companyDescription = "",
    city = "",
    country = "",
    categoryDescs = [],
    values = [],
    vanityId = "",
  } = sellerDetails || {};

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

  useEffect(() => {
    if (isAuthenticated) {
      props.getUserProfile(keycloak.token);
    }
  }, []);

  useEffect(() => {
    let queries = props.queryParams;
    for (let list in queries) {
      if (list === "f_categories") {
        if (queries[list]) {
          setCategoryName(queries[list]);
        }
      }
    }
  }, [props.queryParams]);

  const showDrawer = () => {
    let state = !drawer;
    setDrawer(state);
  };

  const onClose = () => {
    setDrawer(false);
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
  };

  const sendQueryCancel = (status) => {
    if (status === "success") {
      setSellerModal(false);
      setSuccessQueryVisible(true);
    } else {
      setSellerModal(false);
    }
  };

  const handleClick = (e) => {
    setSelectedKey(e.key);
    if (e.key !== "catalog") {
      router.push("/seller/" + vanityId);
    }
  };

  const showPdfModal = (type) => {
    setSellerModal(true);
  };

  const showScheduleBenefits = () => {
    setShowScheduleBenefits(true);
  };

  const handleCancel = (status) => {
    setSellerModal(false);
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
    // console.log(values);
    // console.log(selectedSlot);
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
        },
      ],
      presenters: [
        {
          profileType: "SELLER",
          profileId: sellerId,
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
    fetch(process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL + "/events/meeting ", {
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

  let sellerValues = "";

  for (let value of values) {
    let name = value.replace(/_/gi, "");
    name =
      "  " +
      "#" +
      name.toLowerCase().charAt(0).toUpperCase() +
      name.toLowerCase().slice(1);
    sellerValues = sellerValues + name + "  ";
  }

  if (isLoading) {
    return (
      <Icon
        component={SPLPLoaderMobile}
        style={{ width: "100%" }}
        className="scp-loader-icon"
      />
    );
  }

  return (
    <div>
      <Layout
        className="seller-listing-container"
        id="seller-product-listing-page"
        style={{ background: "#f9f7f2" }}
      >
        <Content>
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
          <div className="seller-org-section qa-txt-alg-cnt">
            <Row className="qa-border-bottom qa-mar-btm-1 qa-pad-btm-2">
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                xl={24}
                className="qa-mar-btm-15"
              >
                <div className="qa-scp-text qa-font-butler qa-fs-20 qa-mar-btm-1 qa-titlecase qa-lh">
                  {brandName.toLowerCase() || orgName.toLowerCase()}
                </div>

                <div className="qa-text-4line banner-text-small qa-font-san qa-fs-12 qa-mar-btm-1">
                  {companyDescription}
                </div>
                {(city || country) && (
                  <div className="banner-text-small qa-font-san qa-fs-12 qa-fw-b qa-mar-btm-1">
                    <Icon
                      component={locationIcon}
                      style={{ width: "9px", marginRight: "5px" }}
                    />
                    {city}
                    {city && country && <span>, </span>} {country}
                  </div>
                )}
                <div className="qa-scp-value qa-sm-color">{sellerValues}</div>
              </Col>

              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <div className="qa-txt-alg-cnt">
                  <div>
                    <Button
                      className="qa-button button-contact-seller"
                      onClick={() => {
                        showPdfModal("contact-seller");
                      }}
                    >
                      Send Order Query
                    </Button>
                  </div>
                  <div className="qa-mar-top-2">
                    <Button
                      className="qa-button go-to-cart"
                      onClick={() => {
                        router.push("/cart");
                      }}
                    >
                      Go to cart
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
            <Content>
              <Menu
                onClick={handleClick}
                mode="horizontal"
                selectedKeys={[selectedKey]}
                className="qa-navigation-tab"
              >
                <Menu.Item key="seller-home">
                  <div className="qa-txt-alg-cnt">
                    <Icon
                      component={sellerProfileIcon}
                      style={{
                        width: "22px",
                        marginRight: "0px",
                        fill: "#979797",
                      }}
                    />
                    <div style={{ padding: "3px 0px" }}>Seller profile</div>
                  </div>
                </Menu.Item>
                <Menu.Item key="catalog" className="qa-fw-b">
                  <div className="qa-txt-alg-cnt">
                    <Icon
                      component={productListingIcon}
                      style={{
                        width: "16px",
                        marginRight: "0px",

                        fill: "#191919",
                      }}
                    />
                    <div style={{ padding: "3px 0px" }}>Product listing</div>
                  </div>
                </Menu.Item>
              </Menu>
            </Content>
          </div>
        </Content>

        <Layout
          style={{
            background: "#f9f7f2",
            display: "block",
          }}
        >
          <BreadCrumb
            className="qa-pad-0-30"
            pageId="seller-product-listing"
            categoryName={category}
            vanityId={vanityId}
            brandName={brandName}
          />
          <div className="qa-pad-0-30">
            <Button className="qa-button slp-filters" onClick={showDrawer}>
              <div className="slp-filters-text">Filters</div>
            </Button>
            <Drawer
              placement="right"
              closable={false}
              width="100%"
              onClose={onClose}
              visible={drawer}
              className="mobile-slider-filter"
            >
              <Button className="button-back" type="link" onClick={onClose}>
                <svg
                  width="46"
                  height="45"
                  viewBox="0 0 46 45"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.8125"
                    width="45"
                    height="45"
                    rx="15"
                    fill="white"
                  />
                  <path
                    d="M23.3125 18L18.8125 22.5L23.3125 27"
                    stroke="#332F2F"
                    strokeWidth="2"
                  />
                  <path
                    d="M19.2617 22.5L28.2617 22.5"
                    stroke="#332F2F"
                    strokeWidth="2"
                  />
                </svg>
              </Button>
              <ProductFacets
                width="100%"
                id="mobile"
                getFilterData={getFilterData}
                setCategoryName={setCategoryName}
                queryParams={queryParams}
                onClose={onClose}
                facets={slp_facets}
                categories={slp_categories}
                sellerId={sellerId}
                pageId="seller-product-listing"
              />
            </Drawer>
          </div>
          <ContentSection
            pageId="seller-product-listing"
            isMobile={true}
            content={slp_content}
            count={slp_count}
            loadMoreData={loadMoreData}
            sellerId={sellerId}
          />
        </Layout>
        <Modal
          visible={sellerModal}
          footer={null}
          closable={false}
          onCancel={handleCancel}
          centered
          bodyStyle={{ padding: "0px" }}
          width={750}
          style={{ top: 5 }}
          className="seller-order-query catalog-modal"
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
            <div>
              <SellerContact
                initialValues={initialValues}
                token={props.token}
                sellerDetails={sellerDetails}
                sendQueryCancel={sendQueryCancel}
                userId={props.userProfile && props.userProfile.profileId}
              />
            </div>
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
          className="splp seller-order-query-submission"
        >
          <div id="send-query-success-modal">
            <div className="send-query-success-modal-content">
              <p className="send-query-success-modal-para1">Thank you!</p>
              <p className="send-query-success-modal-para2">
                We have received your order query and will revert within the
                next 48 to 72 hours.
              </p>
            </div>
              <Button
                className="send-query-success-modal-button"
                onClick={() => {
                  router.push("/")
                  successQueryCancel();
                }}
              >
                Back to home page
              </Button>
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
          className="schedule-benefits-modal schedule-benefits-mobile-modal"
        >
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
            />{" "}
          </div>
          <Row>
            <Col xs={22} sm={22} md={22} lg={22}>
              <span
                className="benefits-header qa-font-butler qa-fs-20 qa-fw-b"
                style={{ marginTop: "25px" }}
              >
                Introduction to Qalara Video demo
              </span>
            </Col>
          </Row>
          <Row justify="space-between" className="qa-mar-top-3">
            <Col xs={22} sm={22} md={22} lg={22} style={{ marginLeft: "30px" }}>
              <p
                className="qa-font-san qa-fs-14"
                style={{ lineHeight: "20px", color: "#332f2f", opacity: "80%" }}
              >
                The Qalara Video demo is a live video meeting that allows the
                buyer to have a one-on-one interaction with the seller. You can
                share your target product segments and the sellers can share
                their experience and achievements with similar product lines.
                This also helps you understand the production methods and
                materials better, and to know the story behind the product and
                the seller.
              </p>
            </Col>
          </Row>
          <Row justify="space-between" style={{ marginTop: "25px" }}>
            <Col xs={22} sm={22} md={22} lg={22}>
              <span
                className="benefits-header qa-font-san qa-fs-17 qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                Benefits
              </span>
            </Col>
          </Row>
          <Row justify="space-between" style={{ marginTop: "35px" }}>
            <Col xs={22} sm={22} md={22} lg={22}>
              <span className="qa-font-san qa-fs-14">
                <ul>
                  <li
                    style={{
                      lineHeight: "20px",
                      color: "#332f2f",
                      opacity: "80%",
                    }}
                  >
                    Check out the seller's product offering live and understand
                    the specifications and details
                  </li>
                  <li
                    style={{
                      lineHeight: "20px",
                      color: "#332f2f",
                      opacity: "80%",
                    }}
                  >
                    Help supplier understand your design preferences and
                    expectations
                  </li>
                  <li
                    style={{
                      lineHeight: "20px",
                      color: "#332f2f",
                      opacity: "80%",
                    }}
                  >
                    Interact and build your customised requirements and finalize
                    pricing and other order details
                  </li>
                  <li
                    style={{
                      lineHeight: "20px",
                      color: "#332f2f",
                      opacity: "80%",
                    }}
                  >
                    You may even request a facility tour to get a first hand
                    view of behind the scenes operations
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
            <Col xs={24} sm={24} md={24} lg={24}>
              <div className="button-div">
                <Button
                  className="qa-button button-schedule-mobile"
                  onClick={() => {
                    scheduleCall();
                  }}
                  style={{ marginBottom: "50px" }}
                >
                  {isAuthenticated
                    ? "Schedule video call"
                    : "Sign in / Sign up"}
                </Button>
              </div>
              {!isAuthenticated ? (
                <span
                  className="qa-font-san qa-fs-12"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "-45px",
                  }}
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
                    marginTop: "-45px",
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
          <ScheduleMeetingMobile
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
          className="schedule-benefits-modal schedule-benefits-mobile-modal"
        >
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
            />{" "}
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
                  marginTop: "25px",
                }}
              >
                If you're a buyer with exclusive Invite-only access, after
                scheduling the video demo please write to us at
                buyers@qalara.com from your official email address. This will
                help us confirm the video meeting and share updates with you.
              </span>
            </Col>
          </Row>
          <Row justify="space-between" className="qa-mar-top-3">
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ display: "flex", justifyContent: "center" }}
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
                className="qa-font-butler qa-fs-20 qa-fw-b"
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
            style={{ marginTop: "12px", marginBottom: "30px" }}
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
                  color: "#332f2f",
                  opacity: "80%",
                }}
              >
                Thank you for your interest for a live demo with {orgName} on{" "}
                {selectedSlot}
              </p>
            </Col>
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
                  color: "#332f2f",
                  opacity: "80%",
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
                      Your request has been successfuly submitted and we will
                      get back to you within the next 24-48 hours with a
                      response from the seller at your registered email address
                      and in your Qalara My Account section.
                    </p>
                  }
                />
              </p>
            </Col>
          </Row>
        </Modal>
      </Layout>
      <SEOFooter category={category} />
    </div>
  );
}

export default connect(null, { getUserProfile })(SellerProductListingMobile);
