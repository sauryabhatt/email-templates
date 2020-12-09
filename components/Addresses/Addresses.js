/** @format */

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Menu,
  Button,
  Tooltip,
  Modal,
  Input,
  Form,
  Radio,
  Select,
  message,
} from "antd";
import Icon, {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { getCountries } from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import AddressCard from "./AddressCard";
import { useKeycloak } from "@react-keycloak/ssr";
import { getAddresses } from "../../store/actions";
import { connect } from "react-redux";
import states from "../../public/filestore/stateCodes_en.json";
import deliveredCountryList from "../../public/filestore/deliveredCountries.json";

const { Option } = Select;
const Addresses = (props) => {
  const [form] = Form.useForm();
  const [newAddress, setNewAddress] = useState(false);
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const [deleteAddress, setDeleteAddress] = useState(false);
  // const [phone, setPhone] = useState('');
  const [selCountryCode, setSelCountryCode] = useState("us");
  const [dialCode, setDialCode] = useState("+91");
  const [selCountryExpectedLength, setSelCountryExpectedLength] = useState(15);
  // const [isValid, setIsValid] = useState(true)
  const [isEdit, setIsEdit] = useState(false);
  const {keycloak} = useKeycloak();
  const [fullName, setFullName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zipCodeList, setZipcodeList] = useState([])
  const [deliver, setDeliver] = useState(false);
  const [state, setState] = useState({
    fullName: null,
    addressLine1: null,
    addressLine2: null,
    country: null,
    state: null,
    city: null,
    zipCode: null,
    phone: "",
    isDefault: true,
    statesByCountry: [],
    isStatesDropdown: false,
  });
  const [contactId, setContactId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [initialValues, setInitialValues] = useState({
    fullName: null,
    addressLine1: null,
    addressLine2: null,
    country: null,
    state: null,
    city: null,
    zipCode: null,
    phone: "",
    isDefault: true,
  });

  const addNewAddress = () => {
    setNewAddress(true);
  };

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      fullName: null,
      addressLine1: null,
      addressLine2: null,
      country: null,
      state: null,
      city: null,
      zipCode: null,
      phone: "",
      isDefault: true,
    }));
    setSelCountryCode("us");
    setNewAddress(false);
    setIsEdit(false);
    setContactId(null);
  };
  const handleNewAddress = (values, selCountryCode) => {
    setNewAddress(false);
    props.addNewAddress(values, selCountryCode);
    form.resetFields();
  };

  const handleAddressDelete = (id) => {
    setContactId(id);
    setDeleteAddress(true);
  };

  const closeDeletePopup = () => {
    props.getAddresses(keycloak.token);
    setContactId(null);
    setDeleteAddress(false);
    setDeleteSuccess(false);
  };

  const handlePhoneNumber = (value, country, event, formattedValue) => {
    let dialCode = "+" + country.dialCode;
    setSelCountryCode(country.countryCode);
    setState((prevState) => ({
      ...prevState,
      phone: formattedValue,
    }));
    setDialCode(dialCode);
    setSelCountryExpectedLength(country.format.length);
    // setPhone(formattedValue);
  };

  const country = getCountries().map((country) => {
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

  const handleEdit = (id) => {
    setContactId(id);
    fetch(process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts/" + id, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + keycloak.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while fetching user profile.";
        }
      })
      .then((response) => {
        let obj = states.find((state) => {
          return state.country == response.country;
        });
        setState((prevState) => ({
          ...prevState,
          fullName: response.fullName,
          addressLine1: response.addressLine1,
          addressLine2: response.addressLine2,
          country: response.country,
          state: response.state,
          city: response.city,
          zipCode: response.zipCode,
          phone: response.phoneNumber,
          isDefault: response.isDefault,
          statesByCountry: obj ? obj.stateCodes : [],
          isStatesDropdown: obj ? true : false,
        }));
        if (deliveredCountryList.includes(response.country)) {
          setDeliver(true);
        } else {
          setDeliver(false);
        }
        setSelCountryExpectedLength(response.phoneNumber.length);
        setSelCountryCode(response.countryCode);
        setIsEdit(true);
        setNewAddress(true);
        setDialCode(response.dialCode);
      })
      .catch((err) => {
        // console.log("Error ", err);
      });
  };

  const makeDefault = (id) => {
    let data = {
      isDefault: true,
    };
    fetch(process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts/" + id, {
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
          throw res.statusText || "Error while fetching user profile.";
        }
      })
      .then((response) => {
        props.getAddresses(keycloak.token);
      })
      .catch((err) => {
        // console.log("Error ", err);
      });
  };
  const addressCard = props.addresses.map((v, i) => {
    return (
      <AddressCard
        key={`address-card-key-${i}`}
        data={v}
        handleEdit={handleEdit}
        handleAddressDelete={handleAddressDelete}
        makeDefault={makeDefault}
      />
    );
  });

  const handleFullName = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      fullName: value,
    }));
  };

  const handleAddressLine1 = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      addressLine1: value,
    }));
  };

  const handleAddressLine2 = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      addressLine2: value,
    }));
  };

  const handleCountry = (e) => {
    let value = e;
    if (deliveredCountryList.includes(value)) {
      setDeliver(true);
    }else{
      setDeliver(false)
    }

    let obj = states.find((state) => {
      return state.country == value;
    });

    if (obj) {
      setState((prevState) => ({
        ...prevState,
        statesByCountry: obj.stateCodes,
        isStatesDropdown: true,
        country: value,
        state: null,
        zipCode: "",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        statesByCountry: null,
        isStatesDropdown: false,
        country: value,
        state: null,
        zipCode: "",
      }));
    }
    // setState(prevState => ({
    //     ...prevState,
    //     country: value
    // }));
  };

  const handleState = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      state: value,
    }));
  };

  const handleStateDropdown = (e) => {
    setState((prevState) => ({
      ...prevState,
      state: e,
    }));
  };
  const handleCity = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      city: value,
    }));
  };

  const handleZipCode = (e) => {
    if(!state.country){
      handleError("zipCode", state.zipCode, "Please enter Country name first!!")
      return
    }
    let value = e.target ? e.target.value.toUpperCase() : e.toUpperCase()
    setState((prevState) => ({
      ...prevState,
      zipCode: value,
    }));

    if(value.toString().length >= 3 && deliver){
      let val = value.replace(/[^a-z0-9]/gi,'')
      fetch(process.env.NEXT_PUBLIC_REACT_APP_DUTY_COST_URL + "/country/" + state.country + "/zipcode/"+val, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + keycloak.token,
        }
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw res.statusText || "Error while updating info.";
          }
        })
        .then((res) => {
          if(res.zipcodes && res.zipcodes.length > 0){
            setZipcodeList(res.zipcodes)
          }else{
            setZipcodeList([value])
          }
        })
        .catch((err) => {
          message.error(err.message || err, 5);
          setLoading(false);
        });
    }else{
      setZipcodeList([value])
    }
  };

  const handleZipcodeChange = (e) => {
    let value = e
    setState((prevState) => ({
      ...prevState,
      zipCode: value,
    }));
  }

  const handleDefault = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      isDefault: value,
    }));
  };

  const saveAddress = () => {
    if (validateFields()) {
      setLoading(true);
      let zip= state.zipCode.replace(/[^a-z0-9]/gi,'')
      let data = {
        profileId: props.userProfile.userProfile.profileId,
        fullName: state.fullName,
        addressLine1: state.addressLine1,
        addressLine2: state.addressLine2,
        country: state.country,
        state: state.state,
        city: state.city,
        zipCode: zip,
        phoneNumber: state.phoneNumber,
        isDefault: state.isDefault,
        countryCode: selCountryCode,
        phoneNumber: state.phone,
        dialCode: dialCode,
      };
      fetch(process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts", {
        method: "POST",
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
            throw res.statusText || "Error while updating info.";
          }
        })
        .then((res) => {
          // message.success('Your info has been updated successfully.', 5);
          // setSuccessUpdateVisible(true);
          setState({
            fullName: null,
            addressLine1: null,
            addressLine2: null,
            country: null,
            state: null,
            city: null,
            zipCode: null,
            phone: "",
            isDefault: true,
          });
          setNewAddress(false);
          setLoading(false);
          props.getAddresses(keycloak.token);
        })
        .catch((err) => {
          message.error(err.message || err, 5);
          setLoading(false);
        });
    } else {
      return false;
    }
  };

  const updateAddress = () => {
    if (validateFields()) {
      setLoading(true);
      let zip= state.zipCode.replace(/[^a-z0-9]/gi,'')
      let data = {
        profileId: props.userProfile.userProfile.profileId,
        fullName: state.fullName,
        addressLine1: state.addressLine1,
        addressLine2: state.addressLine2,
        country: state.country,
        state: state.state,
        city: state.city,
        zipCode: zip,
        phoneNumber: state.phoneNumber,
        isDefault: state.isDefault,
        countryCode: selCountryCode,
        phoneNumber: state.phone,
      };
      fetch(process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts/" + contactId, {
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
            throw res.statusText || "Error while updating info.";
          }
        })
        .then((res) => {
          // message.success('Your info has been updated successfully.', 5);
          // setSuccessUpdateVisible(true);
          setState({
            fullName: null,
            addressLine1: null,
            addressLine2: null,
            country: null,
            state: null,
            city: null,
            zipCode: null,
            phone: "",
            isDefault: true,
          });
          handleClose();
          setLoading(false);
          props.getAddresses(keycloak.token);
        })
        .catch((err) => {
          message.error(err.message || err, 5);
          setLoading(false);
        });
    } else {
      return false;
    }
  };

  const deleteAccept = () => {
    fetch(process.env.NEXT_PUBLIC_REACT_APP_CONTACTS_URL + "/contacts/" + contactId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + keycloak.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while updating info.";
        }
      })
      .then((res) => {
        // message.success('Your info has been updated successfully.', 5);
        // setSuccessUpdateVisible(true);
        setDeleteSuccess(true);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        setLoading(false);
      });
  };

  const assignText = (value, inputVal) => {
    let divName = value + "-error-block";
    if (selCountryExpectedLength !== inputVal) {
      document.getElementsByClassName(divName)[0].innerHTML =
        "Enter valid phone number";
    } else {
      document.getElementsByClassName(divName)[0].innerHTML =
        "Field is required";
    }
  };

  const getStates =
    state.statesByCountry &&
    state.statesByCountry.map((state, index) => {
      return (
        <Option key={index} value={state.state}>
          {state.state}
        </Option>
      );
    });

  const checkPhone = (value, inputVal) => {
    let divName = value + "-error-block";
    if (
      inputVal == "" ||
      inputVal == dialCode ||
      selCountryExpectedLength !== inputVal.length
    ) {
      assignText(value, inputVal);
      document.getElementsByClassName("form-control")[0].style.border =
        "1px solid #ff4d4f";
      document.getElementsByClassName("flag-dropdown")[0].style.border =
        "1px solid #ff4d4f";
      document.getElementsByClassName(divName)[0].style.display = "block";
    } else {
      document.getElementsByClassName("form-control")[0].style.border =
        "1px solid #d9d9d9";
      document.getElementsByClassName("flag-dropdown")[0].style.border =
        "1px solid #d9d9d9";
      document.getElementsByClassName(divName)[0].style.display = "none";
    }
  };

  const handleError = (value, inputVal = null, message) => {
    let divName = value + "-error-block";
    if (inputVal == null || inputVal == "") {
      if (value == "country") {
        document.querySelectorAll(
          "#add-new-address-form .ant-select-selector"
        )[0].style.border = "1px solid #ff4d4f";
      }else if (value == "zipCode" && deliver) {
        let node = document.querySelectorAll(
          "#add-new-address-form .ant-select-selector"
        )
        node[node.length - 1].style.border = "1px solid #ff4d4f";
      } else if (value == "phone") {
        checkPhone(value, inputVal);
      } else if (value == "state" && state.isStatesDropdown) {
        document.querySelectorAll(
          "#add-new-address-form .ant-select-selector"
        )[1].style.border = "1px solid #ff4d4f";
      } else {
        document.getElementById(value).style.border = "1px solid #ff4d4f";
      }
      document.getElementsByClassName(divName)[0].style.display = "block";
      if(message) document.getElementsByClassName(divName)[0].innerText = message
    } else if (value == "phone") {
      checkPhone(value, inputVal);
    } else if (value == "zipCode" && deliver) {
        let node = document.querySelectorAll(
          "#add-new-address-form .ant-select-selector"
        )
        node[node.length - 1].style.border = "1px solid #d9d9d9";
      document.getElementsByClassName(divName)[0].style.display = "none";
    }else if (value == "state" && state.isStatesDropdown) {
      document.querySelectorAll(
        "#add-new-address-form .ant-select-selector"
      )[1].style.border = "1px solid #d9d9d9";
      document.getElementsByClassName(divName)[0].style.display = "none";
    } else {
      if (value == "country") {
        document.querySelectorAll(
          "#add-new-address-form .ant-select-selector"
        )[0].style.border = "1px solid #d9d9d9";
      } else {
        document.getElementById(value).style.border = "1px solid #d9d9d9";
      }

      document.getElementsByClassName(divName)[0].style.display = "none";
    }
  };

  const validateFields = () => {
    let isValid = true;
    if (state.fullName == null || state.fullName.trim() === "") {
      handleError("fullName");
      isValid = false;
    }
    if (state.addressLine1 == null || state.addressLine1.trim() === "") {
      handleError("addressLine1");
      isValid = false;
    }
    if (state.addressLine2 == null || state.addressLine2.trim() === "") {
      handleError("addressLine2");
      isValid = false;
    }
    if (state.country == null || state.country.trim() === "") {
      handleError("country");
      isValid = false;
    }
    if (state.state == null || state.state.trim() === "") {
      handleError("state");
      isValid = false;
    }
    if (state.city == null || state.city.trim() === "") {
      handleError("city");
      isValid = false;
    }
    if (state.zipCode == null || state.zipCode.trim() === "") {
      handleError("zipCode");
      isValid = false;
    }
    if (
      state.phone.trim() === "" ||
      dialCode == state.phone ||
      selCountryExpectedLength !== state.phone.length
    ) {
      handleError("phone", state.phone);
      isValid = false;
    }
    return isValid;
  };
  return (
    <React.Fragment>
      <Col xs={24} sm={24} md={22} lg={22}>
        {mediaMatch.matches ? (
          ""
        ) : (
          <Row>
            <Col xs={24} sm={24} md={12} lg={12}>
              <div style={{ textAlign: "right" }}>
                <span
                  className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                  style={{ lineHeight: "17px" }}
                  onClick={addNewAddress}
                >
                  <PlusOutlined /> ADD A NEW ADDRESS
                </span>
              </div>
            </Col>
          </Row>
        )}
        <Row className={mediaMatch.matches ? "" : "qa-mar-top-3"}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="form-top">
              <p
                className="form-heading"
                className="qa-fs-22 qa-font-san qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                MY ADDRESSES
              </p>
            </div>
          </Col>
          {mediaMatch.matches ? (
            <Col xs={22} sm={22} md={12} lg={12}>
              <div style={{ textAlign: "right" }}>
                <span
                  className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                  style={{ lineHeight: "17px", cursor: "pointer" }}
                  onClick={addNewAddress}
                >
                  <PlusOutlined /> ADD A NEW ADDRESS
                </span>
              </div>
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Col>
      <Col xs={24} sm={24} md={22} lg={22}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          // style={{ border: "1px solid #ffdead" }}
        >
          {props.addresses.length > 0 ? (
            addressCard
          ) : (
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={
                mediaMatch.matches
                  ? { padding: "20px", backgroundColor: "#F2F0EB" }
                  : { backgroundColor: "#F2F0EB" }
              }
            >
              <Row
                style={
                  mediaMatch.matches
                    ? {}
                    : {
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        paddingTop: "20px",
                        paddingBottom: "15px",
                      }
                }
              >
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-font-san qa-fs-14"
                    style={{ color: "#191919" }}
                  >
                    No saved address found
                  </span>
                </Col>
              </Row>
            </Col>
          )}
        </Col>
      </Col>
      <Modal
        visible={newAddress}
        footer={null}
        closable={false}
        // onCancel={handleNewAddress}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={750}
        className="address-modal cart-address-modal qa-font-san"
        destroyOnClose={true}
      >
        <div className="qa-rel-pos">
          <div
            onClick={handleClose}
            style={{
              position: "absolute",
              right: "10px",
              top: "0px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
        </div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} style={{ lineHeight: "22px" }}>
            {!isEdit ? (
              <span className="qa-font-san qa-fs-18 qa-fw-b qa-tc-white">
                ADD NEW ADDRESS
              </span>
            ) : (
              <span className="qa-font-san qa-fs-18 qa-fw-b qa-tc-white">
                EDIT ADDRESS
              </span>
            )}
          </Col>
        </Row>

        <Row className="qa-mar-top-3">
          <Col xs={24} sm={24} md={23} lg={23}>
            <Form
              id="add-new-address-form"
              form={form}
              onFinish={!isEdit ? saveAddress : updateAddress}
              initialValues={initialValues}
              // style={{ marginLeft: '20px' }}
            >
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span className="qa-font-san qa-fs-14 qa-tc-white">
                    Full name
                  </span>
                  <Form.Item
                    rules={[
                      {
                        required: true,
                        message: "Field is required.",
                        whitespace: true,
                      },
                    ]}
                  >
                    <Input
                      value={state.fullName}
                      onChange={handleFullName}
                      id="fullName"
                      onBlur={(e) => handleError("fullName", state.fullName)}
                    />
                    <span
                      className="qa-font-san qa-fs-12 qa-error fullName-error-block"
                      style={{ display: "none" }}
                    >
                      Field is required
                    </span>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        Address line 1
                      </span>
                      <Form.Item
                        valuePropName="value"
                        rules={[
                          {
                            required: true,
                            message: "Field is required.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input
                          value={state.addressLine1}
                          onChange={handleAddressLine1}
                          id="addressLine1"
                          onBlur={(e) =>
                            handleError("addressLine1", state.addressLine1)
                          }
                        />
                        <span
                          className="qa-font-san qa-fs-12 qa-error addressLine1-error-block"
                          style={{ display: "none" }}
                        >
                          Field is required
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={0} sm={0} md={2} lg={2}></Col>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        Address line 2
                      </span>
                      <Form.Item
                        // name="addressLine2"
                        rules={[
                          {
                            required: true,
                            message: "Field is required.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input
                          value={state.addressLine2}
                          onChange={handleAddressLine2}
                          id="addressLine2"
                          onBlur={(e) =>
                            handleError("addressLine2", state.addressLine2)
                          }
                        />
                        <span
                          className="qa-font-san qa-fs-12 qa-error addressLine2-error-block"
                          style={{ display: "none" }}
                        >
                          Field is required
                        </span>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        Country
                      </span>
                      <Form.Item
                        // name="country"
                        className="modified-selector"
                        rules={[
                          {
                            required: true,
                            message: "Field is required.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          // disabled={btnDisabled}
                          // dropdownClassName="qa-dark-menu-theme"
                          value={state.country}
                          onChange={handleCountry}
                          id="country"
                          onBlur={(e) => handleError("country", state.country)}
                        >
                          {country}
                        </Select>
                        <span
                          className="qa-font-san qa-fs-12 qa-error country-error-block"
                          style={{ display: "none" }}
                        >
                          Field is required
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={0} sm={0} md={2} lg={2}></Col>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        State
                      </span>
                      <Form.Item
                        // name="state"
                        rules={[
                          {
                            required: true,
                            message: "Field is required.",
                            whitespace: true,
                          },
                        ]}
                      >
                        {!state.isStatesDropdown ? (
                          <Input
                            value={state.state}
                            onChange={handleState}
                            id="state"
                            onBlur={(e) => handleError("state", state.state)}
                          />
                        ) : (
                          <Select
                            placeholder="Select state"
                            onChange={handleStateDropdown}
                            showSearch
                            value={state.state}
                            id="state"
                            onBlur={(e) => handleError("state", state.state)}
                          >
                            {" "}
                            {getStates}{" "}
                          </Select>
                        )}

                        <span
                          className="qa-font-san qa-fs-12 qa-error state-error-block"
                          style={{ display: "none" }}
                        >
                          Field is required
                        </span>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        City
                      </span>
                      <Form.Item
                        // name="city"
                        rules={[
                          {
                            required: true,
                            message: "Field is required.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Input
                          value={state.city}
                          onChange={handleCity}
                          id="city"
                          onBlur={(e) => handleError("city", state.city)}
                        />
                        <span
                          className="qa-font-san qa-fs-12 qa-error city-error-block"
                          style={{ display: "none" }}
                        >
                          Field is required
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={0} sm={0} md={2} lg={2}></Col>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        Pincode
                      </span>
                      <Form.Item
                        // name="zipCode"
                        rules={[
                          {
                            required: true,
                            message: "Field is required.",
                            whitespace: true,
                          },
                        ]}
                      >
                        {deliver
                          ?(
                            <Select 
                              showSearch
                              value={state.zipCode}
                              onSearch={handleZipCode}
                              onChange={handleZipcodeChange}
                              id="zipCode"
                              onBlur={(e) => handleError("zipCode", state.zipCode)}
                            >
                              {zipCodeList && zipCodeList.length > 0 
                                ?(zipCodeList.map(e => {
                                    return <Option key= {e} value={e}>{e}</Option> 
                                  }))
                                  : null
                              }
                            </Select>)
                            :(
                              <Input
                                value={state.zipCode}
                                onChange={handleZipCode}
                                id="zipCode"
                                className = "testInput"
                                onBlur={(e) => handleError("zipCode", state.zipCode)}
                              />
                            )}
                            <span
                              className="qa-font-san qa-fs-12 qa-error zipCode-error-block"
                              style={{ display: "none" }}
                            >
                              Field is required
                            </span>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col xs={24} sm={24} md={11} lg={11}>
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        Phone number
                      </span>
                      <Form.Item
                        // name="phoneNumber"
                        rules={[
                          {
                            required: true,
                            message: "Field is required.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <PhoneInput
                          country={selCountryCode}
                          value={state.phone}
                          onChange={handlePhoneNumber}
                          // disableCountryCode={true}
                          enableSearch={true}
                          countryCodeEditable={false}
                          // prefix={'+'}
                          id="phone"
                          onBlur={(e) => handleError("phone", state.phone)}
                          // onChange={(inputPhone, countryData) => {
                          //     console.log(countryData);
                          //     if(countryData.countryCode !== selCountryCode) {
                          //       setPhone('')
                          //       setIsValid(true)
                          //     }
                          //     else{
                          //         let text = '+' + inputPhone;
                          //       setPhone(text);
                          //     }
                          //     setSelCountryCode(countryData.countryCode)
                          //     setSelCountryExpectedLength(countryData.format.length)
                          //   }}
                          //   onBlur={()=>{
                          //     console.log(phone);
                          //     console.log(phone.length);
                          //     console.log(selCountryExpectedLength);
                          //     phone.length != selCountryExpectedLength ? setIsValid(false) : setIsValid(true)
                          //   }}
                          //   isValid={() => !isValid ? phone.length == selCountryExpectedLength : isValid}
                          // value={this.state.phone}
                          // onChange={phone => this.setState({ phone })}
                        />
                        <span
                          className="qa-font-san qa-fs-12 qa-error phone-error-block"
                          style={{ display: "none" }}
                        >
                          Field is required
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={0} sm={0} md={2} lg={2}></Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={11}
                      lg={11}
                      style={{ marginTop: "15px" }}
                    >
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        Default address
                      </span>
                      <Form.Item
                        // name="isDefault"
                        rules={[
                          {
                            required: true,
                            message: "Field is required.",
                            whitespace: true,
                          },
                        ]}
                      >
                        <Radio.Group
                          value={state.isDefault}
                          onChange={handleDefault}
                          className="radio-group"
                        >
                          <Radio value={true}>
                            <span className="qa-font-san qa-fs-14 qa-tc-white qa-radio-home">
                              Yes (Default)
                            </span>
                          </Radio>
                          <Radio value={false}>
                            <span className="qa-font-san qa-fs-14 qa-tc-white">
                              No
                            </span>
                          </Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="qa-mar-top-3">
                <Col xs={24} sm={24} md={24} lg={24}>
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Button
                        className="qa-button button-save-address"
                        htmlType="submit"
                        // onClick={(e) => saveAddress}
                        loading={loading}
                      >
                        <span className="qa-fs-12 qa-fw-b qa-font-san">
                          SAVE
                        </span>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Modal>
      <Modal
        visible={deleteAddress}
        footer={null}
        closable={false}
        // onCancel={handleNewAddress}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={600}
        className="address-modal"
      >
        <div className="qa-rel-pos">
          <div
            onClick={closeDeletePopup}
            style={{
              position: "absolute",
              right: "10px",
              top: "0px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
        </div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} style={{ lineHeight: "22px" }}>
            <span className="qa-font-san qa-fs-18 qa-fw-b qa-tc-white">
              DELETE ADDRESS
            </span>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={
              mediaMatch.matches ? { padding: "30px" } : { marginTop: "50px" }
            }
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} className="qa-col-center">
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-font-san qa-fs-20 qa-tc-white"
                      : "qa-font-san qa-fs-14 qa-tc-white"
                  }
                >
                  Are you sure you want to delete the address?
                </span>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                className="qa-col-center"
                style={{ paddingTop: "30px" }}
              >
                <Col xs={11} sm={11} md={11} lg={11} className="qa-col-end">
                  <Button
                    className="qa-button address-delete-reject-button"
                    onClick={closeDeletePopup}
                  >
                    <span
                      className={
                        mediaMatch.matches
                          ? "qa-font-san qa-tc-white qa-fs-17"
                          : "qa-font-san qa-tc-white qa-fs-14"
                      }
                    >
                      NO
                    </span>
                  </Button>
                </Col>
                <Col xs={2} sm={2} md={2} lg={2}></Col>
                <Col xs={11} sm={11} md={11} lg={11}>
                  <Button
                    className="qa-button address-delete-confirm-button"
                    onClick={deleteAccept}
                  >
                    <span
                      className={
                        mediaMatch.matches
                          ? "qa-font-san qa-tc-white qa-fs-17"
                          : "qa-font-san qa-tc-white qa-fs-14"
                      }
                    >
                      YES
                    </span>
                  </Button>
                </Col>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
      <Modal
        visible={deleteSuccess}
        footer={null}
        closable={false}
        // onCancel={handleNewAddress}
        centered
        bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
        width={600}
        className="address-modal"
      >
        <div className="qa-rel-pos">
          <div
            onClick={closeDeletePopup}
            style={{
              position: "absolute",
              right: "10px",
              top: "0px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
        </div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} style={{ lineHeight: "22px" }}>
            <span className="qa-font-san qa-fs-18 qa-fw-b qa-tc-white">
              DELETE ADDRESS
            </span>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            style={
              mediaMatch.matches ? { padding: "30px" } : { marginTop: "35px" }
            }
          >
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} className="qa-col-center">
                <img
                  className="qa-rel-pos image-container"
                  style={{ height: "50px" }}
                  src={process.env.NEXT_PUBLIC_URL + "/tick.png"}
                />
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                className="qa-col-center qa-mar-top-2"
              >
                <span
                  className={
                    mediaMatch.matches
                      ? "qa-font-san qa-fs-20 qa-tc-white"
                      : "qa-font-san qa-fs-14 qa-tc-white"
                  }
                >
                  Address is successfully deleted!
                </span>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                className="qa-col-center"
                style={
                  mediaMatch.matches
                    ? { paddingTop: "30px" }
                    : { paddingTop: "20px" }
                }
              >
                <Button
                  className="qa-button address-delete-success-button"
                  onClick={closeDeletePopup}
                >
                  <span
                    className={
                      mediaMatch.matches
                        ? "qa-font-san qa-tc-white qa-fs-17"
                        : "qa-font-san qa-tc-white qa-fs-14"
                    }
                  >
                    DONE
                  </span>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
    </React.Fragment>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    addresses: state.userProfile.addresses,
  };
};

export default connect(mapStateToProps, {
  getAddresses,
})(Addresses);

// export default Addresses;
