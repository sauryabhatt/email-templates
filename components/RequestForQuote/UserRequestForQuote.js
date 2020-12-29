/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useKeycloak } from "@react-keycloak/ssr";
import { loginToApp } from "../AuthWithKeycloak";
import {
  Button,
  Form,
  Select,
  Input,
  message,
  Upload,
  DatePicker,
  Checkbox,
  Modal,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SendQueryForm from "../SendQueryForm/SendQueryForm";

function RequestForQuote(props) {
  const { keycloak } = useKeycloak();
  const [visible, setVisible] = useState(false);
  const [inviteAccess, setInviteAccess] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);

  const { userProfile } = props.userProfile;

  let firstName = "";
  let orgName = "";
  let verificationStatus = "";
  let profileType = "";

  let requesterName = "";
  if (
    userProfile &&
    userProfile.firstName &&
    userProfile &&
    userProfile.lastName
  ) {
    requesterName = userProfile.firstName + " " + userProfile.lastName;
    firstName = userProfile.firstName;
    orgName = userProfile.orgName;
    verificationStatus = userProfile.verificationStatus;
    profileType = userProfile.profileType;
  }

  let values = {
    requesterName: requesterName,
    companyName: userProfile && userProfile.orgName,
    emailId: userProfile && userProfile.email,
    country: userProfile && userProfile.country,
    city: "",
    mobileNo: userProfile && userProfile.orgPhone,
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
    // setInviteAccess(false);
    window.location.href = "/";
  };

  const signIn = () => {
    loginToApp();
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div className="rfq-container">
      <div className="rfq-body-header">
        <h1>Request for quote</h1>
        <p>
          If you’re a buyer, we can help you source products from any lifestyle
          category! Share your requirements below and we will get back in 48
          hours!
        </p>
      </div>
      <div className="rfq-body">
        {/*<div className="bird-vector"></div>*/}
        <div className="rfq-info-form">
          {/*<span className="form-q">What would you like help sourcing from India?</span>*/}
          {userProfile && userProfile.orgName ? (
            <SendQueryForm
              hideHeader={true}
              sendQueryCancel={sendQueryCancel}
              token={keycloak.token}
              initialValues={values}
              userId={
                props.userProfile &&
                props.userProfile.userProfile &&
                props.userProfile.userProfile.profileId
              }
            />
          ) : null}
        </div>
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
                We have received your Sourcing Request, and will revert within
                the next 48-72 hours.
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
        <div className="rfq-why-us">
          <span className="heading">Why us?</span>
          <p className="paragraph-points">
            Zero commission (launch offer)
            <br />
            Over 20,000 products
            <br />
            Small buyer friendly terms
            <br />
            One-stop-shop across multiple suppliers
            <br />
            Digital secure payment on delivery
          </p>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    auth: state.auth,
    priceDetails: state.currencyConverter,
    meetingCount: state.userProfile.meetingCount,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
  };
};

export default connect(mapStateToProps, null)(RequestForQuote);
