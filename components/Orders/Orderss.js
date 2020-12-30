import React, { useEffect, useState } from "react";
import Link from "next/link";
import { connect } from "react-redux";
import { Row, Col, Menu, Button, Modal } from "antd";
import OrderDetails from "./OrderDetails";
import { getOrders, getOrderByOrderId } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { useRouter } from "next/router";
import { LoadingOutlined } from "@ant-design/icons";
import SendQueryForm from "../SendQueryForm/SendQueryForm";
import OrderCard from "./OrderCard";
import OrderDetail from "./OrderDetail"
import closeButton from "../../public/filestore/closeButton";
import Icon, {
  CheckCircleOutlined,
} from "@ant-design/icons";

const Orderss = (props) => {
  const { keycloak } = useKeycloak();
  const [current, setCurrent] = useState("open");
  const [showLoader, setShowLoader] = useState(true);
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const [visible, setVisible] = useState(false);
  const [detailOrder, setDetailOrder] = useState("")
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  console.log(props.mediaMatch)
  const handleClick = (e) => {
    setCurrent(e.key);
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
  };

  let requesterName = "";
  if (
    props.userProfile &&
    props.userProfile.firstName &&
    props.userProfile &&
    props.userProfile.lastName
  ) {
    requesterName =
      props.userProfile.firstName + " " + props.userProfile.lastName;
  }

  let values = {
    profileId: props.userProfile && props.userProfile.profileId,
    profileType: props.userProfile && props.userProfile.profileType,
    category: "",
    requirementDetails: "",
    upload: {},
    quantity: "",
    pricePerItem: "",
    deliveryDate: "",
    requesterName: requesterName,
    companyName: props.userProfile && props.userProfile.orgName,
    emailId: props.userProfile && props.userProfile.email,
    country: props.userProfile && props.userProfile.country,
    city: "",
    mobileNo: props.userProfile && props.userProfile.orgPhone,
  };

  useEffect(() => {
    setShowLoader(true);
    props.getOrders(keycloak.token);
  }, [keycloak.token]);

  useEffect(() => {
    if (props.orders && props.isOrderAvailable) {
      setShowLoader(false);
    }
  }, [props.orders, props.isOrderAvailable]);

  const downloadBuyerAgreement = () => {
    var a = document.createElement("a");
    a.href = process.env.NEXT_PUBLIC_REACT_APP_BUYER_AGREEMENT_URL;
    a.setAttribute("download", "Buyer-agreement");
    a.setAttribute("target", "_blank");
    a.click();
  };
  const sendQueryCancel = (status) => {
    setVisible(false);
    if (status === "success") {
      setSuccessQueryVisible(true);
    } 
  };

  let viewOrder = []
  if (showLoader ) {
    return (
      <div className="qa-loader-middle">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </div>
    );
  }
  return (
    <React.Fragment>
      <Col xs={24} sm={24} md={22} lg={22} className = "order-container">
        <Row>
          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="form-top">
              <p
                className="form-heading qa-fs-22 qa-font-san qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                MY ORDERS {props.showOrderDetails ? <span>/ {detailOrder.subOrders[detailOrder.subIndex].id}</span> : null}
              </p>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} className = "order-faq-section">
            <div style={{ textAlign: "right" }}>
              <Link href="/FAQforwholesalebuyers">
                <a target="_blank">
                  <span
                    style={{ lineHeight: "17px", cursor: "pointer" }}
                    className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                  >
                    BUYERS’ FAQs{" "}
                  </span>
                </a>
              </Link>
              <span
                className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                style={{ lineHeight: "17px" }}
              >
                {" "}
                |{" "}
              </span>
              <span
                className="qa-font-san qa-fw-b qa-fs-14 qa-sm-color"
                style={{ lineHeight: "17px", cursor: "pointer" }}
                onClick={downloadBuyerAgreement}
              >
                {" "}
                ORDER T&C{" "}
              </span>
            </div>
          </Col>
        </Row>
      </Col>
      {props.showOrderDetails ? null
      :(<Col xs={24} sm={24} md={24} lg={24} className="order-menu">
        <Row>
          <Col xs={24} sm={24} md={18} lg={18}>
            <Menu
              onClick={handleClick}
              selectedKeys={[current]}
              mode="horizontal"
            >
              <Menu.Item key="open">
                <span
                  className="qa-fs-14 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  OPEN
                </span>
              </Menu.Item>
              <Menu.Item key="delivered">
                <span
                  className="qa-fs-14 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  DELIVERED
                </span>
              </Menu.Item>
              <Menu.Item key="cancelled">
                <span
                  className="qa-fs-14 qa-font-san"
                  style={{ lineHeight: "17px" }}
                >
                  CANCELLED
                </span>
              </Menu.Item>
            </Menu>
          </Col>
          {mediaMatch.matches ? (
            <Col
              xs={22}
              sm={22}
              md={6}
              lg={6}
              style={{ borderBottom: "0.5px solid #C4C4C4" }}
              className="qa-vertical-center"
            >
              <div
                style={{
                  textAlign: "left",
                  textAlignLast: "left",
                  lineHeight: "12px",
                }}
              >
                {current == "received" || current == "closed" ? (
                  <span
                    className="qa-font-san qa-fs-10"
                    style={{ color: "#191919" }}
                  >
                    *Quote is applicable till 30 days from the day the quote was
                    shared
                  </span>
                ) : (
                  ""
                )}
              </div>
            </Col>

          ) : (
            ""
          )}
        </Row>
      </Col>)}
      <React.Fragment>
      {props.showOrderDetails 
        ? (props.orders && props.orders.length > 0 && props.typeOrder[current].length > 0
            ? <OrderDetail order={detailOrder}/>
            : null
        ) 
        :(props.orders && props.orders.length > 0 && props.typeOrder[current].length > 0
          ?(
            props.typeOrder[current].map(x => <OrderCard 
              setDetailOrder = {setDetailOrder} 
              handleShowOrder = {props.handleShowOrder}
              setOrderText = {props.setOrderText}
              order = {x}
              mediaMatche = {props.mediaMatch}
            />)
          ):(
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              style={{ backgroundColor: "#F2F0EB" }}
            >
              <Row
                style={{
                  paddingLeft: "20px",
                  paddingRight: "20px",
                  paddingTop: "20px",
                  paddingBottom: "15px",
                }}
              >
                <Col xs={24} sm={24} md={24} lg={24}>
                  <span
                    className="qa-font-butler qa-fs-30"
                    style={{ color: "#191919" }}
                  >
                    No orders to display!
                  </span>
                </Col>
                <Col xs={17} sm={17} md={17} lg={17}>
                  <span className="qa-font-san qa-fs-17 qa-tc-white">
                    You currently do not have any active or past orders to
                    display. You can get started by sharing a Request for quote
                    by clicking below.
                  </span>
                </Col>
                <Col xs={7} sm={7} md={7} lg={7}></Col>
                <Col
                  xs={10}
                  sm={10}
                  md={10}
                  lg={10}
                  style={{ marginTop: "40px", marginBottom: "40px" }}
                  className="quote-rfq"
                >
                  <Button
                    className="qa-button quote-contact-seller"
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    <span className="qa-font-san qa-fw-b qa-fs-12">
                      REQUEST FOR QUOTE
                    </span>
                  </Button>
                </Col>
              </Row>
            </Col>
          ))
        }
        <Modal
        visible={visible}
        footer={null}
        closable={false}
        onCancel={sendQueryCancel}
        style={{ top: 5 }}
        bodyStyle={{ padding: "0" }}
        className="rfq-submit-modal"
        // width={props.buyerDetails || props.sellerDetails ? 775 : 550}
        className="rfq-submit-modal"
      >
        <div>
          <div
            onClick={sendQueryCancel}
            style={{
              position: "absolute",
              right: "20px",
              top: "15px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />{" "}
          </div>
          <SendQueryForm
            sendQueryCancel={sendQueryCancel}
            token={keycloak.token}
            initialValues={values}
            userId={props.userProfile && props.userProfile.profileId}
          />
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
        className="rfq-submission-modal"
      >
        <div id="send-query-success-modal">
          <div className="send-query-success-modal-content">
            <p className="send-query-success-modal-para1">Thank you!</p>
            <p className="send-query-success-modal-para2">
              We are excited to serve you and will revert within 24-48 hrs.
            </p>
          </div>
          <Button
            className="send-query-success-modal-button"
            onClick={() => {
              successQueryCancel();
            }}
          >
            Back to home page
          </Button>
        </div>
      </Modal>
      </React.Fragment>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    orders: state.userProfile.orders,
    typeOrder: state.userProfile.typeOrder,
    brandNameList: state.userProfile.brandNameList,
    isOrderAvailable: state.userProfile.isOrderAvailable,
    userProfile: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, {
  getOrders,
  getOrderByOrderId,
})(Orderss);
