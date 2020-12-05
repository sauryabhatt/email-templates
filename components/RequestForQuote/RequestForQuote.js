/** @format */

import React, { useState, useEffect } from "react";
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
  console.log("not authenticated");
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
    console.log("Upload event:", e);
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
                We have received your request for quote and will revert within
                the next 48 to 72 hours.
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

export default RequestForQuote;
