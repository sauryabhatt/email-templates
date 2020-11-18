/** @format */

import React, { useState } from "react";
import { Row, Col, Button } from "antd";
import AddToCalendar from "react-add-to-calendar";
import "react-add-to-calendar/dist/react-add-to-calendar.css";
import moment from "moment";
import  Link  from "next/link";

const VideoRequestCarousel = (props) => {
  const [headerText, setHeaderText] = useState(null);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Date(
    props.type == "BUYER"
      ? props.data.registrants[0].slotDate
      : props.data.presenters[0].slotDate
  ).toLocaleDateString("en-us", options);
  const formattedTime =
    formattedDate +
    " " +
    moment(props.data.registrants[0].slotStart, ["hh:mm A"]).format("hh:mm A") +
    " to " +
    moment(props.data.registrants[0].slotEnd, ["hh:mm A"]).format("hh:mm A");
  const sellerHeaderText =
    "Received video demo request from " + props.data.registrants[0].orgName;
  const buyerHeaderPending =
    "Your video demo request with " +
    props.data.presenters[0].orgName +
    " is Pending";
  const buyerHeaderAccepted =
    "Your video demo request with " +
    props.data.presenters[0].orgName +
    " is Confirmed";
  const buyerBodyPending =
    "Your video call request dated " +
    props.data.registrants[0].orgName +
    " for date ";
  const sellerBody =
    "You have received video call request from " +
    props.data.registrants[0].orgName +
    " on date " +
    formattedDate +
    " " +
    props.data.presenters[0].slotStart +
    " to " +
    props.data.presenters[0].slotEnd;
  const items = [
    { apple: "Apple" },
    { google: "Google" },
    { outlook: "Outlook" },
  ];

  const event = {
    title: "One on One Meeting " + props.data.presenters[0].orgName,
    description: "One on one demo with seller",
    location: "",
    startTime: "",
    endTime: "",
  };

  // const getHeaderText = () => {
  //     if (props.type == 'SELLER') {
  //         let text =
  //         setHeaderText(text);
  //     } else if (props.type == 'BUYER' && props.data.eventStatus == 'OPEN') {
  //         let text =
  //         setHeaderText(text);
  //     } else {
  //         let text =
  //         setHeaderText(text);
  //     }
  // }

  const icon = { textOnly: "none" };
  return (
    <Col
      xs={24}
      sm={24}
      md={24}
      lg={24}
      key={props.key}
      style={{ backgroundColor: "#ffffff", height: "100%" }}
    >
      {/* <div style={{ borderRadius: '4px', padding: '20px' }}> */}
      <Row justify="space-around" style={{ height: "100%" }}>
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={14}
          style={{ padding: "20px" }}
          className={
            props.isWeb ? "vertical-divider video-request-content" : ""
          }
        >
          <Col xs={24} sm={24} md={24} lg={24}>
            <Row justify="space-between">
              <Col
                xs={2}
                sm={2}
                md={1}
                lg={1}
                style={props.isWeb ? { paddingTop: "18px" } : ""}
              >
                <img
                  className="qa-rel-pos image-container bell-icon"
                  style={{ display: "inline" }}
                  src={process.env.NEXT_PUBLIC_URL + "/bell.png"}
                />
              </Col>
              {props.type == "BUYER" ? (
                <Col
                  xs={22}
                  sm={22}
                  md={23}
                  lg={23}
                  style={
                    props.isWeb
                      ? { paddingLeft: "10px", paddingTop: "23px" }
                      : ""
                  }
                >
                  <span
                    className="qa-font-butler qa-fs-17 qa-fw-b"
                    style={{ color: "#191919" }}
                  >
                    {props.data.eventStatus == "OPEN"
                      ? buyerHeaderPending
                      : buyerHeaderAccepted}
                  </span>
                </Col>
              ) : (
                <Col
                  xs={22}
                  sm={22}
                  md={23}
                  lg={23}
                  style={
                    props.isWeb
                      ? { paddingLeft: "10px", paddingTop: "23px" }
                      : ""
                  }
                >
                  <span
                    className="qa-font-butler qa-fs-17 qa-fw-b"
                    style={{ color: "#191919" }}
                  >
                    {sellerHeaderText}
                  </span>
                </Col>
              )}
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} style={{ marginTop: "10px" }}>
            <Row justify="space-between">
              <Col xs={2} sm={2} md={1} lg={1}></Col>
              <Col
                xs={22}
                sm={22}
                ms={23}
                lg={23}
                style={{ paddingLeft: "10px", paddingBottom: "25px" }}
              >
                <div
                  style={{ paddingRight: "20px" }}
                  className={props.isWeb ? "" : "video-call-text"}
                >
                  {props.type == "SELLER" ? (
                    <span
                      className="qa-font-san qa-fs-12"
                      style={{ lineHeight: "19px", color: "#332f2f" }}
                    >
                      You have received video demo request from{" "}
                      {props.data.registrants[0].orgName} on date{" "}
                      <b>
                        {formattedDate} {props.data.presenters[0].slotStart} to{" "}
                        {props.data.presenters[0].slotEnd}
                      </b>
                    </span>
                  ) : (
                    ""
                  )}
                  {props.type == "BUYER" && props.data.eventStatus == "OPEN" ? (
                    <span
                      className="qa-font-san qa-fs-12"
                      style={{ lineHeight: "19px", color: "#332f2f" }}
                    >
                      Your video demo request for <b>{formattedTime}</b> is
                      pending with {props.data.presenters[0].orgName}. We will
                      inform you as soon as it is accepted.
                    </span>
                  ) : (
                    ""
                  )}
                  {props.type == "BUYER" &&
                  props.data.eventStatus == "ACCEPTED" ? (
                    <span
                      className="qa-font-san qa-fs-12"
                      style={{ lineHeight: "19px", color: "#332f2f" }}
                    >
                      Your video demo request for <b>{formattedTime}</b> has
                      been accepted by {props.data.presenters[0].orgName}.
                      Please add this to your calendar.
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
          </Col>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={10}
          lg={10}
          style={props.type && props.type == "BUYER" ? { display: "none" } : ""}
        >
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            className={
              props.isWeb ? "web-button-section" : "mobile-button-section"
            }
          >
            <div style={{ textAlign: "center" }}>
              <Button
                className={
                  props.isWeb ? "web-reject-button" : "mobile-reject-button"
                }
                style={{ display: "inline-block" }}
                onClick={() => props.handleReject(props.data.requestId)}
              >
                <span
                  className="qa-font-san qa-fs-12 qa-fw-b"
                  style={{ color: "#191919" }}
                >
                  RESCHEDULE
                </span>
              </Button>
              <Button
                className={
                  props.isWeb ? "web-accept-button" : "mobile-accept-button"
                }
                style={{ display: "inline-block", marginLeft: "15px" }}
                onClick={() => props.handleAccept(props.data.requestId)}
              >
                <span
                  className="qa-font-san qa-fs-12 qa-fw-b"
                  style={{ color: "#191919" }}
                >
                  ACCEPT
                </span>
              </Button>
            </div>
          </Col>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={10}
          lg={10}
          style={
            props.type && props.type == "SELLER" ? { display: "none" } : ""
          }
        >
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            className={
              props.isWeb ? "web-button-section" : "mobile-cal-button-section"
            }
          >
            <Row>
              {props.data.eventStatus == "OPEN" ? (
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Button
                    className="web-reject-button"
                    onClick={() => props.handleCancel(props.data.requestId)}
                  >
                    <span
                      className="qa-font-san qa-fs-12 qa-fw-b"
                      style={{ color: "#191919", marginLeft: "-6px" }}
                    >
                      CANCEL REQUEST
                    </span>
                  </Button>
                </Col>
              ) : (
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <AddToCalendar
                    event={event}
                    buttonLabel="ADD TO CALENDAR"
                    listItems={items}
                  />

                  {/* <Button >Add to Calender</Button> */}
                </Col>
              )}
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "25px",
                }}
              >
                <Link
                  href={`/seller/${props.id}`}
                  target="blank"                  
                >
                 <span style={{ color: "#874439", textDecoration: "underline" }} className="qa-fs-14 qa-font-san qa-fw-b"> View seller profile</span>
                </Link>
              </Col>
            </Row>
          </Col>
        </Col>
      </Row>
      {/* </div> */}
    </Col>
  );
};

export default VideoRequestCarousel;
