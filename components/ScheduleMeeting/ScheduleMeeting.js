/** @format */

import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useKeycloak } from "@react-keycloak/ssr";
import {
  Button,
  Row,
  Col,
  Modal,
  Alert,
  Form,
  Select,
  DatePicker,
  TimePicker,
} from "antd";
import Icon from "@ant-design/icons";
import momentTimezone from "moment-timezone";
import dateFormat from "dateformat";
import moment from "moment";
import closeButton from "../../public/filestore/closeButton";

const { Option } = Select;

const ScheduleMeeting = (props) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const timezones = momentTimezone.tz.names();
  const [mobile, setMobile] = useState(false);
  const [visible, setVisible] = useState(true);
  const [GMTOffset, setGMTOffset] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [sellerStartTime, setSellerStartTime] = useState(null);
  const [sellerEndTime, setSellerEndTime] = useState(null);
  const [disabledTime, setDisabledTime] = useState([]);
  const [correctValue, setCorrectValue] = useState(true);
  const [disabledStartTime, setDisabledStartTime] = useState([]);
  const { keycloak } = useKeycloak();
  const [disabledHoursBydate, setDisabledHoursBydate] = useState([]);
  const [disabledEndTimePicker, setDisabledEndTimePicker] = useState(true);
  const [showSlotText, setShowSlotText] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let width = window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }
  });

  const prepareTimeZoneOptions = timezones.map((v, i) => {
    return (
      <Option key={i} value={v}>
        {v}
      </Option>
    );
  });

  const handleDate = (date, dateString) => {
    setDateValue(dateFormat(date, "dddd, mmmm dS, yyyy"));
    setSelectedDate(dateString);
    if (startTime != null) {
      let a = dateString + " " + startTime + ":00" + " GMT " + GMTOffset;
      let b = moment(a, "YYYY/MM/DD HH ZZ")
        .tz("asia/kolkata")
        .format("YYYY-MM-DD HH:mm");
      setSellerStartTime(b);
    }

    if (endTime != null) {
      let a = dateString + " " + endTime + ":00" + " GMT " + GMTOffset;
      let b = moment(a, "YYYY/MM/DD HH ZZ")
        .tz("asia/kolkata")
        .format("YYYY-MM-DD HH:mm");
      setSellerEndTime(b);
    }

    if (startTime != null && endTime != null) {
      let slot =
        dateFormat(date, "dddd, mmmm dS, yyyy") +
        ", " +
        moment(startTime, ["HH"]).format("hh A") +
        " - " +
        moment(endTime, ["HH"]).format("hh A");
      setSelectedSlot(slot);
    }
    form.setFieldsValue({ end_time: null, start_time: null });
    setStartTime(null);
    setEndTime(null);

    getDisableSlotsBySeller(dateString);
  };

  const getDisableSlotsBySeller = (dateString) => {
    let profileId = props.sellerProfile.id.replace("HOME::", "");
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_MEETING_URL +
        "/events/meeting/slots?date=" +
        dateString +
        "&profile_id=" +
        profileId,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while fetching user profile.";
        }
      })
      .then((response) => {
        let startTimeArr = [];
        let endTimeArr = [];
        if (response.length > 0) {
          response.map((time, index) => {
            let start_time = moment(time.slotStart, "HH:mm A ZZ")
              .tz(timezone)
              .format("HH");
            let end_time = moment(time.slotEnd, "HH:mm A ZZ")
              .tz(timezone)
              .format("HH");
            if (parseInt(end_time) - parseInt(start_time) == 2) {
              for (let i = parseInt(start_time); i < parseInt(end_time); i++) {
                startTimeArr.push(i);
              }

              for (let j = parseInt(end_time); j > parseInt(start_time); j--) {
                endTimeArr.push(j);
              }
              // console.log(endTimeArr);
              // console.log(startTimeArr);
            } else {
              startTimeArr.push(parseInt(start_time));
              endTimeArr.push(parseInt(end_time));
            }
          });
          setDisabledTime((disabledTime) => endTimeArr);
          setDisabledHoursBydate((setDisabledHoursBydate) => endTimeArr);
          setDisabledStartTime((disabledStartTime) => startTimeArr);
        }
      })
      .catch((err) => {
        // console.log("Error ", err);
      });
  };

  const handleStartTime = (value, time) => {
    let selected_time = value._d.toString().split(" ")[4];
    let disabledSlots = [...disabledHoursBydate];
    for (
      let i = 0;
      i <= parseInt(value._d.toString().split(" ")[4].split(":")[0]);
      i++
    ) {
      disabledSlots.push(
        parseInt(value._d.toString().split(" ")[4].split(":")[0]) - i
      );
    }

    for (
      let i = parseInt(value._d.toString().split(" ")[4].split(":")[0]) + 3;
      i <= 23;
      i++
    ) {
      disabledSlots.push(i);
    }

    let slot =
      dateValue +
      ", " +
      moment(selected_time, ["HH:mm"]).format("hh:mm A") +
      " - " +
      moment(endTime, ["HH:mm"]).format("hh:mm A");
    if (selectedDate != null) {
      let a = selectedDate + " " + selected_time + ":00" + " GMT " + GMTOffset;
      let b = moment(a, "YYYY/MM/DD HH ZZ")
        .tz("asia/kolkata")
        .format("YYYY-MM-DD HH:mm");
      setSellerStartTime(b);
    }
    if (selectedDate != null && endTime != null) {
      setSelectedSlot(slot);
    }

    setDisabledTime((disabledTime) => disabledSlots);
    form.setFieldsValue({ end_time: null });
    setEndTime(null);
    setStartTime(selected_time);
    setDisabledEndTimePicker(false);
  };

  const handleEndTime = (value, time) => {
    let selected_time = value._d.toString().split(" ")[4];
    let slot =
      dateValue +
      ", " +
      moment(startTime, ["HH:mm"]).format("hh:mm A") +
      " - " +
      moment(selected_time, ["HH:mm"]).format("hh:mm A");
    if (selectedDate != null) {
      let a = selectedDate + " " + selected_time + ":00" + " GMT " + GMTOffset;
      let b = moment(a, "YYYY/MM/DD HH ZZ")
        .tz("asia/kolkata")
        .format("YYYY-MM-DD HH:mm");
      setSellerEndTime(b);
    }

    if (selectedDate != null && startTime != null) {
      setSelectedSlot(slot);
    }

    setEndTime(selected_time);
    setShowSlotText(false);
  };

  const getGMTValueByTimezone = (value) => {
    let url = "https://worldtimeapi.org/api/timezone/";
    for (let i = 0; i < value.split("/").length; i++) {
      url = url + value.split("/")[i] + "/";
    }
    fetch(url, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        setGMTOffset(response.utc_offset.replace(":", ""));
        if (selectedDate != null && startTime != null && endTime != null) {
          let a =
            selectedDate +
            " " +
            startTime +
            " GMT " +
            response.utc_offset.replace(":", "");
          let b = moment(a, "YYYY/MM/DD HH:mm A ZZ")
            .tz("asia/kolkata")
            .format("YYYY/MM/DD HH:mm:ss ZZ");
          setSellerStartTime(b);
          a =
            selectedDate +
            " " +
            endTime +
            " GMT " +
            response.utc_offset.replace(":", "");
          b = moment(a, "YYYY/MM/DD HH:mm A ZZ")
            .tz("asia/kolkata")
            .format("YYYY/MM/DD HH:mm:ss ZZ");
          setSellerEndTime(b);
        }
      })
      .catch((err) => {
        // console.log("Error ", err);
      });
  };

  const handleTimezone = (value) => {
    getDisableSlotsBySeller(selectedDate);
    getGMTValueByTimezone(value);
    setTimezone(value);
  };

  const disabledDate = (current) => {
    return current && moment().add(2, "day") >= current;
  };

  const handleOpen = (value) => {
    if (disabledStartTime.length > 0) {
      setShowSlotText(true);
    }
  };

  return (
    <Modal
      visible={visible}
      footer={null}
      closable={false}
      onCancel={props.handleCancel}
      centered
      bodyStyle={{ padding: "30px", backgroundColor: "#f9f7f2" }}
      width={1050}
      className="schedule-modal"
    >
      <div className="qa-rel-pos">
        <div
          onClick={props.handleCancel}
          style={{
            position: "absolute",
            right: "10px",
            top: "10px",
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
        <Col
          xs={22}
          sm={22}
          md={22}
          lg={22}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "28px",
            marginTop: "25px",
          }}
        >
          <span className="schedule-header qa-font-butler qa-fs-22 qa-fw-b">
            Schedule request for video demo with {props.orgName}
          </span>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24}>
          <hr style={{ border: "solid 1px #e5e5e5" }} />
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginTop: "22px" }}>
        <Col
          xs={22}
          sm={22}
          md={21}
          lg={21}
          style={{ marginLeft: "50px", marginRight: "80px" }}
          className={mobile ? "mobile-only" : ""}
        >
          <Alert
            className="alert-info-top"
            style={{ width: "850px" }}
            type="info"
            message={
              <p className="alert-paragraph">
                Most Qalara suppliers are currently based in India, but will try
                their best to accommodate time zones across the world.
              </p>
            }
            showIcon
          />
        </Col>
      </Row>
      <Row justify="space-between qa-mar-top-3">
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          className={mobile ? "mobile-only" : ""}
        >
          <Form
            id="schedule-form"
            form={form}
            onFinish={(values) =>
              props.onFinish(
                values,
                selectedSlot,
                selectedDate,
                sellerStartTime,
                sellerEndTime
              )
            }
            style={{ marginLeft: "20px" }}
          >
            <Row justify="space-between">
              <Col
                xs={22}
                sm={22}
                md={12}
                lg={12}
                className={!mobile ? "vertical-divider" : ""}
              >
                <Col xs={24} sm={24} md={22} lg={22}>
                  <span style={{ color: "#191919" }}>
                    Select your time zone
                  </span>
                  <Form.Item
                    name="timezone"
                    className="modified-selector"
                    rules={[{ required: true, message: "Field is required." }]}
                  >
                    <Select
                      className="timezone"
                      showSearch
                      onChange={handleTimezone}
                    >
                      {prepareTimeZoneOptions}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={22} lg={22}>
                  <span style={{ color: "#191919" }}>Select date</span>
                  <Form.Item
                    name="date"
                    rules={[{ required: true, message: "Field is required." }]}
                  >
                    <DatePicker
                      className="datePicker"
                      onChange={(date, dateString) =>
                        handleDate(date, dateString)
                      }
                      disabledDate={disabledDate}
                      showToday={false}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span style={{ color: "#191919" }}>
                    Select time slots(You can select time slot maximum 2 hour)
                  </span>
                  <Row>
                    <Col xs={10} sm={10} md={11} lg={11}>
                      <Form.Item
                        name="start_time"
                        rules={[
                          { required: true, message: "Field is required." },
                        ]}
                      >
                        <TimePicker
                          format="h"
                          className="timepicker"
                          onChange={handleStartTime}
                          value={moment(startTime, "HH")}
                          disabledHours={() => disabledStartTime}
                          onOpenChange={handleOpen}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                      className={mobile ? "picker-margin" : "picker-margin-web"}
                    >
                      <Form.Item
                        name="end_time"
                        // validateStatus={!correctValue ? 'error': ''}
                        // help={correctValue && endTime == null ? "Field is required." : "Duration max 2 hours"}
                        rules={[
                          { required: true, message: "Field is required." },
                          // { validator: handleEndTimeValidation }
                        ]}
                      >
                        <TimePicker
                          use24hours
                          format="h"
                          className="timepicker1"
                          onChange={handleEndTime}
                          disabledHours={() => disabledTime}
                          id="schedule-timepicker"
                          disabled={disabledEndTimePicker}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                {selectedSlot != null ? (
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <span>
                      Your selected slot - <b>{selectedSlot}</b>{" "}
                    </span>
                  </Col>
                ) : (
                  ""
                )}
                {showSlotText ? (
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <span>
                      Slots that are already booked have been greyed out
                    </span>
                  </Col>
                ) : (
                  ""
                )}
              </Col>
              {/* <Col xs={0} sm={0} md={1} lg={1}> */}
              {/* <hr style={{width: '1', size:'500'}}/> */}
              {/* </Col> */}
              <Col xs={22} sm={22} md={11} lg={11}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-fs-17 qa-font-san"
                    style={{ color: "#332f2f", opacity: "80%" }}
                  >
                    {props.orgName} timezone is{" "}
                  </span>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-fs-17 qa-font-san qa-fw-b"
                    style={{ color: "#191919" }}
                  >
                    India standard time UTC/GMT +5:30{" "}
                  </span>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{ marginTop: "30px" }}
                >
                  <span
                    className="qa-fs-14 qa-font-san"
                    style={{ color: "#332f2f", opacity: "80%" }}
                  >
                    Generally available during the following hours
                  </span>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{ marginTop: "5px" }}
                >
                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <span
                        className="qa-fs-14 qa-font-san qa-fw-b"
                        style={{ color: "#191919" }}
                      >
                        Monday to Friday
                      </span>
                    </Col>
                    <Col xs={10} sm={10} md={8} lg={8}>
                      <span
                        className="qa-fs-14 qa-font-san"
                        style={{
                          marginLeft: "10px",
                          color: "#332f2f",
                          opacity: "80%",
                        }}
                      >
                        10 am - 7 pm
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={6} lg={6}></Col>
                  </Row>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{ marginTop: "10px" }}
                >
                  <Row>
                    <Col xs={10} sm={10} md={10} lg={10}>
                      <span
                        className="qa-fs-14 qa-font-san qa-fw-b"
                        style={{ color: "#191919" }}
                      >
                        Saturday
                      </span>
                    </Col>
                    <Col xs={10} sm={10} md={8} lg={8}>
                      <span
                        className="qa-fs-14 qa-font-san"
                        style={{
                          marginLeft: "10px",
                          color: "#332f2f",
                          opacity: "80%",
                        }}
                      >
                        10 am - 2 pm
                      </span>
                    </Col>
                    <Col xs={4} sm={4} md={6} lg={6}></Col>
                  </Row>
                </Col>
                {sellerStartTime != null && sellerEndTime != null ? (
                  <Col
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{ marginTop: "40px", marginBottom: "40px" }}
                  >
                    <Alert
                      className="alert-info-top seller-timezone"
                      type="info"
                      message={
                        <p
                          className="seller-time"
                          style={{ color: "#332f2f", opacity: "80%" }}
                        >
                          Selected time slot in seller time zone
                        </p>
                      }
                      description={
                        <p
                          className="alert-paragraph qa-fs-12 qa-fw-b qa-font-san"
                          style={{ color: "#191919" }}
                        >
                          {dateFormat(sellerStartTime, "dddd, mmmm dS, yyyy ")}
                          {moment(sellerStartTime.split(" ")[1].toString(), [
                            "HH:mm",
                          ]).format("hh:mm A")}{" "}
                          - {dateFormat(sellerEndTime, "dddd, mmmm dS, yyyy ")}
                          {moment(sellerEndTime.split(" ")[1].toString(), [
                            "HH:mm",
                          ]).format("hh:mm A")}
                        </p>
                      }
                    />
                  </Col>
                ) : (
                  ""
                )}
              </Col>
              <Col xs={24} sm={24} md={24} lg={24}>
                <hr style={{ border: "solid 1px #e5e5e5" }} />
              </Col>
            </Row>
            <Row justify="space-between qa-mar-top-3">
              <Col xs={24} sm={24} md={24} lg={24}>
                <div className="button-div">
                  <Button
                    className="qa-button button-schedule-request"
                    htmlType="submit"
                    // onClick={() => {
                    //     props.onFinish(timezone,selectedSlot, selectedDate)
                    // }}
                  >
                    <span className="qa-fs-12 qa-fw-b qa-font-san">
                      SUBMIT REQUEST
                    </span>
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

const mapStateToProps = (state) => {
  return {
    sellerProfile: state.sellerListing.sellerDetails,
  };
};

export default connect(mapStateToProps)(ScheduleMeeting);
