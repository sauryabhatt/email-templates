/** @format */

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Col, Row, Modal, Input, Form, message } from "antd";
import { useKeycloak } from "@react-keycloak/ssr";
import Icon from "@ant-design/icons";
// import { loginToApp } from "./../../AuthWithKeycloak/AuthWithKeycloak";
import HomeBanner from "./../HomeBanner/HomeBanner";
import CategoryBannerCarousel from "../CategoryBannerCarousel";
import PaymentBanner from "./../PaymentBanner/PaymentBanner";
import SendQueryForm from "./../SendQueryForm/SendQueryForm";
import CraftCarousel from "./../CraftCarousel/CraftCarousel";
import SellerCarousel from "./../SellerCarousel/SellerCarousel";
import PressCrousel from "./../PressCrousel/PressCrousel";
import closeButton from "../../public/filestore/closeButton";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

function Home(props) {
  const router = useRouter();
  const { keycloak } = useKeycloak();
  const isAuthenticated = useSelector((state) => state.auth.authenticated);
  const [visible, setVisible] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [inviteAccess, setInviteAccess] = useState(false);
  const [form] = Form.useForm();
  let mediaMatch = undefined;
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [inProgressMsg, setInProgressMsg] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [previousUrl, setPreviousUrl] = useState("");

  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );

  useEffect(() => {
    let hours = 2; // Reset when storage is more than 2 hours
    let now = new Date().getTime();
    mediaMatch = window.matchMedia("(min-width: 768px)");
    let { username = "" } = props.userProfile || {};
    let newUser = localStorage.getItem("newUser");
    let userNameLS = localStorage.getItem("userName");
    let previousUrl = localStorage.getItem("productUrl");
    if (newUser && previousUrl && newUser !== null) {
      setNewUser(true);
      setPreviousUrl(previousUrl);
      // setShowNotification(true);
    }
    if (newUser && now - parseInt(newUser) > hours * 60 * 60 * 1000) {
      localStorage.removeItem("newUser");
      localStorage.removeItem("productUrl");
      localStorage.removeItem("userName");
    }

    let notification = sessionStorage.getItem("showNotification");
    if (props && props.userProfile && !notification) {
      let { verificationStatus = "", profileType = "" } = props.userProfile;
      if (profileType === "BUYER" && verificationStatus === "IN_PROGRESS") {
        setNotificationMsg(
          "Welcome! Your Buyer Account will be verified within 48 hours, meanwhile we are providing temporary access to view seller catalogs, products, prices and place orders. Qalara offers secure payments, lowest freight costs, and quality inspections for your orders, so you can shop with confidence!"
        );
        setInProgressMsg(
          "Just click on SHOP in the main menu to start discovering thousands of products! And click on Request for Quote for any custom order requirements."
        );
        setShowNotification(true);
      } else if (profileType === "BUYER" && verificationStatus === "ON_HOLD") {
        setNotificationMsg(
          "We are in the process of verifying your buyer profile, and will revert within 48 hours. Once verified, you will have access to product catalogs, prices and will be able to order and checkout."
        );
        setInProgressMsg(
          "Just click on SHOP in the main menu to start discovering thousands of products! And click on Request for Quote for any custom order requirements."
        );
        setShowNotification(true);
      } else if (profileType === "BUYER" && verificationStatus === "REJECTED") {
        setShowNotification(false);
      } else if (
        profileType === "BUYER" &&
        verificationStatus === "VERIFIED" &&
        props.isGuest === "true"
      ) {
        setNotificationMsg(
          "As a invitee buyer you have access to all the products and prices. However to place an order please signup as a buyer"
        );
        setShowNotification(true);
      }
      sessionStorage.setItem("showNotification", true);
    }
  }, [props.userProfile]);

  let values = {
    category: "",
    requirementDetails: "",
    upload: {},
    quantity: "",
    pricePerItem: "",
    deliveryDate: "",
    requesterName: "",
    companyName: "",
    emailId: "",
    country: "",
    city: "",
    mobileNo: "",
  };
  // sendQueryOpen = () => {
  //   this.setState({ visible: true });
  // };

  const sendQueryCancel = (status) => {
    if (status === "success") {
      setVisible(false);
      setSuccessQueryVisible(true);
    } else {
      setVisible(false);
    }
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
    setInviteAccess(false);
    setSubmitted(false);
    form.resetFields();
  };

  const signIn = () => {
    loginToApp(keycloak, undefined);
  };

  const handleCancel = () => {
    setShowNotification(false);
  };

  const handleInvite = (values) => {
    setLoading(true);
    // let ip = await getIP();
    fetch("https://ipapi.co/json/", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        let data = {
          fromEmailId: values.email,
          name: values.name,
          orgName: values.orgName,
          profileType: "BUYER",
          ip: (response && response.ip) || null,
          ipCountry: (response && response.country_name) || null,
        };
        sendInviteData(data);
      })
      .catch((err) => {
        // console.log("Error ", err);
      });
  };

  const sendInviteData = (data) => {
    fetch(process.env.NEXT_PUBLIC_REACT_APP_API_FORM_URL + "/forms/lead-gens", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Error while signing up.";
        }
      })
      .then((res) => {
        // message.success('User signed up successfully.', 5);
        setLoading(false);
        form.resetFields();
        setSubmitted(true);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
        setLoading(false);
      });
  };

  const sellerItems = [
    {
      imageHeading: "Fair & Social",
      image: "https://cdn.qalara.com/images/Img_HomePageCarousel2_3.jpg",
      url: "/seller/aravali",
    },
    {
      imageHeading: "Artisanal",
      image: "https://cdn.qalara.com/images/Img_HomePageCarousel2_4.jpg",
      url: "/seller/theindiacrafthouse",
    },
    {
      imageHeading: "Recycled",
      image: "https://cdn.qalara.com/images/Img_HomePageCarousel2_5.jpg",
      url: "/seller/creativedehome",
    },
    {
      imageHeading: "Sustainable",
      image: "https://cdn.qalara.com/images/Img_HomePageCarousel2_6.jpg",
      url: "/seller/collectivecraft",
    },
    {
      imageHeading: "Organic",
      image: "https://cdn.qalara.com/images/Img_HomePageCarousel2_1.jpg",
      url: "/seller/greenfurhandcrafts",
    },
    {
      imageHeading: "Eco friendly",
      image: "https://cdn.qalara.com/images/Img_HomePageCarousel2_2.jpg",
      url: "/seller/kalaghar",
    },
  ];

  const imageHeading = "EXPLORE TRENDS";
  const craftItems = [
    {
      imageTitle: "Urban Jungle",
      imageHeading: <span>{imageHeading}</span>,
      slideText:
        "As boundaries between the indoors and the outdoors get blurred, eco-friendly products and natural materials surrounded with large patches of green within living spaces, lend much needed oneness with nature. Discover our range of handmade tropical inspiration which includes macrame planters, terracotta pots, sabai baskets, upcycled & bamboo outdoor furniture, dry flowers, marble garden decor and more from wholesale suppliers who care.",
      imageInner: "https://cdn.qalara.com/images/Img_HomePageCarousel1_2.jpg",
      searchText: "UrbanJungle",
      path: "/trends/urbanjungle",
    },
    {
      imageTitle: "Holiday spirit",
      imageHeading: <span>{imageHeading}</span>,
      slideText:
        "Nothing quite welcomes the holiday season like a well-decorated festive home. Whether its traditional red-and-green decor or modern glitz, we’re certain that you’ll find something at Qalara. Bring in the season to be merry with crewel embroidered pillows, cozy blankets made of recycled yarns, outdoor lights, traditional toy, paper mache gift boxes and handmade décor pieces, thanks to brilliant ideas from some of our favourite sellers. ",
      imageInner: "https://cdn.qalara.com/images/Img_HomePageCarousel1_6.jpg",
      searchText: "ChristmasSpirit",
      path: "/trends/christmasspirit",
    },
    {
      imageTitle: "Global textures",
      imageHeading: <span>{imageHeading}</span>,
      slideText:
        "Globally inspired textures, materials and patterns that bring an electric aesthetic to the home. Embrace the adventures of a collector who mixes treasures of different cultures together effortlessly by blending décor items with handcrafted textiles - rugs, cushions, throws and more! \n" +
        "Our wholesale suppliers offer unique handmade products, combining local crafts and materials with new-age aesthetics, that cater to a global audience. ",
      imageInner: "https://cdn.qalara.com/images/Img_HomePageCarousel1_1.jpg",
      searchText: "GlobalTextures",
      path: "/trends/globaltextures",
    },
    {
      imageTitle: "Earth inspired",
      imageHeading: <span>{imageHeading}</span>,
      slideText:
        "The elegance of natural materials and traditional crafts is truly unparalleled. Discover artisan-made handcrafted statement pieces in sustainable mango wood and natural rattan, recycled shelves and rugs, upcycled metal figurines, hand knotted jute planters; that create a  relaxed mood and add a sun-kissed glow to any space. Our wholesale suppliers believe in conscious production, sustainable supply chains, low carbon footprint & giving back.",
      imageInner: "https://cdn.qalara.com/images/Img_HomePageCarousel1_3.jpg",
      searchText: "EarthInspired",
      path: "/trends/earthinspired",
    },
    {
      imageTitle: "Sunlit Spring '21",
      imageHeading: <span>{imageHeading}</span>,
      slideText:
        "These dominant trends of the upcoming season showcase a brave new world, that celebrates Joy; a bold mix of warm colours, relaxing fits and conscious use of environment-friendly materials. Snug, comfortable masks will continue to be a part of the ensemble. Our sellers have adapted to these changing times and these curated must-haves will definitely awe your customers, so start stocking for a successful Spring Summer 21",
      imageInner: "https://cdn.qalara.com/images/Img_HomePageCarousel1_7.jpg",
      searchText: "sunkissedSpring21",
      path: "/trends/sunkissed-spring21",
    },
    {
      imageTitle: "Home office",
      imageHeading: <span>{imageHeading}</span>,
      slideText:
        "Working from home can be comfortable and convenient with the right tools and set up. Curated from our responsible and conscious wholesale sellers, these writing tables, lighting solutions, notepads & table accessories inspire everyday creativity. Discover the grace of handmade: ajrakh diary covers, recycled wood clipboards, eco-friendly pen stands, cotton printed and bamboo lampshades, hand knotted hanging desks, ceramic coffee mugs and more.",
      imageInner: "https://cdn.qalara.com/images/Img_HomePageCarousel1_4.jpg",
      searchText: "HomeOffice",
      path: "/trends/homeoffice",
    },
  ];

  let sellerUrl = `/sellers/all-categories`;
  let plpUrl = `/products/all-categories`;
  let productUrl = "/explore/curatedbyus";
  let rtsUrl = `/products/all-categories?f_product_types=${encodeURIComponent(
    "Ready to ship"
  )}`;
  let customUrl = `/products/all-categories?f_product_types=${encodeURIComponent(
    "Make to order"
  )}`;
  let ertmUrl = `/products/all-categories?f_product_types=${encodeURIComponent(
    "Express custom"
  )}`;
  return (
    <>
      <HomeBanner isAuthenticated={isAuthenticated} />
      <Row id="q-source-banner">
        <div className="q-source-title">
          <div className="banner-text">
            We serve all types of wholesale buying & sourcing needs
          </div>
        </div>
        <Col
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          className="source-steps qa-mr-1"
        >
          <Link href={rtsUrl}>
            <div className="steps-container qa-cursor">
              <span className="qa-next-line" style={{ color: "#191919" }}>
                READY TO SHIP
              </span>

              <span style={{ color: "#4e4848" }}>
                Browse our growing range of ready stock products that can be
                dispatched within 7-10 days. Add to bag and checkout instantly,
                subject to reasonable order minimums.
              </span>
              <div className="qa-fixed-btns">
                <div className="q-button-link">Shop now</div>
                <svg
                  width="18"
                  height="8"
                  viewBox="0 0 18 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                    fill="#874439"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={8}
          lg={8}
          xl={8}
          className="source-steps qa-ml-1"
        >
          <Link href={ertmUrl}>
            <div className="steps-container qa-cursor">
              <span className="qa-next-line" style={{ color: "#191919" }}>
                EXPRESS CUSTOM
              </span>

              <span style={{ color: "#4e4848" }}>
                Browse, add to bag and instantly checkout 'Express Custom' range
                of products that can be manufactured in small quantities and
                dispatched within 3-5 weeks.
              </span>
              <div className="qa-fixed-btns">
                <div className="q-button-link">Shop now</div>
                <svg
                  width="18"
                  height="8"
                  viewBox="0 0 18 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                    fill="#874439"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} className="source-steps">
          <Link href={customUrl}>
            <div className="steps-container qa-cursor">
              <span className="qa-next-line" style={{ color: "#191919" }}>
                CUSTOM QUOTE
              </span>

              <span style={{ color: "#4e4848" }}>
                Browse products tagged 'Custom Order', share custom requirements
                or your own designs and product ideas with a Request for Quote.
                Receive quotations and confirm orders digitally.
              </span>
              <div className="qa-fixed-btns">
                <div className="q-button-link">Browse now</div>
                <svg
                  width="18"
                  height="8"
                  viewBox="0 0 18 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                    fill="#874439"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </Col>
        <Col span={24}>
          <div className="q-source-details">
            We quality inspect all orders, manage production monitoring for
            custom orders, facilitate secure payments, offer the best freight
            costs and ensure safe door delivery.
          </div>
        </Col>
      </Row>
      {/*<Row id="q-source-banner">
        <div className="q-source-title">
          <div className="banner-text">
            
            Complete a custom order in three steps
          </div>
        </div>
       
        <Col
          xs={24}
          sm={24}
          md={12}
          lg={12}
          xl={12}
          style={{ fontFamily: "senregular" }}
          className="source-steps"
        >
          <div
            className="steps-container"
            style={{
              //marginBottom: "20px",
              lineHeight: "140%",
              //marginTop: "30px",
            }}
          >
            <div className="source-field-icon1">
              <svg
                width="37.13px"
                height="30"
                viewBox="0 0 74 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M70.5023 0.217896H3.45714C1.5508 0.217896 0 1.81084 0 3.76892V49.2539C0 51.1626 1.51853 52.6577 3.45714 52.6577H51.9618L58.5371 59.233C59.0317 59.7275 59.6891 59.9999 60.3885 59.9999C61.0876 59.9999 61.7451 59.7275 62.2397 59.233L65.0429 56.4299C65.5374 55.9353 65.8097 55.2779 65.8097 54.5787C65.8097 53.8793 65.5373 53.2218 65.0428 52.7274L64.9731 52.6577H70.5023C72.4635 52.6577 74 51.1626 74 49.2539V3.76892C74 1.84409 72.3982 0.217896 70.5023 0.217896ZM3.45714 2.99985H70.5023C70.8703 2.99985 71.218 3.37375 71.218 3.76892V8.98105H2.78196V3.76892C2.78196 3.35928 3.09743 2.99985 3.45714 2.99985ZM36.9519 44.0372C33.5291 44.0372 30.3111 42.7042 27.8906 40.2839C25.4703 37.8637 24.1375 34.6457 24.1375 31.2228C24.1375 27.7999 25.4703 24.5818 27.8906 22.1615C30.3109 19.7412 33.5288 18.4083 36.9517 18.4083C40.3747 18.4083 43.5925 19.7412 46.013 22.1615C48.4333 24.5817 49.7663 27.7997 49.7663 31.2228C49.7663 34.6456 48.4333 37.8636 46.013 40.2839C43.5927 42.7042 40.3747 44.0372 36.9519 44.0372ZM48.1077 42.1294L50.4119 44.4337L50.2434 44.6023L47.9391 42.298L48.1077 42.1294ZM60.3883 57.1499L53.74 50.5016C53.6361 50.3444 53.5013 50.2096 53.3441 50.1057L51.0092 47.7708L53.5806 45.1997L62.9597 54.5787L60.3883 57.1499ZM70.5023 49.8758H62.1912L55.432 43.1166C54.9375 42.622 54.2801 42.3495 53.5806 42.3495C53.2006 42.3495 52.8341 42.4325 52.4981 42.5853L49.8745 39.9616C51.6129 37.4025 52.5483 34.3846 52.5483 31.2228C52.5483 27.0568 50.9261 23.1402 47.9802 20.1944C45.0343 17.2486 41.1177 15.6263 36.9519 15.6263C32.786 15.6263 28.8695 17.2486 25.9236 20.1944C22.978 23.1402 21.3557 27.0568 21.3557 31.2228C21.3557 35.3886 22.978 39.3052 25.9236 42.251C28.8695 45.1968 32.786 46.8191 36.952 46.8191C40.1535 46.8191 43.2071 45.86 45.7865 44.0796L48.3953 46.6884C48.2424 47.0243 48.1595 47.3908 48.1595 47.7708C48.1595 48.4701 48.4319 49.1276 48.9264 49.6222L49.18 49.8758H3.45714C3.13192 49.8758 2.78196 49.6812 2.78196 49.2539V11.763H71.218V49.2539C71.218 49.6578 70.8493 49.8758 70.5023 49.8758Z"
                  fill="black"
                />
              </svg>
            </div>
            <span className="qa-next-line" style={{ color: "#191919" }}>
              Step 1
            </span>
            <span style={{ color: "#4e4848" }}>
              Browse our products and suppliers (or share your own ideas) and
              send us a Request for quote for any artisanal home & lifestyle
              products you’d like to source from India and South Asia.
            </span>
          </div>

          <div
            className="steps-container"
            style={{
             
              lineHeight: "140%",
            }}
          >
            <div className="source-field-icon2">
              <svg
                width="22.83"
                height="30"
                viewBox="0 0 46 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.83076 11.3738C10.5105 11.3738 11.0626 11.9228 11.0626 12.5983C11.0626 13.0417 11.4224 13.4014 11.8657 13.4014C12.3091 13.4014 12.6688 13.0417 12.6688 12.5983C12.6688 11.3171 11.8064 10.2449 10.6339 9.89696V9.80311C10.6339 9.35973 10.2741 9 9.83076 9C9.38738 9 9.02765 9.35973 9.02765 9.80311V9.89775C7.85932 10.2462 7 11.3178 7 12.5983C7 14.1638 8.26951 15.4364 9.83076 15.4364C10.5105 15.4364 11.0626 15.9854 11.0626 16.6599C11.0626 17.3396 10.5105 17.8928 9.83076 17.8928C9.15522 17.8928 8.60623 17.3396 8.60623 16.6599C8.60623 16.2165 8.2465 15.8568 7.80311 15.8568C7.35973 15.8568 7 16.2165 7 16.6599C7 17.9438 7.85932 19.0188 9.02765 19.3686V19.4624C9.02765 19.9058 9.38738 20.2656 9.83076 20.2656C10.2741 20.2656 10.6339 19.9058 10.6339 19.4624V19.3691C11.8064 19.0201 12.6688 17.9446 12.6688 16.6599C12.6688 15.0997 11.3962 13.8302 9.83076 13.8302C9.15522 13.8302 8.60623 13.278 8.60623 12.5983C8.60623 11.9228 9.15522 11.3738 9.83076 11.3738Z"
                  fill="black"
                />
                <path
                  d="M9.83076 11.3738C10.5105 11.3738 11.0626 11.9228 11.0626 12.5983C11.0626 13.0417 11.4224 13.4014 11.8657 13.4014C12.3091 13.4014 12.6688 13.0417 12.6688 12.5983C12.6688 11.3171 11.8064 10.2449 10.6339 9.89696V9.80311C10.6339 9.35973 10.2741 9 9.83076 9C9.38738 9 9.02765 9.35973 9.02765 9.80311V9.89775C7.85932 10.2462 7 11.3178 7 12.5983C7 14.1638 8.26951 15.4364 9.83076 15.4364C10.5105 15.4364 11.0626 15.9854 11.0626 16.6599C11.0626 17.3396 10.5105 17.8928 9.83076 17.8928C9.15522 17.8928 8.60623 17.3396 8.60623 16.6599C8.60623 16.2165 8.2465 15.8568 7.80311 15.8568C7.35973 15.8568 7 16.2165 7 16.6599C7 17.9438 7.85932 19.0188 9.02765 19.3686V19.4624C9.02765 19.9058 9.38738 20.2656 9.83076 20.2656C10.2741 20.2656 10.6339 19.9058 10.6339 19.4624V19.3691C11.8064 19.0201 12.6688 17.9446 12.6688 16.6599C12.6688 15.0997 11.3962 13.8302 9.83076 13.8302C9.15522 13.8302 8.60623 13.278 8.60623 12.5983C8.60623 11.9228 9.15522 11.3738 9.83076 11.3738Z"
                  stroke="black"
                />
                <path
                  d="M45.4713 17.3066C45.4716 16.964 45.3376 16.6349 45.098 16.3899L30.0763 1.07344C29.9542 0.948907 29.8085 0.850006 29.6477 0.782538C29.4869 0.71507 29.3143 0.680393 29.1399 0.680542H6.54829C4.81157 0.680542 3.14599 1.37045 1.91795 2.59849C0.689907 3.82653 0 5.49211 0 7.22883V53.8723C0 55.609 0.689907 57.2746 1.91795 58.5026C3.14599 59.7306 4.81157 60.4205 6.54829 60.4205H38.923C40.6597 60.4205 42.3253 59.7306 43.5533 58.5026C44.7814 57.2746 45.4713 55.609 45.4713 53.8723V17.3066ZM30.3448 5.07444L41.6667 16.6256H32.3092C31.7882 16.6256 31.2886 16.4186 30.9201 16.0502C30.5517 15.6818 30.3448 15.1821 30.3448 14.6611V5.07444ZM38.923 57.8012H6.54829C5.50626 57.8012 4.50691 57.3873 3.77008 56.6505C3.03326 55.9136 2.61931 54.9143 2.61931 53.8723V7.20918C2.61931 6.16715 3.03326 5.16781 3.77008 4.43098C4.50691 3.69416 5.50626 3.28021 6.54829 3.28021H27.7254V14.6611C27.7254 15.8768 28.2084 17.0427 29.068 17.9024C29.9276 18.762 31.0935 19.2449 32.3092 19.2449H42.852V53.8723C42.852 54.9143 42.438 55.9136 41.7012 56.6505C40.9644 57.3873 39.965 57.8012 38.923 57.8012Z"
                  fill="black"
                />
                <path
                  d="M35.5049 29.4014H17.8573C17.5099 29.4014 17.1768 29.5394 16.9312 29.785C16.6856 30.0306 16.5476 30.3637 16.5476 30.711C16.5476 31.0584 16.6856 31.3915 16.9312 31.6371C17.1768 31.8827 17.5099 32.0207 17.8573 32.0207H35.5049C35.8522 32.0207 36.1854 31.8827 36.431 31.6371C36.6766 31.3915 36.8146 31.0584 36.8146 30.711C36.8146 30.3637 36.6766 30.0306 36.431 29.785C36.1854 29.5394 35.8522 29.4014 35.5049 29.4014Z"
                  fill="black"
                />
                <path
                  d="M9.96644 28.7464C9.44542 28.7464 8.94575 28.9533 8.57734 29.3218C8.20892 29.6902 8.00195 30.1898 8.00195 30.7109C8.00195 31.2319 8.20892 31.7315 8.57734 32.1C8.94575 32.4684 9.44542 32.6753 9.96644 32.6753H9.99918C10.5202 32.6753 11.0199 32.4684 11.3883 32.1C11.7567 31.7315 11.9637 31.2319 11.9637 30.7109C11.9637 30.4501 11.9118 30.1919 11.8111 29.9514C11.7103 29.7109 11.5627 29.4929 11.3768 29.31C11.1909 29.1272 10.9704 28.9832 10.7283 28.8864C10.4861 28.7896 10.2272 28.742 9.96644 28.7464Z"
                  fill="black"
                />
                <path
                  d="M35.5049 37.9141H17.8573C17.5099 37.9141 17.1768 38.052 16.9312 38.2977C16.6856 38.5433 16.5476 38.8764 16.5476 39.2237C16.5476 39.5711 16.6856 39.9042 16.9312 40.1498C17.1768 40.3954 17.5099 40.5334 17.8573 40.5334H35.5049C35.8522 40.5334 36.1854 40.3954 36.431 40.1498C36.6766 39.9042 36.8146 39.5711 36.8146 39.2237C36.8146 38.8764 36.6766 38.5433 36.431 38.2977C36.1854 38.052 35.8522 37.9141 35.5049 37.9141Z"
                  fill="black"
                />
                <path
                  d="M9.96644 37.2592C9.44542 37.2592 8.94575 37.4662 8.57734 37.8346C8.20892 38.203 8.00195 38.7027 8.00195 39.2237C8.00195 39.7447 8.20892 40.2444 8.57734 40.6128C8.94575 40.9812 9.44542 41.1882 9.96644 41.1882H9.99918C10.5202 41.1882 11.0199 40.9812 11.3883 40.6128C11.7567 40.2444 11.9637 39.7447 11.9637 39.2237C11.9637 38.9629 11.9118 38.7048 11.8111 38.4643C11.7103 38.2238 11.5627 38.0057 11.3768 37.8229C11.1909 37.64 10.9704 37.496 10.7283 37.3992C10.4861 37.3024 10.2272 37.2548 9.96644 37.2592Z"
                  fill="black"
                />
                <path
                  d="M35.5049 46.4269H17.8573C17.5099 46.4269 17.1768 46.5649 16.9312 46.8105C16.6856 47.0561 16.5476 47.3892 16.5476 47.7365C16.5476 48.0839 16.6856 48.417 16.9312 48.6626C17.1768 48.9082 17.5099 49.0462 17.8573 49.0462H35.5049C35.8522 49.0462 36.1854 48.9082 36.431 48.6626C36.6766 48.417 36.8146 48.0839 36.8146 47.7365C36.8146 47.3892 36.6766 47.0561 36.431 46.8105C36.1854 46.5649 35.8522 46.4269 35.5049 46.4269Z"
                  fill="black"
                />
                <path
                  d="M9.96644 45.772C9.44542 45.772 8.94575 45.979 8.57734 46.3474C8.20892 46.7158 8.00195 47.2155 8.00195 47.7365C8.00195 48.2575 8.20892 48.7572 8.57734 49.1256C8.94575 49.494 9.44542 49.701 9.96644 49.701H9.99918C10.5202 49.701 11.0199 49.494 11.3883 49.1256C11.7567 48.7572 11.9637 48.2575 11.9637 47.7365C11.9637 47.4757 11.9118 47.2176 11.8111 46.9771C11.7103 46.7366 11.5627 46.5185 11.3768 46.3357C11.1909 46.1528 10.9704 46.0088 10.7283 45.912C10.4861 45.8153 10.2272 45.7677 9.96644 45.772Z"
                  fill="black"
                />
              </svg>
            </div>
            <span className="qa-next-line" style={{ color: "#191919" }}>
              Step 2
            </span>
            <span style={{ color: "#4e4848" }}>
              Receive line-sheets for collections from curated sellers.
              Shortlist products and finalise quantities to receive a
              consolidated quote with the lowest freight cost & taxes along with
              lead times. Confirm your order digitally.
            </span>
          </div>
          <div
            className="steps-container"
            style={{
              lineHeight: "140%",
            }}
          >
            <div className="source-field-icon3">
              <svg
                width="34.15px"
                height="30"
                viewBox="0 0 70 61"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <mask
                  id="path-1-outside-1"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="70"
                  height="61"
                  fill="black"
                >
                  <rect fill="white" width="70" height="61" />
                  <path d="M68.1939 34.8605H60.488H56.8028V13.5288H59.8929C60.3363 13.5288 60.6961 13.1691 60.6961 12.7257V1.80311C60.6961 1.35973 60.3363 1 59.8929 1H36.9184H24.7776H1.80311C1.35973 1 1 1.35973 1 1.80311V12.7257C1 13.1691 1.35973 13.5288 1.80311 13.5288H4.89532V45.4129C4.89532 45.8562 5.25505 46.216 5.69843 46.216H16.3512V52.2299V59.9369C16.3512 60.3803 16.7109 60.74 17.1543 60.74H24.8686H60.488H68.1939C68.6373 60.74 68.997 60.3803 68.997 59.9369V52.2299V43.3695V35.6636C68.997 35.2202 68.6373 34.8605 68.1939 34.8605ZM67.1233 51.5018C66.933 51.5259 66.7435 51.5519 66.5573 51.5884C66.4549 51.6085 66.3549 51.6349 66.2537 51.6587C66.0955 51.6958 65.938 51.734 65.7832 51.7799C65.6766 51.8115 65.572 51.8474 65.4669 51.8833C65.3218 51.9325 65.1782 51.9842 65.0366 52.0409C64.932 52.083 64.8288 52.1272 64.7261 52.1732C64.5884 52.2351 64.4531 52.3008 64.3192 52.3695C64.2205 52.4204 64.1221 52.4712 64.0256 52.5259C63.8921 52.6013 63.7623 52.6822 63.6332 52.7645C63.5436 52.8218 63.453 52.8772 63.3655 52.9376C63.2293 53.032 63.0986 53.133 62.9684 53.2349C62.8952 53.2921 62.8197 53.3457 62.7486 53.4052C62.5653 53.5582 62.3888 53.7189 62.219 53.8866C62.1951 53.9104 62.1711 53.934 62.1473 53.958C61.9781 54.1292 61.8163 54.3072 61.6619 54.4921C61.6043 54.5611 61.5522 54.6343 61.4968 54.7051C61.3928 54.8382 61.2896 54.9715 61.1934 55.1107C61.1353 55.1949 61.0819 55.2824 61.0265 55.3686C60.9417 55.5013 60.8587 55.6348 60.7811 55.7723C60.7285 55.8656 60.6793 55.9608 60.6302 56.0562C60.5593 56.1938 60.4916 56.333 60.4281 56.475C60.384 56.5736 60.3416 56.6726 60.3012 56.7733C60.2423 56.9194 60.1889 57.0682 60.138 57.2183C60.1039 57.3192 60.0694 57.4196 60.039 57.522C59.9918 57.681 59.9523 57.8428 59.9144 58.0054C59.8916 58.1029 59.866 58.1991 59.8467 58.2977C59.8101 58.4852 59.7837 58.676 59.7596 58.8675C59.7497 58.9453 59.7349 59.0213 59.7272 59.0998C59.7262 59.1113 59.7235 59.1223 59.7225 59.1338H25.6341C25.633 59.122 25.6304 59.1108 25.6292 59.0991C25.6215 59.0208 25.6067 58.945 25.5969 58.8674C25.5728 58.6762 25.5465 58.4862 25.5099 58.2993C25.4903 58.1989 25.4643 58.1011 25.4411 58.0019C25.4032 57.8407 25.3643 57.6802 25.3175 57.5227C25.2866 57.4192 25.2518 57.3179 25.2173 57.2162C25.1666 57.067 25.1135 56.9194 25.055 56.7741C25.0145 56.6734 24.9718 56.574 24.9275 56.475C24.8637 56.3325 24.7959 56.1928 24.7245 56.0546C24.6756 55.96 24.627 55.8656 24.5747 55.7731C24.4963 55.6342 24.4124 55.4995 24.3266 55.3656C24.2723 55.2808 24.2197 55.1948 24.1625 55.1119C24.0639 54.9694 23.9581 54.8327 23.8514 54.6968C23.7984 54.6293 23.7489 54.5594 23.694 54.4936C23.5298 54.297 23.358 54.1066 23.1769 53.9254C23.1758 53.9244 23.175 53.9232 23.174 53.9221C22.9915 53.7398 22.7996 53.5672 22.6013 53.402C22.5366 53.348 22.4677 53.2994 22.4015 53.2474C22.2643 53.1398 22.1264 53.0335 21.9828 52.9344C21.9002 52.8773 21.8145 52.825 21.7298 52.7709C21.5955 52.685 21.4603 52.6009 21.321 52.5224C21.2287 52.4704 21.1346 52.4218 21.0399 52.3731C20.9016 52.3018 20.7615 52.2339 20.6188 52.17C20.5199 52.1258 20.4206 52.0835 20.3199 52.043C20.1741 51.9844 20.0262 51.9311 19.8767 51.8806C19.7749 51.8461 19.6736 51.8113 19.57 51.7806C19.4125 51.734 19.2523 51.695 19.0912 51.6574C18.9919 51.6341 18.8938 51.6082 18.7932 51.5885C18.6072 51.552 18.4179 51.5261 18.2277 51.5021C18.1488 51.492 18.0714 51.477 17.9918 51.4691C17.9801 51.4681 17.969 51.4655 17.9574 51.4644V44.135C17.9688 44.1339 17.9796 44.1313 17.9911 44.1303C18.0722 44.1224 18.1508 44.1071 18.2314 44.0968C18.4201 44.0729 18.6084 44.0471 18.7932 44.0111C18.894 43.9912 18.9921 43.9653 19.0917 43.9421C19.2524 43.9044 19.4123 43.8655 19.5692 43.819C19.6737 43.7881 19.7759 43.753 19.8786 43.7183C20.0269 43.6681 20.1734 43.6153 20.3179 43.5572C20.4203 43.5162 20.5212 43.473 20.6216 43.4281C20.7619 43.3653 20.8995 43.2985 21.0357 43.2286C21.1327 43.1787 21.2292 43.1289 21.3238 43.0754C21.46 42.9987 21.5921 42.9164 21.7236 42.8327C21.8111 42.7766 21.9 42.7225 21.9855 42.6634C22.1234 42.568 22.2558 42.4657 22.3876 42.3627C22.4596 42.3065 22.5343 42.2537 22.6043 42.1952C22.7889 42.0412 22.9669 41.8794 23.1379 41.7105C23.1619 41.6867 23.1857 41.6629 23.2095 41.6389C23.3776 41.4689 23.5387 41.2921 23.692 41.1085C23.7507 41.0383 23.8038 40.9637 23.8602 40.8917C23.963 40.7602 24.0652 40.6284 24.1603 40.4909C24.2199 40.4049 24.2746 40.3156 24.331 40.2273C24.4146 40.0967 24.4963 39.9654 24.5729 39.83C24.6265 39.7351 24.6765 39.6384 24.7266 39.5414C24.7966 39.4055 24.8633 39.2682 24.9261 39.1282C24.9713 39.0274 25.0147 38.9263 25.056 38.8235C25.1138 38.68 25.1662 38.5344 25.2163 38.3872C25.2513 38.2839 25.2866 38.1812 25.3177 38.0761C25.3642 37.9197 25.403 37.7605 25.4406 37.6005C25.464 37.5007 25.49 37.402 25.5098 37.3007C25.5464 37.1143 25.5726 36.9243 25.5968 36.7336C25.6066 36.6559 25.6215 36.5798 25.6292 36.5014C25.6304 36.4897 25.633 36.4785 25.634 36.4667H59.7225C59.7235 36.4782 59.7261 36.4892 59.7272 36.5007C59.7349 36.5791 59.7497 36.6552 59.7594 36.7328C59.7836 36.9245 59.81 37.1153 59.8468 37.3028C59.8661 37.4013 59.8916 37.4971 59.9142 37.5944C59.9522 37.7574 59.9917 37.9195 60.0391 38.0787C60.0694 38.1809 60.1036 38.281 60.1377 38.3814C60.1886 38.5321 60.2424 38.6812 60.3015 38.8279C60.3415 38.9278 60.3839 39.0261 60.4275 39.124C60.4916 39.2672 60.5598 39.4075 60.6313 39.5464C60.6798 39.6405 60.7282 39.7342 60.7802 39.8264C60.8588 39.9657 60.943 40.1011 61.0291 40.2355C61.0829 40.3199 61.1352 40.4054 61.1921 40.4876C61.2909 40.6305 61.3968 40.7679 61.5038 40.9044C61.5564 40.9713 61.6055 41.0407 61.6602 41.106C61.9904 41.5019 62.3556 41.8671 62.7514 42.1973C62.8168 42.2519 62.8862 42.301 62.9531 42.3536C63.0895 42.4607 63.2269 42.5665 63.3698 42.6653C63.452 42.7222 63.5375 42.7745 63.6219 42.8284C63.7563 42.9145 63.8917 42.9987 64.0311 43.0772C64.1232 43.1292 64.217 43.1776 64.3111 43.2261C64.4499 43.2976 64.5903 43.3658 64.7334 43.4299C64.8313 43.4736 64.9296 43.5159 65.0295 43.5559C65.1763 43.615 65.3253 43.6689 65.476 43.7197C65.5764 43.7538 65.6765 43.7881 65.7787 43.8184C65.938 43.8657 66.1 43.9052 66.263 43.9432C66.3603 43.9658 66.4561 43.9913 66.5547 44.0107C66.7421 44.0474 66.933 44.0738 67.1246 44.098C67.2022 44.1078 67.2783 44.1226 67.3567 44.1303C67.3682 44.1313 67.3792 44.1339 67.3907 44.135V51.4644C67.379 51.4655 67.3677 51.4681 67.3561 51.4693C67.2776 51.477 67.2012 51.4919 67.1233 51.5018ZM24.0004 36.5596C23.957 36.8918 23.8903 37.2167 23.8012 37.5326C23.7895 37.5733 23.7816 37.6157 23.7693 37.6562C23.6708 37.9812 23.5447 38.2934 23.4014 38.5963C23.3731 38.6564 23.345 38.7167 23.3148 38.7759C23.1654 39.0698 22.997 39.3524 22.8085 39.6203C22.7751 39.6679 22.7386 39.7134 22.7039 39.7602C22.5003 40.0344 22.2828 40.2982 22.0416 40.5394C22.0391 40.5419 22.0365 40.5444 22.0339 40.5468C21.7926 40.7874 21.5287 41.0046 21.2542 41.2077C21.2078 41.242 21.1628 41.2781 21.1155 41.3113C20.8467 41.5 20.5631 41.6681 20.2682 41.8177C20.2099 41.8472 20.1504 41.8749 20.0911 41.9029C19.7872 42.0461 19.4734 42.1725 19.1474 42.271C19.1077 42.2829 19.0664 42.2908 19.0265 42.3021C18.7085 42.3918 18.3812 42.4587 18.0465 42.5021C18.0166 42.506 17.9875 42.5123 17.9574 42.5158V36.4667H24.0147C24.0111 36.4981 24.0046 36.5284 24.0004 36.5596ZM67.3908 42.5157C67.3601 42.512 67.3301 42.5057 67.2995 42.5017C66.9653 42.458 66.6384 42.3912 66.3207 42.3013C66.2821 42.2903 66.2421 42.2826 66.2036 42.271C65.876 42.1722 65.5613 42.0451 65.2562 41.9008C65.1995 41.8741 65.1427 41.8475 65.0869 41.8192C64.7895 41.6684 64.5037 41.4987 64.2329 41.3082C64.1894 41.2774 64.148 41.2441 64.1051 41.2125C63.5485 40.801 63.0565 40.309 62.645 39.7524C62.6134 39.7095 62.5801 39.668 62.5493 39.6245C62.3587 39.3538 62.1891 39.0679 62.0382 38.7706C62.01 38.7148 61.9833 38.658 61.9567 38.6013C61.8124 38.2962 61.6853 37.9814 61.5865 37.6539C61.5749 37.6154 61.5671 37.5754 61.5562 37.5367C61.4662 37.2191 61.3994 36.8922 61.3558 36.5579C61.3517 36.5274 61.3455 36.4974 61.3418 36.4667H67.3908V42.5157ZM59.0898 11.9226H55.9997H37.7216V2.60622H59.0898V11.9226ZM36.1153 12.7257V22.6093L33.4838 21.3231L31.2088 20.2078C30.9861 20.1001 30.7257 20.0991 30.5029 20.2078L28.8448 21.0188L25.5807 22.6119V12.7257V2.60622H36.1153V12.7257ZM2.60623 2.60623H23.9745V11.9226H5.69843H2.60623V2.60623ZM6.50155 44.6097V13.5288H23.9724V23.8982C23.9724 24.0378 24.0091 24.1719 24.0752 24.2899C24.1403 24.4077 24.2346 24.5091 24.352 24.5831C24.5873 24.7295 24.8822 24.7452 25.13 24.6228L29.2779 22.5947L30.8543 21.8255L32.5428 22.6507L36.565 24.6228C36.6769 24.6772 36.7982 24.7044 36.9185 24.7044C36.9314 24.7044 36.9441 24.6997 36.9569 24.699C36.966 24.6987 36.9739 24.696 36.9828 24.6955C37.1083 24.6853 37.2324 24.6519 37.343 24.5831C37.3443 24.5823 37.3449 24.5807 37.346 24.58C37.347 24.5793 37.3483 24.5796 37.3493 24.5789C37.5835 24.4325 37.7268 24.1753 37.7268 23.8981V13.5288H55.1966V34.8605H24.8686H17.1543C16.7109 34.8605 16.3512 35.2202 16.3512 35.6636V43.3695V44.6097H6.50155V44.6097ZM17.9574 53.0836C17.9876 53.0872 18.0169 53.0934 18.0468 53.0973C18.3811 53.1407 18.7077 53.2077 19.0254 53.2971C19.0658 53.3086 19.1077 53.3167 19.1479 53.3287C19.4735 53.427 19.7869 53.5531 20.0904 53.6963C20.1502 53.7245 20.21 53.7525 20.269 53.7823C20.5634 53.9318 20.8469 54.0999 21.1154 54.2884C21.1628 54.3216 21.2078 54.3578 21.2543 54.3922C21.5288 54.5953 21.7926 54.8125 22.0339 55.0531C22.0365 55.0556 22.0392 55.0581 22.0416 55.0606C22.2828 55.3017 22.5003 55.5655 22.7038 55.8397C22.7387 55.8867 22.7751 55.9322 22.8088 55.9799C22.9973 56.2478 23.1654 56.5307 23.3149 56.8246C23.345 56.8836 23.373 56.9438 23.4015 57.0036C23.5446 57.3066 23.6709 57.6192 23.7693 57.9443C23.7816 57.9848 23.7897 58.0269 23.8012 58.0678C23.8904 58.3837 23.957 58.7086 24.0004 59.041C24.0046 59.0721 24.0111 59.1024 24.0148 59.1338H17.9575V53.0836H17.9574ZM61.3418 59.1338C61.3455 59.1029 61.3517 59.0732 61.3558 59.0425C61.3993 58.7087 61.4662 58.3819 61.5559 58.0645C61.5672 58.0253 61.5749 57.9848 61.5866 57.9457C61.6853 57.619 61.8119 57.305 61.9558 57.0006C61.9831 56.9427 62.0103 56.8845 62.0393 56.8274C62.1895 56.5315 62.3585 56.2468 62.5482 55.9772C62.5801 55.9319 62.6147 55.8888 62.6477 55.8442C63.0578 55.2898 63.548 54.7998 64.1022 54.3895C64.1467 54.3566 64.1896 54.3221 64.2348 54.2902C64.5043 54.1007 64.789 53.9316 65.085 53.7812C65.1422 53.7523 65.2003 53.7252 65.2582 53.6978C65.5625 53.5539 65.8766 53.4273 66.2031 53.3284C66.2421 53.3167 66.2827 53.3091 66.3221 53.2979C66.6392 53.2082 66.9654 53.1414 67.2993 53.0979C67.33 53.0938 67.3599 53.0874 67.3908 53.0837V59.1338H61.3418Z" />
                </mask>
                <path
                  d="M68.1939 34.8605H60.488H56.8028V13.5288H59.8929C60.3363 13.5288 60.6961 13.1691 60.6961 12.7257V1.80311C60.6961 1.35973 60.3363 1 59.8929 1H36.9184H24.7776H1.80311C1.35973 1 1 1.35973 1 1.80311V12.7257C1 13.1691 1.35973 13.5288 1.80311 13.5288H4.89532V45.4129C4.89532 45.8562 5.25505 46.216 5.69843 46.216H16.3512V52.2299V59.9369C16.3512 60.3803 16.7109 60.74 17.1543 60.74H24.8686H60.488H68.1939C68.6373 60.74 68.997 60.3803 68.997 59.9369V52.2299V43.3695V35.6636C68.997 35.2202 68.6373 34.8605 68.1939 34.8605ZM67.1233 51.5018C66.933 51.5259 66.7435 51.5519 66.5573 51.5884C66.4549 51.6085 66.3549 51.6349 66.2537 51.6587C66.0955 51.6958 65.938 51.734 65.7832 51.7799C65.6766 51.8115 65.572 51.8474 65.4669 51.8833C65.3218 51.9325 65.1782 51.9842 65.0366 52.0409C64.932 52.083 64.8288 52.1272 64.7261 52.1732C64.5884 52.2351 64.4531 52.3008 64.3192 52.3695C64.2205 52.4204 64.1221 52.4712 64.0256 52.5259C63.8921 52.6013 63.7623 52.6822 63.6332 52.7645C63.5436 52.8218 63.453 52.8772 63.3655 52.9376C63.2293 53.032 63.0986 53.133 62.9684 53.2349C62.8952 53.2921 62.8197 53.3457 62.7486 53.4052C62.5653 53.5582 62.3888 53.7189 62.219 53.8866C62.1951 53.9104 62.1711 53.934 62.1473 53.958C61.9781 54.1292 61.8163 54.3072 61.6619 54.4921C61.6043 54.5611 61.5522 54.6343 61.4968 54.7051C61.3928 54.8382 61.2896 54.9715 61.1934 55.1107C61.1353 55.1949 61.0819 55.2824 61.0265 55.3686C60.9417 55.5013 60.8587 55.6348 60.7811 55.7723C60.7285 55.8656 60.6793 55.9608 60.6302 56.0562C60.5593 56.1938 60.4916 56.333 60.4281 56.475C60.384 56.5736 60.3416 56.6726 60.3012 56.7733C60.2423 56.9194 60.1889 57.0682 60.138 57.2183C60.1039 57.3192 60.0694 57.4196 60.039 57.522C59.9918 57.681 59.9523 57.8428 59.9144 58.0054C59.8916 58.1029 59.866 58.1991 59.8467 58.2977C59.8101 58.4852 59.7837 58.676 59.7596 58.8675C59.7497 58.9453 59.7349 59.0213 59.7272 59.0998C59.7262 59.1113 59.7235 59.1223 59.7225 59.1338H25.6341C25.633 59.122 25.6304 59.1108 25.6292 59.0991C25.6215 59.0208 25.6067 58.945 25.5969 58.8674C25.5728 58.6762 25.5465 58.4862 25.5099 58.2993C25.4903 58.1989 25.4643 58.1011 25.4411 58.0019C25.4032 57.8407 25.3643 57.6802 25.3175 57.5227C25.2866 57.4192 25.2518 57.3179 25.2173 57.2162C25.1666 57.067 25.1135 56.9194 25.055 56.7741C25.0145 56.6734 24.9718 56.574 24.9275 56.475C24.8637 56.3325 24.7959 56.1928 24.7245 56.0546C24.6756 55.96 24.627 55.8656 24.5747 55.7731C24.4963 55.6342 24.4124 55.4995 24.3266 55.3656C24.2723 55.2808 24.2197 55.1948 24.1625 55.1119C24.0639 54.9694 23.9581 54.8327 23.8514 54.6968C23.7984 54.6293 23.7489 54.5594 23.694 54.4936C23.5298 54.297 23.358 54.1066 23.1769 53.9254C23.1758 53.9244 23.175 53.9232 23.174 53.9221C22.9915 53.7398 22.7996 53.5672 22.6013 53.402C22.5366 53.348 22.4677 53.2994 22.4015 53.2474C22.2643 53.1398 22.1264 53.0335 21.9828 52.9344C21.9002 52.8773 21.8145 52.825 21.7298 52.7709C21.5955 52.685 21.4603 52.6009 21.321 52.5224C21.2287 52.4704 21.1346 52.4218 21.0399 52.3731C20.9016 52.3018 20.7615 52.2339 20.6188 52.17C20.5199 52.1258 20.4206 52.0835 20.3199 52.043C20.1741 51.9844 20.0262 51.9311 19.8767 51.8806C19.7749 51.8461 19.6736 51.8113 19.57 51.7806C19.4125 51.734 19.2523 51.695 19.0912 51.6574C18.9919 51.6341 18.8938 51.6082 18.7932 51.5885C18.6072 51.552 18.4179 51.5261 18.2277 51.5021C18.1488 51.492 18.0714 51.477 17.9918 51.4691C17.9801 51.4681 17.969 51.4655 17.9574 51.4644V44.135C17.9688 44.1339 17.9796 44.1313 17.9911 44.1303C18.0722 44.1224 18.1508 44.1071 18.2314 44.0968C18.4201 44.0729 18.6084 44.0471 18.7932 44.0111C18.894 43.9912 18.9921 43.9653 19.0917 43.9421C19.2524 43.9044 19.4123 43.8655 19.5692 43.819C19.6737 43.7881 19.7759 43.753 19.8786 43.7183C20.0269 43.6681 20.1734 43.6153 20.3179 43.5572C20.4203 43.5162 20.5212 43.473 20.6216 43.4281C20.7619 43.3653 20.8995 43.2985 21.0357 43.2286C21.1327 43.1787 21.2292 43.1289 21.3238 43.0754C21.46 42.9987 21.5921 42.9164 21.7236 42.8327C21.8111 42.7766 21.9 42.7225 21.9855 42.6634C22.1234 42.568 22.2558 42.4657 22.3876 42.3627C22.4596 42.3065 22.5343 42.2537 22.6043 42.1952C22.7889 42.0412 22.9669 41.8794 23.1379 41.7105C23.1619 41.6867 23.1857 41.6629 23.2095 41.6389C23.3776 41.4689 23.5387 41.2921 23.692 41.1085C23.7507 41.0383 23.8038 40.9637 23.8602 40.8917C23.963 40.7602 24.0652 40.6284 24.1603 40.4909C24.2199 40.4049 24.2746 40.3156 24.331 40.2273C24.4146 40.0967 24.4963 39.9654 24.5729 39.83C24.6265 39.7351 24.6765 39.6384 24.7266 39.5414C24.7966 39.4055 24.8633 39.2682 24.9261 39.1282C24.9713 39.0274 25.0147 38.9263 25.056 38.8235C25.1138 38.68 25.1662 38.5344 25.2163 38.3872C25.2513 38.2839 25.2866 38.1812 25.3177 38.0761C25.3642 37.9197 25.403 37.7605 25.4406 37.6005C25.464 37.5007 25.49 37.402 25.5098 37.3007C25.5464 37.1143 25.5726 36.9243 25.5968 36.7336C25.6066 36.6559 25.6215 36.5798 25.6292 36.5014C25.6304 36.4897 25.633 36.4785 25.634 36.4667H59.7225C59.7235 36.4782 59.7261 36.4892 59.7272 36.5007C59.7349 36.5791 59.7497 36.6552 59.7594 36.7328C59.7836 36.9245 59.81 37.1153 59.8468 37.3028C59.8661 37.4013 59.8916 37.4971 59.9142 37.5944C59.9522 37.7574 59.9917 37.9195 60.0391 38.0787C60.0694 38.1809 60.1036 38.281 60.1377 38.3814C60.1886 38.5321 60.2424 38.6812 60.3015 38.8279C60.3415 38.9278 60.3839 39.0261 60.4275 39.124C60.4916 39.2672 60.5598 39.4075 60.6313 39.5464C60.6798 39.6405 60.7282 39.7342 60.7802 39.8264C60.8588 39.9657 60.943 40.1011 61.0291 40.2355C61.0829 40.3199 61.1352 40.4054 61.1921 40.4876C61.2909 40.6305 61.3968 40.7679 61.5038 40.9044C61.5564 40.9713 61.6055 41.0407 61.6602 41.106C61.9904 41.5019 62.3556 41.8671 62.7514 42.1973C62.8168 42.2519 62.8862 42.301 62.9531 42.3536C63.0895 42.4607 63.2269 42.5665 63.3698 42.6653C63.452 42.7222 63.5375 42.7745 63.6219 42.8284C63.7563 42.9145 63.8917 42.9987 64.0311 43.0772C64.1232 43.1292 64.217 43.1776 64.3111 43.2261C64.4499 43.2976 64.5903 43.3658 64.7334 43.4299C64.8313 43.4736 64.9296 43.5159 65.0295 43.5559C65.1763 43.615 65.3253 43.6689 65.476 43.7197C65.5764 43.7538 65.6765 43.7881 65.7787 43.8184C65.938 43.8657 66.1 43.9052 66.263 43.9432C66.3603 43.9658 66.4561 43.9913 66.5547 44.0107C66.7421 44.0474 66.933 44.0738 67.1246 44.098C67.2022 44.1078 67.2783 44.1226 67.3567 44.1303C67.3682 44.1313 67.3792 44.1339 67.3907 44.135V51.4644C67.379 51.4655 67.3677 51.4681 67.3561 51.4693C67.2776 51.477 67.2012 51.4919 67.1233 51.5018ZM24.0004 36.5596C23.957 36.8918 23.8903 37.2167 23.8012 37.5326C23.7895 37.5733 23.7816 37.6157 23.7693 37.6562C23.6708 37.9812 23.5447 38.2934 23.4014 38.5963C23.3731 38.6564 23.345 38.7167 23.3148 38.7759C23.1654 39.0698 22.997 39.3524 22.8085 39.6203C22.7751 39.6679 22.7386 39.7134 22.7039 39.7602C22.5003 40.0344 22.2828 40.2982 22.0416 40.5394C22.0391 40.5419 22.0365 40.5444 22.0339 40.5468C21.7926 40.7874 21.5287 41.0046 21.2542 41.2077C21.2078 41.242 21.1628 41.2781 21.1155 41.3113C20.8467 41.5 20.5631 41.6681 20.2682 41.8177C20.2099 41.8472 20.1504 41.8749 20.0911 41.9029C19.7872 42.0461 19.4734 42.1725 19.1474 42.271C19.1077 42.2829 19.0664 42.2908 19.0265 42.3021C18.7085 42.3918 18.3812 42.4587 18.0465 42.5021C18.0166 42.506 17.9875 42.5123 17.9574 42.5158V36.4667H24.0147C24.0111 36.4981 24.0046 36.5284 24.0004 36.5596ZM67.3908 42.5157C67.3601 42.512 67.3301 42.5057 67.2995 42.5017C66.9653 42.458 66.6384 42.3912 66.3207 42.3013C66.2821 42.2903 66.2421 42.2826 66.2036 42.271C65.876 42.1722 65.5613 42.0451 65.2562 41.9008C65.1995 41.8741 65.1427 41.8475 65.0869 41.8192C64.7895 41.6684 64.5037 41.4987 64.2329 41.3082C64.1894 41.2774 64.148 41.2441 64.1051 41.2125C63.5485 40.801 63.0565 40.309 62.645 39.7524C62.6134 39.7095 62.5801 39.668 62.5493 39.6245C62.3587 39.3538 62.1891 39.0679 62.0382 38.7706C62.01 38.7148 61.9833 38.658 61.9567 38.6013C61.8124 38.2962 61.6853 37.9814 61.5865 37.6539C61.5749 37.6154 61.5671 37.5754 61.5562 37.5367C61.4662 37.2191 61.3994 36.8922 61.3558 36.5579C61.3517 36.5274 61.3455 36.4974 61.3418 36.4667H67.3908V42.5157ZM59.0898 11.9226H55.9997H37.7216V2.60622H59.0898V11.9226ZM36.1153 12.7257V22.6093L33.4838 21.3231L31.2088 20.2078C30.9861 20.1001 30.7257 20.0991 30.5029 20.2078L28.8448 21.0188L25.5807 22.6119V12.7257V2.60622H36.1153V12.7257ZM2.60623 2.60623H23.9745V11.9226H5.69843H2.60623V2.60623ZM6.50155 44.6097V13.5288H23.9724V23.8982C23.9724 24.0378 24.0091 24.1719 24.0752 24.2899C24.1403 24.4077 24.2346 24.5091 24.352 24.5831C24.5873 24.7295 24.8822 24.7452 25.13 24.6228L29.2779 22.5947L30.8543 21.8255L32.5428 22.6507L36.565 24.6228C36.6769 24.6772 36.7982 24.7044 36.9185 24.7044C36.9314 24.7044 36.9441 24.6997 36.9569 24.699C36.966 24.6987 36.9739 24.696 36.9828 24.6955C37.1083 24.6853 37.2324 24.6519 37.343 24.5831C37.3443 24.5823 37.3449 24.5807 37.346 24.58C37.347 24.5793 37.3483 24.5796 37.3493 24.5789C37.5835 24.4325 37.7268 24.1753 37.7268 23.8981V13.5288H55.1966V34.8605H24.8686H17.1543C16.7109 34.8605 16.3512 35.2202 16.3512 35.6636V43.3695V44.6097H6.50155V44.6097ZM17.9574 53.0836C17.9876 53.0872 18.0169 53.0934 18.0468 53.0973C18.3811 53.1407 18.7077 53.2077 19.0254 53.2971C19.0658 53.3086 19.1077 53.3167 19.1479 53.3287C19.4735 53.427 19.7869 53.5531 20.0904 53.6963C20.1502 53.7245 20.21 53.7525 20.269 53.7823C20.5634 53.9318 20.8469 54.0999 21.1154 54.2884C21.1628 54.3216 21.2078 54.3578 21.2543 54.3922C21.5288 54.5953 21.7926 54.8125 22.0339 55.0531C22.0365 55.0556 22.0392 55.0581 22.0416 55.0606C22.2828 55.3017 22.5003 55.5655 22.7038 55.8397C22.7387 55.8867 22.7751 55.9322 22.8088 55.9799C22.9973 56.2478 23.1654 56.5307 23.3149 56.8246C23.345 56.8836 23.373 56.9438 23.4015 57.0036C23.5446 57.3066 23.6709 57.6192 23.7693 57.9443C23.7816 57.9848 23.7897 58.0269 23.8012 58.0678C23.8904 58.3837 23.957 58.7086 24.0004 59.041C24.0046 59.0721 24.0111 59.1024 24.0148 59.1338H17.9575V53.0836H17.9574ZM61.3418 59.1338C61.3455 59.1029 61.3517 59.0732 61.3558 59.0425C61.3993 58.7087 61.4662 58.3819 61.5559 58.0645C61.5672 58.0253 61.5749 57.9848 61.5866 57.9457C61.6853 57.619 61.8119 57.305 61.9558 57.0006C61.9831 56.9427 62.0103 56.8845 62.0393 56.8274C62.1895 56.5315 62.3585 56.2468 62.5482 55.9772C62.5801 55.9319 62.6147 55.8888 62.6477 55.8442C63.0578 55.2898 63.548 54.7998 64.1022 54.3895C64.1467 54.3566 64.1896 54.3221 64.2348 54.2902C64.5043 54.1007 64.789 53.9316 65.085 53.7812C65.1422 53.7523 65.2003 53.7252 65.2582 53.6978C65.5625 53.5539 65.8766 53.4273 66.2031 53.3284C66.2421 53.3167 66.2827 53.3091 66.3221 53.2979C66.6392 53.2082 66.9654 53.1414 67.2993 53.0979C67.33 53.0938 67.3599 53.0874 67.3908 53.0837V59.1338H61.3418Z"
                  fill="black"
                />
                <path
                  d="M68.1939 34.8605H60.488H56.8028V13.5288H59.8929C60.3363 13.5288 60.6961 13.1691 60.6961 12.7257V1.80311C60.6961 1.35973 60.3363 1 59.8929 1H36.9184H24.7776H1.80311C1.35973 1 1 1.35973 1 1.80311V12.7257C1 13.1691 1.35973 13.5288 1.80311 13.5288H4.89532V45.4129C4.89532 45.8562 5.25505 46.216 5.69843 46.216H16.3512V52.2299V59.9369C16.3512 60.3803 16.7109 60.74 17.1543 60.74H24.8686H60.488H68.1939C68.6373 60.74 68.997 60.3803 68.997 59.9369V52.2299V43.3695V35.6636C68.997 35.2202 68.6373 34.8605 68.1939 34.8605ZM67.1233 51.5018C66.933 51.5259 66.7435 51.5519 66.5573 51.5884C66.4549 51.6085 66.3549 51.6349 66.2537 51.6587C66.0955 51.6958 65.938 51.734 65.7832 51.7799C65.6766 51.8115 65.572 51.8474 65.4669 51.8833C65.3218 51.9325 65.1782 51.9842 65.0366 52.0409C64.932 52.083 64.8288 52.1272 64.7261 52.1732C64.5884 52.2351 64.4531 52.3008 64.3192 52.3695C64.2205 52.4204 64.1221 52.4712 64.0256 52.5259C63.8921 52.6013 63.7623 52.6822 63.6332 52.7645C63.5436 52.8218 63.453 52.8772 63.3655 52.9376C63.2293 53.032 63.0986 53.133 62.9684 53.2349C62.8952 53.2921 62.8197 53.3457 62.7486 53.4052C62.5653 53.5582 62.3888 53.7189 62.219 53.8866C62.1951 53.9104 62.1711 53.934 62.1473 53.958C61.9781 54.1292 61.8163 54.3072 61.6619 54.4921C61.6043 54.5611 61.5522 54.6343 61.4968 54.7051C61.3928 54.8382 61.2896 54.9715 61.1934 55.1107C61.1353 55.1949 61.0819 55.2824 61.0265 55.3686C60.9417 55.5013 60.8587 55.6348 60.7811 55.7723C60.7285 55.8656 60.6793 55.9608 60.6302 56.0562C60.5593 56.1938 60.4916 56.333 60.4281 56.475C60.384 56.5736 60.3416 56.6726 60.3012 56.7733C60.2423 56.9194 60.1889 57.0682 60.138 57.2183C60.1039 57.3192 60.0694 57.4196 60.039 57.522C59.9918 57.681 59.9523 57.8428 59.9144 58.0054C59.8916 58.1029 59.866 58.1991 59.8467 58.2977C59.8101 58.4852 59.7837 58.676 59.7596 58.8675C59.7497 58.9453 59.7349 59.0213 59.7272 59.0998C59.7262 59.1113 59.7235 59.1223 59.7225 59.1338H25.6341C25.633 59.122 25.6304 59.1108 25.6292 59.0991C25.6215 59.0208 25.6067 58.945 25.5969 58.8674C25.5728 58.6762 25.5465 58.4862 25.5099 58.2993C25.4903 58.1989 25.4643 58.1011 25.4411 58.0019C25.4032 57.8407 25.3643 57.6802 25.3175 57.5227C25.2866 57.4192 25.2518 57.3179 25.2173 57.2162C25.1666 57.067 25.1135 56.9194 25.055 56.7741C25.0145 56.6734 24.9718 56.574 24.9275 56.475C24.8637 56.3325 24.7959 56.1928 24.7245 56.0546C24.6756 55.96 24.627 55.8656 24.5747 55.7731C24.4963 55.6342 24.4124 55.4995 24.3266 55.3656C24.2723 55.2808 24.2197 55.1948 24.1625 55.1119C24.0639 54.9694 23.9581 54.8327 23.8514 54.6968C23.7984 54.6293 23.7489 54.5594 23.694 54.4936C23.5298 54.297 23.358 54.1066 23.1769 53.9254C23.1758 53.9244 23.175 53.9232 23.174 53.9221C22.9915 53.7398 22.7996 53.5672 22.6013 53.402C22.5366 53.348 22.4677 53.2994 22.4015 53.2474C22.2643 53.1398 22.1264 53.0335 21.9828 52.9344C21.9002 52.8773 21.8145 52.825 21.7298 52.7709C21.5955 52.685 21.4603 52.6009 21.321 52.5224C21.2287 52.4704 21.1346 52.4218 21.0399 52.3731C20.9016 52.3018 20.7615 52.2339 20.6188 52.17C20.5199 52.1258 20.4206 52.0835 20.3199 52.043C20.1741 51.9844 20.0262 51.9311 19.8767 51.8806C19.7749 51.8461 19.6736 51.8113 19.57 51.7806C19.4125 51.734 19.2523 51.695 19.0912 51.6574C18.9919 51.6341 18.8938 51.6082 18.7932 51.5885C18.6072 51.552 18.4179 51.5261 18.2277 51.5021C18.1488 51.492 18.0714 51.477 17.9918 51.4691C17.9801 51.4681 17.969 51.4655 17.9574 51.4644V44.135C17.9688 44.1339 17.9796 44.1313 17.9911 44.1303C18.0722 44.1224 18.1508 44.1071 18.2314 44.0968C18.4201 44.0729 18.6084 44.0471 18.7932 44.0111C18.894 43.9912 18.9921 43.9653 19.0917 43.9421C19.2524 43.9044 19.4123 43.8655 19.5692 43.819C19.6737 43.7881 19.7759 43.753 19.8786 43.7183C20.0269 43.6681 20.1734 43.6153 20.3179 43.5572C20.4203 43.5162 20.5212 43.473 20.6216 43.4281C20.7619 43.3653 20.8995 43.2985 21.0357 43.2286C21.1327 43.1787 21.2292 43.1289 21.3238 43.0754C21.46 42.9987 21.5921 42.9164 21.7236 42.8327C21.8111 42.7766 21.9 42.7225 21.9855 42.6634C22.1234 42.568 22.2558 42.4657 22.3876 42.3627C22.4596 42.3065 22.5343 42.2537 22.6043 42.1952C22.7889 42.0412 22.9669 41.8794 23.1379 41.7105C23.1619 41.6867 23.1857 41.6629 23.2095 41.6389C23.3776 41.4689 23.5387 41.2921 23.692 41.1085C23.7507 41.0383 23.8038 40.9637 23.8602 40.8917C23.963 40.7602 24.0652 40.6284 24.1603 40.4909C24.2199 40.4049 24.2746 40.3156 24.331 40.2273C24.4146 40.0967 24.4963 39.9654 24.5729 39.83C24.6265 39.7351 24.6765 39.6384 24.7266 39.5414C24.7966 39.4055 24.8633 39.2682 24.9261 39.1282C24.9713 39.0274 25.0147 38.9263 25.056 38.8235C25.1138 38.68 25.1662 38.5344 25.2163 38.3872C25.2513 38.2839 25.2866 38.1812 25.3177 38.0761C25.3642 37.9197 25.403 37.7605 25.4406 37.6005C25.464 37.5007 25.49 37.402 25.5098 37.3007C25.5464 37.1143 25.5726 36.9243 25.5968 36.7336C25.6066 36.6559 25.6215 36.5798 25.6292 36.5014C25.6304 36.4897 25.633 36.4785 25.634 36.4667H59.7225C59.7235 36.4782 59.7261 36.4892 59.7272 36.5007C59.7349 36.5791 59.7497 36.6552 59.7594 36.7328C59.7836 36.9245 59.81 37.1153 59.8468 37.3028C59.8661 37.4013 59.8916 37.4971 59.9142 37.5944C59.9522 37.7574 59.9917 37.9195 60.0391 38.0787C60.0694 38.1809 60.1036 38.281 60.1377 38.3814C60.1886 38.5321 60.2424 38.6812 60.3015 38.8279C60.3415 38.9278 60.3839 39.0261 60.4275 39.124C60.4916 39.2672 60.5598 39.4075 60.6313 39.5464C60.6798 39.6405 60.7282 39.7342 60.7802 39.8264C60.8588 39.9657 60.943 40.1011 61.0291 40.2355C61.0829 40.3199 61.1352 40.4054 61.1921 40.4876C61.2909 40.6305 61.3968 40.7679 61.5038 40.9044C61.5564 40.9713 61.6055 41.0407 61.6602 41.106C61.9904 41.5019 62.3556 41.8671 62.7514 42.1973C62.8168 42.2519 62.8862 42.301 62.9531 42.3536C63.0895 42.4607 63.2269 42.5665 63.3698 42.6653C63.452 42.7222 63.5375 42.7745 63.6219 42.8284C63.7563 42.9145 63.8917 42.9987 64.0311 43.0772C64.1232 43.1292 64.217 43.1776 64.3111 43.2261C64.4499 43.2976 64.5903 43.3658 64.7334 43.4299C64.8313 43.4736 64.9296 43.5159 65.0295 43.5559C65.1763 43.615 65.3253 43.6689 65.476 43.7197C65.5764 43.7538 65.6765 43.7881 65.7787 43.8184C65.938 43.8657 66.1 43.9052 66.263 43.9432C66.3603 43.9658 66.4561 43.9913 66.5547 44.0107C66.7421 44.0474 66.933 44.0738 67.1246 44.098C67.2022 44.1078 67.2783 44.1226 67.3567 44.1303C67.3682 44.1313 67.3792 44.1339 67.3907 44.135V51.4644C67.379 51.4655 67.3677 51.4681 67.3561 51.4693C67.2776 51.477 67.2012 51.4919 67.1233 51.5018ZM24.0004 36.5596C23.957 36.8918 23.8903 37.2167 23.8012 37.5326C23.7895 37.5733 23.7816 37.6157 23.7693 37.6562C23.6708 37.9812 23.5447 38.2934 23.4014 38.5963C23.3731 38.6564 23.345 38.7167 23.3148 38.7759C23.1654 39.0698 22.997 39.3524 22.8085 39.6203C22.7751 39.6679 22.7386 39.7134 22.7039 39.7602C22.5003 40.0344 22.2828 40.2982 22.0416 40.5394C22.0391 40.5419 22.0365 40.5444 22.0339 40.5468C21.7926 40.7874 21.5287 41.0046 21.2542 41.2077C21.2078 41.242 21.1628 41.2781 21.1155 41.3113C20.8467 41.5 20.5631 41.6681 20.2682 41.8177C20.2099 41.8472 20.1504 41.8749 20.0911 41.9029C19.7872 42.0461 19.4734 42.1725 19.1474 42.271C19.1077 42.2829 19.0664 42.2908 19.0265 42.3021C18.7085 42.3918 18.3812 42.4587 18.0465 42.5021C18.0166 42.506 17.9875 42.5123 17.9574 42.5158V36.4667H24.0147C24.0111 36.4981 24.0046 36.5284 24.0004 36.5596ZM67.3908 42.5157C67.3601 42.512 67.3301 42.5057 67.2995 42.5017C66.9653 42.458 66.6384 42.3912 66.3207 42.3013C66.2821 42.2903 66.2421 42.2826 66.2036 42.271C65.876 42.1722 65.5613 42.0451 65.2562 41.9008C65.1995 41.8741 65.1427 41.8475 65.0869 41.8192C64.7895 41.6684 64.5037 41.4987 64.2329 41.3082C64.1894 41.2774 64.148 41.2441 64.1051 41.2125C63.5485 40.801 63.0565 40.309 62.645 39.7524C62.6134 39.7095 62.5801 39.668 62.5493 39.6245C62.3587 39.3538 62.1891 39.0679 62.0382 38.7706C62.01 38.7148 61.9833 38.658 61.9567 38.6013C61.8124 38.2962 61.6853 37.9814 61.5865 37.6539C61.5749 37.6154 61.5671 37.5754 61.5562 37.5367C61.4662 37.2191 61.3994 36.8922 61.3558 36.5579C61.3517 36.5274 61.3455 36.4974 61.3418 36.4667H67.3908V42.5157ZM59.0898 11.9226H55.9997H37.7216V2.60622H59.0898V11.9226ZM36.1153 12.7257V22.6093L33.4838 21.3231L31.2088 20.2078C30.9861 20.1001 30.7257 20.0991 30.5029 20.2078L28.8448 21.0188L25.5807 22.6119V12.7257V2.60622H36.1153V12.7257ZM2.60623 2.60623H23.9745V11.9226H5.69843H2.60623V2.60623ZM6.50155 44.6097V13.5288H23.9724V23.8982C23.9724 24.0378 24.0091 24.1719 24.0752 24.2899C24.1403 24.4077 24.2346 24.5091 24.352 24.5831C24.5873 24.7295 24.8822 24.7452 25.13 24.6228L29.2779 22.5947L30.8543 21.8255L32.5428 22.6507L36.565 24.6228C36.6769 24.6772 36.7982 24.7044 36.9185 24.7044C36.9314 24.7044 36.9441 24.6997 36.9569 24.699C36.966 24.6987 36.9739 24.696 36.9828 24.6955C37.1083 24.6853 37.2324 24.6519 37.343 24.5831C37.3443 24.5823 37.3449 24.5807 37.346 24.58C37.347 24.5793 37.3483 24.5796 37.3493 24.5789C37.5835 24.4325 37.7268 24.1753 37.7268 23.8981V13.5288H55.1966V34.8605H24.8686H17.1543C16.7109 34.8605 16.3512 35.2202 16.3512 35.6636V43.3695V44.6097H6.50155V44.6097ZM17.9574 53.0836C17.9876 53.0872 18.0169 53.0934 18.0468 53.0973C18.3811 53.1407 18.7077 53.2077 19.0254 53.2971C19.0658 53.3086 19.1077 53.3167 19.1479 53.3287C19.4735 53.427 19.7869 53.5531 20.0904 53.6963C20.1502 53.7245 20.21 53.7525 20.269 53.7823C20.5634 53.9318 20.8469 54.0999 21.1154 54.2884C21.1628 54.3216 21.2078 54.3578 21.2543 54.3922C21.5288 54.5953 21.7926 54.8125 22.0339 55.0531C22.0365 55.0556 22.0392 55.0581 22.0416 55.0606C22.2828 55.3017 22.5003 55.5655 22.7038 55.8397C22.7387 55.8867 22.7751 55.9322 22.8088 55.9799C22.9973 56.2478 23.1654 56.5307 23.3149 56.8246C23.345 56.8836 23.373 56.9438 23.4015 57.0036C23.5446 57.3066 23.6709 57.6192 23.7693 57.9443C23.7816 57.9848 23.7897 58.0269 23.8012 58.0678C23.8904 58.3837 23.957 58.7086 24.0004 59.041C24.0046 59.0721 24.0111 59.1024 24.0148 59.1338H17.9575V53.0836H17.9574ZM61.3418 59.1338C61.3455 59.1029 61.3517 59.0732 61.3558 59.0425C61.3993 58.7087 61.4662 58.3819 61.5559 58.0645C61.5672 58.0253 61.5749 57.9848 61.5866 57.9457C61.6853 57.619 61.8119 57.305 61.9558 57.0006C61.9831 56.9427 62.0103 56.8845 62.0393 56.8274C62.1895 56.5315 62.3585 56.2468 62.5482 55.9772C62.5801 55.9319 62.6147 55.8888 62.6477 55.8442C63.0578 55.2898 63.548 54.7998 64.1022 54.3895C64.1467 54.3566 64.1896 54.3221 64.2348 54.2902C64.5043 54.1007 64.789 53.9316 65.085 53.7812C65.1422 53.7523 65.2003 53.7252 65.2582 53.6978C65.5625 53.5539 65.8766 53.4273 66.2031 53.3284C66.2421 53.3167 66.2827 53.3091 66.3221 53.2979C66.6392 53.2082 66.9654 53.1414 67.2993 53.0979C67.33 53.0938 67.3599 53.0874 67.3908 53.0837V59.1338H61.3418Z"
                  stroke="black"
                  strokeWidth="0.5"
                  mask="url(#path-1-outside-1)"
                />
                <path
                  d="M42.6741 38.7349C37.6755 38.7349 33.6097 42.8017 33.6097 47.8002C33.6097 52.7988 37.6755 56.8645 42.6741 56.8645C47.6726 56.8645 51.7384 52.7988 51.7384 47.8002C51.7384 42.8017 47.6726 38.7349 42.6741 38.7349ZM42.6741 55.2583C38.5612 55.2583 35.216 51.913 35.216 47.8002C35.216 43.6874 38.5612 40.3411 42.6741 40.3411C46.7869 40.3411 50.1321 43.6874 50.1321 47.8002C50.1321 51.913 46.7869 55.2583 42.6741 55.2583Z"
                  fill="black"
                />
                <path
                  d="M42.6741 38.7349C37.6755 38.7349 33.6097 42.8017 33.6097 47.8002C33.6097 52.7988 37.6755 56.8645 42.6741 56.8645C47.6726 56.8645 51.7384 52.7988 51.7384 47.8002C51.7384 42.8017 47.6726 38.7349 42.6741 38.7349ZM42.6741 55.2583C38.5612 55.2583 35.216 51.913 35.216 47.8002C35.216 43.6874 38.5612 40.3411 42.6741 40.3411C46.7869 40.3411 50.1321 43.6874 50.1321 47.8002C50.1321 51.913 46.7869 55.2583 42.6741 55.2583Z"
                  stroke="black"
                />
                <path
                  d="M42.6699 44.5407C43.3496 44.5407 43.9017 45.0897 43.9017 45.7652C43.9017 46.2086 44.2615 46.5683 44.7048 46.5683C45.1482 46.5683 45.508 46.2086 45.508 45.7652C45.508 44.4839 44.6455 43.4118 43.473 43.0638V42.97C43.473 42.5266 43.1133 42.1669 42.6699 42.1669C42.2265 42.1669 41.8668 42.5266 41.8668 42.97V43.0646C40.6984 43.4131 39.8391 44.4847 39.8391 45.7652C39.8391 47.3306 41.1086 48.6033 42.6699 48.6033C43.3496 48.6033 43.9017 49.1523 43.9017 49.8268C43.9017 50.5065 43.3496 51.0597 42.6699 51.0597C41.9943 51.0597 41.4453 50.5065 41.4453 49.8268C41.4453 49.3834 41.0856 49.0237 40.6422 49.0237C40.1988 49.0237 39.8391 49.3834 39.8391 49.8268C39.8391 51.1107 40.6984 52.1857 41.8668 52.5355V52.6293C41.8668 53.0727 42.2265 53.4324 42.6699 53.4324C43.1133 53.4324 43.473 53.0727 43.473 52.6293V52.536C44.6455 52.187 45.508 51.1115 45.508 49.8268C45.508 48.2666 44.2353 46.9971 42.6699 46.9971C41.9943 46.9971 41.4453 46.4449 41.4453 45.7652C41.4453 45.0897 41.9943 44.5407 42.6699 44.5407Z"
                  fill="black"
                />
                <path
                  d="M42.6699 44.5407C43.3496 44.5407 43.9017 45.0897 43.9017 45.7652C43.9017 46.2086 44.2615 46.5683 44.7048 46.5683C45.1482 46.5683 45.508 46.2086 45.508 45.7652C45.508 44.4839 44.6455 43.4118 43.473 43.0638V42.97C43.473 42.5266 43.1133 42.1669 42.6699 42.1669C42.2265 42.1669 41.8668 42.5266 41.8668 42.97V43.0646C40.6984 43.4131 39.8391 44.4847 39.8391 45.7652C39.8391 47.3306 41.1086 48.6033 42.6699 48.6033C43.3496 48.6033 43.9017 49.1523 43.9017 49.8268C43.9017 50.5065 43.3496 51.0597 42.6699 51.0597C41.9943 51.0597 41.4453 50.5065 41.4453 49.8268C41.4453 49.3834 41.0856 49.0237 40.6422 49.0237C40.1988 49.0237 39.8391 49.3834 39.8391 49.8268C39.8391 51.1107 40.6984 52.1857 41.8668 52.5355V52.6293C41.8668 53.0727 42.2265 53.4324 42.6699 53.4324C43.1133 53.4324 43.473 53.0727 43.473 52.6293V52.536C44.6455 52.187 45.508 51.1115 45.508 49.8268C45.508 48.2666 44.2353 46.9971 42.6699 46.9971C41.9943 46.9971 41.4453 46.4449 41.4453 45.7652C41.4453 45.0897 41.9943 44.5407 42.6699 44.5407Z"
                  stroke="black"
                />
              </svg>
            </div>
            <span className="qa-next-line" style={{ color: "#191919" }}>
              Step 3
            </span>
            <span style={{ color: "#4e4848" }}>
              We manage sampling and production monitoring for you across all
              vendors. Once goods are ready you can opt for remote video
              inspection. Qalara sends you regular status updates till goods are
              delivered.
            </span>
          </div>
        </Col>
        <div className="quote-cta-home-page">
          <Button
            className="send-query-button"
            onClick={() => {
              setVisible(true);
            }}
          >
            <div className="send-query-button-text qa-rfq-button qa-rfq-home">
              Request for Quote
            </div>
          </Button>
        </div>
        <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
      </Row>*/}
      {/*<CategoryBanner />*/}
      <CategoryBannerCarousel />
      <PaymentBanner
        showRFQ={() => {
          setVisible(true);
        }}
      />
      <PressCrousel />
      <CraftCarousel items={craftItems} />
      <SellerCarousel items={sellerItems} />
      {/* <Button>
          <Link href="/categories">Seller Listing Page</Link>
        </Button>
        <Button>
          <Link href="/products">Product Listing Page</Link>
        </Button>
        <Button>
          <Link href="/sellers/products">SPLP</Link>
        </Button> */}
      {/* <AppFeedBanner/> */}
      {/* } */}
      <Modal
        visible={visible}
        footer={null}
        onCancel={sendQueryCancel}
        style={{ top: 5 }}
        bodyStyle={{ padding: "0" }}
        width={550}
        className="rfq-submit-modal"
      >
        <SendQueryForm
          sendQueryCancel={sendQueryCancel}
          token={token || process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN}
          initialValues={values}
        />
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
              We have received your request for quote and will revert within the
              next 48 to 72 hours.
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
      {/* <Modal
        visible={inviteAccess}
        footer={null}
        closable={false}
        onCancel={successQueryCancel}
        centered
        bodyStyle={{ padding: "0" }}
        width={600}
        className="invite-access-modal"
      >
        <div id="send-query-success-modal">
          <div
            onClick={successQueryCancel}
            style={{
              position: "absolute",
              right: "15px",
              top: "15px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <div className="send-query-success-modal-content">
            <p className="send-query-success-modal-para1">Invite only access</p>
            <p className="send-query-success-modal-para2">
              Welcome to the invite-only preview of Qalara.
            </p>
            <p
              className="send-query-success-modal-para2 qa-font-san qa-fs-14"
              style={{
                lineHeight: "20px",
                letterSpacing: "0.14px",
                color: "rgba(51, 47, 47, 0.8)",
              }}
            >
              We have a growing portfolio of sellers across Home & Lifestyle
              categories. Only Invitees have access to the complete range of
              Seller’s product catalogs and the new video demo feature.
            </p>
            <p
              className="send-query-success-modal-para2"
              style={{ marginBottom: "2px", fontSize: "12px" }}
            >
              <span
                className="qa-font-san qa-fw-b qa-fs-14"
                style={{ letterSpacing: "0.12px" }}
              >
                If you already have an Invite Code,
              </span>
            </p>
            <p
              className="send-query-success-modal-para2"
              style={{ marginBottom: "0px", fontSize: "12px" }}
            >
              Please click the button below and enter your Invite-only Username
              and Code for unrestricted access to Qalara.
            </p>
          </div>
          <Button className="send-query-success-modal-button" onClick={signIn}>
            SIGN IN TO UNLOCK ACCESS
          </Button>
          <p
            className="send-query-success-modal-para2"
            style={{ padding: "12px 35px 0px 35px", marginBottom: "0px" }}
          >
            <span
              className="qa-font-san qa-fw-b qa-fs-14"
              style={{ letterSpacing: "0.12px" }}
            >
              If you are a buyer and don’t have the Invite Code,
            </span>
          </p>
          <p
            className="send-query-success-modal-para2"
            style={{
              padding: "0px 40px 0px 40px",
              fontSize: "12px",
              paddingBottom: "5px",
            }}
          >
            <span
              className="qa-font-san qa-fs-12"
              style={{ letterSpacing: "0.12px" }}
            >
              please share your details below and we’ll get back to you within a
              few hours.
            </span>
          </p>
          <Form
            name="invite-form"
            form={form}
            onFinish={handleInvite}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "please enter a correct email address.",
                },
                {
                  required: true,
                  message: "Field is required.",
                },
                {
                  min: 1,
                  max: 70,
                  message: "Length should be 1-70 characters!",
                },
              ]}
            >
              <Input
                className={
                  mediaMatch.matches
                    ? "send-query-input"
                    : "send-query-input send-query-input-width"
                }
                placeholder="Email address"
              />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: "Field is required.",
                },
              ]}
            >
              <Input
                className={
                  mediaMatch.matches
                    ? "send-query-input"
                    : "send-query-input send-query-input-width"
                }
                placeholder="Your name"
              />
            </Form.Item>
            <Form.Item
              name="orgName"
              rules={[
                {
                  required: true,
                  message: "Field is required.",
                },
              ]}
            >
              <Input
                className={
                  mediaMatch.matches
                    ? "send-query-input"
                    : "send-query-input send-query-input-width"
                }
                placeholder="Company name"
              />
            </Form.Item>

            <Form.Item>
              {submitted ? (
                <Button
                  className={
                    mediaMatch.matches
                      ? "query-submit-button"
                      : "query-submit-button query-submit-button-width"
                  }
                  style={{ border: "1px solid #874439" }}
                >
                  <span
                    className="qa-font-san qa-fw-b qa-fs-12"
                    style={{ color: "#191919", letterSpacing: "0.72px" }}
                  >
                    THANK YOU
                  </span>
                </Button>
              ) : (
                <Button
                  className={
                    mediaMatch.matches
                      ? "query-button"
                      : "query-button query-button-width"
                  }
                  htmlType="submit"
                  loading={loading}
                >
                  <span
                    className="qa-font-san qa-fw-b qa-fs-12"
                    style={{ color: "#f9f7f2", letterSpacing: "0.72px" }}
                  >
                    SEND ME AN INVITE CODE
                  </span>
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </Modal>
     */}
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile.userProfile,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
  };
};

export default connect(mapStateToProps, null)(Home);
