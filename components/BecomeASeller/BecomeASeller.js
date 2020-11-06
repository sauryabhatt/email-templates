/** @format */

import React, { useState } from "react";
import { Button, Row, Col, Modal, message, Form, Input } from "antd";
import Icon from "@ant-design/icons";
import GlobalAppearanceIcon from "../../public/filestore/globalAppearanceIcon";
import SmoothOperationsIcon from "../../public/filestore/smoothOperationsIcon";
import VerifiedBuyersIcon from "../../public/filestore/verifiedBuyersIcon";
import Artisanal from "../../public/filestore/artisanal";
import FairAndSocial from "../../public/filestore/fairAndSocial";
import Organic from "../../public/filestore/organic";
import Recycled from "../../public/filestore/recycled";
import EcoFriendly from "../../public/filestore/ecoFriendly";
import Sustainable from "../../public/filestore/sustainable";


function BecomeASeller(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [successVisible, setsuccessVisible] = useState(false);

  const onFinish = (values) => {

    fetch("https://ipapi.co/json/", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        let data = {
          fromEmailId: values.fromEmailId,
          name: values.name,
          phoneNumber: values.phoneNumber,
          profileType: "SELLER",
          ip: (response && response.ip) || null,
          ipCountry: (response && response.country_name) || null,
        };
        sendInviteData(data);
      })
      .catch((err) => {
        // console.log("Error ", err);
      });
    // console.log(values);
    // let data = {
    //   name: values.name,
    //   fromEmailId: values.fromEmailId,
    //   phoneNumber: values.phoneNumber,
    // };
    // console.log(data);
  }

  const sendInviteData = (data) =>{
    setLoading(true);
    fetch(process.env.REACT_APP_API_FORM_URL + "/forms/lead-gens", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MTIyNTU0MjgsImlhdCI6MTYwNDQ3OTQyOCwianRpIjoiZWUxMjk1YTMtNTlmMi00MzRlLTk3NjMtZTY5MzBiZThkZDAwIiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiYTIwMTg5YTYtNjgzZC00YjI3LWI3ZDktMmFmNTA3MzY4Y2QzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4wLjQyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtcmVhY3R1aSIsImNsaWVudEFkZHJlc3MiOiIxMC4yLjAuNDIifQ.V6-7rnSb6RxhxwsDolIMx6MtdUUSoZjOsFIAF5S9f8OCCm_MCeane_xQYqR_49jZ8S2eiTk829n6UtVmr-ogtrtb0-L9akHw_8JyNDErd2yir0vQODjgJgVrMvgHrbywzD536n4Xv610pQWmnCfCUGgezTthwf5-I0sek0ZvSAYg0EnUcs4TcrSfG7Raqx_-32ngWORriOub6OXdA7gNwINJ0_WBtghz5OfG1gEP9kBZGJK5Ze-02qv_I2ioQo0E7dt7sMYS7cjbhzxCuHllaM1-3MNdkJ1GfW9g66LIcal7JdR0RVzQvqXjoUlz_SohSegGAC19gwojD8G9nc3FTw",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while signing up.";
        }
      })
      .then((res) => {
        // message.success('User signed up successfully.', 5);
        setLoading(false);
        setsuccessVisible(true);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        setLoading(false);
      });
  };
  return (
    <div id="become-a-seller">
      <div className="banner">
        <span className="banner-text">
          Connect with global wholesale buyers 24x7, 365 days
          <p className="banner-text-small">
            <br />
            Hundreds of reputed suppliers, and growing daily. Backed by Reliance
            Industries.
          </p>
        </span>
      </div>
      <Row justify="space-around" className="intrest-banner">
        <Col
          className="intrest-heading"
          xs={20}
          sm={20}
          md={20}
          lg={20}
          xl={20}
        >
          <p className="heading-text">
            Interested to learn more? Please share your details below for a
            consultation.
          </p>
        </Col>
        <Col className="intrest-form" xs={20} sm={20} md={20} lg={20} xl={20}>
          <Form
            name="user_interest_form"
            onFinish={onFinish}
            form={form}
            scrollToFirstError
          >
            <Row justify="space-between">
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item
                  name="name"
                  validateTrigger="onBlur"
                  className="form-item"
                  rules={[
                    { required: true, message: "Field is required." },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input placeholder="Your name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item
                  name="fromEmailId"
                  validateTrigger="onBlur"
                  className="form-item"
                  rules={[
                    {
                      type: "email",
                      message: "Enter the correct email address.",
                    },
                    {
                      required: true,
                      message: "Field is required.",
                    },
                    {
                      min: 5,
                      max: 70,
                      message: "Length should be 1-70 characters!",
                    },
                  ]}
                >
                  <Input placeholder="Email address" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item
                  name="phoneNumber"
                  validateTrigger="onBlur"
                  className="form-item"
                  rules={[
                    // { required: true, message: "Field is required." },
                    {
                      pattern: new RegExp("^[0-9]{6,15}$"),
                      message:
                        "Only numbers are allowed & length should be 6-15 characters.",
                    },
                  ]}
                >
                  <Input placeholder="Phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-button"
                    loading={loading}
                    disabled={loading}
                  >
                    Yes I am interested
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col className="intrest-bottom" xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row justify="space-around">
            <Col xs={20} sm={20} md={20} lg={20} xl={20}>
              <span className="text1">Limited time offer! </span>
              <span className="text2">
                Share your details and stand a chance to get an annual
                subscription worth{" "}
              </span>
              <span className="text3">Rs.24,000 free!</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="feature-banner">
        <Col
          className="feature-banner-1"
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={24}
        >
          <p className="heading">What Qalara does for you?</p>
        </Col>
        <Col className="feature-banner-2" xs={24} sm={24} md={8} lg={8} xl={8}>
          <div className="para-main">
            <p className="para-icon">
              <Icon component={VerifiedBuyersIcon} className="feature-icon" />
            </p>
            <p className="para-heading">Verified buyers</p>
            <p className="para-text">
              Find verified wholesale buyers from around the world and grow your
              business
            </p>
          </div>
          <div className="para-divider" />
        </Col>
        <Col className="feature-banner-3" xs={24} sm={24} md={8} lg={8} xl={8}>
          <div className="para-main">
            <p className="para-icon">
              <Icon component={GlobalAppearanceIcon} className="feature-icon" />
            </p>
            <p className="para-heading">Digital showcase</p>
            <p className="para-text">
              Build a world class digital profile for your business, and elevate
              your brand globally
            </p>
          </div>
          <div className="para-divider" />
        </Col>
        <Col className="feature-banner-4" xs={24} sm={24} md={8} lg={8} xl={8}>
          <div className="para-main">
            <p className="para-icon">
              <Icon component={SmoothOperationsIcon} className="feature-icon" />
            </p>
            <p className="para-heading">Hassle-free operations</p>
            <p className="para-text">
              Support and simplify your (export) operations, with digitally
              powered tools and services.
            </p>
          </div>
        </Col>
      </Row>
      <div className="vision-banner">
        <p className="vision-text">
          Qalara is a global B2B ecommerce marketplace, backed by a Fortune 500
          company, that aims to drive sustainable and meaningful consumption of
          responsibly produced goods, globally.
        </p>
      </div>
      <Row justify="space-around" className="criteria-banner">
        <Col
          className="criteria-banner-heading"
          xs={20}
          sm={20}
          md={20}
          lg={20}
          xl={20}
        >
          <p className="heading">
            If you are a responsible manufacturer of lifestyle products, we
            would love to partner with you!
          </p>
        </Col>
        <Col
          className="criteria-banner-content"
          xs={20}
          sm={20}
          md={20}
          lg={20}
          xl={20}
        >
          <Row justify="space-between">
            <Col className="content-1" xs={12} sm={12} md={4} lg={4} xl={4}>
              <p className="content-icon-para">
                <Icon component={Artisanal} className="content-icon" />
              </p>
              <p className="content-heading">Artisanal</p>
            </Col>
            <Col className="content-2" xs={12} sm={12} md={4} lg={4} xl={4}>
              <p className="content-icon-para">
                <Icon component={FairAndSocial} className="content-icon" />
              </p>
              <p className="content-heading">Fair & Social</p>
            </Col>
            <Col className="content-3" xs={12} sm={12} md={4} lg={4} xl={4}>
              <p className="content-icon-para">
                <Icon component={Organic} className="content-icon" />
              </p>
              <p className="content-heading">Organic</p>
            </Col>
            <Col className="content-4" xs={12} sm={12} md={4} lg={4} xl={4}>
              <p className="content-icon-para">
                <Icon component={Recycled} className="content-icon" />
              </p>
              <p className="content-heading">Recycled</p>
            </Col>
            <Col className="content-5" xs={12} sm={12} md={4} lg={4} xl={4}>
              <p className="content-icon-para">
                <Icon component={EcoFriendly} className="content-icon" />
              </p>
              <p className="content-heading">Eco Friendly</p>
            </Col>
            <Col className="content-6" xs={12} sm={12} md={4} lg={4} xl={4}>
              <p className="content-icon-para">
                <Icon component={Sustainable} className="content-icon" />
              </p>
              <p className="content-heading">Sustainable</p>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={0} sm={0} md={24} lg={24} xl={24} style={{ height: "70vh" }}>
          <Row style={{ height: "70vh" }}>
            <Col
              xs={0}
              sm={0}
              md={10}
              lg={10}
              xl={10}
              style={{ height: "70vh" }}
            >
              <Row style={{ height: "70vh" }}>
                <Col
                  xs={0}
                  sm={0}
                  md={8}
                  lg={8}
                  xl={8}
                  style={{
                    height: "35vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_1.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image1} width='100%' height='100%' /> */}
                </Col>
                <Col
                  xs={0}
                  sm={0}
                  md={8}
                  lg={8}
                  xl={8}
                  style={{
                    height: "35vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_5.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image2} width='100%' height='100%' /> */}
                </Col>
                <Col
                  xs={0}
                  sm={0}
                  md={8}
                  lg={8}
                  xl={8}
                  style={{
                    height: "35vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_2.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image3} width='100%' height='100%' /> */}
                </Col>
                <Col
                  xs={0}
                  sm={0}
                  md={8}
                  lg={8}
                  xl={8}
                  style={{
                    height: "35vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_6.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image4} width='100%' height='100%' /> */}
                </Col>
                <Col
                  xs={0}
                  sm={0}
                  md={16}
                  lg={16}
                  xl={16}
                  style={{
                    height: "35vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_3.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image5} width='100%' height='100%' /> */}
                </Col>
              </Row>
            </Col>
            <Col
              xs={0}
              sm={0}
              md={10}
              lg={10}
              xl={10}
              style={{ height: "70vh" }}
              className="category-banner"
            >
              <Row justify="center" className="category-content">
                <Col xs={0} sm={0} md={20} lg={20} xl={20} className="heading">
                  Categories
                </Col>
                <Col xs={0} sm={0} md={20} lg={20} xl={20} className="points">
                  Home & Décor
                </Col>
                <Col xs={0} sm={0} md={20} lg={20} xl={20} className="points">
                  Furniture
                </Col>
                <Col xs={0} sm={0} md={20} lg={20} xl={20} className="points">
                  Kitchen
                </Col>
                <Col xs={0} sm={0} md={20} lg={20} xl={20} className="points">
                  Rugs & Carpets
                </Col>
                <Col xs={0} sm={0} md={20} lg={20} xl={20} className="points">
                  Home Furnishings
                </Col>
                <Col xs={0} sm={0} md={10} lg={10} xl={10} className="points">
                  Accessories
                </Col>
                <Col xs={0} sm={0} md={20} lg={20} xl={20} className="bottom">
                  Apparel & Footwear, Jewelry, Kids, Textiles, Beauty &
                  Wellness, Specialty Foods & Staples coming shortly.
                </Col>
              </Row>
            </Col>
            <Col
              xs={0}
              sm={0}
              md={4}
              lg={4}
              xl={4}
              style={{
                height: "70vh",
                backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_4.png"})`,
              }}
              className="category-image-backgroung"
            >
              {/* <img src={Image6} width='100%' height='100%' /> */}
            </Col>
          </Row>
        </Col>
        <Col xs={24} sm={24} md={0} lg={0} xl={0}>
          <Row justify="center">
            <Col
              xs={24}
              sm={24}
              md={0}
              lg={0}
              xl={0}
              className="category-banner"
            >
              <Row justify="center" className="category-content">
                <Col xs={20} sm={20} md={0} lg={0} xl={0} className="heading">
                  Categories
                </Col>
                <Col xs={20} sm={20} md={0} lg={0} xl={0} className="points">
                  Home & Décor
                </Col>
                <Col xs={20} sm={20} md={0} lg={0} xl={0} className="points">
                  Furniture
                </Col>
                <Col xs={20} sm={20} md={0} lg={0} xl={0} className="points">
                  Kitchen
                </Col>
                <Col xs={20} sm={20} md={0} lg={0} xl={0} className="points">
                  Rugs & Carpets
                </Col>
                <Col xs={20} sm={20} md={0} lg={0} xl={0} className="points">
                  Home Furnishings
                </Col>
                <Col xs={20} sm={20} md={0} lg={0} xl={0} className="points">
                  Accessories
                </Col>
                <Col xs={20} sm={20} md={0} lg={0} xl={0} className="bottom">
                  Apparel & Footwear, Jewelry, Kids, Textiles, Beauty &
                  Wellness, Specialty Foods & Staples coming shortly.
                </Col>
              </Row>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={0}
              lg={0}
              xl={0}
              style={{ height: "100vh" }}
            >
              <Row style={{ height: "100vh" }}>
                <Col
                  xs={12}
                  sm={12}
                  md={0}
                  lg={0}
                  xl={0}
                  style={{
                    height: "25vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_1.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image1} width='100%' height='100%' /> */}
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={0}
                  lg={0}
                  xl={0}
                  style={{
                    height: "25vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_5.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image2} width='100%' height='100%' /> */}
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={0}
                  lg={0}
                  xl={0}
                  style={{ height: "50vh" }}
                >
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={0}
                      lg={0}
                      xl={0}
                      style={{
                        height: "25vh",
                        backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_6.png"})`,
                      }}
                      className="category-image-backgroung"
                    >
                      {/* <img src={Image4} width='100%' height='100%' /> */}
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={0}
                      lg={0}
                      xl={0}
                      style={{
                        height: "25vh",
                        backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_2.png"})`,
                      }}
                      className="category-image-backgroung"
                    >
                      {/* <img src={Image3} width='100%' height='100%' /> */}
                    </Col>
                  </Row>
                </Col>
                <Col
                  xs={12}
                  sm={12}
                  md={0}
                  lg={0}
                  xl={0}
                  style={{
                    height: "50vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_4.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image6} width='100%' height='100%' /> */}
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={0}
                  lg={0}
                  xl={0}
                  style={{
                    height: "25vh",
                    backgroundImage: `url(${"https://cdn.qalara.com/images/Img_SellerLeadGen_Categories_Images_3.png"})`,
                  }}
                  className="category-image-backgroung"
                >
                  {/* <img src={Image5} width='100%' height='100%' /> */}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row
        justify="space-around"
        className="intrest-banner"
        style={{ position: "relative" }}
      >
        <Col
          className="intrest-heading"
          xs={20}
          sm={20}
          md={20}
          lg={20}
          xl={20}
        >
          <p className="heading-text">
            Interested to learn more? Please share your details below for a
            consultation.
          </p>
        </Col>
        <Col className="intrest-form" xs={20} sm={20} md={20} lg={20} xl={20}>
          <Form
            name="user_interest_form"
            onFinish={onFinish}
            form={form}
            scrollToFirstError
          >
            <Row justify="space-between">
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item
                  name="name"
                  validateTrigger="onBlur"
                  className="form-item"
                  rules={[
                    { required: true, message: "Field is required." },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input placeholder="Your name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item
                  name="fromEmailId"
                  validateTrigger="onBlur"
                  className="form-item"
                  rules={[
                    {
                      type: "email",
                      message: "Enter the correct email address.",
                    },
                    {
                      required: true,
                      message: "Field is required.",
                    },
                    {
                      min: 5,
                      max: 70,
                      message: "Length should be 1-70 characters!",
                    },
                  ]}
                >
                  <Input placeholder="Email address" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Form.Item
                  name="phoneNumber"
                  className="form-item"
                  validateTrigger="onBlur"
                  rules={[
                    // { required: true, message: "Field is required." },
                    {
                      pattern: new RegExp("^[0-9]{6,15}$"),
                      message:
                        "Only numbers are allowed & length should be 6-15 characters.",
                    },
                  ]}
                >
                  <Input placeholder="Phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={5} lg={5} xl={5}>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="submit-button"
                    loading={loading}
                    disabled={loading}
                  >
                    Yes I am interested
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col className="intrest-bottom" xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row justify="space-around">
            <Col xs={20} sm={20} md={20} lg={20} xl={20}>
              <span className="text1">Limited time offer! </span>
              <span className="text2">
                Share your details and stand a chance to get an annual
                subscription worth{" "}
              </span>
              <span className="text3">Rs.24,000 free!</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        visible={successVisible}
        footer={null}
        closable={true}
        onCancel={() => {
          setsuccessVisible(false);
        }}
        centered
        bodyStyle={{ padding: "0" }}
        width={400}
      >
        <div id="become-a-seller-modal">
          <div className="become-a-seller-modal-content">
            <p className="become-a-seller-modal-para1">Thank you!</p>
            <p className="become-a-seller-modal-para2">
              Thanks for showing interest in joining our platform. We will
              revert to you within next 48 hours.
            </p>
          </div>
          <Button
            className="become-a-seller-modal-button"
            onClick={() => {
              setsuccessVisible(false);
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default BecomeASeller;
