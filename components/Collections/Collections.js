/** @format */

import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import Slider from "react-slick";
import CollectionDetails from "./CollectionDetails";
import Icon from "@ant-design/icons";
import addToCollectionIcon from "../../public/filestore/addToCollection";
import { connect } from "react-redux";
import { getCollections } from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";

function Collections(props) {
  const {keycloak} = useKeycloak();
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState([]);
  const mediaMatch = window.matchMedia("(min-width: 768px)");
  const [showCollectionDetails, setCollectionDetails] = useState(true);
  const [buyerId, setBuyerId] = useState("");
  const [collectionName, setCollectionName] = useState("");

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
    let { userProfile = {} } = props;
    let { profileType = "", profileId = "" } = userProfile || {};

    if (profileType && profileId) {
      if (profileType === "BUYER") {
        profileId = profileId.replace("BUYER::", "");
        setBuyerId(profileId);
        props.getCollections(token, profileId);
      }
    }
  }, [props.userProfile]);

  useEffect(() => {
    let { userCollections = "" } = props;
    if (userCollections && userCollections.length) {
      setCollections(userCollections);
    }
  }, [props.userCollections]);

  let { currencyDetails = {}, userProfile = {} } = props;

  return (
    <Row className="collections">
      <Col xs={24} sm={24} md={22} lg={22}>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12}>
            <div className="form-top">
              <p
                className="form-heading qa-fs-22 qa-font-san qa-fw-b"
                style={{ color: "#191919", letterSpacing: "0.2px" }}
              >
                MY COLLECTIONS
              </p>
            </div>
          </Col>
        </Row>
      </Col>

      {showCollectionDetails ? (
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
                  <span
                    className={
                      mediaMatch.matches
                        ? "qa-font-butler qa-fs-30 qa-tc-white"
                        : "qa-font-butler qa-fs-24 qa-tc-white"
                    }
                  >
                    No collections to display!
                  </span>
                </Col>
                <Col xs={24} sm={24} md={17} lg={17}>
                  <span
                    className={
                      mediaMatch.matches
                        ? "qa-font-san qa-fs-17 qa-tc-white"
                        : "qa-font-san qa-fs-14 qa-tc-white"
                    }
                  >
                    You currently do not have any collections to display. You
                    can get started by saving a product to your collection.
                  </span>
                </Col>
                <Col xs={7} sm={7} md={7} lg={7}></Col>
              </Row>
            </Col>
          ) : (
            <Col xs={24} sm={24} md={24} lg={24}>
              {collections.map((collection, i) => {
                let { products = [], name = "", createdTime = "" } = collection;
                return (
                  <Row className="qa-mar-btm-2" key={i}>
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
                              Created {createdTime}
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
                      style={{ padding: "20px", backgroundColor: "#F2F0EB" }}
                    >
                      <Col xs={24} sm={24} md={24} lg={24}>
                        <Slider ref={(c) => (slider = c)} {...settings}>
                          {products.map((product, k) => {
                            let { imageUrl = "", productName = "" } = product;

                            return (
                              <Col xs={22} sm={22} md={22} lg={22} key={k}>
                                <div className="aspect-ratio-box">
                                  <img
                                    className="images"
                                    src={
                                      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                                      imageUrl
                                    }
                                    alt="Collection placeholder"
                                  ></img>
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
                            setCollectionDetails(false);
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
        />
      )}
    </Row>
  );
}

const mapStateToProps = (state) => {
  return {
    userCollections: state.userProfile.collections,
    userProfile: state.userProfile.userProfile,
    currencyDetails: state.currencyConverter,
  };
};

export default connect(mapStateToProps, { getCollections })(Collections);
