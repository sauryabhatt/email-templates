/** @format */

import React, { useState } from "react";
import { loginToApp } from "../AuthWithKeycloak";
import { Button, Modal } from "antd";
import SendQueryForm from "../SendQueryForm/SendQueryForm";

function RequestForQuote(props) {
  const [visible, setVisible] = useState(false);
  const [inviteAccess, setInviteAccess] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);

  let values = {
    requesterName: "",
    companyName: "",
    emailId: "",
    country: "",
    city: "",
    mobileNo: "",
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
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <div className="rfq-container">
      <div className="rfq-signIn-header">
        <p>
          Creating an RFQ will be faster and easier as a signed-in user. Please
          click here to&nbsp;
          <span onClick={signIn}>SIGN IN</span>
        </p>
      </div>
      <div className="rfq-body-header">
        <h1>Help me source</h1>
        <p>
          We can help you source products from any lifestyle category in India
          and South Asia!
        </p>
      </div>
      <div className="rfq-body">
        {/*<div className="bird-vector"></div>*/}
        <div className="rfq-info-form">
          {/*<span className="form-q">What would you like help sourcing from India?</span>*/}
          <SendQueryForm
            hideHeader={true}
            sendQueryCancel={sendQueryCancel}
            token={process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN}
            initialValues={values}
          />
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
                We have received your Sourcing request, and will revert within
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
            25,000+ products from verified suppliers
            <br />
            Air and Sea delivery to 100+ countries
            <br />
            Secure payments in major global currencies
            <br />
            We quality inspect all goods before dispatch
            <br />
            One-stop-shop from design to delivery
            <br />
            Zero commission promotional offer
          </p>
        </div>
      </div>
    </div>
  );
}

export default RequestForQuote;
