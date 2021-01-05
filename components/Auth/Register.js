/** @format */

import React, { useState, useEffect } from "react";
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
  Tooltip,
  Modal,
} from "antd";
import Icon from "@ant-design/icons";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { useKeycloak } from "@react-keycloak/ssr";
import "react-phone-input-2/lib/style.css";
import BackButton from "../../public/filestore/backButton";
import sellerOrgTypeConfig from "../../public/filestore/sellerOrgType.json";
import buyerOrgTypeConfig from "../../public/filestore/buyerOrgType.json";
import roleInOrganizationConfig from "../../public/filestore/roleInOrganization.json";
import dealsInOrderTypesConfig from "../../public/filestore/dealsInOrderTypes.json";
import dealsInCategoriesConfig from "../../public/filestore/dealsInCategories.json";
import interestsInOrderTypesConfig from "../../public/filestore/interestsInOrderTypes.json";
import interestsInCategoriesConfig from "../../public/filestore/interestsInCategories.json";
import { loginToApp } from "../AuthWithKeycloak";
import { useRouter } from "next/router";

const { Option } = Select;

const Register = (props) => {
  const router = useRouter();
  const { keycloak } = useKeycloak();
  const [form] = Form.useForm();
  const [profileType, setProfileType] = useState("BUYER");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [userIP, setUserIP] = useState();
  const [userCountry, setUserCountry] = useState();
  const [linkError, setLinkError] = useState(false);
  const [selCountryCode, setSelCountryCode] = useState("us");
  const [promoCode, setPromoCode] = useState(null);
  const [agreeToEmail, setAgreeToEmail] = useState(false);
  const [validPromo, setValidPromo] = useState(true);

  useEffect(() => {
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
        console.log("Error ", err);
      });
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = (status) => {
    setVisible(false);
    router.push("/");
  };

  const signIn = () => {
    loginToApp(keycloak, undefined);
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

  const onValuesChange = (changedValues, allValues) => {
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
    setAgreeToEmail(false);
    setPromoCode(null);
    setProfileType(e.target.value);
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
        "email",
        "country",
        "personalPhone",
        "city",
        "zipcode",
      ])
      .then((values) => {
        setStep(step + 1);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const onFinish = (values) => {
    // console.log(values);
    setLinkError(false);
    let data = {
      profileType: profileType,
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
    };

    data.sourceSystemInfo = {
      ipAddress: userIP,
      country: userCountry,
    };

    if (profileType === "BUYER") {
      data.dealsInOrderTypes = values.inOrderTypes;
      data.dealsInCategories = values.inCategories;

      data.brandName = values.brandName;
      data.isHomeBased = values.businessType;
      // data.dunsNumber = values.dunsNumber;
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

      if (values.websiteLink) {
        data.orgWebsite = values.websiteLink;
      }

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
    }

    if (profileType === "SELLER") {
      data.dealsInOrderTypes = values.inOrderTypes;
      data.dealsInCategories = values.inCategories;
    }

    setLoading(true);
    fetch(process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/profiles", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          setLoading(false);
          let message = res.statusText || "Error while signing up.";
          if (res.statusText === "Conflict") {
            message = "Email id/Phone number already registered";
          }
          throw message;
        }
      })
      .then((res) => {
        setLoading(false);
        showModal();
        let now = new Date().getTime();
        localStorage.setItem("newUser", now);
        localStorage.setItem("userName", values.email);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        setLoading(false);
      });
  };

  const validateCode = () => {
    if (promoCode) {
      fetch(
        process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
          "/profiles/promotions/" +
          promoCode +
          "/validate",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
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
          form={form}
          scrollToFirstError
          autoComplete="dontshow"
          autofill={false}
        >
          <Row
            justify="space-around"
            style={step === 0 ? {} : { display: "none" }}
          >
            <Col className="main-right" xs={24} sm={24} md={11} lg={11} xl={11}>
              <Row justify="space-around user-profile-btn">
                <Col
                  xs={24}
                  sm={24}
                  md={22}
                  lg={22}
                  xl={22}
                  className="qa-mar-btm-2"
                >
                  <p className="signup-heading">Sign up for free!</p>
                  {/* <p className="signup-subtitle">in just a few minutes!</p> */}
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <div className="create-account">
                        <div className="link-style register">
                          Already have an account?{" "}
                          <span className="link" onClick={signIn}>
                            Sign in here
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div className="label-paragraph">
                    Please select one to proceed:
                  </div>
                  <Row>
                    <Col xs={0} sm={0} md={24} lg={24}>
                      <Radio.Group
                        onChange={handleRadioSelect}
                        value={profileType}
                        className="radio-group"
                      >
                        <Row>
                          <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                            <Radio
                              value="BUYER"
                              className={
                                profileType === "BUYER"
                                  ? "qa-radio-home qa-fw-b"
                                  : "qa-radio-home"
                              }
                            >
                              BUY FROM QALARA
                            </Radio>
                          </Col>

                          <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                          <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                            <Radio
                              value="SELLER"
                              className={
                                profileType === "SELLER"
                                  ? "qa-radio-home qa-fw-b"
                                  : "qa-radio-home"
                              }
                            >
                              SELL ON QALARA
                            </Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Col>
                    <Col xs={24} sm={24} md={0} lg={0}>
                      <Radio.Group
                        onChange={handleRadioSelect}
                        value={profileType}
                        className="radio-group"
                      >
                        <Row>
                          <Col
                            xs={11}
                            sm={11}
                            md={11}
                            lg={11}
                            xl={11}
                            className="qa-mar-btm-1"
                          >
                            <Radio
                              value="BUYER"
                              className={
                                profileType === "BUYER"
                                  ? "qa-radio-home qa-fw-b"
                                  : "qa-radio-home"
                              }
                            >
                              <div className="qa-disp-f">
                                <div>BUY FROM</div> <div>QALARA</div>
                              </div>
                            </Radio>
                          </Col>

                          <Col xs={2} sm={2} md={2} lg={2} xl={2}></Col>
                          <Col xs={11} sm={11} md={11} lg={11} xl={11}>
                            <Radio
                              value="SELLER"
                              className={
                                profileType === "SELLER"
                                  ? "qa-radio-home qa-fw-b"
                                  : "qa-radio-home"
                              }
                            >
                              <div className="qa-disp-f">
                                <div>SELL ON</div> <div>QALARA</div>
                              </div>
                            </Radio>
                          </Col>
                        </Row>
                      </Radio.Group>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">First name</div>
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
                    <Input disabled={btnDisabled} autoComplete="dontshow" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  <div className="label-paragraph">Last name</div>
                  <Form.Item
                    name="lastName"
                    className="form-item"
                    rules={
                      [
                        // { required: true, message: "Field is required." },
                        // {
                        //   min: 3,
                        //   max: 50,
                        //   message: "Length should be 3-50 characters!",
                        // },
                      ]
                    }
                  >
                    <Input disabled={btnDisabled} autoComplete="dontshow" />
                  </Form.Item>
                </Col>

                {profileType === "SELLER" ? (
                  <React.Fragment>
                    <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                      <div className="label-paragraph">
                        Email address
                        {/* <Tooltip
                      overlayClassName="qa-tooltip"
                      title="Please enter your Business email address if available, Eg. John.doe@qalara.com"
                    >
                      <span className="text-right qa-cursor">What's this?</span>
                    </Tooltip> */}
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
                        <Input
                          disabled={btnDisabled}
                          placeholder="@companyname.com"
                          autoComplete="dontshow"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">Country</div>
                      <Form.Item
                        name="country"
                        className="form-item modified-selector"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          showSearch
                          disabled={btnDisabled}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
                        >
                          {country}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">Mobile number</div>
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
                        {/* <PhoneInput
                      disabled={btnDisabled}
                      country={selCountryCode}
                      enableSearch={true}
                      countryCodeEditable={false}
                    /> */}
                        <Input disabled={btnDisabled} autoComplete="dontshow" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                      <div className="label-paragraph">
                        Organization name
                        <Tooltip
                          overlayClassName="qa-tooltip"
                          title="Enter the legal/registered organization name"
                        >
                          <span className="text-right qa-cursor">
                            What's this?
                          </span>
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
                        <Input disabled={btnDisabled} autoComplete="dontshow" />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">Organization type</div>
                      <Form.Item
                        name="orgType"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          disabled={btnDisabled}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
                        >
                          {profileType === "BUYER"
                            ? buyerOrgType
                            : sellerOrgType}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">
                        Role in organization
                      </div>
                      <Form.Item
                        name="roleInOrganization"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          disabled={btnDisabled}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
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
                        className="modified-selector"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          className="qa-dark-menu-theme"
                          disabled={btnDisabled}
                          showArrow={true}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
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
                        className="modified-selector"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          className="qa-dark-menu-theme"
                          disabled={btnDisabled}
                          showArrow={true}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
                        >
                          {profileType === "BUYER"
                            ? interestsInCategories
                            : dealsInCategories}
                        </Select>
                      </Form.Item>
                    </Col>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">Country</div>
                      <Form.Item
                        name="country"
                        className="form-item modified-selector"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          showSearch
                          disabled={btnDisabled}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
                        >
                          {country}
                        </Select>
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
                        <Input autoComplete="dontshow" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">Pin / Zip code</div>
                      <Form.Item
                        name="zipcode"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Input autoComplete="dontshow" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">Mobile number</div>
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
                        {/* <PhoneInput
                      disabled={btnDisabled}
                      country={selCountryCode}
                      enableSearch={true}
                      countryCodeEditable={false}
                    /> */}
                        <Input disabled={btnDisabled} autoComplete="dontshow" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                      <div className="label-paragraph">
                        Email address
                        {/* <Tooltip
                      overlayClassName="qa-tooltip"
                      title="Please enter your Business email address if available, Eg. John.doe@qalara.com"
                    >
                      <span className="text-right qa-cursor">What's this?</span>
                    </Tooltip> */}
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
                        <Input
                          disabled={btnDisabled}
                          placeholder="@companyname.com"
                          autoComplete="dontshow"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">
                        Organization name
                        {/* <Tooltip
                          overlayClassName="qa-tooltip"
                          title="Enter the legal/registered organization name"
                        >
                          <span className="text-right qa-cursor">
                            What's this?
                          </span>
                        </Tooltip> */}
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
                        <Input disabled={btnDisabled} autoComplete="dontshow" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">
                        Role in organization
                      </div>
                      <Form.Item
                        name="roleInOrganization"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          disabled={btnDisabled}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
                        >
                          {roleInOrganization}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">Organization type</div>
                      <Form.Item
                        name="orgType"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          disabled={btnDisabled}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
                        >
                          {profileType === "BUYER"
                            ? buyerOrgType
                            : sellerOrgType}
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
                        className="modified-selector"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          className="qa-dark-menu-theme"
                          disabled={btnDisabled}
                          showArrow={true}
                          dropdownClassName="qa-dark-menu-theme"
                          placeholder="Select"
                        >
                          {profileType === "BUYER"
                            ? interestsInOrderTypes
                            : dealsInOrderTypes}
                        </Select>
                      </Form.Item>
                    </Col>

                    {process.env.NEXT_PUBLIC_REACT_APP_REFERRAL_REQUIRED ==
                      "true" && (
                      <Col
                        xs={24}
                        sm={24}
                        md={22}
                        lg={22}
                        xl={22}
                        style={
                          profileType == "BUYER" ? {} : { display: "none" }
                        }
                      >
                        <div className="label-paragraph">
                          Referral code (if available)
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
                                onClick={validateCode}
                              >
                                <span className="qa-font-san qa-fs-14">
                                  APPLY
                                </span>
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </React.Fragment>
                )}

                <React.Fragment>
                  <Col
                    xs={24}
                    sm={24}
                    md={22}
                    lg={22}
                    xl={22}
                    className="checkbox-grp qa-mar-top-1"
                  >
                    <span className="qa-disp-inline qa-fs-12">
                      <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                          {
                            required: true,
                            message: "Please accept T&C.",
                            validator: (_, value) =>
                              value
                                ? Promise.resolve()
                                : Promise.reject("Please accept T&C."),
                          },
                        ]}
                      >
                        <Checkbox
                          className="check-box-tnc"
                          disabled={btnDisabled}
                        >
                          Standard{" "}
                          <Link className="link-text" href="/TermsOfUse">
                            <a target="_blank" className="link-text">
                              T&C
                            </a>
                          </Link>{" "}
                          apply
                        </Checkbox>
                      </Form.Item>
                    </span>
                    <span className="qa-disp-inline qa-mar-left-20 qa-fs-12">
                      <Form.Item>
                        <Checkbox
                          className="check-box-tnc"
                          disabled={btnDisabled}
                          onChange={handleAgreeToEmail}
                          value={agreeToEmail}
                        >
                          You agree to receive promotional emails
                        </Checkbox>
                      </Form.Item>
                    </span>
                  </Col>
                </React.Fragment>

                <Col
                  xs={24}
                  sm={24}
                  md={22}
                  lg={22}
                  xl={22}
                  style={{ marginBottom: "60px" }}
                >
                  {/* {profileType === "BUYER" ? (
                    <Button
                      type="primary"
                      className="submit-button"
                      loading={loading}
                      disabled={btnDisabled || loading || !validPromo}
                      onClick={nextStep}
                    >
                      Next Step
                      <span className="qa-mar-lft1">
                        <svg
                          width="18"
                          height="8"
                          viewBox="0 0 18 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                            fill="#000"
                          />
                        </svg>
                      </span>
                    </Button>
                  ) : ( */}
                  <Button
                    type="primary"
                    loading={loading}
                    disabled={btnDisabled || loading}
                    htmlType="submit"
                    className="submit-button"
                  >
                    Submit
                  </Button>
                  {/* )} */}
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
          {/* {profileType === "BUYER" && (
            <div style={step === 1 ? {} : { display: "none" }}>
              <div>
                <p className="signup-heading">Almost done!</p>
                <p className="signup-sub-heading">
                  This information helps us build a trusted platform. Your data
                  is private and safe - we are GDPR compliant.
                </p>
              </div>

              <Row
                // justify='space-between'
                justify="space-around"
                style={step === 1 ? {} : { display: "none" }}
              >
                <Col xs={24} sm={24} md={11} lg={11} xl={11}>
                  <Row justify="space-around">
                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">
                        Organization name
                        
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
                      <div className="label-paragraph">
                        Website / social media link
                      </div>
                      <Form.Item
                        name="websiteLink"
                        // rules={[
                        //   { required: true, message: "Field is required." },
                        // ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={22} lg={22} xl={22}>
                      <div className="label-paragraph">
                        <span className="qa-lft">
                          ABN / VAT / EORI / UEN / Tax Number (as applicable)
                        </span>
                        <Tooltip
                          overlayClassName="qa-tooltip"
                          title="These details are usually required for the smooth customs clearance process of your shipment in the destination country. If not available please mention 'Not Available'"
                        >
                          <span className="text-right qa-cursor qa-rgt">
                            What's this?
                          </span>
                        </Tooltip>
                      </div>
                      <Form.Item
                        name="dunsNumber"
                        rules={
                          [
                            // { required: true, message: "Field is required." },
                            // {
                            //   pattern: new RegExp("^[0-9]*$"),
                            //   message:
                            //     "Only numbers are allowed & length should be 6-15 characters.",
                            // },
                          ]
                        }
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">Organization type</div>
                      <Form.Item
                        name="orgType"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          disabled={btnDisabled}
                          dropdownClassName="qa-dark-menu-theme"
                        >
                          {profileType === "BUYER"
                            ? buyerOrgType
                            : sellerOrgType}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">
                        Role in organization
                      </div>
                      <Form.Item
                        name="roleInOrganization"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
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
                          ? "Categories interested in"
                          : "Categories you deal in"}
                      </div>
                      <Form.Item
                        name="inCategories"
                        className="modified-selector"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          className="qa-dark-menu-theme"
                          disabled={btnDisabled}
                          showArrow={true}
                          dropdownClassName="qa-dark-menu-theme"
                        >
                          {profileType === "BUYER"
                            ? interestsInCategories
                            : dealsInCategories}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                      <div className="label-paragraph">
                        {profileType === "BUYER"
                          ? "Order types"
                          : "Order types you deal in"}
                      </div>
                      <Form.Item
                        name="inOrderTypes"
                        className="modified-selector"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          className="qa-dark-menu-theme"
                          disabled={btnDisabled}
                          showArrow={true}
                          dropdownClassName="qa-dark-menu-theme"
                        >
                          {profileType === "BUYER"
                            ? interestsInOrderTypes
                            : dealsInOrderTypes}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col
                      xs={24}
                      sm={24}
                      md={22}
                      lg={22}
                      xl={22}
                      className="checkbox-grp"
                    >
                      <span className="qa-disp-inline qa-fs-12">
                        <Form.Item
                          name="agreement"
                          valuePropName="checked"
                          rules={[
                            {
                              required: true,
                              message: "Please accept T&C.",
                              validator: (_, value) =>
                                value
                                  ? Promise.resolve()
                                  : Promise.reject("Please accept T&C."),
                            },
                          ]}
                        >
                          <Checkbox
                            className="check-box-tnc"
                            disabled={btnDisabled}
                          >
                            Standard{" "}
                            <Link className="link-text" href="/TermsOfUse">
                              <a target="_blank" className="link-text">
                                T&C
                              </a>
                            </Link>{" "}
                            apply
                          </Checkbox>
                        </Form.Item>
                      </span>
                      <span className="qa-disp-inline qa-mar-left-20 qa-fs-12">
                        <Form.Item>
                          <Checkbox
                            className="check-box-tnc"
                            disabled={btnDisabled}
                            onChange={handleAgreeToEmail}
                            value={agreeToEmail}
                          >
                            You agree to receive promotional emails
                          </Checkbox>
                        </Form.Item>
                      </span>
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
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          )}
          <Row
            justify="space-around"
            style={step === 2 ? {} : { display: "none" }}
          >
            <Col className="main-right" xs={24} sm={24} md={11} lg={11} xl={11}>
              <div className="congratulation-content">
                <p className="congratulation-head">Congratulations!</p>
                <p className="congratulation-para">
                  Please verify your account by clicking the link in your email.
                </p>
              </div>
              <Button
                className="send-query-success-modal-button"
                onClick={handleCancel}
              >
                Back to home page
              </Button>
            </Col>
          </Row>
         */}
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
          className="send-query-success-modal-button congratulation-button"
          onClick={handleCancel}
        >
          Back to home page
        </Button>
      </Modal>
    </div>
  );
};

export default Register;
