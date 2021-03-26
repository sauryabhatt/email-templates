/** @format */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Row, Col, Menu, Button, Modal } from "antd";
import QuotationCard from "./QuotationCard";
import { useKeycloak } from "@react-keycloak/ssr";
import { getQuoteByStatus, getRfqByStatus } from "../../store/actions";
import { connect } from "react-redux";
import moment from "moment";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import SendQueryForm from "../SendQueryForm/SendQueryForm";
import Icon from "@ant-design/icons";

const Quotations = (props) => {
  console.log("props",props)
  const router = useRouter();
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const [current, setCurrent] = useState("received");
  const { keycloak } = useKeycloak();
  const [showLoader, setShowLoader] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lineSheetRes, setLineSheetRes ] = useState([])

  const mergedlineSheetRes = [...lineSheetRes,...props.quotes]
  console.log("props.userProfile",props.userProfile)

  // let buyer_id = props.userProfile.profileId.replace("BUYER::","");

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

 const getRfq = () => {
  // let url = `https://api-dev.qalara.com:2095/forms/queries/status?buyer_id=${buyer_id}&status=LINKED_PARTIAL`
  let url = `https://api-dev.qalara.com:2095/forms/queries/status?buyer_id=BU10160&status=LINKED_PARTIAL`

  fetch(url , {
      method:"GET",
      headers: {
        "Authorization": "Bearer " + keycloak.token,
        "Content-Type": "application/json"
      },   
    }).then(res => {
      console.log("res",res)
      if(res.ok){
        return res.json()
      }
    }).then(res => {
      // console.log("merge",res.props.quote);
      console.log("resBody",res)
      setLineSheetRes(res);
    })
 }
  useEffect(()=>{
    if(keycloak?.token){
      getRfq();
    }
  },[keycloak.token,props.quote])

  const downloadBuyerAgreement = () => {
    var a = document.createElement("a");
    a.href = process.env.NEXT_PUBLIC_REACT_APP_BUYER_AGREEMENT_URL;
    a.setAttribute("download", "Buyer-agreement");
    a.setAttribute("target", "_blank");
    a.click();
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
    if (props.userProfile) {
      setShowLoader(true);
      getQuotationByStatus(current);
    }
  }, [props.userProfile]);

  useEffect(() => {
    setShowLoader(false);
  }, [props.brandNameList]);

  const getQuotationByStatus = (status) => {
    props.getQuoteByStatus(
      keycloak.token,
      mappedStaus[status],
      status,
      props.userProfile.profileId.split("::")[1]
    );
  };

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
      <QuotationCard
        status={current}
        lineSheetRes={mergedlineSheetRes}
        data={quote}
        // data={mergedlineSheetRes}
        formattedDate={date}
        day={day}
        quoteCreatedDate={quoteCreatedDate}
        brandNames={props.brandNameList}
        key={`quotation-card-${i}`}
      />
    );
  });

  const redirectToFaq = () => {
    router.push("/FAQforwholesalebuyers");
  };

  if (showLoader) {
    return (
      <div className="qa-loader-middle">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </div>
    );
  }

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

  return (
    <React.Fragment>
      <Col xs={24} sm={24} md={22} lg={22}>
        <Row justify="space-around">
          <Col xs={22} sm={22} md={11} lg={11}>
            <div className="form-top">
              <p
                className="form-heading"
                className="qa-fs-22 qa-font-san qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                MY QUOTATIONS
              </p>
            </div>
          </Col>
          <Col xs={22} sm={22} md={11} lg={11}>
            <div style={{ textAlign: "right" }}>
              <Link href="/FAQforwholesalebuyers">
                <a target="_blank">
                  <span
                    style={{ lineHeight: "17px", cursor: "pointer" }}
                    className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                  >
                    BUYERS’ FAQs
                  </span>
                </a>
              </Link>
              <span
                className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                style={{ lineHeight: "17px" }}
              >
                {" "}
                |{" "}
              </span>
              <span
                className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                style={{ lineHeight: "17px", cursor: "pointer" }}
                onClick={downloadBuyerAgreement}
              >
                {" "}
                ORDER T&C{" "}
              </span>
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={22} lg={22} className="quote-menu">
        <Row>
          <Col xs={24} sm={24} md={18} lg={18}>
            <Menu
              onClick={handleClick}
              selectedKeys={[current]}
              mode="horizontal"
            >
              <Menu.Item key="received">
                <span
                  className="qa-fs-16 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  RECEIVED
                </span>
              </Menu.Item>
              <Menu.Item key="requested">
                <span
                  className="qa-fs-16 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  REQUESTED
                </span>
              </Menu.Item>
              <Menu.Item key="closed">
                <span
                  className="qa-fs-16 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  CLOSED
                </span>
              </Menu.Item>
            </Menu>
          </Col>
          {mediaMatch.matches ? (
            <Col
              xs={22}
              sm={22}
              md={6}
              lg={6}
              style={{ borderBottom: "0.5px solid #C4C4C4" }}
              className="qa-vertical-center"
            >
              <div
                style={{
                  textAlign: "left",
                  textAlignLast: "left",
                  lineHeight: "12px",
                }}
              >
                {current == "received" || current == "closed" ? (
                  <span
                    className="qa-font-san qa-fs-10"
                    style={{ color: "#191919" }}
                  >
                    *Quote is applicable till 30 days from the day the quote was
                    shared
                  </span>
                ) : (
                  ""
                )}
              </div>
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Col>
      <Col
        xs={22}
        sm={22}
        md={22}
        lg={22}
        className="quote-menu"
        style={{ marginTop: "50px" }}
      >
        {props.isQuoteAvailable && props.quotes.length > 0 ? quotaionCard : ""}
        {props.isQuoteAvailable && props.quotes.length == 0 ? (
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
                    className="qa-font-butler qa-fs-30"
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
                    className="qa-font-butler qa-fs-30"
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
                    className="qa-font-butler qa-fs-30"
                    style={{ color: "#191919" }}
                  >
                    No past request to display!
                  </span>
                </Col>
              ) : (
                ""
              )}
              <Col xs={17} sm={17} md={17} lg={17}>
                {current == "received" ? (
                  <span className="qa-font-san qa-fs-17 qa-tc-white">
                    You currently do have any active Quotations to display. You
                    can get started by sharing a 'Request for Quote' by clicking
                    below.
                  </span>
                ) : (
                  ""
                )}

                {current == "requested" ? (
                  <span className="qa-font-san qa-fs-17 qa-tc-white">
                    You currently do have any active request for a quote to
                    display. You can get started by sharing a 'Request for
                    Quote' by clicking below.
                  </span>
                ) : (
                  ""
                )}

                {current == "closed" ? (
                  <span className="qa-font-san qa-fs-17 qa-tc-white">
                    You currently do have any past quotations to display. You
                    can get started by sharing a 'Request for Quote' by clicking
                    below.
                  </span>
                ) : (
                  ""
                )}
              </Col>
              <Col xs={7} sm={7} md={7} lg={7}></Col>
              <Col
                xs={10}
                sm={10}
                md={10}
                lg={10}
                style={{ marginTop: "40px" }}
                className="quote-rfq"
              >
                <Button
                  className="qa-button quote-contact-seller"
                  onClick={() => {
                    setVisible(true);
                  }}
                >
                  <span className="qa-font-san qa-fw-b qa-fs-12">
                    REQUEST FOR QUOTE
                  </span>
                </Button>
              </Col>

              {/* <Col xs={24} sm={24} md={24} lg={24}>
                                <Button
                                    className="send-query-button"
                                    onClick={() => {
                                        setVisible(true);
                                    }}
                                >
                                    <div className="send-query-button-text qa-rfq-button">
                                        Request for Quote
                                 </div>
                                </Button>
                            </Col> */}
            </Row>
          </Col>
        ) : (
          ""
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
              We are excited to serve you and will revert within 24-48 hrs.
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
    isQuoteAvailable: state.userProfile.isQuoteAvailable,
  };
};
export default connect(mapStateToProps, { getQuoteByStatus, getRfqByStatus })(
  Quotations
);
