/** @format */

import React, { useState } from "react";
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
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import categories from "../../public/filestore/categories.json";
import { loginToApp } from "../AuthWithKeycloak";

const { Option } = Select;

const SendQueryForm = (props) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { keycloak } = useKeycloak();

  const { initialValues = {} } = props || {};

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "image/jpeg",
    "image/png",
  ];

  const typeOfCategories = categories.map((v, i) => {
    return (
      <Option key={i} value={v.key}>
        {v.value}
      </Option>
    );
  });

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

  const rfqCall = (data) => {
    fetch(process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/forms/queries", {
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
          form.resetFields();
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
  };

  const onFinish = (values) => {
    let isAnonymousUser = true;
    if (initialValues && initialValues.profileId) {
      isAnonymousUser = false;
    }

    var data = {
      profileId: (initialValues && initialValues.profileId) || "anonymous",
      profileType: (initialValues && initialValues.profileType) || "anonymous",
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
      destinationCountry: values.destinationCountry,
      zipcode: values.zipcode,
      deliverylocationType: values.deliverylocationType,
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
        rfqCall(data);
      })
      .catch((err) => {
        data.fromIP = "";
        data.ipCountry = "";
        rfqCall(data);
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
    <Select
      value={undefined}
      className="country-selector"
      placeholder="Select country"
      showSearch
    >
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

  if (initialValues && initialValues.profileId) {
    assetUrl =
      process.env.NEXT_PUBLIC_REACT_APP_API_ASSETS_URL +
      "/assets?sourceService=forms&userId=" +
      initialValues.profileId;
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
            {/* {keycloak.authenticated || props.hideHeader ? null : (
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
                      SIGN IN/ SIGN UP
                    </Button>
                  </p>
                }
              />
            )} */}
            <p className="heading">Sourcing request</p>
            <p className="paragraph qa-mar-btm-1">
              We can help you source products from any lifestyle category in
              India and South Asia!
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
          initialValues={initialValues}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row justify="center">
            <Col span={20}>
              {/* <span className="label-heading">               
              </span>
              <br /> */}
              <div className="label-paragraph qa-lh">
                Tell us about your brand / business to help us find the right
                match.
              </div>
              <Form.Item
                name="category"
                style={{ marginBottom: "1em" }}
                className="modified-selector"
                // label='I am looking for'
                rules={[
                  {
                    required: true,
                    message: "Please share some details.",
                  },
                  {
                    min: 25,
                    max: 500,
                    message: "Please enter message within 25-500 characters.",
                  },
                ]}
              >
                {/* <Select placeholder="Select category">
                  {typeOfCategories}
                </Select> */}
                <Input.TextArea
                  value={"value"}
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
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
              {/* <span className="label-paragraph">
                Please share product details (include product code with any
                customization requirements, if available). The more details the
                better.
               
              </span> */}
              <div className="label-paragraph qa-lh">
                Please describe the type of products, or services, you're
                looking for.
              </div>
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
                    min: 25,
                    max: 500,
                    message: "Please enter message within 25-500 characters.",
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
              {/* <span className="label-paragraph ref-photos">
                Please attach reference photos of designs you like.{" "}
                <b>Highly recommended</b>
              </span> */}
              <div className="label-paragraph qa-lh ref-photos">
                Attach reference images of designs, if available.
              </div>
              <br />
              <Form.Item
                name="upload"
                style={{ marginBottom: "1em" }}
                // rules={[{ required: true, message: 'Please upload atleast one item.' }]}
                // getValueFromEvent={normFile}
                extra={
                  <span className="qa-mar-top-1 max-size-upload">
                    Max size per attachment: 2MB
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
              <div className="label-paragraph qa-lh">
                Please give an indication of quantities required per product (to
                match the right price and supplier)*
              </div>
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
                    message: "Please enter quantity range.",
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
              {/* <span className="label-paragraph">
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
              </Form.Item> */}
              {/* <span className="label-paragraph">
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
                />
              </Form.Item> */}
              <span className="label-paragraph">Destination Country*</span>
              <Form.Item
                name="destinationCountry"
                style={{ marginBottom: "1em", cursor: "pointer" }}
                rules={[
                  { required: true, message: "Please select your country." },
                ]}
              >
                {country}
              </Form.Item>
              <span className="label-paragraph">Delivery location type</span>
              <Form.Item
                name="deliverylocationType"
                style={{ marginBottom: "1em" }}
                // rules={[
                //   {
                //     required: true,
                //     message: "Please select your delivery location type.",
                //   },
                // ]}
              >
                <Select placeholder="Select location type" showSearch>
                  <Option value="home">Home</Option>
                  <Option value="store">Store</Option>
                  <Option value="office">Office</Option>
                  <Option value="warehouse">Warehouse</Option>
                  <Option value="amazonWarehouse">Amazon Warehouse</Option>
                  <Option value="others">Others</Option>
                  );
                </Select>
              </Form.Item>
              <span className="label-paragraph">
                Destination Pin / Zip Code*
              </span>
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
              {/* <div className="city-state-phone">
                <div className="city-state">
                  <span className="label-paragraph">
                    Destination City, State*
                  </span>
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
                    <Input />
                  </Form.Item>
                </div>
              </div> */}
              <div className="label-heading" id="user-details">
                Please share your details so we can respond:
              </div>

              <div
                className="label-paragraph info-safe"
                style={{ marginBottom: "0.5em", lineHeight: "100%" }}
              >
                Your information is safe with us.
              </div>
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
              {/* <span className="label-paragraph">Company name*</span>
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
              </Form.Item> */}
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
              {/* <span className="label-paragraph">Destination Country*</span>
              <Form.Item
                name="country"
                style={{ marginBottom: "1em" }}
                rules={[
                  { required: true, message: "Please select your country." },
                ]}
              >
                {country}
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
                  <span
                    className="link-text"
                    onClick={() =>
                      window.open(
                        window.location.protocol +
                          "//" +
                          window.location.host +
                          "/TermsOfUse"
                      )
                    }
                  >
                    T&C
                  </span>{" "}
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
