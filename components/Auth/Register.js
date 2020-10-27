/** @format */

import React, { useState, useEffect } from "react";
//import { useCookies } from "react-cookie";
//import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
  Radio,
  Select,
  message,
  Layout,
  Tooltip,
  Modal,
} from "antd";
import Icon from "@ant-design/icons";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { history } from "./../../store";
import AppFooter from "./../AppFooter/AppFooter";
import LogoWithText from "../../public/filestore/logo_with_text.js";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import BackButton from "../../public/filestore/backButton";
import IconBuy from "../../public/filestore/iconBuy";
import IconSell from "../../public/filestore/iconSell";
import sellerOrgTypeConfig from "../../public/filestore/sellerOrgType.json";
import buyerOrgTypeConfig from "../../public/filestore/buyerOrgType.json";
import roleInOrganizationConfig from "../../public/filestore/roleInOrganization.json";
import dealsInOrderTypesConfig from "../../public/filestore/dealsInOrderTypes.json";
import dealsInCategoriesConfig from "../../public/filestore/dealsInCategories.json";
import interestsInOrderTypesConfig from "../../public/filestore/interestsInOrderTypes.json";
import interestsInCategoriesConfig from "../../public/filestore/interestsInCategories.json";
import radio_select from "../../public/radio_select";
import radio_nonSelect from "../../public/radio_nonSelect";
import FeedbackModal from "./../FeedbackModal/FeedbackModal";

import { loginToApp } from "../AuthWithKeycloak";
//import { loginToApp } from "../../AuthWithKeycloak/AuthWithKeycloak";
//import { findAllByLabelText } from "@testing-library/react";

import {useRouter} from 'next/router';
// import ellipse from "./../../filestore/Ellipse 160.png";
// import bird from "./../../filestore/Vector.png";
// import picture from "./../../filestore/Vector-1.png";
// import ellipseSm from "./../../filestore/Ellipse 160 (2).png";
// import birdSm from "./../../filestore/Vector (2).png";
// import pictureSm from "./../../filestore/Vector-1(2).png";

const { Option } = Select;
const { Header } = Layout;

const Register = (props) => {
  const history = useRouter();  
  const mediaMatch = ""; 
  // console.log(mediaMatch.matches);
  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );
  const [form] = Form.useForm();
  // const [errors, setErrors] = useState([]);
  const [profileType, setProfileType] = useState("BUYER");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [homeBasedValue, setHomeBasedValue] = useState();
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [count, setCounter] = useState(0);
  const [userIP, setUserIP] = useState();
  const [userCountry, setUserCountry] = useState();
  const [linkError, setLinkError] = useState(false);
  //const [cookie, setCookie] = useCookies(["userID"]);
  const [selCountryCode, setSelCountryCode] = useState("us");
  const [promoCode, setPromoCode] = useState(null);
  const [agreeToEmail, setAgreeToEmail] = useState(false);
  const [validPromo, setValidPromo] = useState(true);

  useEffect(() => {
  const mediaMatch = window.matchMedia("(min-width: 768px)");
    // Update the document title using the browser API
    if (count === 0) {
      fetch("https://ipapi.co/json/", {
        method: "GET",
      })
        .then((response) => response.json())
        .then((response) => {
          let { ip = "", country_name = "" } = response;
          setUserCountry(country_name);
          setUserIP(ip);
        })
        .catch((err) => {
          // console.log("Error ", err);
        });
    }
    setCounter(1);
  });

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = (status) => {
    setVisible(false);
    history.push("/");
  };

  const signIn = () => {
    loginToApp();
  };

  const sellerOrgType = sellerOrgTypeConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const buyerOrgType = buyerOrgTypeConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const roleInOrganization = roleInOrganizationConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const dealsInOrderTypes = dealsInOrderTypesConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const dealsInCategories = dealsInCategoriesConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const interestsInOrderTypes = interestsInOrderTypesConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const interestsInCategories = interestsInCategoriesConfig.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

  const phoneCountryCode = getCountries().map((country) => (
    <Option key={country} value={getCountryCallingCode(country)}>
      +{getCountryCallingCode(country)}
    </Option>
  ));

  const country = getCountries().map((country) => {
    // console.log(country, en[country]);
    if (country === "US") {
      // console.log(country);
      return (
        <Option key={country} value={en[country] + " (US)"}>
          {en[country] + " (US)"}
        </Option>
      );
    }
    if (country === "GB") {
      // console.log(country);
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

  const onValuesChange = (changedValues, allValues) => {
    // console.log(changedValues, allValues);
    if (changedValues.profileType) {
      setBtnDisabled(false);
      setProfileType(changedValues.profileType);
      allValues.orgType = undefined;
      allValues.inOrderTypes = undefined;
      allValues.inCategories = undefined;
      allValues.roleInOrganization = undefined;
      form.setFieldsValue(allValues);
    }
  };

  const handleRadioSelect = (e) => {
    let id = e.target.parentElement.id;
    if (id == "BUYER") {
      
      document.getElementById("seller-text").classList.remove("qa-fw-b");
      document.getElementById("buyer-text").classList.add("qa-fw-b");
      document.getElementById("seller-want-text").classList.remove("qa-fw-b");
      document.getElementById("buyer-want-text").classList.add("qa-fw-b");
    } else {
      
      document.getElementById("buyer-text").classList.remove("qa-fw-b");
      document.getElementById("seller-text").classList.add("qa-fw-b");
      document.getElementById("seller-want-text").classList.add("qa-fw-b");
      document.getElementById("buyer-want-text").classList.remove("qa-fw-b");
    }
    setAgreeToEmail(false);
    setPromoCode(null);
    setProfileType(id);
    form.setFieldsValue({
      orgType: [],
      inOrderTypes: [],
      inCategories: [],
      roleInOrganization: [],
    });
  };

  const nextStep = () => {
    form
      .validateFields([
        "firstName",
        "lastName",
        "email",
        "country",
        "personalPhone",
        "orgName",
        "orgType",
        "inOrderTypes",
        "roleInOrganization",
        "inCategories",
      ])
      .then((values) => {
        setStep(step + 1);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const onCheckHomeRB = (event) => {
    setHomeBasedValue(event.target.value);
  };

  const onFinish = (values) => {
    // console.log(values);
    setLinkError(false);
    let data = {
      profileType: profileType,
      // requiredActions: ["UPDATE_PASSWORD", "VERIFY_EMAIL"],
      username: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      country: values.country,
      personalPhone: values.personalPhone,
      orgName: values.orgName,
      orgType: values.orgType,
      roleInOrganization: values.roleInOrganization,
      receivePromoEmails: agreeToEmail,
      // "agreement": values.agreement
    };

    data.sourceSystemInfo = {
      ipAddress: userIP,
      country: userCountry,
    };

    if (profileType === "BUYER") {
      if (values.websiteLink || values.facebookLink || values.instagramLink) {
        // data.interestsInOrderTypes = values.inOrderTypes;
        // data.interestsInCategories = values.inCategories;
        data.dealsInOrderTypes = values.inOrderTypes;
        data.dealsInCategories = values.inCategories;

        data.brandName = values.brandName;
        data.isHomeBased = values.businessType;
        data.dunsNumber = values.dunsNum;
        data.orgPhone = values.orgPhone;

        data.userPrivateInfo = {
          registeredAddress: {
            address: values.address,
            pinCode: values.zipcode,
            city: values.city,
            state: values.state,
            country: values.buyerCountry,
          },
        };

        data.orgWebsite = values.websiteLink;
        data.signupPromoCode = promoCode;
        data.userSocialAccount = [];
        if (values.facebookLink) {
          data.userSocialAccount.push({
            socialMedia: "FACEBOOK",
            url: values.facebookLink,
          });
        }
        if (values.instagramLink) {
          data.userSocialAccount.push({
            socialMedia: "INSTAGRAM",
            url: values.instagramLink,
          });
        }
      } else {
        setLinkError(true);
        return false;
      }
    }

    if (profileType === "SELLER") {
      data.dealsInOrderTypes = values.inOrderTypes;
      data.dealsInCategories = values.inCategories;
    }
    // console.log(data);

    setLoading(true);
    fetch(process.env.REACT_APP_API_PROFILE_URL + "/profiles", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          // console.log("inside res ok");
          return res.json();
        } else {
          // console.log("inside res else");
          setLoading(false);
          let message = res.statusText || "Error while signing up.";
          if (res.statusText === "Conflict") {
            message = "Email id/Phone number already registered";
          }
          throw message;
        }
      })
      .then((res) => {
        // console.log("inside res");
        // message.success('User signed up successfully.', 5);
        setLoading(false);
        showModal();
        let now = new Date().getTime();
        localStorage.setItem("newUser", now);
        localStorage.setItem("userName", values.email);
        // setStep(2);
      })
      .catch((err) => {
        // console.log("inside err");
        message.error(err.message || err, 5);
        setLoading(false);
      });
  };

  const validateCode = () => {
    if (promoCode) {
      fetch(
        process.env.REACT_APP_API_PROFILE_URL +
          "/profiles/promotions/" +
          promoCode +
          "/validate",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            return res.text();
          } else {
            throw message;
          }
        })
        .then((res) => {
          if (res == "true") {
            setValidPromo(true);
            document.getElementsByClassName(
              "referral-error-block"
            )[0].style.display = "none";
            message.success("Promo code applied successfully.", 5);
          } else {
            setValidPromo(false);
            document.getElementsByClassName(
              "referral-error-block"
            )[0].style.display = "block";
            document.getElementsByClassName(
              "referral-error-block"
            )[0].textContent = "Please enter a valid referral code";
          }
        })
        .catch((err) => {
          // console.log("inside err");
          message.error(err.message || err, 5);
        });
    } else {
      document.getElementsByClassName("referral-error-block")[0].style.display =
        "block";
      document.getElementsByClassName("referral-error-block")[0].textContent =
        "Please enter a valid referral code";
    }
  };

  const handlePromoCode = (e) => {
    let value = e.target.value;
    if (value == null || value == undefined || value == "") {
      setValidPromo(true);
      document.getElementsByClassName("referral-error-block")[0].style.display =
        "none";
    }
    setPromoCode(value);
  };

  const handleAgreeToEmail = (e) => {
    setAgreeToEmail(e.target.checked);
  };
  return (
    <div className="user-registration">
      {/*<Helmet>
        <title>
          Sign up to connect with buyers and sellers of unique, sustainable,
          recycled, organic products | Qalara
        </title>
        <meta
          name="keywords"
          content="Indian exporters, Indian manufacturers, products from India, buy and sell wholesale, sell in USA, Sell in Europe"
        />
        <meta
          name="description"
          content="Join the community of buyers and sellers on Qalara, the best way to trade Indian products, home and kitchen items, handmade products, carpets and textiles."
        />
        <link rel="canonical" href="https://www.qalara.com/signup" />
        {/* <meta name="og:type" content="website" />
          <meta name="og:title"
            content="Sign up to connect with buyers and sellers of unique, sustainable, recycled, organic products | Qalara" />
          <meta name="og:site_name" content="Qalara.com" />
          <meta name="og:description"
            content="Join the community of buyers and sellers on Qalara, the best way to trade Indian products, home and kitchen items, handmade products, carpets and textiles." />
          <meta name="og:url" content={process.env.REACT_APP_REDIRECT_APP_DOMAIN + '/signup'} />
          <meta name="og:image" href={process.env.REACT_APP_REDIRECT_APP_DOMAIN + "/title_logo192.png"} />
          <link rel="apple-touch-icon" href={process.env.REACT_APP_REDIRECT_APP_DOMAIN + "/title_logo192.png"} /> 
    </Helmet>*/}
      <Row
      //   style={{
      //     position: "absolute",
      //     zIndex: 1,
      //     width: "100%",
      //     marginTop: "-81px",
      //   }}
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Header className="app-header">
            <div
              style={{
                flexGrow: 1,
                justifyContent: "center",
                margin: "auto",
              }}
            >
              <Link href="/" style={{ textDecoration: "none" }}>
                <Icon
                  component={LogoWithText}
                  style={{ height: "40px", width: "135px" }}
                ></Icon>
              </Link>
            </div>
          </Header>
        </Col>
        {/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <div className="buyer-invite-text">
            If you are a buyer interested in getting Invite-only access, you may
            email us at <a href="mailto:buyers@qalara.com">buyers@qalara.com</a>
             with details of your company to get an Invite Code for exclusive
            access. Alternately, you can sign-up and once we have verified your
            details we will unlock the same access.
          </div>
        </Col> */}
      </Row>
      <div id="user-register-form" className="user-registration-container">
        <Button
          className="button-back"
          type="link"
          style={step === 1 ? {} : { display: "none" }}
          onClick={() => setStep(step - 1)}
        >
          <Icon
            component={BackButton}
            style={{ width: "30px", height: "30px" }}
          />
        </Button>
        <Form
          name="user_register_form"
          initialValues={{
            profileType: profileType,
            phoneCountryCode: "91",
          }}
          onValuesChange={onValuesChange}
          onFinish={onFinish}
          // onFinishFailed={() => { nextStatus = false }}
          form={form}
          scrollToFirstError
        >
          <Row
            // justify='space-between'
            justify="space-around"
            style={step === 0 ? {} : { display: "none" }}
          >
            {/* <Col className='main-left' xs={24} sm={24} md={11} lg={11} xl={11}>
                        <div className='ellipse' style={{ backgroundImage: `url(${mediaMatch.matches ? ellipse : ellipseSm})` }} />
                        <div className='bird' style={{ backgroundImage: `url(${mediaMatch.matches ? bird : birdSm})` }} />
                        <div className='picture' style={{ backgroundImage: `url(${mediaMatch.matches ? picture : pictureSm})` }} />
                    </Col> */}
            <Col className="main-right" xs={24} sm={24} md={11} lg={11} xl={11}>
              <Row justify="space-around user-profile-btn">
                <Col
                  xs={24}
                  sm={24}
                  md={22}
                  lg={22}
                  xl={22}
                  className="qa-mar-btm-3"
                >
                  <p className="signup-heading">Sign up</p>
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <div className="create-account">
                        <div onClick={signIn} className="link-style register">
                          Already have an account? Sign in here
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="label-paragraph">
                    Please select one to proceed:
                  </div>
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={11}
                      lg={11}
                      xl={11}
                      className={mediaMatch.matches ? "" : "qa-mar-btm-3"}
                    >
                      <Row>
                        <Col
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          className={
                            mediaMatch.matches
                              ? "qa-vertical-center"
                              : "qa-col-center"
                          }
                        >
                        <span className="signup_radio" id="BUYER" style={{ cursor: "pointer" }} onClick={(e) => handleRadioSelect(e)}>{profileType === "BUYER" ? radio_select() : radio_nonSelect()}</span>
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={17}>
                          <Row>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <span
                                id="buyer-want-text"
                                className="qa-font-san qa-fs-14 qa-fw-b"
                                style={{ color: "#f9f7f2" }}
                              >
                                I want to
                              </span>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <span
                                className="qa-font-san qa-fs-17 qa-fw-b"
                                style={{
                                  textTransform: "uppercase",
                                  color: "#D9BB7F",
                                }}
                                id="buyer-text"
                              >
                                BUY FROM QALARA
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
                    <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                      <Row>
                        <Col
                          xs={6}
                          sm={6}
                          md={6}
                          lg={6}
                          xl={6}
                          className={
                            mediaMatch.matches
                              ? "qa-vertical-center"
                              : "qa-col-center"
                          }
                        >
                          <span className="signup_radio" id="SELLER" style={{ cursor: "pointer" }} onClick={(e) => handleRadioSelect(e)}>{profileType === "SELLER" ? radio_select() : radio_nonSelect()}</span>
                        </Col>
                        <Col xs={17} sm={17} md={17} lg={17} xl={17}>
                          <Row>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <span
                                id="seller-want-text"
                                className="qa-font-san qa-fs-14 "
                                style={{ color: "#f9f7f2" }}

                              >
                                I want to
                              </span>
                            </Col>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <span
                                className="qa-font-san qa-fs-17"
                                style={{
                                  textTransform: "uppercase",
                                  color: "#D9BB7F",
                                }}
                                id="seller-text"
                              >
                                SELL ON QALARA
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                {process.env.REACT_APP_REFERRAL_REQUIRED == "true" ? (
                  <Col
                    xs={24}
                    sm={24}
                    md={22}
                    lg={22}
                    xl={22}
                    style={profileType == "BUYER" ? {} : { display: "none" }}
                  >
                    <div className="label-paragraph">
                      Enter your referral code here
                    </div>
                    <Row>
                      <Col xs={16} sm={16} md={16} lg={16} xl={16}>
                        <Form.Item>
                          <Input
                            placeholder="Referral code"
                            className="referral-box"
                            onChange={handlePromoCode}
                          />
                          <span
                            className="qa-error referral-error-block qa-font-san qa-fs-12"
                            id="referral-error-text"
                            style={{ display: "none" }}
                          >
                            This field is mandatory
                          </span>
                        </Form.Item>
                      </Col>
                      <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                        <Form.Item>
                          <Button
                            className="referral-btn"
                            style={{ padding: "15px 24px" }}
                            onClick={validateCode}
                          >
                            <span className="qa-font-san qa-fs-14">APPLY</span>
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                ) : (
                  ""
                )}
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">Your first name</div>
                  <Form.Item
                    name="firstName"
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
                    <Input disabled={btnDisabled} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">Your last name</div>
                  <Form.Item
                    name="lastName"
                    className="form-item"
                    rules={[
                      // { required: true, message: "Field is required." },
                      {
                        min: 3,
                        max: 50,
                        message: "Length should be 3-50 characters!",
                      },
                    ]}
                  >
                    <Input disabled={btnDisabled} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                  <div className="label-paragraph">
                    Your e-mail{" "}
                    <Tooltip
                      overlayClassName="qa-tooltip"
                      title="Please enter your Business email address if available, Eg. John.doe@qalara.com"
                    >
                      <span className="text-right">What's this?</span>
                    </Tooltip>
                  </div>
                  <Form.Item
                    name="email"
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
                        min: 1,
                        max: 70,
                        message: "Length should be 1-70 characters!",
                      },
                    ]}
                  >
                    <Input disabled={btnDisabled} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">Country</div>
                  <Form.Item
                    name="country"
                    className="form-item"
                    rules={[{ required: true, message: "Field is required." }]}
                  >
                    <Select
                      showSearch
                      disabled={btnDisabled}
                      dropdownClassName="qa-dark-menu-theme"
                    >
                      {country}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">Your mobile number</div>
                  <Form.Item
                    name="personalPhone"
                    className="form-item"
                    rules={[
                      { required: true, message: "Field is required." },
                      {
                        pattern: new RegExp("^[0-9]{6,15}$"),
                        message:
                          "Only numbers are allowed & length should be 6-15 characters.",
                      },
                    ]}
                  >
                    <PhoneInput
                      disabled={btnDisabled}
                      country={selCountryCode}
                      enableSearch={true}
                      countryCodeEditable={false}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                  <div className="label-paragraph">
                    Organization name
                    <Tooltip
                      overlayClassName="qa-tooltip"
                      title="Enter the legal/registered organisation name"
                    >
                      <span className="text-right">What's this?</span>
                    </Tooltip>
                  </div>
                  <Form.Item
                    name="orgName"
                    rules={[
                      { required: true, message: "Field is required." },
                      {
                        min: 3,
                        max: 70,
                        message: "Length should be 3-70 characters!",
                      },
                    ]}
                  >
                    <Input disabled={btnDisabled} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">Organization type</div>
                  <Form.Item
                    name="orgType"
                    rules={[{ required: true, message: "Field is required." }]}
                  >
                    <Select
                      disabled={btnDisabled}
                      dropdownClassName="qa-dark-menu-theme"
                    >
                      {profileType === "BUYER" ? buyerOrgType : sellerOrgType}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">Role in organization</div>
                  <Form.Item
                    name="roleInOrganization"
                    rules={[{ required: true, message: "Field is required." }]}
                  >
                    <Select
                      disabled={btnDisabled}
                      dropdownClassName="qa-dark-menu-theme"
                    >
                      {roleInOrganization}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">
                    {profileType === "BUYER"
                      ? "Order types interested in"
                      : "Order types you deal in"}
                  </div>
                  <Form.Item
                    name="inOrderTypes"
                    rules={[{ required: true, message: "Field is required." }]}
                  >
                    <Select
                      mode="multiple"
                      className="qa-dark-menu-theme"
                      disabled={btnDisabled}
                      dropdownClassName="qa-dark-menu-theme"
                    >
                      {profileType === "BUYER"
                        ? interestsInOrderTypes
                        : dealsInOrderTypes}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">
                    {profileType === "BUYER"
                      ? "Categories interested in"
                      : "Categories you deal in"}
                  </div>
                  <Form.Item
                    name="inCategories"
                    rules={[{ required: true, message: "Field is required." }]}
                  >
                    <Select
                      mode="multiple"
                      className="qa-dark-menu-theme"
                      disabled={btnDisabled}
                      dropdownClassName="qa-dark-menu-theme"
                    >
                      {profileType === "BUYER"
                        ? interestsInCategories
                        : dealsInCategories}
                    </Select>
                  </Form.Item>
                </Col>
                {profileType === "SELLER" && (
                  <React.Fragment>
                    <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                      <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                          {
                            required: true,
                            message: "Please accept the agreement.",
                            validator: (_, value) =>
                              value
                                ? Promise.resolve()
                                : Promise.reject(
                                    "Please accept the agreement."
                                  ),
                          },
                        ]}
                      >
                        <Checkbox
                          className="check-box-tnc"
                          disabled={btnDisabled}
                        >
                          Standard{" "}
                          <Link
                            className="link-text"
                            href="/TermsOfUse"
                            target="_blank"
                          >
                            T&C
                          </Link>{" "}
                          apply.
                        </Checkbox>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                      <Form.Item>
                        <Checkbox
                          className="check-box-tnc"
                          disabled={btnDisabled}
                          onChange={handleAgreeToEmail}
                          value={agreeToEmail}
                        >
                          <span>You agree to receive promotional emails</span>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </React.Fragment>
                )}
                <Col
                  xs={24}
                  sm={24}
                  md={22}
                  lg={22}
                  xl={22}
                  style={{ marginBottom: "60px" }}
                >
                  {profileType === "BUYER" ? (
                    <Button
                      type="primary"
                      className="submit-button"
                      loading={loading}
                      disabled={btnDisabled || loading || !validPromo}
                      onClick={nextStep}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      loading={loading}
                      disabled={btnDisabled || loading}
                      htmlType="submit"
                      className="submit-button"
                    >
                      Submit
                    </Button>
                  )}
                  {/* {profileType === "SELLER" && ( */}
                  {/* <div className="create-account">
                    <div onClick={signIn} className="link-style register">
                      Already have an account? Sign in here
                    </div>
                  </div> */}
                  {/* )} */}
                </Col>
              </Row>
            </Col>
          </Row>
          {profileType === "BUYER" && (
            <Row
              // justify='space-between'
              justify="space-around"
              style={step === 1 ? {} : { display: "none" }}
            >
              <Col
                className="main-right"
                xs={24}
                sm={24}
                md={11}
                lg={11}
                xl={11}
              >
                <Row justify="space-around">
                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <p className="signup-heading">Sign up</p>
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <div className="create-account">
                          <div onClick={signIn} className="link-style register">
                            Already have an account? Sign in here
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <p className="signup-sub-heading">
                      This information helps us build a trusted platform. Your
                      data is private and safe - we are GDPR compliant.
                    </p>
                  </Col>
                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <div className="label-paragraph">
                      Brand name
                      <Tooltip
                        overlayClassName="qa-tooltip"
                        title="Name under which you generally conduct business"
                      >
                        <span className="text-right">What's this?</span>
                      </Tooltip>
                    </div>
                    <Form.Item
                      name="brandName"
                      rules={[
                        { required: true, message: "Field is required." },
                        {
                          min: 3,
                          max: 70,
                          message: "Length should be 3-70 characters!",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <div className="label-paragraph">
                      DUNS number
                      <Tooltip
                        overlayClassName="qa-tooltip"
                        title="DUNS number will help us verify your account quickly. Your data is private and safe - we are GDPR compliant."
                      >
                        <span className="text-right">Why?</span>
                      </Tooltip>
                    </div>
                    <Form.Item
                      name="dunsNum"
                      rules={[
                        // { required: true, message: "Field is required." },
                        {
                          pattern: new RegExp("^[0-9]*$"),
                          message:
                            "Only numbers are allowed & length should be 6-15 characters.",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <div className="label-paragraph">
                      Are you a home-based business?
                    </div>
                    <Form.Item
                      name="businessType"
                      className="form-item"
                      rules={[
                        { required: true, message: "Field is required." },
                      ]}
                    >
                      <Radio.Group
                        onChange={onCheckHomeRB}
                        value={homeBasedValue}
                        className="radio-group"
                      >
                        <Radio value={true} className="qa-radio-home">
                          Yes
                        </Radio>
                        <Radio value={false} className="qa-radio-home">
                          No
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <p className="signup-sub-heading">
                      Please provide the address where your business is
                      registered:
                    </p>
                  </Col>

                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <div className="label-paragraph">Zipcode</div>
                    <Form.Item
                      name="zipcode"
                      rules={[
                        { required: true, message: "Field is required." },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <div className="label-paragraph">Address</div>
                    <Form.Item
                      name="address"
                      rules={[
                        { required: true, message: "Field is required." },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <div className="label-paragraph">City</div>
                    <Form.Item
                      name="city"
                      rules={[
                        { required: true, message: "Field is required." },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <div className="label-paragraph">State</div>
                    <Form.Item
                      name="state"
                      rules={[
                        { required: true, message: "Field is required." },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <div className="label-paragraph">Country</div>
                    <Form.Item
                      name="buyerCountry"
                      rules={[
                        { required: true, message: "Field is required." },
                      ]}
                    >
                      <Select showSearch dropdownClassName="qa-dark-menu-theme">
                        {country}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <div className="label-paragraph">
                      Organisation phone number
                    </div>
                    <Form.Item
                      name="orgPhone"
                      rules={[
                        { required: true, message: "Field is required." },
                        {
                          pattern: new RegExp("^[0-9]{6,15}$"),
                          message:
                            "Only numbers are allowed & length should be 6-15 characters.",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <p className="signup-sub-heading">
                      Please provide minimum one of the following
                      <Tooltip
                        overlayClassName="qa-tooltip"
                        title="This will help us speed up the verification process and share personalized recommendations with you"
                      >
                        <span className="text-right">Why?</span>
                      </Tooltip>
                    </p>
                  </Col>

                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <div className="label-paragraph">
                      Organisation website link
                    </div>
                    <Form.Item
                      name="websiteLink"
                      //   rules={[
                      //     { required: true, message: "Field is required." },
                      //   ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <div className="label-paragraph">
                      Organisation Facebook link
                    </div>
                    <Form.Item
                      name="facebookLink"
                      //   rules={[
                      //     { required: true, message: "Field is required." },
                      //   ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                    <div className="label-paragraph">
                      Organisation Instagram link
                    </div>
                    <Form.Item
                      name="instagramLink"
                      //   rules={[
                      //     { required: true, message: "Field is required." },
                      //   ]}
                    >
                      <Input />
                    </Form.Item>
                    {linkError && (
                      <div className="qa-text-error">
                        Please provide minimum one of the above details
                      </div>
                    )}
                  </Col>

                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <Form.Item
                      name="agreement"
                      valuePropName="checked"
                      rules={[
                        {
                          required: true,
                          message: "Please accept the agreement.",
                          validator: (_, value) =>
                            value
                              ? Promise.resolve()
                              : Promise.reject("Please accept the agreement."),
                        },
                      ]}
                    >
                      <Checkbox
                        className="check-box-tnc"
                        disabled={btnDisabled}
                      >
                        Standard{" "}
                        <Link
                          className="link-text"
                          href="/TermsOfUse"
                          target="_blank"
                        >
                          T&C
                        </Link>{" "}
                        apply.
                      </Checkbox>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <Form.Item>
                      <Checkbox
                        className="check-box-tnc"
                        disabled={btnDisabled}
                        onChange={handleAgreeToEmail}
                        value={agreeToEmail}
                      >
                        <span>You agree to receive promotional emails</span>
                      </Checkbox>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                    <Button
                      type="primary"
                      loading={loading}
                      disabled={loading}
                      htmlType="submit"
                      className="submit-button"
                    >
                      Submit
                    </Button>
                    {/* <div className="create-account">
                      <div onClick={signIn} className="link-style register">
                        Already have an account? Sign in here
                      </div>
                    </div> */}
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          <Row
            // justify='space-between'
            justify="space-around"
            style={step === 2 ? {} : { display: "none" }}
          >
            {/* <Col className='main-left' xs={24} sm={24} md={11} lg={11} xl={11}>
                        <div className='ellipse' style={{ backgroundImage: `url(${mediaMatch.matches ? ellipse : ellipseSm})` }} />
                        <div className='bird' style={{ backgroundImage: `url(${mediaMatch.matches ? bird : birdSm})` }} />
                        <div className='picture' style={{ backgroundImage: `url(${mediaMatch.matches ? picture : pictureSm})` }} />
                    </Col> */}
            <Col className="main-right" xs={24} sm={24} md={11} lg={11} xl={11}>
              <div className="congratulation-content">
                <p className="congratulation-head">Congratulations!</p>
                <p className="congratulation-para">
                  Please verify your account by clicking the link in your email.
                </p>
              </div>
              <Button
                className="congratulation-button"
                onClick={() => {
                  history.push("/");
                }}
              >
                Back to home page
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <Modal
        className="confirmation-modal"
        visible={visible}
        footer={null}
        closable={true}
        onCancel={handleCancel}
        bodyStyle={{ padding: "30" }}
        width={profileType === "BUYER" ? 750 : 500}
        centered
      >
        {profileType === "BUYER" ? (
          <p
            className="qa-font-butler qa-fs-30 qa-fw-b qa-tc-white"
            style={{
              textAlign: "center",
              lineHeight: "120%",
              marginTop: "20px",
            }}
          >
            Please set your password to <br />
            complete the sign-up process!
          </p>
        ) : (
          <p className="verification-heading">Sign up complete</p>
        )}
        {profileType === "BUYER" ? (
          <p
            className="qa-font-san qa-tc-white qa-fs-14"
            style={{ lineHeight: "130%" }}
          >
            Please go to your email account and look for an email from{" "}
            <b>'Qalara Global'</b> (check in the{" "}
            <b>
              <i>spam folder</i>
            </b>{" "}
            if you dont find it in your inbox). Click on the link in that email
            to set your password, and then proceed to sign in with your new
            password to start browsing our wide range of products.
            <br />
            <br /> If you face any issues, please write to us at
            buyers@qalara.com.
          </p>
        ) : (
          <p className="verification-text">
            Thanks for showing interest in joining our platform. Please set the
            password for your account using the link sent to your registered
            email address. To continue your registration process, select the
            'Apply to be a seller' option from your profile page
          </p>
        )}
        <Button
          className="congratulation-button"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to home page
        </Button>
      </Modal>
      {/* <AppFooter /> */}
    </div>
  );
};

export default Register;
