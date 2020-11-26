/** @format */

import React, { useState, useEffect } from "react";
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
  DatePicker,
} from "antd";
import Icon, { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { loginToApp } from "../AuthWithKeycloak";
import addToCollectionIcon from "../../public/filestore/addToCollection";
import Link from "next/link";
import { useRouter } from "next/router";
const { Option } = Select;

const ProductContact = (props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const mediaMatch = window.matchMedia("(min-width: 768px)");

  const { keycloak } = useKeycloak();

  let {
    productDetails = {},
    selectedColor = "",
    selectedSize = "",
    showPrice = false,
    currencyDetails = {},
  } = props;

  let {
    articleId = "",
    productName = "",
    variants = [],
    skus = [],
    exfactoryListPrice = "",
    priceMin = "",
    heroImageUrl = "",
  } = productDetails || {};

  let galleryImages = [];
  let url = process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL;
  if (variants.length) {
    for (let list of variants) {
      if (list["mediaUrls"].length) {
        galleryImages.push(url + list["mediaUrls"][0]);
      }
    }
  }
  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "image/jpeg",
    "image/png",
  ];

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
    let isAnonymousUser = true;
    if (props.initialValues && props.initialValues.profileId) {
      isAnonymousUser = false;
    }

    let variantId = variants.length > 0 ? variants[0].sequenceId : "";
    let skuId = skus.length > 0 ? skus[0].id : "";
    for (let variant of variants) {
      if (variant.color === selectedColor) {
        variantId = variant["sequenceId"];
      }
    }

    for (let sku of skus) {
      if (sku.variantId === variantId) {
        if (selectedSize) {
          if (
            sku["variantInfo"] &&
            sku["variantInfo"]["size"] &&
            sku["variantInfo"]["size"] === selectedSize
          ) {
            skuId = sku["id"];
          }
        } else {
          skuId = sku["id"];
        }
      }
    }

    let data = {
      profileId:
        (props.initialValues && props.initialValues.profileId) || "anonymous",
      profileType: props.initialValues && props.initialValues.profileType,
      isAnonymousUser: isAnonymousUser,
      queryCategory: values.category || "Others",
      questions: values.requirementDetails || "Product RFQ",
      quantityRequired: values.quantity,
      targetUnitPrice: values.pricePerItem,
      targetDeliveryDate: values.deliveryDate,
      requesterName: values.requesterName,
      companyName: values.companyName,
      emailId: values.emailId,
      country: values.country || values.destinationCountry,
      mobileNo: values.mobileNo,
      zipcode: values.zipcode,
      destinationCountry: values.destinationCountry,
      rfqType: "PRODUCT",
      articleId: articleId,
      variantId: variantId,
      pdpURL: process.env.NEXT_PUBLIC_URL + "/product/" + articleId,
      skuId: skuId,
      sellerId: props.sellerDetails.id.split("::")[2],
      buyerId: props.userId && props.userId.split("::")[1],
      productName: props.productDetails.productName,
    };

    if (keycloak.authenticated) {
      data.profileId = keycloak.subject;
      data.isAnonymousUser = false;
    }
    if (values.upload && values.upload.fileList) {
      data.attachments = values.upload.fileList.map((fileobj) => {
        return fileobj.response;
      });
    }

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
            if (res.ok) {
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

  const country = (
    <Select placeholder="Select country" showSearch>
      {getCountries().map((country) => {
        if (country === "US") {
          return (
            <Option key={country} value={en[country] + "(USA)"}>
              {en[country]}
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
  let imageUrl1;
  let imageUrl2;

  if (heroImageUrl) {
    imageUrl1 =
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL + heroImageUrl;
    imageUrl2 = galleryImages[0];
  } else {
    imageUrl1 = galleryImages[0];
    imageUrl2 = galleryImages[1];
  }

  let displayPrice = priceMin || exfactoryListPrice;
  let { convertToCurrency = "" } = currencyDetails || {};

  return (
    <Row id="seller-contact-form">
      <Col className="left-details" span={mediaMatch.matches ? 8 : 0}>
        <Row>
          {showPrice && (
            <Col span={24} className="left-verified-seller">
              <div
                style={{ backgroundColor: "#f2f0eb", padding: "17px" }}
                className="qa-pos-rel"
              >
                <Icon
                  component={addToCollectionIcon}
                  className="atc-icon"
                  style={{
                    width: "30px",
                    verticalAlign: "middle",
                    marginRight: "5px",
                  }}
                />
                <span className="custom-quote-atc">Save to collection</span>
                <div className="custom-quote-text">
                  If you would like to Get Custom Quote for multiple products,
                  you can now use our new Save to Collection feature and send a
                  combined Quote request easily
                </div>
                <span className="custom-quote-new">
                  <span>NEW</span>
                </span>
              </div>
            </Col>
          )}
          <Col span={props.productDetails ? 24 : 0}>
            <div
              className="left-verified-seller"
              style={{ marginTop: showPrice ? "0px" : "140px" }}
            >
              <div className="heading qa-tc-f" style={{ marginBottom: "20px" }}>
                {productName}
              </div>

              {/* {showPrice && (
                <div className="qa-tc-f">
                  <span
                    style={{
                      fontSize: "20px",
                      fontFamily: "Butler",
                      color: "#f9f7f2",
                      verticalAlign: "middle",
                    }}
                  >
                    {getSymbolFromCurrency(convertToCurrency)}
                    {getConvertedCurrency(displayPrice)}
                  </span>
                  {priceMin && (
                    <span className="qa-tc-f qa-fs-17 qa-font-butler qa-va-m">
                      {" "}
                      - {getSymbolFromCurrency(convertToCurrency)}
                      {getConvertedCurrency(exfactoryListPrice)}
                    </span>
                  )}

                  <div className="qa-font-san  qa-dark-body">
                    Suggested retail price : <b>${suggestedRetailPrice}</b>
                  </div> 
                </div>
              )} */}
              <div className="qa-fs-12 qa-mar-btm-2 qa-font-san qa-dark-body qa-lh">
                Base price per unit excl. margin and other charges
              </div>
              <div>
                <div
                  style={{
                    display: "inline-block",
                    width: "50%",
                    padding: "5px",
                  }}
                >
                  <img src={imageUrl1} alt="Hero" width="100%" />
                </div>
                {/* <div
                  style={{
                    display: "inline-block",
                    width: "50%",
                    padding: "5px",
                  }}
                >
                  <img src={imageUrl2} alt="Variant" width="100%" />
                </div> */}
              </div>
            </div>
          </Col>

          <Col span={props.sellerDetails ? 24 : 0}>
            <div className="left-verified-seller">
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
                {/* <span
                  style={{
                    color: "#d9bb7f",
                    verticalAlign: "middle",
                  }}
                >
                  <Icon component={certifiedIcon} className="certified-icon" />
                </span> */}
              </div>

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
          {!mediaMatch.matches && showPrice && (
            <Col span={20}>
              <div
                style={{
                  backgroundColor: "#E5E3DF",
                  padding: "17px",
                  marginTop: "30px",
                }}
                className="qa-pos-rel"
              >
                <Icon
                  component={addToCollectionIcon}
                  className="atc-icon"
                  style={{
                    width: "30px",
                    verticalAlign: "middle",
                    marginRight: "5px",
                  }}
                />
                <span className="custom-quote-atc">Save to collection</span>
                <div className="custom-quote-text">
                  If you would like to Get Custom Quote for multiple products,
                  you can now use our new Save to Collection feature and send a
                  combined Quote request easily
                </div>
                <span className="custom-quote-new">
                  <span>NEW</span>
                </span>
              </div>
            </Col>
          )}

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
            <p className="heading">Get custom quote</p>

            <p className="paragraph">
              Please share your order requirement or any customization request
              for this product. We will respond with images and quotation within
              2 business days.
            </p>
          </Col>
        </Row>
        <Form
          form={form}
          name="seller_contact_form"
          initialValues={props.initialValues}
          onFinish={onFinish}
          scrollToFirstError
        >
          <Row justify="center">
            <Col span={20}>
              {/* <span className="label-paragraph">What are you looking for?</span> */}
              {/* <Form.Item
                name="category"
                style={{ marginBottom: "1em" }}
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
              </Form.Item> */}

              <span className="label-paragraph">
                Please share any customization requirement (color, size, etc.)
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
                  autoSize={{ minRows: 2, maxRows: 4 }}
                />
              </Form.Item>

              <span className="label-paragraph">
                Please attach reference photos of designs you like.{" "}
                <b>Highly recommended</b>
              </span>
              <br />
              <Form.Item
                name="upload"
                style={{ marginBottom: "1em" }}
                extra={
                  <span className="label-paragraph">
                    Max Size per attachment: 2Mb
                  </span>
                }
              >
                <Upload
                  name="files"
                  listType="picture-card"
                  fileList={fileList}
                  action={assetUrl}
                  headers={{
                    Authorization: "Bearer " + props.token,
                  }}
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
                  { required: true, message: "Please enter the quantity." },
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
                <Input />
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
                <Input />
              </Form.Item> */}
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
                <Input />
              </Form.Item> */}
              <br />
              <span className="label-heading">
                Please share your details so we can respond:
              </span>
              <br />
              <span
                className="label-paragraph"
                style={{ marginBottom: "0.5em", marginTop: "0.5em" }}
              >
                Your information is safe with us.
              </span>
              <br />
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
                <Input />
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
                <Input />
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
                <Input />
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
                  {
                    min: 3,
                    max: 50,
                    message: "Length should be 3-50 characters!",
                  },
                ]}
              >
                <Input />
              </Form.Item> */}
              <span className="label-paragraph">Phone number</span>
              <Form.Item
                name="mobileNo"
                placeholder="Enter country code and number"
                style={{ marginBottom: "1em" }}
                rules={[
                  {
                    pattern: new RegExp("^[0-9]{6,15}$"),
                    message: "Wrong format!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

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
                  <Link href="/TermsOfUse">
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
      <Col className="left-details" span={mediaMatch.matches ? 0 : 24}>
        <Row>
          <Col span={props.productDetails ? 24 : 0}>
            <div className="left-verified-seller">
              <div className="heading qa-tc-f" style={{ marginBottom: "20px" }}>
                {productName}
              </div>

              {/* <div className="qa-tc-f">
                <span
                  style={{
                    fontSize: "20px",
                    fontFamily: "Butler",
                    color: "#f9f7f2",
                    verticalAlign: "middle",
                  }}
                >
                  ${priceMin || exfactoryListPrice}
                </span>
                {priceMin && (
                  <span className="qa-tc-f qa-fs-17 qa-font-butler qa-va-m">
                    {" "}
                    - ${exfactoryListPrice}
                  </span>
                )}

                <div className="qa-font-san  qa-dark-body">
                  Suggested retail price : <b>${suggestedRetailPrice}</b>
                </div>
              </div> */}
              <div className="qa-mar-btm-1 qa-font-san qa-dark-body qa-fs-12 qa-lh">
                Base price per unit excl. margin and other charges
              </div>
              <div>
                <div
                  style={{
                    display: "inline-block",
                    width: "50%",
                  }}
                >
                  <img src={imageUrl1} alt="Hero" width="100%" />
                </div>
                {/* <div
                  style={{
                    display: "inline-block",
                    width: "50%",
                    padding: "5px",
                  }}
                >
                  <img src={imageUrl2} alt="Variant" width="100%" />
                </div> */}
              </div>
            </div>
          </Col>

          <Col span={props.sellerDetails ? 24 : 0}>
            <div className="left-verified-seller">
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

                {/* <span
                  style={{
                    color: "#d9bb7f",
                    verticalAlign: "middle",
                  }}
                >
                  <Icon component={certifiedIcon} className="certified-icon" />
                </span> */}
              </div>
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
          </Col>
        */}
        </Row>
      </Col>
    </Row>
  );
};

export default ProductContact;
