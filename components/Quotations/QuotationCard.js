import React, { useEffect, useState } from "react";
import { Row, Col, Menu, Button } from "antd";
import { useRouter } from "next/router";
import moment from "moment";
import { useKeycloak } from "@react-keycloak/ssr";
import { setOrderByOrderId } from "../../store/actions";
import { connect } from "react-redux";

const QuotationCard = (props) => {
  console.log("props", props);
  const router = useRouter();
  const { keycloak } = useKeycloak();

  const handleReview = (quoteNumber) => {
    props.setOrderByOrderId(null);
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL +
        "/quotes/custom/" +
        quoteNumber +
        "/margin",
      {
        method: "PUT",
        headers: {
          "Content-Length": 0,
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw (
            res.statusText || "Oops something went wrong. Please try again!"
          );
        }
      })
      .then((res) => {
        // console.log("status",res)
        if (props.data.orderId) {
          let url = "/order-review/" + props.data.orderId;
          router.push(url);
        } else {
          createOrderFromQuote(quoteNumber);
        }
      })
      .catch((err) => {
        // message.error(err.message || err, 5);
      });

    // let url = '/order-review/' + rfqId
    // router.push(url);
  };

  const createOrderFromQuote = (quoteNumber) => {
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL +
        "/orders/custom/" +
        quoteNumber,
      {
        method: "POST",
        headers: {
          "Content-Length": 0,
          Authorization: "Bearer " + keycloak.token,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw (
            res.statusText || "Oops something went wrong. Please try again!"
          );
        }
      })
      .then((res) => {
        // console.log(res.orderId);
        let url = "/order-review/" + res.orderId;
        router.push(url);
      })
      .catch((err) => {
        // message.error(err.message || err, 5);
      });
  };

  const viewOrderPage = (lineSheetNumber) => {
    const { buyerCode } = props.data;
    let url =
      process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL +
      "/forms/queries/status?buyer_id=" +
      buyerCode +
      "&status=LINKED_PARTIAL";
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + keycloak.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // console.log("res",res)
        if (res.ok) {
          return res.json();
        }
      })
      .then((res) => {
        let url = "/linesheet-review/" + lineSheetNumber;
        router.push(url);
      });
  };
  const downloadMedia = (data) => {
    if (data) {
      var a = document.createElement("a");
      a.href =
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL + data["mediaUrl"];
      a.setAttribute("download", "Spec-sheet");
      a.setAttribute("target", "_blank");
      a.click();
    }
  };

  const redirectToSellerCompany = (vanityId) => {
    let url = `${/seller/}${vanityId}`;
    router.push(url);
  };

  const getBrandName =
    props.data &&
    props.data.subOrders &&
    props.data.subOrders.map((subOrder, index) => {
      return (
        <Col
          key={`brand-name-${index}`}
          xs={24}
          sm={24}
          md={24}
          lg={24}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <span
            className="qa-font-san qa-fs-14 qa-fw-b qa-sm-color"
            style={{
              lineHeight: "20px",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={(e) =>
              redirectToSellerCompany(
                props.brandNames[subOrder.sellerCode].vanityId
              )
            }
          >
            {subOrder.sellerCode}
          </span>
        </Col>
      );
    });

  const getAllRfqNumber =
    props.data &&
    props.data.linkedQueriesId &&
    Object.keys(props.data.linkedQueriesId).map((key, index) => {
      return (
        <Col key={`RfqNumber-${index}`} xs={24} sm={24} md={24} lg={24}>
          <span
            className="qa-font-san qa-fs-14"
            style={{ lineHeight: "20px", color: "#191919" }}
          >
            {props.data.linkedQueriesId[key]}
          </span>
        </Col>
      );
    });

  if (props.linesheet) {
    return (
      <Row>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          style={{ background: "#f2f0eb", marginBottom: "20px",paddingTop:"30px",paddingBottom:"30px" }}
        >
          <Row>
            <Col
              xs={22}
              sm={22}
              md={3}
              lg={3}
              className="vertical-divider qa-vertical-center"
            >
              <Row style={{ width: "100%" }}>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-fs-32 qa-font-san"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#191919",
                    }}
                  >
                    {moment(props.data.creationDate).format("DD")}
                  </span>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-font-san qa-fs-12"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#332f2f",
                      opacity: "80%",
                    }}
                  >
                    {moment(props.data.creationDate).format("MMM YYYY")}
                  </span>
                </Col>
              </Row>
            </Col>
            <Col xs={22} sm={22} md={7} lg={7}>
              <Row style={{ height: "100%" }}>
                <Col
                  xs={24}
                  sm={24}
                  md={6}
                  lg={6}
                  className="qa-vertical-center"
                >
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        marginLeft: "17px",
                      }}
                    >
                      <span
                        className="qa-fs-12 qa-font-san"
                        style={{ color: "#191919" }}
                      >
                        RFQ ID
                      </span>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        marginLeft: "17px",
                      }}
                    >
                      <Row>{props.data.queryNumber}</Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xs={24} sm={24} md={14} lg={14} xl={14}>
              <Col xs={24} sm={24} md={24} lg={22} style={{ top: "20%" }}>
                <Row justify="end">
                  {props.data.rfqStatus === "LINKED_PARTIAL" && (
                    <div style={{ textAlign: "center" }}>
                      <Button
                        className="web-review-button"
                        onClick={() =>
                          viewOrderPage(props.data.lineSheetNumber)
                        }
                      >
                        <span
                          className="qa-font-san qa-fs-12 qa-fw-b"
                          style={{ color: "#191919" }}
                        >
                          VIEW ORDER SHEET
                        </span>
                      </Button>
                      {/* <Button
                                            className="web-review-button"
                                            style={{marginLeft:"25px"}}
                                            onClick={() => handleReview(props.data.quoteNumber)}
                                        >
                                            <span className="qa-font-san qa-fs-12 qa-fw-b" style={{ color: '#191919' }}>REVIEW AND CHECKOUT</span></Button> */}
                    </div>
                  )}
                  {props.data.quoteStatus === "ACCEPTED" && (
                    <div style={{ textAlign: "center" }}>
                      {/* <Button
                                                className="web-review-button"
                                                onClick={() => viewOrderPage(props.data.lineSheetNumber)}
                                            >
                                                <span className="qa-font-san qa-fs-12 qa-fw-b" style={{ color: '#191919' }}>VIEW ORDER SHEET</span></Button> */}
                      <Button
                        className="web-review-button"
                        style={{ marginLeft: "25px" }}
                        onClick={() => handleReview(props.data.quoteNumber)}
                      >
                        <span
                          className="qa-font-san qa-fs-12 qa-fw-b"
                          style={{ color: "#191919" }}
                        >
                          REVIEW AND CHECKOUT
                        </span>
                      </Button>
                    </div>
                  )}
                </Row>
              </Col>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  } else {
    return (
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        style={{ background: "#f2f0eb", marginBottom: "20px" }}
      >
        <Row>
          <Col
            xs={22}
            sm={22}
            md={3}
            lg={3}
            className="vertical-divider qa-vertical-center"
          >
            <Row style={{ width: "100%" }}>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                style={
                  props.status == "requested"
                    ? {
                        marginTop: "5px",
                        display: "flex",
                        justifyContent: "center",
                      }
                    : { display: "flex", justifyContent: "center" }
                }
              >
                <span
                  className="qa-fs-32 qa-font-san"
                  style={{ color: "#191919" }}
                >
                  {props.day}
                </span>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={24}
                style={
                  props.status == "requested"
                    ? { marginBottom: "20px", textAlign: "center" }
                    : { textAlign: "center" }
                }
              >
                <span
                  className="qa-font-san qa-fs-12"
                  style={{ color: "#332f2f", opacity: "80%" }}
                >
                  {props.formattedDate}
                </span>
              </Col>
            </Row>
          </Col>
          <Col
            xs={22}
            sm={22}
            md={14}
            lg={14}
            className={
              props.status == "received" || props.status == "closed"
                ? "vertical-divider"
                : ""
            }
            style={{ paddingTop: "20px", paddingBottom: "20px" }}
          >
            <Row style={{ height: "100%" }}>
              {props.status == "received" || props.status == "closed" ? (
                <Col
                  xs={24}
                  sm={24}
                  md={6}
                  lg={6}
                  className="qa-vertical-center"
                >
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        marginLeft: "17px",
                      }}
                    >
                      <span
                        className="qa-fs-12 qa-font-san"
                        style={{ color: "#191919" }}
                      >
                        RFQ ID
                      </span>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        marginLeft: "17px",
                      }}
                    >
                      <Row>{getAllRfqNumber}</Row>
                    </Col>
                  </Row>
                </Col>
              ) : (
                <Col
                  xs={24}
                  sm={24}
                  md={6}
                  lg={6}
                  className="qa-vertical-center"
                >
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        marginLeft: "17px",
                      }}
                    >
                      <span
                        className="qa-fs-12 qa-font-san"
                        style={{ color: "#191919" }}
                      >
                        RFQ ID
                      </span>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        marginLeft: "17px",
                      }}
                    >
                      <span className="qa-font-san qa-fs-14 qa-tc-white">
                        {props.data.queryNumber}
                      </span>
                    </Col>
                  </Row>
                </Col>
              )}
              <Col xs={24} sm={24} md={2} lg={2}></Col>
              {props.status == "received" || props.status == "closed" ? (
                <Col
                  xs={24}
                  sm={24}
                  md={9}
                  lg={9}
                  className="qa-vertical-center"
                  style={{ justifyContent: "center", flexDirection: "column" }}
                >
                  <div style={{ fontFamily: "senregular" }}>Seller ID</div>
                  <Row>{getBrandName}</Row>
                </Col>
              ) : (
                <Col
                  xs={24}
                  sm={24}
                  md={16}
                  lg={16}
                  className="qa-vertical-center"
                  style={{ justifyContent: "center" }}
                >
                  {props.data.sellerId ? (
                    <span
                      className="qa-font-san qa-fs-14 qa-fw-b qa-sm-color"
                      style={{
                        lineHeight: "20px",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={(e) =>
                        redirectToSellerCompany(
                          props.brandNames &&
                            props.brandNames[props.data.sellerId] &&
                            props.brandNames[props.data.sellerId].vanityId
                        )
                      }
                    >
                      {props.data.sellerId}
                    </span>
                  ) : (
                    <span className="qa-font-san qa-fs-14 qa-fw-b qa-tc-white">
                      Custom order quote requested
                    </span>
                  )}
                </Col>
              )}
              {props.status == "received" || props.status == "closed" ? (
                <Col
                  xs={24}
                  sm={24}
                  md={7}
                  lg={7}
                  className="qa-vertical-center"
                >
                  <Row>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <img
                        className="images"
                        src={process.env.NEXT_PUBLIC_URL + "/pdf_download.png"}
                        style={{ height: "50px" }}
                        onClick={(e) =>
                          downloadMedia(props.data.quotationMedia)
                        }
                      ></img>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <span
                        className="qa-font-san qa-fs-10"
                        style={{ color: "#332f2f", opacity: "80%" }}
                      >
                        Quote ID: {props.data.quoteNumber}
                      </span>
                    </Col>
                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <span
                        className="qa-font-san qa-fs-10"
                        style={{ color: "#332f2f", opacity: "80%" }}
                      >
                        {props.quoteCreatedDate}*
                      </span>
                    </Col>
                  </Row>
                </Col>
              ) : (
                ""
              )}
            </Row>
          </Col>
          {props.status == "received" ? (
            <Col xs={24} sm={24} md={7} lg={7}>
              <Col xs={24} sm={24} md={24} lg={24} style={{ top: "30%" }}>
                <div style={{ textAlign: "center" }}>
                  <Button
                    className="web-review-button"
                    onClick={() => handleReview(props.data.quoteNumber)}
                  >
                    <span
                      className="qa-font-san qa-fs-12 qa-fw-b"
                      style={{ color: "#191919" }}
                    >
                      REVIEW AND CHECKOUT
                    </span>
                  </Button>
                </div>
              </Col>
            </Col>
          ) : (
            ""
          )}

          {props.status == "closed" ? (
            <Col
              xs={24}
              sm={24}
              md={7}
              lg={7}
              style={{ padding: "20px" }}
              className="qa-vertical-center"
            >
              <Row>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{
                    top: "15%",
                    display: "flex",
                    lineHeight: "17px",
                    textAlign: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    {props.data.orderStatus &&
                    props.data.orderStatus === "CHECKED_OUT" ? (
                      <span className="dot-green"></span>
                    ) : (
                      <span className="dot-red"></span>
                    )}
                    &nbsp;&nbsp;&nbsp;
                    {props.data.orderStatus &&
                    props.data.orderStatus === "CHECKED_OUT" ? (
                      <span
                        className="qa-font-san qa-fs-14 qa-fw-b"
                        style={{ color: "#191919" }}
                      >
                        Order confirmed
                      </span>
                    ) : (
                      <span
                        className="qa-font-san qa-fs-14 qa-fw-b"
                        style={{ color: "#191919" }}
                      >
                        Order cancelled & archived
                      </span>
                    )}
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  style={{
                    top: "15%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <span className="qa-font-san qa-fs-12">
                      {moment(props.data.updatedTimeStamp).format("DD/MM/YYYY")}
                      *
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
          ) : (
            ""
          )}
        </Row>
      </Col>
    );
  }
};

export default connect(null, { setOrderByOrderId })(QuotationCard);
