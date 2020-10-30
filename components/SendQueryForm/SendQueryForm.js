/** @format */

import React, { useState } from "react";
// import { useSelector } from "react-redux";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { loginToApp } from "../AuthWithKeycloak";
// import './index.css';
import Link from "next/link";

const { Option } = Select;

const SendQueryForm = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();

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
    }
    const isLt2M = file.size <= 2 * 1024 * 1024;
    if (!isLt2M) {
      message.error("File size must smaller than 2MB!", 5);
    }
    return isJpgOrPng && isLt2M;
  };

  // const handlePreview = async file => {
  //     if (!file.url && !file.preview) {
  //         file.preview = await getBase64(file.originFileObj);
  //     }
  //     return file.url;
  // };

  const handleChange = (info) => {
    // console.log(info.file.status);
    if (
      info.file.status === "uploading" ||
      info.file.status === "done" ||
      info.file.status === "removed"
    ) {
      setFileList(info.fileList);
      return;
    }
  };

  const onFinish = (values) => {
    // console.log('Received values of form: ', values);
    let isAnonymousUser = true;
    if (props.initialValues && props.initialValues.profileId) {
      isAnonymousUser = false;
    }

    var data = {
      profileId:
        (props.initialValues && props.initialValues.profileId) || "anonymous",
      profileType:
        (props.initialValues && props.initialValues.profileType) || "anonymous",
      isAnonymousUser: isAnonymousUser,
      queryCategory: values.category,
      questions: values.requirementDetails,
      quantityRequired: values.quantinty,
      targetUnitPrice: values.pricePerItem,
      targetDeliveryDate: values.deliveryDate,
      requesterName: values.requesterName,
      companyName: values.companyName,
      emailId: values.emailId,
      country: values.country,
      city: values.city,
      mobileNo: values.mobileNo,
      rfqType: "QALARA",
      buyerId: props.userId && props.userId.split("::")[1],
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
        fetch(process.env.REACT_APP_API_FORM_URL + "/forms/queries", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        })
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
    process.env.REACT_APP_API_ASSETS_URL + "/assets?sourceService=forms";

  if (props.initialValues && props.initialValues.profileId) {
    assetUrl =
      process.env.REACT_APP_API_ASSETS_URL +
      "/assets?sourceService=forms&userId=" +
      props.initialValues.profileId;
  }

  return (
    <Row id="send-query-form">
      <Col span={props.buyerDetails || props.sellerDetails ? 8 : 0}></Col>
      <Col
        span={props.buyerDetails || props.sellerDetails ? 16 : 24}
        style={{ marginBottom: 0, padddinBoBottem: 0 }}
        className="register"
      >
        <Row justify="center">
          <Col span={20}>
            {keycloak.authenticated || props.hideHeader ? null : (
              <Alert
                className="alert-info-top"
                type="info"
                description={
                  <p className="alert-paragraph">
                    Creating an RFQ will be faster and easier as a signed-in
                    user. Please click below:
                    <br />
                    <Button
                      className="alert-button"
                      type="link"
                      onClick={() => {
                        loginToApp(keycloak, {
                          currentPath: router.pathname,
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
            <p className="heading">Request for quote</p>
            <p className="paragraph">
              If you’re a buyer, we can help you source products from any
              lifestyle category! Share your requirements below and we will get
              back in 24 hours!
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
          name="send_query_form"
          initialValues={props.initialValues}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row justify="center">
            <Col span={20}>
              <span className="label-heading">
                What would you like help sourcing from India?
              </span>
              <br />
              <span className="label-paragraph">What are you looking for?</span>
              <Form.Item
                name="category"
                style={{ marginBottom: "1em" }}
                // label='I am looking for'
                rules={[
                  { required: true, message: "Please select a category." },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select category"
                  value={undefined}
                >
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
              <span className="label-paragraph ref-photos">
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
                  <span className="label-paragraph max-size-upload">
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
                  // onPreview={handlePreview}
                  onChange={handleChange}
                  multiple
                >
                  {fileList.length >= 10 ? null : <PlusOutlined />}
                </Upload>
              </Form.Item>
              <span className="label-paragraph order-quantity">
                What is the quantity that you're looking to order?
              </span>
              <Form.Item
                name="quantity"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    type: "string",
                    message: "The input is not valid!",
                  },
                  // {
                  //     required: true,
                  //     message: 'Please enter the quantity.',
                  // },
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
              <br />
              <span className="label-heading" id="user-details">
                Please share your details so we can respond:
              </span>
              <br />
              <span
                className="label-paragraph info-safe"
                style={{ marginBottom: "0.5em" }}
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
              <span className="label-paragraph">Country*</span>
              <Form.Item
                name="country"
                style={{ marginBottom: "1em" }}
                rules={[
                  { required: true, message: "Please select your country." },
                ]}
              >
                {country}
              </Form.Item>
              <div className="city-state-phone">
                <div className="city-state">
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
                  </Form.Item>
                </div>
                <div className="phone">
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
                </div>
              </div>
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
                className="agreement"
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
          </Row>
          <Form.Item style={{ margin: "0" }} className="submit">
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

export default SendQueryForm;
