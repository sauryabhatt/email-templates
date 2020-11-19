/** @format */

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Upload,
  message,
  InputNumber,
  DatePicker,
  Modal,
  Select,
} from "antd";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import deleteIcon from "../../public/filestore/deleteIcon";
import Icon from "@ant-design/icons";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import closeButton from "../../public/filestore/closeButton";
import getSymbolFromCurrency from "currency-symbol-map";
import { connect } from "react-redux";
import { getCollections } from "../../store/actions";

const { Option } = Select;

const CollectionDetails = (props) => {
  let {
    collections = {},
    setCollectionDetails = "",
    setCollectionName = "",
    currencyDetails = {},
    token = "",
    userProfile = {},
    collectionName = "",
    buyerId = "",
    refreshCollection = "",
  } = props;

  const router = useRouter();

  useEffect(() => {
    // window.scrollTo(0, 0);
    if (props && props.collections) {
      let { products = [], rfqCreated = false } = props.collections || {};
      setProducts(products);
      setRfqSubmitted(rfqCreated);
    }
  }, [props.collections]);

  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [products, setProducts] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [RFQ, setRFQ] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [formVal, setFormval] = useState();

  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let { createdTime = "" } = collections;
  let date = new Date(createdTime);
  let month = monthNames[date.getMonth()];
  let year = date.getFullYear();

  const [form] = Form.useForm();
  const [rfqform] = Form.useForm();
  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "image/jpeg",
    "image/png",
  ];
  let assetUrl =
    process.env.NEXT_PUBLIC_REACT_APP_API_ASSETS_URL +
    "/assets?sourceService=forms";

  let { convertToCurrency = "" } = currencyDetails || {};

  const getConvertedCurrency = (baseAmount) => {
    let { convertToCurrency = "", rates = [] } = currencyDetails || {};
    return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(2);
  };

  const onFinishRFQ = (values) => {
    let {
      destinationCountry = "",
      deliveryDate = "",
      destinationCity = "",
      zipcode = "",
      requirementDetails = "",
    } = values || {};
    let { upload = [] } = formVal;
    let {
      profileId = "",
      profileType = "",
      email = "",
      firstName = "",
      orgName = "",
      orgPhone = "",
    } = userProfile || {};
    let data = {
      profileId: profileId,
      profileType: profileType,
      targetDeliveryDate: deliveryDate,
      requesterName: firstName,
      companyName: orgName,
      emailId: email,
      mobileNo: orgPhone,
      destinationCountry: destinationCountry,
      destinationCity: destinationCity || "",
      zipcode: zipcode,
      rfqType: "COLLECTION",
      buyerId: buyerId,
      remarks: requirementDetails,
      collectionName: collectionName,
    };
    if (upload && upload.fileList) {
      data.attachments = upload.fileList.map((fileobj) => {
        return fileobj.response;
      });
    }

    let productList = [];
    let i = 0;
    for (let product of products) {
      let { articleId = "" } = product;
      let obj = {};
      obj["articleId"] = articleId;
      obj["quantity"] = formVal["quantity-" + i];
      obj["remarks"] = formVal["remarks-" + i];
      productList.push(obj);
      i++;
    }

    data.products = productList;

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
              Authorization: "Bearer " + token,
            },
          }
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw res.statusText || "Error while signing up.";
            }
          })
          .then((res) => {
            setRFQ(false);
            setRfqSubmitted(true);
            setSuccessQueryVisible(true);
            setFileList([]);
            form.resetFields();
          })
          .catch((err) => {
            message.error(err.message || err, 5);
            setRFQ(false);
          });
      })
      .catch((err) => {
        message.error(err.message, 5);
      });
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
  };

  const deleteProductFromCollection = (articleId = "", collectionName = "") => {
    let url =
      process.env.NEXT_PUBLIC_REACT_APP_COLLECTION_URL +
      "/collections/buyer/product?buyer_id=" +
      buyerId +
      "&article_id=" +
      articleId +
      "&collection=" +
      collectionName;
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          props.getCollections(token, buyerId, (res) => {
            message.success("Product has been removed from collection!", 5);
            for (let list of res) {
              let { products = [], name = "" } = list;
              if (name === collectionName) {
                setProducts(products);
              }
            }
            refreshCollection(res);
          });
          // return res.json();
        } else {
          throw res.statusText || "Error in create order";
        }
      })
      .catch((err) => {
        message.error(err.message || err, 5);
      });
  };

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

  const handleChange = (info) => {
    if (
      info.file.status === "uploading" ||
      info.file.status === "done" ||
      info.file.status === "removed"
    ) {
      setFileList(info.fileList);
      return;
    }
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

  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

  const onCheck = () => {
    form
      .validateFields()
      .then((values) => {
        setRFQ(true);
        setFormval(values);
      })
      .catch((err) => {
        message.error("Please select quantity", 5);
      });
  };

  return (
    <React.Fragment>
      <Col xs={24} sm={24} md={22} lg={22}>
        <Form form={form} name="upload_reference_form" scrollToFirstError>
          <Row className="qa-mar-btm-2">
            <Col xs={24} sm={24} md={24} lg={24}>
              <Row style={{ backgroundColor: "#E6E4DF" }}>
                <React.Fragment>
                  <Col xs={10} sm={10} md={10} lg={10} className="qa-pad-015">
                    <div className="collection-name qa-mar-left-20">
                      {collectionName}
                    </div>
                    <div className="collection-stitle qa-mar-left-20">
                      Created {month} {year}
                    </div>
                  </Col>
                </React.Fragment>

                <Col
                  xs={14}
                  sm={14}
                  md={14}
                  lg={14}
                  className="qa-pad-01 qa-txt-alg-rgt"
                >
                  {mediaMatch.matches && (
                    <span>
                      {rfqSubmitted ? (
                        <div className="rfq-text mt-10">
                          Request for quote submitted!
                        </div>
                      ) : (
                        <div className="rfq-text">
                          This collection gets automatically appended to your
                          RFQ
                        </div>
                      )}
                    </span>
                  )}

                  <Button
                    disabled={rfqSubmitted || products.length === 0}
                    htmlType="submit"
                    onClick={onCheck}
                    className="c-request-for-quote-button"
                  >
                    REQUEST FOR QUOTE
                  </Button>

                  {!mediaMatch.matches && (
                    <div className="rfq-text-mob">
                      {rfqSubmitted
                        ? "Request for quote submitted"
                        : "This collection gets automatically added to your RFQ"}
                    </div>
                  )}
                </Col>
              </Row>
            </Col>

            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ padding: "20px", backgroundColor: "#F2F0EB" }}
            >
              <Row className="c-upload-section">
                <Col span={24}>
                  <Row justify="center">
                    <Col span={24}>
                      <Form.Item
                        name="upload"
                        extra={
                          <div className="upload-subtext qa-lh qa-mar-top-05">
                            You can upload picture references for any designs
                            you would like
                          </div>
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
                          onChange={handleChange}
                          onPreview={onPreview}
                          multiple
                        >
                          <Button className="upload-ref-img-btn">
                            Upload Pictures
                          </Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row gutter={[30, 0]}>
                <Col span={24} className="c-total-product">
                  TOTAL PRODUCTS: {products.length}
                </Col>
                {products.map((product, k) => {
                  let {
                    imageUrl = "",
                    productName = "",
                    exFactoryPrice = "",
                    minQty = "",
                    articleId = "",
                    moqUnit = "",
                  } = product;

                  return (
                    <Col
                      xs={24}
                      sm={24}
                      md={8}
                      lg={8}
                      key={k}
                      className="qa-mar-btm-1 qa-font-san qa-fs-12"
                    >
                      <div className="aspect-ratio-box">
                        <Link href={`/product/${articleId}`}>
                          <img
                            className="images"
                            src={
                              process.env
                                .NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                              imageUrl
                            }
                            alt="Collection placeholder"
                          ></img>
                        </Link>
                      </div>
                      <Row className="qa-tc-white qa-mar-top-05">
                        <Col span={20}>
                          <div className="qa-text-2line qa-tc-white qa-fw-b qa-lh qa-mar-top-05">
                            {productName || "Product name placeholder"}
                          </div>
                        </Col>
                        <Col span={4} className="qa-txt-alg-rgt qa-mar-top-1">
                          <span
                            onClick={() => {
                              deleteProductFromCollection(
                                articleId,
                                collectionName
                              );
                            }}
                          >
                            <Icon
                              component={deleteIcon}
                              className="delete-icon qa-cursor"
                              style={{
                                width: "12px",
                              }}
                            />
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <div className="qa-tc-white">
                            Base price{" "}
                            <span className="qa-fw-b">
                              {getSymbolFromCurrency(convertToCurrency)}
                              {getConvertedCurrency(exFactoryPrice)}
                            </span>
                          </div>
                          <div
                            className="qa-tc-white"
                            style={{ marginTop: "-3px" }}
                          >
                            Min order qty{" "}
                            <span className="qa-fw-b">
                              {minQty} {moqUnit}
                            </span>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={24}>
                          <Form.Item
                            name={`quantity-${k}`}
                            className="form-item"
                            rules={[
                              {
                                required: true,
                                message: "Please select quantity",
                              },
                              {
                                min: parseInt(minQty),
                                type: "number",
                                message:
                                  "Please add quantity equal or greater than the minimum",
                              },
                              {
                                pattern: new RegExp("^[0-9]*$"),
                                message: "Wrong format!",
                              },
                            ]}
                          >
                            <InputNumber
                              type="number"
                              className="c-qty-box"
                              placeholder="Enter qty"
                            />
                          </Form.Item>
                        </Col>
                        <Col span={24}>
                          <div className="qa-tc-white">
                            Remarks (customization)
                          </div>
                          <Form.Item name={`remarks-${k}`}>
                            <Input.TextArea autoSize={{ minRows: 3 }} />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Col>
                  );
                })}
              </Row>
              <Col xs={24} sm={24} md={24} lg={24}>
                <span
                  className="qa-font-san qa-fs-14 qa-fw-b qa-cursor"
                  style={{
                    color: "#874439",
                    lineHeight: "17px",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                  onClick={() => {
                    setCollectionDetails(false);
                    setCollectionName("");
                  }}
                >
                  View less
                </span>
              </Col>
            </Col>
          </Row>
        </Form>
      </Col>
      <Modal
        visible={RFQ}
        className="c-rfq-modal"
        footer={null}
        closable={false}
        onCancel={() => setRFQ(false)}
        centered
        bodyStyle={{ padding: "0px", backgroundColor: "#f9f7f2" }}
        width={550}
      >
        <div className="qa-font-san">
          <div
            onClick={() => setRFQ(false)}
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
          <div className="qa-mar-top-3">
            <p className="heading">Request for quote</p>
            <p className="paragraph">
              If you’re a buyer, we can help you source products from any
              lifestyle category! Share your requirements below and we will get
              back in 24 hours!
            </p>
          </div>
          <Form
            form={rfqform}
            name="collection_rfq_form"
            onFinish={onFinishRFQ}
            scrollToFirstError
          >
            <Row justify="center">
              <Col span={20}>
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
                {/* <span className="label-paragraph">
                  Destination City, State*
                </span>
                <Form.Item
                  name="destinationCity"
                  style={{ marginBottom: "1em" }}
                  rules={[
                    {
                      required: true,
                      message: "Please select your country.",
                      whitespace: true,
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
                <span className="label-paragraph">
                  Expected delivery date?*
                </span>
                <Form.Item
                  name="deliveryDate"
                  style={{ marginBottom: "1em" }}
                  rules={[
                    { required: true, message: "Please select delivery date" },
                  ]}
                >
                  <DatePicker
                    disabledDate={disabledDate}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <span className="label-paragraph">
                  Please share any other critical information
                </span>
                <Form.Item
                  name="requirementDetails"
                  style={{ marginBottom: "3em" }}
                >
                  <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="submit-collection-rfq"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
      <Modal
        visible={successQueryVisible}
        footer={null}
        closable={true}
        onCancel={successQueryCancel}
        centered
        bodyStyle={{ padding: "0" }}
        width={400}
        className="seller-order-query-submission collection-rfq"
      >
        <div id="send-query-success-modal">
          <div className="send-query-success-modal-content">
            <p className="send-query-success-modal-para1">Thank you!</p>
            <p className="send-query-success-modal-para2">
              Thank you for submitting your Request for Quote. We will revert
              with a Quotation at your registered email address within 48-72
              hours.
            </p>
          </div>
          <Link href="/">
            <Button
              className="send-query-success-modal-button"
              onClick={() => {
                successQueryCancel();
              }}
            >
              Back to home page
            </Button>
          </Link>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default connect(null, { getCollections })(CollectionDetails);
