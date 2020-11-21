/** @format */

import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "antd";
import Slider from "react-slick";
import CollectionDetails from "./CollectionDetails";
import Link from "next/link";
import { connect } from "react-redux";
import { getCollections } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

function Collections(props) {
  const { keycloak } = useKeycloak();
  const [showLoader, setShowLoader] = useState(true);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const router = useRouter();
  const [buyerId, setBuyerId] = useState("");
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

  let { token = "" } = keycloak || {};
  let slider;
  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4.5,
    slidesToScroll: 1.5,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1.5,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3.2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    // window.scrollTo(0, 0);
  }, [props.showCollectionDetails]);

  useEffect(() => {
    let { userProfile = {} } = props;
    let { profileType = "", profileId = "" } = userProfile || {};

    if (profileType && profileId) {
      if (profileType === "BUYER") {
        profileId = profileId.replace("BUYER::", "");
        setBuyerId(profileId);
        setShowLoader(true);
        props.getCollections(token, profileId, (results) => {
          setShowLoader(false);
          if (results && results.length) {
            setCollections(results);
          }
        });
      }
    }
  }, [props.userProfile]);

  const refreshCollection = (collections) => {
    setCollections(collections);
  };

  let {
    currencyDetails = {},
    userProfile = {},
    collectionName = "",
    setCollectionName = "",
    showCollectionDetails = "",
    setCollectionDetails = "",
    isGuest = false,
  } = props;
  let { profileType = "", verificationStatus = "" } = userProfile || {};
  let rejectedUser = false;

  let displayMessage =
    "You currently do not have any saved collection to display. Browse through our curated range of beautiful products and add them to your collection.";
  if (
    profileType === "BUYER" &&
    verificationStatus === "VERIFIED" &&
    isGuest === "true"
  ) {
    displayMessage =
      "You currently do not have any saved collection to display. To save and access your collection from anywhere, please sign up as a buyer.";
  } else if (
    (profileType === "BUYER" && verificationStatus === "ON_HOLD") ||
    (profileType === "BUYER" && verificationStatus === "REJECTED")
  ) {
    displayMessage =
      "You currently do not have any saved collection to display. You can save and access your collection from anywhere, once your buyer account is verified.";
    rejectedUser = true;
  }

  if (showLoader) {
    return (
      <div className="qa-loader-middle">
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      </div>
    );
  }

  return (
    <Row className="collections">
      <Col xs={24} sm={24} md={22} lg={22}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div className="form-top">
              <p
                className="form-heading qa-fs-22 qa-font-san qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                MY COLLECTIONS {collectionName ? "/ " + collectionName : ""}
              </p>
            </div>
          </Col>
        </Row>
      </Col>

      {!showCollectionDetails ? (
        <Col xs={24} sm={24} md={22} lg={22}>
          {collections.length === 0 ? (
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
                <Col xs={24} sm={24} md={24} lg={24} className="qa-mar-btm-05">
                  <div
                    className={
                      mediaMatch.matches
                        ? "qa-font-butler qa-fs-30 qa-tc-white qa-lh"
                        : "qa-font-butler qa-fs-24 qa-tc-white qa-lh"
                    }
                  >
                    No saved collections to display!
                  </div>
                </Col>
                <Col xs={24} sm={24} md={17} lg={17}>
                  <span
                    className={
                      mediaMatch.matches
                        ? "qa-font-san qa-fs-17 qa-tc-white"
                        : "qa-font-san qa-fs-14 qa-tc-white"
                    }
                  >
                    {displayMessage}
                  </span>
                </Col>
                <Col xs={4} sm={4} md={7} lg={7}></Col>
                {!rejectedUser && (
                  <Col
                    xs={16}
                    sm={16}
                    md={10}
                    lg={10}
                    style={{ marginTop: "40px", marginBottom: "40px" }}
                    className="quote-rfq"
                  >
                    {isGuest === "true" ? (
                      <Button
                        className="qa-button quote-contact-seller"
                        onClick={() => {
                          router.push("/signup");
                        }}
                      >
                        <span className="qa-font-san qa-fw-b qa-fs-14">
                          SIGN UP AS A BUYER
                        </span>
                      </Button>
                    ) : (
                      <Button
                        className="qa-button collection-btn-shop"
                        onClick={() => {
                          router.push("/");
                        }}
                      >
                        <span className="qa-font-san qa-fw-b qa-fs-12">
                          START SHOPPING
                        </span>
                      </Button>
                    )}
                  </Col>
                )}
                <Col xs={4} sm={4} md={7} lg={7}></Col>
              </Row>
            </Col>
          ) : (
            <Col xs={24} sm={24} md={24} lg={24}>
              {collections.map((collection, i) => {
                let { products = [], name = "", createdTime = "" } = collection;
                let date = new Date(createdTime);
                let month = monthNames[date.getMonth()];
                let year = date.getFullYear();
                return (
                  <Row
                    className="qa-mar-btm-2"
                    key={i}
                    style={{
                      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Col xs={24} sm={24} md={24} lg={24}>
                      <Row style={{ backgroundColor: "#E6E4DF" }}>
                        <React.Fragment>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            className="qa-pad-015"
                          >
                            <div className="collection-name qa-mar-left-20">
                              {name}
                            </div>
                            <div className="collection-stitle qa-mar-left-20">
                              Created {month} {year}
                            </div>
                          </Col>
                        </React.Fragment>
                      </Row>
                    </Col>

                    <Col
                      xs={24}
                      sm={24}
                      md={24}
                      lg={24}
                      style={{
                        padding: "20px",
                        backgroundColor: "#F2F0EB",
                      }}
                    >
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Slider ref={(c) => (slider = c)} {...settings}>
                          {products.map((product, k) => {
                            let {
                              imageUrl = "",
                              productName = "",
                              articleId = "",
                            } = product;

                            return (
                              <Col xs={22} sm={22} md={22} lg={22} key={k}>
                                <div className="aspect-ratio-box">
                                  <Link
                                    href={`/product/${articleId}`}
                                    className="qa-cursor"
                                  >
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
                                <div className="qa-text-2line collection-stitle qa-fw-b qa-mar-top-05">
                                  {productName || "Product name placeholder"}
                                </div>
                              </Col>
                            );
                          })}
                        </Slider>
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <span
                          className="qa-font-san qa-fs-14 qa-fw-b qa-cursor qa-mar-top-2"
                          style={{
                            color: "#874439",
                            lineHeight: "17px",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                          onClick={() => {
                            setCollectionDetails(true);
                            setSelectedCollection(collection);
                            setCollectionName(name);
                          }}
                        >
                          View all
                        </span>
                      </Col>
                    </Col>
                  </Row>
                );
              })}
            </Col>
          )}
        </Col>
      ) : (
        <CollectionDetails
          collections={selectedCollection}
          setCollectionDetails={setCollectionDetails}
          currencyDetails={currencyDetails}
          collectionName={collectionName}
          token={token}
          userProfile={userProfile}
          buyerId={buyerId}
          setCollectionName={setCollectionName}
          refreshCollection={refreshCollection}
        />
      )}
    </Row>
  );
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile.userProfile,
    currencyDetails: state.currencyConverter,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
  };
};

export default connect(mapStateToProps, { getCollections })(Collections);
