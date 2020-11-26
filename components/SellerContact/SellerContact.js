/** @format */

import React, { useState } from "react";
// import { useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/ssr";
import {
  Alert,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  message,
  Upload,
  Checkbox,
  InputNumber,
  DatePicker,
  Avatar,
} from "antd";
import Icon, { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { loginToApp } from "../AuthWithKeycloak";
// import './index.css';
import { useRouter } from "next/router";

import certifiedIcon from "../../public/filestore/certifiedIcon";
import Link from "next/link";

const { Option } = Select;

const SellerContact = (props) => {
  const router = useRouter();
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const [form] = Form.useForm();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // const currentUser = useSelector(state => state.auth.currentUser);
  const { keycloak } = useKeycloak();
  // console.log(keycloak.subject);

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "image/jpeg",
    "image/png",
  ];

  // const normFile = e => {
  //     // console.log('Upload event:', e);

  //     if (Array.isArray(e)) {
  //         return e;
  //     }

  //     return e;
  // };

  // const getBase64 = (file) => {
  //     return new Promise((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file);
  //         reader.onload = () => resolve(reader.result);
  //         reader.onerror = error => reject(error);
  //     });
  // }

  const beforeUpload = (file) => {
    const isJpgOrPng = acceptedFileTypes.includes(file.type);
    if (!isJpgOrPng) {
      message.error(
        "You can only upload JPG/PNG, PDF, MS-Excel & MS-PPT file!",
        5
      );
      return false;
    }
    const isLt2M = file.size <= 2 * 1024 * 1024;
    if (!isLt2M) {
      message.error("File size must smaller than 2MB!", 5);
      return false;
    }
    return isJpgOrPng && isLt2M;
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const handleChange = (info) => {
    if (
      info.file.status === "done" ||
      info.file.status === "removed" ||
      info.file.status === "uploading"
    ) {
      let { fileList = [] } = info || {};
      let uploadedList = [];
      for (let file of fileList) {
        const isJpgOrPng = acceptedFileTypes.includes(file.type);
        const isLt2M = file.size <= 2 * 1024 * 1024;
        if (isJpgOrPng && isLt2M) {
          uploadedList.push(file);
        }
      }
      setFileList(uploadedList);
      return;
    }
  };

  const onFinish = (values) => {
    // console.log('Received values of form: ', values);
    let isAnonymousUser = true;
    if (props.initialValues && props.initialValues.profileId) {
      isAnonymousUser = false;
    }

    let { sellerDetails = {} } = props;
    let { vanityId = "" } = sellerDetails || {};

    let data = {
      profileId:
        (props.initialValues && props.initialValues.profileId) || "anonymous",
      profileType: props.initialValues && props.initialValues.profileType,
      isAnonymousUser: isAnonymousUser,
      queryCategory: values.category,
      questions: values.requirementDetails,
      quantityRequired: values.quantity,
      targetUnitPrice: values.pricePerItem,
      targetDeliveryDate: values.deliveryDate,
      requesterName: values.requesterName,
      companyName: values.companyName,
      emailId: values.emailId,
      country: values.destinationCountry,
      mobileNo: values.mobileNo,
      zipcode: values.zipcode,
      destinationCountry: values.destinationCountry,
      scpURL: process.env.NEXT_PUBLIC_URL + "/seller/" + vanityId,
      vanityId: vanityId,
      rfqType: "SELLER",
      sellerId: props.sellerDetails.id.split("::")[2],
      buyerId: props.userId && props.userId.split("::")[1],
      sellerBrandName: props.sellerDetails.brandName,
    };

    if (keycloak.authenticated) {
      data.profileId = keycloak.subject;
      data.isAnonymousUser = false;
    }
    // console.log('Received values of form: ', values);
    if (values.upload && values.upload.fileList) {
      data.attachments = values.upload.fileList.map((fileobj) => {
        return fileobj.response;
      });
    }

    // console.log(data);
    setLoading(true);

    fetch("https://ipapi.co/json/", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((result) => {
        let { ip = "", country = "" } = result;
        data.fromIP = ip;
        data.ipCountry = country;
        fetch(
          process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/forms/queries",
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + props.token,
            },
          }
        )
          .then((res) => {
            // console.log(res);
            if (res.ok) {
              // message.success('Your query has been sent successfully.', 5);
              props.sendQueryCancel("success");
            } else {
              message.error(res.statusText, 5);
              setErrors(
                errors.concat({
                  atStage: "Error while sending",
                  message: res.statusText,
                })
              );
            }
            setLoading(false);
          })
          .catch((err) => {
            message.error(err.message, 5);
            setErrors(errors.concat(err));
            setLoading(false);
          });
      })
      .catch((err) => {
        message.error(err.message, 5);
        setErrors(errors.concat(err));
        setLoading(false);
      });
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  // const children = [];
  // for (let i = 0; i < 5; i++) {
  //     children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  // }

  // const displayErrors = errors => errors.map((err, i) => <Alert key={i} type="error" message={err.atStage} description={err.message} closable />)

  const country = (
    <Select placeholder="Select country" showSearch>
      {getCountries().map((country) => {
        // console.log(country);
        if (country === "US") {
          return (
            <Option key={country} value={en[country] + "(USA)"}>
              {en[country]}
            </Option>
          );
        }
        return (
          <Option key={country} value={en[country]}>
            {en[country]}
          </Option>
        );
      })}
    </Select>
  );

  let assetUrl =
    process.env.NEXT_PUBLIC_REACT_APP_API_ASSETS_URL +
    "/assets?sourceService=forms";

  if (props.initialValues && props.initialValues.profileId) {
    assetUrl =
      process.env.NEXT_PUBLIC_REACT_APP_API_ASSETS_URL +
      "/assets?sourceService=forms&userId=" +
      props.initialValues.profileId;
  }

  return (
    <Row id="seller-contact-form">
      <Col className="left-details" span={mediaMatch.matches ? 8 : 0}>
        <Row>
          <Col span={props.sellerDetails ? 24 : 0}>
            <div
              className="left-verified-seller"
              style={{ marginTop: "140px" }}
            >
              <p className="heading">Seller details</p>
              <div className="para">
                {/* <Avatar
                  size={40}
                  src={
                    props.sellerDetails &&
                    props.sellerDetails.brandLogo &&
                    props.sellerDetails.brandLogo.media &&
                    props.sellerDetails.brandLogo.media.mediaUrl &&
                    process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                      props.sellerDetails.brandLogo.media.mediaUrl
                  }
                ></Avatar> */}
                <span className="text-avatar">
                  {props.sellerDetails && props.sellerDetails.orgName}
                </span>
                {/* {props.sellerDetails &&
                  props.sellerDetails.verificationStatus &&
                  (props.sellerDetails.verificationStatus === "VERIFIED" ||
                    props.sellerDetails.verificationStatus ===
                      "REGISTERED") && ( */}
                {/* <span
                  style={{
                    color: "#d9bb7f",
                    verticalAlign: "middle",
                  }}
                >
                  <Icon component={certifiedIcon} className="certified-icon" />
                </span> */}
                {/* )} */}
              </div>
              {/* <p className="para">
                <span className="label">Organisation type</span>
                <span className="text">
                  {props.sellerDetails && props.sellerDetails.orgType}
                </span>
              </p> */}

              <Row className="para">
                <Col span={24}>
                  <span className="label">City</span>
                  {/* </Col> */}
                  {/* <Col span={24} className="qa-txt-alg-lft"> */}
                  <span className="text">
                    {props.sellerDetails && props.sellerDetails.city}
                  </span>
                </Col>
              </Row>

              <Row className="para">
                <Col span={24}>
                  <span className="label">Country</span>
                  {/* </Col> */}
                  {/* <Col span={24} className="qa-txt-alg-lft"> */}
                  <span className="text">
                    {props.sellerDetails && props.sellerDetails.country}
                  </span>
                </Col>
              </Row>

              {/* <p className="para">
                <span className="label">City</span>
                <span className="text">
                  {props.sellerDetails && props.sellerDetails.city}
                </span>
              </p>
              <p className="para">
                <span className="label">Country</span>
                <span className="text">
                  {props.sellerDetails && props.sellerDetails.country}
                </span>
              </p> */}
            </div>
          </Col>
          <Col
            span={
              props.initialValues && props.initialValues.profileType ? 0 : 24
            }
          >
            <div className="left-verified-seller rfq-benefits-section">
              <p className="heading">
                Benefits of buying
                <br />
                on Qalara
              </p>
              <p className="para">
                1. A growing selection of artisanal, ecofriendly, organic,
                recycled, fair & social and sustainable products and suppliers
              </p>
              <p className="para">
                2. Verified producers and transparent practices
              </p>
              <p className="para">3. Small-to-mid sized buyer friendly terms</p>
              <p className="para">
                4. One stop sourcing platform from discovery to delivery
              </p>
              <p className="para">5. Secure digital commerce</p>
            </div>
          </Col>
          {/* <Col
            span={
              props.initialValues && props.initialValues.profileType ? 24 : 0
            }
          >
            <div className="left-verified-seller">
              <p className="heading">
                {props.initialValues &&
                props.initialValues.profileType &&
                props.initialValues.profileType === "SELLER"
                  ? "Seller"
                  : "Buyer"}{" "}
                details
              </p>
              <Row className="para">
                <Col span={12}>
                  <span className="label">First name</span>
                </Col>
                <Col span={12} className="qa-txt-alg-rgt">
                  <span className="text">
                    {props.initialValues && props.initialValues.firstName}
                  </span>
                  {props.initialValues &&
                    props.initialValues.verificationStatus &&
                    (props.initialValues.verificationStatus === "VERIFIED" ||
                      props.initialValues.verificationStatus ===
                        "REGISTERED") && (
                      <span
                        style={{
                          color: "#d9bb7f",
                          verticalAlign: "middle",
                          marginLeft: "3px",
                        }}
                      >
                        <Icon
                          component={certifiedIcon}
                          className="certified-icon"
                        />
                      </span>
                    )}
                </Col>
              </Row>

              <Row className="para">
                <Col span={12}>
                  <span className="label">Organisation type</span>
                </Col>
                <Col span={12} className="qa-txt-alg-rgt">
                  <span className="text">
                    {props.initialValues && props.initialValues.orgType}
                  </span>
                </Col>
              </Row>

              <Row className="para">
                <Col span={12}>
                  <span className="label">Country</span>
                </Col>
                <Col span={12} className="qa-txt-alg-rgt">
                  <span className="text">
                    {props.initialValues && props.initialValues.country}
                  </span>
                </Col>
              </Row>
            </div>
          </Col> */}
        </Row>
      </Col>
      <Col
        span={mediaMatch.matches ? 16 : 24}
        style={{ marginBottom: 0, padddinBoBottem: 0 }}
        className="register"
      >
        <Row justify="center">
          <Col span={20}>
            {keycloak.authenticated ? null : (
              <Alert
                className="alert-info-top"
                type="info"
                description={
                  <p className="alert-paragraph">
                    Creating an RFQ will be faster and easier as a signed-in
                    user. Please click below: <br />
                    <Button
                      className="alert-button"
                      type="link"
                      onClick={() => {
                        loginToApp(keycloak, {
                          currentPath: router.asPath.split("?")[0],
                        });
                      }}
                    >
                      {" "}
                      SIGN IN/ SIGN UP
                    </Button>
                  </p>
                }
              />
            )}
            <p className="heading">Send order query</p>
            <p className="paragraph">
              You may share any sourcing requirement relating to this seller's
              portfolio, or even share your own designs for the seller to
              produce. We will contact the seller and respond with product
              images and quotation within 2 business days.
            </p>
          </Col>
        </Row>
        {/* {errors.length > 0 && (
                    <div style={{ textAlign: 'left' }}>
                        {displayErrors(errors)}
                    </div>
                )} */}
        <Form
          form={form}
          name="seller_contact_form"
          initialValues={props.initialValues}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row justify="center">
            <Col span={20}>
              {/* <span className="label-heading">
                What would you like help sourcing from India?
              </span>
              <br /> */}
              <span className="label-paragraph">What are you looking for?</span>
              <Form.Item
                name="category"
                style={{ marginBottom: "1em" }}
                // label='I am looking for'
                rules={[
                  { required: true, message: "Please select a category." },
                ]}
              >
                <Select showSearch placeholder="Select category">
                  <Option key={0} value="Rugs & Carpets">
                    Rugs & Carpets
                  </Option>
                  <Option key={1} value="Art & Decor">
                    Art & Decor
                  </Option>
                  <Option key={2} value="Home Furnishings">
                    Home Furnishings
                  </Option>
                  <Option key={3} value="Kitchen">
                    Kitchen
                  </Option>
                  <Option key={4} value="Others">
                    Others
                  </Option>
                </Select>
              </Form.Item>
              {/* <Form.Item
                        name="greeting"
                        rules={[
                            {
                                type: 'string',
                                message: 'The input is not valid message!',
                            },
                            {
                                required: true,
                                message: 'Please input your message!',
                            },
                            { min: 30, max: 150, message: 'Message length should be 30-150 characters!' }
                        ]}
                    >
                        <Input.TextArea
                            value={"value"}
                            // onChange={onChange}
                            placeholder="Greeting"
                            autoSize={{ minRows: 1, maxRows: 5 }} />
                    </Form.Item> */}
              <span className="label-paragraph">
                Please share product details (include product code with any
                customization requirements, if available). The more details the
                better.
              </span>
              <Form.Item
                name="requirementDetails"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    type: "string",
                    message: "The input is not valid!",
                  },
                  {
                    required: true,
                    message: "Please enter your requirement.",
                  },
                  {
                    min: 5,
                    max: 500,
                    message: "Message must be in 5-500 characters",
                  },
                ]}
              >
                <Input.TextArea
                  value={"value"}
                  // onChange={onChange}
                  // placeholder="Please input the details here"
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </Form.Item>
              {/* <Form.Item
                        name="requirement"
                        rules={[{ required: true, message: 'Please input requirements!' },
                        { min: 3, max: 30, message: 'Length should be 3-30 characters!' }]}
                    >
                        <Input
                            // prefix={<ShopOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="What do you need from the seller?"
                        />
                    </Form.Item> */}
              {/* <Form.Item
                        name="requirement"
                        rules={[{ required: true, message: 'Please select the item.' }]}
                    >
                        <Select style={{ flex: '0' }} showSearch placeholder="What do you need from the seller?">
                            {children}
                        </Select>
                    </Form.Item> */}
              <span className="label-paragraph">
                Please attach reference photos of designs you like.{" "}
                <b>Highly recommended</b>
              </span>
              <br />
              <Form.Item
                name="upload"
                style={{ marginBottom: "1em" }}
                // rules={[{ required: true, message: 'Please upload atleast one item.' }]}
                // getValueFromEvent={normFile}
                extra={
                  <span className="label-paragraph">
                    Max Size per attachment: 2Mb
                  </span>
                }
                style={{ marginBottom: "0.2em" }}
              >
                <Upload
                  name="files"
                  listType="picture-card"
                  fileList={fileList}
                  action={assetUrl}
                  headers={{
                    Authorization: "Bearer " + props.token,
                  }}
                  // className="avatar-uploader"
                  beforeUpload={beforeUpload}
                  onPreview={onPreview}
                  onChange={handleChange}
                  multiple
                >
                  {fileList.length >= 10 ? null : <PlusOutlined />}
                </Upload>
              </Form.Item>
              <span className="label-paragraph">
                What is the quantity that you're looking to order?*
              </span>
              <Form.Item
                name="quantity"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    type: "string",
                    message: "The input is not valid!",
                  },
                  {
                    required: true,
                    message: "Please enter the quantity.",
                  },
                  {
                    min: 1,
                    max: 50,
                    message: "Length should be 1-50 characters!",
                  },
                ]}
              >
                <Input
                // style={{
                //     width: '100%',
                // }}
                // min={1}
                // max={1000}
                // placeholder="Quantity"
                />
              </Form.Item>
              <span className="label-paragraph">
                What is your target cost (USD)?
              </span>
              <Form.Item
                name="pricePerItem"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    type: "string",
                    message: "The input is not valid!",
                  },
                  {
                    min: 1,
                    max: 50,
                    message: "Length should be 1-50 characters!",
                  },
                ]}
              >
                <Input
                // style={{
                //     width: '100%',
                // }}
                // min={1}
                // max={1000000}
                // placeholder="Target price per piece (In USD)"
                />
              </Form.Item>
              <span className="label-paragraph">
                What is your required delivery date?
              </span>
              <Form.Item
                name="deliveryDate"
                placeholder=""
                style={{ marginBottom: "1em" }}
              >
                <DatePicker
                  disabledDate={disabledDate}
                  style={{ width: "100%" }}
                  // placeholderplaceholder="Target delivery date"
                />
              </Form.Item>
              <span className="label-paragraph">Destination Country*</span>
              <Form.Item
                name="destinationCountry"
                style={{ marginBottom: "1em" }}
                rules={[
                  { required: true, message: "Please select your country." },
                ]}
              >
                {country}
              </Form.Item>
              <span className="label-paragraph">Destination Pin Code*</span>
              <Form.Item
                name="zipcode"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your zipcode.",
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              {/* <span className="label-paragraph">Destination City, State*</span>
              <Form.Item
                name="destinationCity"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    required: true,
                    message: "Please input State & City name!",
                  },
                  {
                    min: 3,
                    max: 50,
                    message: "Length should be 3-50 characters!",
                  },
                ]}
              >
                <Input
                // placeholder="State, City"
                />
              </Form.Item> */}
              <br />
              <div className="label-heading qa-lh">
                Please share your details so we can respond:
              </div>
              <span
                className="label-paragraph"
                style={{ marginBottom: "0.5em", marginTop: "0.5em" }}
              >
                Your information is safe with us.
              </span>
              <br />
              {/* <p style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '0.5em' }}>From,</p> */}
              <span className="label-paragraph">Your name*</span>
              <Form.Item
                name="requesterName"
                style={{ marginBottom: "1em" }}
                rules={[
                  { required: true, message: "Please enter your name." },
                  {
                    min: 3,
                    max: 50,
                    message: "Length should be 3-50 characters!",
                  },
                ]}
              >
                <Input
                // placeholder="Your Name"
                />
              </Form.Item>
              <span className="label-paragraph">Company name*</span>
              <Form.Item
                name="companyName"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    required: true,
                    message: "Please enter your company name.",
                  },
                  {
                    min: 3,
                    max: 50,
                    message: "Length should be 3-50 characters!",
                  },
                ]}
              >
                <Input
                // placeholder="Company Name"
                />
              </Form.Item>
              <span className="label-paragraph">Email address*</span>
              <Form.Item
                name="emailId"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    type: "email",
                    message: "Please enter a correct email address.",
                  },
                  {
                    required: true,
                    message: "Please enter your email address.",
                  },
                ]}
              >
                <Input
                // placeholder="E-mail ID"
                />
              </Form.Item>
              {/* <span className="label-paragraph">Country*</span>
              <Form.Item
                name="country"
                style={{ marginBottom: "1em" }}
                rules={[
                  { required: true, message: "Please select your country." },
                ]}
              >
                {country}
              </Form.Item>
              <span className="label-paragraph">City, State</span>
              <Form.Item
                name="city"
                style={{ marginBottom: "1em" }}
                rules={[
                  // { required: true, message: 'Please input State & City name!' },
                  {
                    min: 3,
                    max: 50,
                    message: "Length should be 3-50 characters!",
                  },
                ]}
              >
                <Input
                // placeholder="State, City"
                />
              </Form.Item> */}
              <span className="label-paragraph">Phone number</span>
              <Form.Item
                name="mobileNo"
                style={{ marginBottom: "1em" }}
                rules={[
                  // {
                  //     required: true,
                  //     message: 'Please input contact number!',
                  // },
                  {
                    pattern: new RegExp("^[0-9]{6,15}$"),
                    message: "Wrong format!",
                  },
                ]}
              >
                <Input
                // placeholder="Phone Number"
                />
              </Form.Item>
              {/* <Form.Item
                        name="liveDemoInterest"
                        valuePropName="checked"
                        style={{ marginBottom: '0.2em' }}
                    >
                        <Checkbox>
                            I am interested in live demo with seller.
                        </Checkbox>
                    </Form.Item> */}
              <Form.Item
                name="agreement"
                style={{ marginBottom: "1em" }}
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject("Please accept the agreement."),
                  },
                ]}
              >
                <Checkbox className="check-box-tnc">
                  Standard{" "}
                  <Link className="link-text" href="/TermsOfUse">
                    <a target="_blank" className="link-text">
                      T&C
                    </a>
                  </Link>{" "}
                  apply.
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ margin: "0" }}>
            <Button
              type="primary"
              loading={loading}
              disabled={loading}
              htmlType="submit"
              className="submit-button"
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default SellerContact;
