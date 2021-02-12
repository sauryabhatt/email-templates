/** @format */

import React, { useState } from "react";
import Icon, { CheckCircleOutlined } from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import { getCountries } from "react-phone-number-input/input";
import { Button, Row, Col, Form, Select } from "antd";
import en from "react-phone-number-input/locale/en.json";

const { Option } = Select;

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

const ServiceabilityCheck = (props) => {
  let {
    hidePincodeModal = "",
    uCountry = "",
    setNonServiceable,
    setNonServiceableCountry,
    setPincodeModal,
    setUCountry,
    modalType = "",
    nonServiceable = "",
    productDetails = {},
  } = props;

  let { deliveryExclusions = [] } = productDetails || {};
  const [form] = Form.useForm();

  const [pincodeSuccess, setPincodeSuccess] = useState(false);

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
      setUCountry(country);
      setPincodeSuccess(true);
      sessionStorage.setItem("destinationCountry", country);
    }
  };

  return (
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
          ? "Sample availability"
          : "Check serviceability"}
      </div>
      {modalType === "sample-delivery" ? (
        <div>
          <div className="p-title">
            Sample delivery may be available for this product, but is subject to
            supplier's confirmation.
          </div>
          <div className="p-s-title">
            Estimated sample cost:{" "}
            <span className="p-price">
              The supplier may charge a premium on the sample if not readily
              available. Delivery costs will be at actuals.
            </span>
          </div>
          <div className="p-note">
            To request for a sample, please write to us at{" "}
            <a className="qa-tc-white qa-hover" href="mailto:buyers@qalara.com">
              buyers@qalara.com
            </a>{" "}
            and mention the product id or the webpage address. We will take care
            of the rest.
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
                <div className="qa-font-san">Select Destination Country</div>
                <Form.Item
                  name="country"
                  className="form-item modified-selector"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Select showSearch dropdownClassName="qa-light-menu-theme">
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
  );
};

export default ServiceabilityCheck;
