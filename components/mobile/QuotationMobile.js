/** @format */

import React, { useState, useEffect } from "react";
import { Row, Col, Menu, Button, Modal } from "antd";
import QuotationcardMobile from "./QuotationcardMobile";
import { useKeycloak } from "@react-keycloak/ssr";
import { getQuoteByStatus, getRfqByStatus } from "../../store/actions";
import { connect } from "react-redux";
import moment from "moment";
import { useRouter } from "next/router";
import Icon, { LoadingOutlined } from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import SendQueryForm from "../SendQueryForm/SendQueryForm";

const QuotationMobile = (props) => {
  const [current, setCurrent] = useState("received");
  const { keycloak } = useKeycloak();
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  let requesterName = "";
  if (
    props.userProfile &&
    props.userProfile.firstName &&
    props.userProfile &&
    props.userProfile.lastName
  ) {
    requesterName =
      props.userProfile.firstName + " " + props.userProfile.lastName;
  }

  let values = {
    profileId: props.userProfile && props.userProfile.profileId,
    profileType: props.userProfile && props.userProfile.profileType,
    category: "",
    requirementDetails: "",
    upload: {},
    quantity: "",
    pricePerItem: "",
    deliveryDate: "",
    requesterName: requesterName,
    companyName: props.userProfile && props.userProfile.orgName,
    emailId: props.userProfile && props.userProfile.email,
    country: props.userProfile && props.userProfile.country,
    city: "",
    mobileNo: props.userProfile && props.userProfile.orgPhone,
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

  const handleClick = (e) => {
    setShowLoader(true);
    setCurrent(e.key);
    let { profileId = "" } = props.userProfile || {};
    if (e.key == "requested" && profileId) {
      props.getRfqByStatus(e.key, keycloak.token, profileId.split("::")[1]);
    } else {
      getQuotationByStatus(e.key);
    }
  };

  const mappedStaus = {
    received: "QUOTED,ACCEPTED",
    requested: "ASSIGNED",
    closed: "CANCELLED,CLOSED",
  };

  useEffect(() => {
    setShowLoader(true);
    getQuotationByStatus(current);
  }, []);

  useEffect(() => {
    setShowLoader(false);
  }, [props.quotes, props.brandNameList]);

  const getQuotationByStatus = (status) => {
    props.getQuoteByStatus(
      keycloak.token,
      mappedStaus[status],
      status,
      props.userProfile.profileId.split("::")[1]
    );
  };

  if (showLoader) {
    return (
      <div className="qa-loader-middle">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </div>
    );
  }

  const quotaionCard = props.quotes.map((quote, i) => {
    let date = null;
    let day = null;
    let quoteCreatedDate = null;
    if (current == "requested") {
      date = moment(quote.creationDate).format("MMM YYYY");
      day = moment(quote.creationDate).format("DD");
      quoteCreatedDate = moment(quote.creationDate).format("DD/MM/YYYY");
    } else {
      date = moment(quote.quoteCreatedTimeStamp).format("MMM YYYY");
      day = moment(quote.quoteCreatedTimeStamp).format("DD");
      quoteCreatedDate = moment(quote.quoteCreatedTimeStamp).format(
        "DD/MM/YYYY"
      );
    }

    return (
      <QuotationcardMobile
        status={current}
        data={quote}
        formattedDate={date}
        day={day}
        quoteCreatedDate={quoteCreatedDate}
        brandNames={props.brandNameList}
      />
    );
  });

  const redirectToFaq = () => {
    router.push("/FAQforwholesalebuyers");
  };
  return (
    <React.Fragment>
      <Col xs={24} sm={24} md={24} lg={0}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={0}>
            <div style={{ textAlign: "right" }}>
              <span
                className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                style={{ lineHeight: "17px", cursor: "poinrer" }}
                onClick={redirectToFaq}
              >
                BUYERS’ FAQs{" "}
              </span>
              <span
                className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                style={{ lineHeight: "17px" }}
              >
                {" "}
                |{" "}
              </span>
              <span
                className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                style={{ lineHeight: "17px", cursor: "poinrer" }}
                onClick={redirectToFaq}
              >
                {" "}
                ORDER T&C{" "}
              </span>
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={24} lg={0}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={0}>
            <div className="form-top">
              <p
                className="form-heading"
                className="qa-fs-24 qa-font-san qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                QUOTATIONS
              </p>
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={22} lg={22} className="quote-menu">
        <Row>
          <Col xs={24} sm={24} md={24} lg={0}>
            <Menu
              onClick={handleClick}
              selectedKeys={[current]}
              mode="horizontal"
            >
              <Menu.Item key="received">
                <span
                  className="qa-fs-14 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  RECEIVED
                </span>
              </Menu.Item>
              <Menu.Item key="requested">
                <span
                  className="qa-fs-14 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  REQUESTED
                </span>
              </Menu.Item>
              <Menu.Item key="closed">
                <span
                  className="qa-fs-14 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  CLOSED
                </span>
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Col>
      {current == "received" || current == "closed" ? (
        <Col xs={24} sm={24} md={24} lg={0} style={{ marginTop: "23px" }}>
          <span
            className="qa-fs-10 qa-font-san"
            style={{ color: "#191919", lineHeight: "12px" }}
          >
            *Quote is applicable till 30 days from the day the quote was shared
          </span>
        </Col>
      ) : (
        ""
      )}
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={0}
        className="quote-menu"
        style={{ marginTop: "32px" }}
      >
        {props.quotes.length > 0 ? (
          quotaionCard
        ) : (
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={{ backgroundColor: "#F2F0EB" }}
          >
            <Row
              style={{
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "20px",
                paddingBottom: "15px",
              }}
            >
              {current == "received" ? (
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-font-butler qa-fs-20"
                    style={{ color: "#191919" }}
                  >
                    No active quotation to display!
                  </span>
                </Col>
              ) : (
                ""
              )}
              {current == "requested" ? (
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-font-butler qa-fs-20"
                    style={{ color: "#191919" }}
                  >
                    No active request to display!
                  </span>
                </Col>
              ) : (
                ""
              )}
              {current == "closed" ? (
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-font-butler qa-fs-20"
                    style={{ color: "#191919" }}
                  >
                    No past request to display!
                  </span>
                </Col>
              ) : (
                ""
              )}
              {current == "received" ? (
                <Col xs={24} sm={24} md={24} lg={24} className="qa-mar-top-1">
                  <span className="qa-font-san qa-fs-14 qa-tc-white">
                    You currently do have any active Quotations to display. You
                    can get started by sharing a 'Request for Quote' by clicking
                    below.
                  </span>
                </Col>
              ) : (
                ""
              )}
              {current == "requested" ? (
                <Col xs={24} sm={24} md={24} lg={24} className="qa-mar-top-1">
                  <span className="qa-font-san qa-fs-14 qa-tc-white">
                    You currently do have any active request for a quote to
                    display. You can get started by sharing a 'Request for
                    Quote' by clicking below.
                  </span>
                </Col>
              ) : (
                ""
              )}
              {current == "closed" ? (
                <Col xs={24} sm={24} md={24} lg={24} className="qa-mar-top-1">
                  <span className="qa-font-san qa-fs-14 qa-tc-white">
                    You currently do have any past quotations to display. You
                    can get started by sharing a 'Request for Quote' by clicking
                    below.
                  </span>
                </Col>
              ) : (
                ""
              )}
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                style={{ marginTop: "40px", marginBottom: "40px" }}
                className="quote-rfq"
              >
                <Button
                  className="qa-button quote-contact-seller-mob"
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  <span className="qa-font-san qa-fw-b qa-fs-14">
                    REQUEST FOR QUOTE
                  </span>
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Col>
      <Modal
        visible={visible}
        footer={null}
        closable={false}
        onCancel={sendQueryCancel}
        style={{ top: 5 }}
        bodyStyle={{ padding: "0" }}
        className="rfq-submit-modal"
        // width={props.buyerDetails || props.sellerDetails ? 775 : 550}
        className="rfq-submit-modal"
      >
        <div>
          <div
            onClick={sendQueryCancel}
            style={{
              position: "absolute",
              right: "20px",
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
          <SendQueryForm
            sendQueryCancel={sendQueryCancel}
            token={keycloak.token}
            initialValues={values}
            userId={props.userProfile && props.userProfile.profileId}
          />
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
        className="rfq-submission-modal"
      >
        <div id="send-query-success-modal">
          <div className="send-query-success-modal-content">
            <p className="send-query-success-modal-para1">Thank you!</p>
            <p className="send-query-success-modal-para2">
              We are excited to serve you and will revert within 24 hrs.
            </p>
          </div>
          <Button
            className="send-query-success-modal-button"
            onClick={() => {
              successQueryCancel();
            }}
          >
            Back to home page
          </Button>
        </div>
      </Modal>
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  return {
    quotes: state.userProfile.quotes,
    brandNameList: state.userProfile.brandNameList,
    userProfile: state.userProfile.userProfile,
  };
};
export default connect(mapStateToProps, { getQuoteByStatus, getRfqByStatus })(
  QuotationMobile
);
