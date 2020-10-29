/** @format */

import React, { useState, useEffect } from "react";
import { Layout, Button, Modal, Alert, Row, Col, Switch, Menu } from "antd";
import ProductFacets from "../common/ProductFacets";
import BreadCrumb from "../common/BreadCrumb";
import ContentSection from "../common/ContentSection";
import SortByFilter from "../common/SortByFilter";
import SEOFooter from "../common/SEOFooter";
import SellerBanner from "../common/SellerBanner";
import SellerContact from "../SellerContact/SellerContact";
import { loginToApp } from "../AuthWithKeycloak";
import ScheduleMeeting from "../ScheduleMeeting/ScheduleMeeting";
import { useSelector, connect } from "react-redux";
import closeButton from "../../public/filestore/closeButton";
import SPLPLoader from "../../public/filestore/SPLPLoader";
import Icon from "@ant-design/icons";
import { useKeycloak } from "@react-keycloak/ssr";
import moment from "moment";
import { useRouter } from "next/router";
import { getUserProfile } from "../../store/actions";
import sellerProfileIcon from "../../public/filestore/sellerProfileIcon";
import productListingIcon from "../../public/filestore/productListingIcon";
import locationIcon from "../../public/filestore/locationIcon";
import Link from "next/link";
const { Content } = Layout;

function SellerProductListingDesktop(props) {
  let productList = props.data;
  const router = useRouter();
  const [sellerModal, setSellerModal] = useState(false);
  const [ScheduleBenefits, setShowScheduleBenefits] = useState(false);
  const [scheduling, setShowScheduling] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.authenticated);
  const { keycloak } = useKeycloak();
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [schedulingSuccess, setShowSchedulingSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [logoUrl, setLogoUrl] = useState(
    props.sellerDetails &&
      props.sellerDetails.brandLogo &&
      props.sellerDetails.brandLogo.media &&
      props.sellerDetails.brandLogo.media.mediaUrl &&
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
        props.sellerDetails.brandLogo.media.mediaUrl
  );

  useEffect(() => {
    if (isAuthenticated) {
      props.getUserProfile(keycloak.token);
    }
  }, []);

  useEffect(() => {
    setLogoUrl(
      props.sellerDetails &&
        props.sellerDetails.brandLogo &&
        props.sellerDetails.brandLogo.media &&
        props.sellerDetails.brandLogo.media.mediaUrl &&
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
          props.sellerDetails.brandLogo.media.mediaUrl
    );
  }, [props]);

  const [selectedKey, setSelectedKey] = useState("catalog");

  let {
    queryParams = {},
    getFilterData,
    loadMoreData,
    setCategoryName,
    category,
    sellerId = "",
    sellerDetails = {},
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
    categoryDescs = [],
    values = [],
    country = "",
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

  const handleSortFilter = (value) => {
    let queryParam = queryParams;
    if (value === "createdTs") {
      queryParam = { ...queryParam, sort_order: "DESC", sort_by: "createdTs" };
    } else if (value === "minimumOrderQuantity") {
      queryParam = {
        ...queryParam,
        sort_order: "ASC",
        sort_by: "minimumOrderQuantity",
      };
    } else {
      queryParam = { ...queryParam, sort_order: "ASC", sort_by: value };
    }
    getFilterData(queryParam, "sort");
  };

  const showScheduleBenefits = () => {
    setShowScheduleBenefits(true);
  };
  const showSellerModal = () => {
    setSellerModal(true);
  };
  const handleCancel = (status) => {
    setSellerModal(false);
    setShowScheduleBenefits(false);
    setVisible(false);
    setShowSchedulingSuccess(false);
    setShowScheduling(false);
  };

  const scheduleCall = () => {
    if (isAuthenticated) {
      setShowScheduleBenefits(false);
      setShowScheduling(true);
    } else {
      // loginToApp({ currentPath: window.location.pathname });
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

  const sendQueryCancel = (status) => {
    if (status === "success") {
      setVisible(false);
      setSellerModal(false);
      setSuccessQueryVisible(true);
    } else {
      setVisible(false);
      setSellerModal(false);
    }
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
  };

  const handleClick = (e) => {
    setSelectedKey(e.key);
    if (e.key !== "catalog") {
      router.push("/seller/" + vanityId);
    }
  };
  if (isLoading) {
    return (
      <Icon
        component={SPLPLoader}
        style={{ width: "100%" }}
        className="scp-loader-icon"
      />
    );
  }

  return (
    <div>
      <Layout
        id="seller-product-listing-page"
        className="seller-listing-container"
        style={{ background: "#f9f7f2" }}
      >
        <Content>
          <div className="qa-rel-pos">
            <SellerBanner
              orgName={brandName}
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
                      showSellerModal("contact-seller");
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
                      className="menu-icons"
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
                      className="menu-icons"
                      component={productListingIcon}
                      fill="red"
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
        <Content className="qa-max-width" style={{ marginTop: "2px" }}>
          <Row className="qa-pad-0-30">
            <Col span={18}>
              <BreadCrumb
                pageId="seller-product-listing"
                categoryName={category}
                vanityId={vanityId}
                brandName={brandName}
              />
            </Col>
            <Col span={6} className="qa-txt-alg-rgt qa-mar-top-3">
              <SortByFilter handleSortFilter={handleSortFilter} id="SPLP" />
            </Col>
          </Row>
        </Content>
        <Layout style={{ background: "#f9f7f2" }} className="qa-max-width">
          <ProductFacets
            getFilterData={getFilterData}
            queryParams={queryParams}
            facets={slp_facets}
            setCategoryName={setCategoryName}
            categories={slp_categories}
            sellerId={sellerId}
          />
          <Layout style={{ background: "#f9f7f2" }}>
            <ContentSection
              pageId="seller-product-listing"
              content={slp_content}
              count={slp_count}
              loadMoreData={loadMoreData}
              sellerId={sellerId}
            />
          </Layout>
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
          className="splp seller-order-query-submission catalog-modal"
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
                share your target product segments and the sellers can share
                their experience and achievements with similar product lines.
                This also helps you understand the production methods and
                materials better, and to know the story behind the product and
                the seller.
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
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ marginBottom: "32px" }}
            >
              <div className="button-div">
                <Button
                  className="qa-button button-schedule"
                  onClick={() => {
                    scheduleCall();
                  }}
                >
                  {isAuthenticated ? "Schedule video call" : "Sign in/Sign up"}
                </Button>
              </div>
              {!isAuthenticated ? (
                <span
                  className="qa-font-san qa-fs-12"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  (Only for buyer)
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

export default connect(null, { getUserProfile })(SellerProductListingDesktop);
