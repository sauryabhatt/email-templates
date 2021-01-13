/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useKeycloak } from "@react-keycloak/ssr";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Checkbox,
  Select,
  message,
  Upload,
  Modal,
} from "antd";
import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { getUserProfile } from "./../../store/actions";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { useRouter } from "next/router";
import additionalCertificateTypes from "../../public/filestore/additionalCertificateTypes.json";
import Spinner from "../Spinner/Spinner";

const { Option } = Select;

const ApplyToSell = (props) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { keycloak } = useKeycloak();
  const [isLoading, setIsLoading] = useState(true);
  const [expandProfile, setExpandProfile] = useState(false);
  const [expandLegal, setExpandLegal] = useState(false);
  const [expandCertificate, setExpandCertificate] = useState(false);
  const [profileType, setProfileType] = useState("SELLER");
  const [disableCommAdd, setDisableCommAdd] = useState(false);
  const [addressProof, setAddressProof] = useState([]);
  const [panAttachment, setPanAttachment] = useState([]);
  const [gstinAttachment, setGstinAttachment] = useState([]);
  const [iecCodeAttachment, setIecCodeAttachment] = useState([]);
  const [certAttachment1, setCertAttachment1] = useState([]);
  const [certAttachment2, setCertAttachment2] = useState([]);
  const [certAttachment3, setCertAttachment3] = useState([]);
  const [certAttachment4, setCertAttachment4] = useState([]);
  const [certAttachment5, setCertAttachment5] = useState([]);
  const [certAttachment6, setCertAttachment6] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successUpdateVisible, setSuccessUpdateVisible] = useState(false);
  const [step, setStep] = useState(0);

  const assetUrl =
    process.env.REACT_APP_API_ASSETS_URL +
    "/assets?sourceService=profile&userId=" +
    (props.userProfile && props.userProfile.profileId);

  const addCertTypes = additionalCertificateTypes.map((v, i) => {
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
    return (
      <Option key={country} value={en[country]}>
        {en[country]}
      </Option>
    );
  });

  const onValuesChange = (changedValues, allValues) => {
    // console.log(changedValues, allValues);
    if (changedValues.profileType) {
      setProfileType(changedValues.profileType);
      allValues.orgType = undefined;
      allValues.inOrderTypes = undefined;
      allValues.inCategories = undefined;
      form.setFieldsValue(allValues);
    }
  };

  useEffect(() => {
    if (props.userProfile) {
      setIsLoading(false);
    }
    if (
      (props.userProfile &&
        props.userProfile.profileType &&
        props.userProfile.profileType === "BUYER") ||
      (props.userProfile &&
        props.userProfile.profileType &&
        props.userProfile.profileType === "SELLER" &&
        props.userProfile.verificationStatus !== "CREATED")
    ) {
      router.push("/");
    }
  }, [props.userProfile]);

  const nextStep = () => {
    form
      .validateFields(["firstName", "lastName", "email", "country", "orgPhone"])
      .then((values) => {
        setStep(step + 1);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.ms-excel",
    "application/vnd.ms-powerpoint",
    "image/jpeg",
    "image/png",
  ];

  const beforeUpload = (file) => {
    // let tmp1 = file.name.split('.').slice(0, -1);
    // let tmp = file.name.split('.').slice(-1);
    // console.log(file.name.length, tmp, tmp1);
    const isJpgOrPng = acceptedFileTypes.includes(file.type);
    if (!isJpgOrPng) {
      message.error(
        "You can only upload JPG/PNG, PDF, MS-Excel & MS-PPT file!",
        5
      );
    }
    const isLtM = file.size <= 10 * 1024 * 1024;
    if (!isLtM) {
      message.error("File size must smaller than 10MB!", 5);
    }
    return isJpgOrPng && isLtM;
  };

  const handleChange = (info) => {
    let fileList = [...info.fileList];
    // console.log(fileList);
    if (
      info.file.status === "uploading" ||
      info.file.status === "done" ||
      info.file.status === "removed"
    ) {
      // 1. Limit the number of uploaded files
      // Only to show one recent uploaded files, and old ones will be replaced by the new
      fileList = fileList.slice(-1);
    } else {
      fileList = fileList.slice(-2);
      fileList.pop();
      // fileList = fileList.slice(-1);
    }
    // console.log(fileList);
    // 2. Read from response and show file link
    fileList = fileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url =
          process.env.REACT_APP_ASSETS_FILE_URL + file.response.mediaUrl;
        let tmp = file.name.split(".");
        file.name = tmp[0].slice(0, 30) + "." + tmp.slice(-1);
      }
      return file;
    });
    // console.log(fileList);

    return fileList;
  };

  const validateFiles = (value, prevValue, prevValues) => {
    var fileObj = {
      file: value.file,
      fileList: handleChange(value),
    };
    // console.log(value, prevValue, prevValues, fileObj);
    return fileObj;
  };

  const handleChangeAddressProof = (info) => {
    setAddressProof(handleChange(info));
  };

  const handleChangePanAttachment = (info) => {
    setPanAttachment(handleChange(info));
  };

  const handleChangeGstinAttachment = (info) => {
    setGstinAttachment(handleChange(info));
  };

  const handleChangeIecCodeAttachment = (info) => {
    setIecCodeAttachment(handleChange(info));
  };

  const handleChangeCertAttachment1 = (info) => {
    setCertAttachment1(handleChange(info));
  };

  const handleChangeCertAttachment2 = (info) => {
    setCertAttachment2(handleChange(info));
  };

  const handleChangeCertAttachment3 = (info) => {
    setCertAttachment3(handleChange(info));
  };

  const handleChangeCertAttachment4 = (info) => {
    setCertAttachment4(handleChange(info));
  };

  const handleChangeCertAttachment5 = (info) => {
    setCertAttachment5(handleChange(info));
  };

  const handleChangeCertAttachment6 = (info) => {
    setCertAttachment6(handleChange(info));
  };

  const handleSameAddress = (e) => {
    // console.log(e);
    if (e.target.checked) {
      const regAdd = form.getFieldsValue([
        "registeredPinCode",
        "registeredAddress",
        "registeredCity",
        "registeredState",
        "registeredCountry",
      ]);
      const commAdd = {
        communicationPinCode: regAdd.registeredPinCode,
        communicationAddress: regAdd.registeredAddress,
        communicationCity: regAdd.registeredCity,
        communicationState: regAdd.registeredState,
        communicationCountry: regAdd.registeredCountry,
      };
      form.setFieldsValue(commAdd);
      setDisableCommAdd(true);
    } else {
      const commAdd = {
        communicationPinCode: undefined,
        communicationAddress: undefined,
        communicationCity: undefined,
        communicationState: undefined,
        communicationCountry: undefined,
      };
      form.setFieldsValue(commAdd);
      setDisableCommAdd(false);
    }
  };

  const handleAddChange = () => {
    const commAdd = {
      communicationPinCode: undefined,
      communicationAddress: undefined,
      communicationCity: undefined,
      communicationState: undefined,
      communicationCountry: undefined,
    };
    form.setFieldsValue(commAdd);
    setDisableCommAdd(false);
  };

  const onFinish = (values) => {
    // console.log(values);

    let data = {
      verificationStatus: "IN_PROGRESS",
      brandName: values.brandName,
      orgEmail: values.orgEmail,
      userPrivateInfo: {
        registeredAddress: {
          address: values.registeredAddress,
          pinCode: values.registeredPinCode,
          city: values.registeredCity,
          state: values.registeredState,
          country: values.registeredCountry,
          addressProof:
            values.addressProof &&
            values.addressProof.fileList &&
            values.addressProof.fileList[0] &&
            values.addressProof.fileList[0].response,
        },
        communicationAddress: {
          address: values.communicationAddress,
          pinCode: values.communicationPinCode,
          city: values.communicationCity,
          state: values.communicationState,
          country: values.communicationCountry,
        },
      },
      panNo: values.panNo,
      panAttachment:
        values.panAttachment &&
        values.panAttachment.fileList &&
        values.panAttachment.fileList[0] &&
        values.panAttachment.fileList[0].response,
      gstin: values.gstin,
      gstinAttachment:
        values.gstinAttachment &&
        values.gstinAttachment.fileList &&
        values.gstinAttachment.fileList[0] &&
        values.gstinAttachment.fileList[0].response,
      iecCode: values.iecCode,
      iecCodeAttachment:
        values.iecCodeAttachment &&
        values.iecCodeAttachment.fileList &&
        values.iecCodeAttachment.fileList[0] &&
        values.iecCodeAttachment.fileList[0].response,
      additionalCertificates: [
        {
          certificateType:
            (values.certAttachment1 &&
              values.certAttachment1.fileList &&
              values.certAttachment1.fileList[0] &&
              values.certAttachment1.fileList[0].response &&
              values.certificateType1) ||
            (values.certAttachment1 &&
              values.certAttachment1.fileList &&
              values.certAttachment1.fileList[0] &&
              values.certAttachment1.fileList[0].response &&
              "Others"),
          certAttachment:
            values.certAttachment1 &&
            values.certAttachment1.fileList &&
            values.certAttachment1.fileList[0] &&
            values.certAttachment1.fileList[0].response,
        },
        {
          certificateType:
            (values.certAttachment2 &&
              values.certAttachment2.fileList &&
              values.certAttachment2.fileList[0] &&
              values.certAttachment2.fileList[0].response &&
              values.certificateType2) ||
            (values.certAttachment2 &&
              values.certAttachment2.fileList &&
              values.certAttachment2.fileList[0] &&
              values.certAttachment2.fileList[0].response &&
              "Others"),
          certAttachment:
            values.certAttachment2 &&
            values.certAttachment2.fileList &&
            values.certAttachment2.fileList[0] &&
            values.certAttachment2.fileList[0].response,
        },
        {
          certificateType:
            (values.certAttachment3 &&
              values.certAttachment3.fileList &&
              values.certAttachment3.fileList[0] &&
              values.certAttachment3.fileList[0].response &&
              values.certificateType3) ||
            (values.certAttachment3 &&
              values.certAttachment3.fileList &&
              values.certAttachment3.fileList[0] &&
              values.certAttachment3.fileList[0].response &&
              "Others"),
          certAttachment:
            values.certAttachment3 &&
            values.certAttachment3.fileList &&
            values.certAttachment3.fileList[0] &&
            values.certAttachment3.fileList[0].response,
        },
        {
          certificateType:
            (values.certAttachment4 &&
              values.certAttachment4.fileList &&
              values.certAttachment4.fileList[0] &&
              values.certAttachment4.fileList[0].response &&
              values.certificateType4) ||
            (values.certAttachment4 &&
              values.certAttachment4.fileList &&
              values.certAttachment4.fileList[0] &&
              values.certAttachment4.fileList[0].response &&
              "Others"),
          certAttachment:
            values.certAttachment4 &&
            values.certAttachment4.fileList &&
            values.certAttachment4.fileList[0] &&
            values.certAttachment4.fileList[0].response,
        },
        {
          certificateType:
            (values.certAttachment5 &&
              values.certAttachment5.fileList &&
              values.certAttachment5.fileList[0] &&
              values.certAttachment5.fileList[0].response &&
              values.certificateType5) ||
            (values.certAttachment5 &&
              values.certAttachment5.fileList &&
              values.certAttachment5.fileList[0] &&
              values.certAttachment5.fileList[0].response &&
              "Others"),
          certAttachment:
            values.certAttachment5 &&
            values.certAttachment5.fileList &&
            values.certAttachment5.fileList[0] &&
            values.certAttachment5.fileList[0].response,
        },
        {
          certificateType:
            (values.certAttachment6 &&
              values.certAttachment6.fileList &&
              values.certAttachment6.fileList[0] &&
              values.certAttachment6.fileList[0].response &&
              values.certificateType6) ||
            (values.certAttachment6 &&
              values.certAttachment6.fileList &&
              values.certAttachment6.fileList[0] &&
              values.certAttachment6.fileList[0].response &&
              "Others"),
          certAttachment:
            values.certAttachment6 &&
            values.certAttachment6.fileList &&
            values.certAttachment6.fileList[0] &&
            values.certAttachment6.fileList[0].response,
        },
      ],
    };
    // console.log(data);

    setLoading(true);
    fetch(process.env.REACT_APP_API_PROFILE_URL + "/profiles/my", {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + keycloak.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while sending request.";
        }
      })
      .then((res) => {
        // message.success('Request has been sent successfully.', 5);
        setLoading(false);
        setSuccessUpdateVisible(true);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        setLoading(false);
      });
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (
    props.userProfile &&
    props.userProfile.profileType &&
    props.userProfile.profileType === "SELLER" &&
    props.userProfile.verificationStatus === "CREATED"
  ) {
    return (
      <div id="apply-to-sell-form">
        <Row justify="space-around">
          <Col xs={21} sm={21} md={11} lg={11} xl={11}>
            <p className="signup-heading">Apply to sell on Qalara</p>
            <Form
              name="apply_to_sell_form"
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
              <div style={{ display: "flow-root" }}>
                <h2 className="section-heading" style={{ float: "left" }}>
                  Company profile:
                </h2>
                <Button
                  className="section-button"
                  type="link"
                  onClick={() => setExpandProfile(!expandProfile)}
                  style={{ float: "right" }}
                >
                  {expandProfile ? <UpOutlined /> : <DownOutlined />}
                </Button>
              </div>
              <div style={expandProfile ? { display: "none" } : {}}>
                <p className="label-paragraph">Brand name</p>
                <Form.Item
                  name="brandName"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <p className="label-paragraph">Organization email address</p>
                <Form.Item
                  name="orgEmail"
                  rules={[
                    {
                      type: "email",
                      message: "Please enter the correct email address.",
                    },
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <p className="label-paragraph-heading">
                  Please provide the address where your business is registered:
                  <br />
                </p>
                <p className="label-paragraph">Zipcode</p>
                <Form.Item
                  name="registeredPinCode"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input onChange={handleAddChange} />
                </Form.Item>
                <p className="label-paragraph">Address</p>
                <Form.Item
                  name="registeredAddress"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 150,
                      message: "Length should be 3-150 characters!",
                    },
                  ]}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    onChange={handleAddChange}
                  />
                </Form.Item>

                <p className="label-paragraph">City</p>
                <Form.Item
                  name="registeredCity"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input onChange={handleAddChange} />
                </Form.Item>
                <p className="label-paragraph">State</p>
                <Form.Item
                  name="registeredState"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input onChange={handleAddChange} />
                </Form.Item>
                <p className="label-paragraph">Country</p>
                <Form.Item
                  name="registeredCountry"
                  className="form-item"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Select showSearch onChange={handleAddChange}>
                    {country}
                  </Select>
                </Form.Item>
                <Form.Item name="sameAddress" valuePropName="unchecked">
                  <Checkbox
                    checked={disableCommAdd}
                    onChange={handleSameAddress}
                  >
                    <span className="label-paragraph-heading">
                      Our communication address is same as the registered
                      address
                    </span>
                  </Checkbox>
                </Form.Item>
                {/* <p className='label-paragraph-heading'>Our communication address is same as the registered address<br /></p> */}
                <p className="label-paragraph">Zipcode</p>
                <Form.Item
                  name="communicationPinCode"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input disabled={disableCommAdd} />
                </Form.Item>
                <p className="label-paragraph">Address</p>
                <Form.Item
                  name="communicationAddress"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 150,
                      message: "Length should be 3-150 characters!",
                    },
                  ]}
                >
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    disabled={disableCommAdd}
                  />
                </Form.Item>

                <p className="label-paragraph">City</p>
                <Form.Item
                  name="communicationCity"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input disabled={disableCommAdd} />
                </Form.Item>
                <p className="label-paragraph">State</p>
                <Form.Item
                  name="communicationState"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input disabled={disableCommAdd} />
                </Form.Item>
                <p className="label-paragraph">Country</p>
                <Form.Item
                  name="communicationCountry"
                  className="form-item"
                  rules={[{ required: true, message: "Field is required." }]}
                >
                  <Select showSearch disabled={disableCommAdd}>
                    {country}
                  </Select>
                </Form.Item>
                <p className="label-paragraph">
                  Upload registered address proof
                </p>
                <Form.Item
                  name="addressProof"
                  normalize={validateFiles}
                  // rules={[{ required: true, message: 'Field is required.' }]}
                >
                  <Upload
                    name="files"
                    fileList={addressProof}
                    beforeUpload={beforeUpload}
                    onChange={handleChangeAddressProof}
                    action={assetUrl}
                    headers={{
                      Authorization: "Bearer " + keycloak.token,
                    }}
                  >
                    <Button className="upload-button">Attach</Button>
                  </Upload>
                </Form.Item>
                <p className="label-paragraph">Organisation website link</p>
                <Form.Item
                  name="orgWebsite"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 50,
                      message: "Length should be 3-50 characters!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <p className="label-paragraph">Organisation Facebook link</p>
                <Form.Item
                  name="facebookUrl"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 100,
                      message: "Length should be 3-100 characters!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <p className="label-paragraph">Organisation Instagram link</p>
                <Form.Item
                  name="instaUrl"
                  rules={[
                    // { required: true, message: 'Field is required.' },
                    {
                      min: 3,
                      max: 100,
                      message: "Length should be 3-100 characters!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div style={{ display: "flow-root" }}>
                <h2 className="section-heading" style={{ float: "left" }}>
                  Governmental / Legal credentials:
                </h2>
                <Button
                  className="section-button"
                  type="link"
                  onClick={() => setExpandLegal(!expandLegal)}
                  style={{ float: "right" }}
                >
                  {expandLegal ? <UpOutlined /> : <DownOutlined />}
                </Button>
              </div>
              <div style={expandLegal ? { display: "none" } : {}}>
                <p className="label-paragraph">Pan no</p>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="panNo"
                    className="input-with-upload"
                    // style={{ display: 'inline-block', width: 'calc(50% - 17px)' }}
                    rules={[
                      // { required: true, message: 'Field is required.' },
                      {
                        min: 3,
                        max: 50,
                        message: "Length should be 3-50 characters!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="panAttachment"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={panAttachment}
                      beforeUpload={beforeUpload}
                      onChange={handleChangePanAttachment}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
                <p className="label-paragraph">GSTIN</p>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="gstin"
                    className="input-with-upload"
                    rules={[
                      // { required: true, message: 'Field is required.' },
                      {
                        min: 3,
                        max: 50,
                        message: "Length should be 3-50 characters!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="gstinAttachment"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={gstinAttachment}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeGstinAttachment}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
                <p className="label-paragraph">IEC code</p>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="iecCode"
                    className="input-with-upload"
                    rules={[
                      // { required: true, message: 'Field is required.' },
                      {
                        min: 3,
                        max: 50,
                        message: "Length should be 3-50 characters!",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="iecCodeAttachment"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={iecCodeAttachment}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeIecCodeAttachment}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
              </div>
              <div style={{ display: "flow-root" }}>
                <h2 className="section-heading" style={{ float: "left" }}>
                  Certifications & compliances:
                </h2>
                <Button
                  className="section-button"
                  type="link"
                  onClick={() => setExpandCertificate(!expandCertificate)}
                  style={{ float: "right" }}
                >
                  {expandCertificate ? <UpOutlined /> : <DownOutlined />}
                </Button>
              </div>
              <div style={expandCertificate ? { display: "none" } : {}}>
                {/* <h2 className='section-heading' style={{ float: 'left' }}>Certifications & compliances:</h2> */}
                {/* <p className='label-paragraph'>Certifications & compliances:</p> */}
                <p className="label-paragraph">
                  We work with responsible suppliers. Certifications help
                  establish the credentials of your company and make you
                  attractive to buyers. (Examples of certificates - Fair Trade
                  Certified, Craftmark, GOTS etc.)
                </p>
                {/* <Form.List name="names">
                                {(fields, { add, remove }) => {
                                    return (
                                        <div>
                                            {fields.map((field, index) => (
                                                <div key={field.key}>
                                                    <Form.Item name={[index, "age"]} noStyle>
                                                        <Input
                                                            style={{ width: "30%", marginRight: 8 }}
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        shouldUpdate={(prevValue, nextValue, { source }) => {
                                                            if (source === "internal") {
                                                                return (
                                                                    get(prevValue, ["names", index, "age"]) !==
                                                                    get(nextValue, ["names", index, "age"])
                                                                );
                                                            }
                                                            return false;
                                                        }}
                                                    >
                                                        {control => {
                                                            console.log("Render name", control);
                                                            return (
                                                                <div style={{ position: "relative" }}>
                                                                    <Form.Item
                                                                        noStyle
                                                                        name={[index, "name"]}
                                                                        rules={[{ required: true }]}
                                                                    >
                                                                        <Input />
                                                                    </Form.Item>
                                                                </div>
                                                            );
                                                        }}
                                                    </Form.Item>
                                                    {fields.length > 1 ? (
                                                        <MinusCircleOutlined
                                                            className="dynamic-delete-button"
                                                            onClick={() => remove(field.name)}
                                                        />
                                                    ) : null}
                                                </div>
                                            ))}
                                            <Form.Item>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => add()}
                                                    style={{ width: "60%" }}
                                                >
                                                    <PlusOutlined /> Add field
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    );
                                }}
                            </Form.List> */}
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="certificateType1"
                    className="input-with-upload"
                    // rules={[{ required: true, message: 'Please select an certificate type.' }]}
                  >
                    <Select>{addCertTypes}</Select>
                  </Form.Item>
                  <Form.Item
                    name="certAttachment1"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={certAttachment1}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeCertAttachment1}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="certificateType2"
                    className="input-with-upload"
                    // rules={[{ required: true, message: 'Please select an certificate type.' }]}
                  >
                    <Select>{addCertTypes}</Select>
                  </Form.Item>
                  <Form.Item
                    name="certAttachment2"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={certAttachment2}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeCertAttachment2}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="certificateType3"
                    className="input-with-upload"
                    // rules={[{ required: true, message: 'Please select an certificate type.' }]}
                  >
                    <Select>{addCertTypes}</Select>
                  </Form.Item>
                  <Form.Item
                    name="certAttachment3"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={certAttachment3}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeCertAttachment3}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="certificateType4"
                    className="input-with-upload"
                    // rules={[{ required: true, message: 'Please select an certificate type.' }]}
                  >
                    <Select>{addCertTypes}</Select>
                  </Form.Item>
                  <Form.Item
                    name="certAttachment4"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={certAttachment4}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeCertAttachment4}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="certificateType5"
                    className="input-with-upload"
                    // rules={[{ required: true, message: 'Please select an certificate type.' }]}
                  >
                    <Select>{addCertTypes}</Select>
                  </Form.Item>
                  <Form.Item
                    name="certAttachment5"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={certAttachment5}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeCertAttachment5}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Form.Item
                    name="certificateType6"
                    className="input-with-upload"
                    // rules={[{ required: true, message: 'Please select an certificate type.' }]}
                  >
                    <Select>{addCertTypes}</Select>
                  </Form.Item>
                  <Form.Item
                    name="certAttachment6"
                    className="upload-with-input"
                    normalize={validateFiles}
                    // rules={[{ required: true, message: 'Field is required.' }]}
                  >
                    <Upload
                      name="files"
                      className="upload-with-input-item"
                      fileList={certAttachment6}
                      beforeUpload={beforeUpload}
                      onChange={handleChangeCertAttachment6}
                      action={assetUrl}
                      headers={{
                        Authorization: "Bearer " + keycloak.token,
                      }}
                    >
                      <Button className="upload-button">Attach</Button>
                    </Upload>
                  </Form.Item>
                </Form.Item>
              </div>
              <Form.Item>
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
        <Modal
          visible={successUpdateVisible}
          footer={null}
          closable={true}
          onCancel={() => {
            setSuccessUpdateVisible(false);
            router.push("/");
            props.getUserProfile(keycloak.token);
          }}
          centered
          bodyStyle={{ padding: "0" }}
          width={400}
        >
          <div id="apply-to-sell-form-modal">
            <div className="apply-to-sell-form-modal-content">
              <p className="apply-to-sell-form-modal-para1">
                Apply to sell initiated!
              </p>
              <p className="apply-to-sell-form-modal-para2">
                Thanks for showing interest in joining our platform. Our team
                will get back to you in 48 hours and take care of the rest of
                the procedure. This is necessary for us to connect you with
                buyers across the globe.
              </p>
            </div>
            <Button
              className="apply-to-sell-form-modal-button"
              onClick={() => {
                setSuccessUpdateVisible(false);
                router.push("/");
                props.getUserProfile(keycloak.token);
              }}
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, { getUserProfile })(ApplyToSell);

// export default ApplyToSell;
