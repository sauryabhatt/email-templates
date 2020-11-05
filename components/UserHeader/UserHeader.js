/** @format */

import React, { useState, useEffect } from "react";
import { useSelector, connect } from "react-redux";
import { useKeycloak } from "@react-keycloak/ssr";
import Link from "next/link";
import { useRouter } from "next/router";
import responseJSONProd from "../../public/data/appHeader.json";
import responseJSONDev from "../../public/data/appHeaderDev.json";
import {
  Layout,
  Button,
  Menu,
  Modal,
  Row,
  Col,
  Popover,
  Drawer,
  Avatar,
  Dropdown,
  Badge,
  Select,
  Form,
  Input,
} from "antd";
import Icon from "@ant-design/icons";
import LogoWithText from "../../public/filestore/logo_with_text";
import { logoutFromApp } from "../AuthWithKeycloak";
import userProfileIcon from "../../public/filestore/userProfileIcon";
import homeIcon from "../../public/filestore/homeIcon";
import menuIcon from "../../public/filestore/menuIcon";
import certifiedIcon from "../../public/filestore/certifiedIcon";
import closeButton from "../../public/filestore/closeButton";
import searchIcon from "../../public/filestore/searchIcon";

import SendQueryForm from "../SendQueryForm/SendQueryForm";
// import ndjsonStream from "can-ndjson-stream";
import _ from "lodash";
import CurrencyConverter from "../common/CurrencyConverter";
import cartIcon from "../../public/filestore/headerCart";

const { Header } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

function UserHeader(props) {
  let { priceDetails = {}, nav } = props;

  const router = useRouter();
  let { convertToCurrency = "" } = priceDetails || {};
  const [visible, setVisible] = useState(false);
  const [shopVisible, setShopVisible] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const appToken = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );
  const { keycloak } = useKeycloak();
  const [navigationItems, setNavigationItems] = useState(nav);
  const [columns, setColumns] = useState();
  const [shopColor, setShopColor] = useState(false);

  const token = keycloak.token || appToken;
  const [inviteAccess, setInviteAccess] = useState(false);

  const [searchForm] = Form.useForm();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchVisibleMob, setSearchVisibleMob] = useState(false);
  const [selectedType, setSelectedType] = useState("product");
  const [close, setClose] = useState(false);

  const { userProfile } = props.userProfile;
  const [imageUrl, setImageUrl] = useState(
    props.userProfile.userProfile &&
      props.userProfile.userProfile.profileImage &&
      props.userProfile.userProfile.profileImage.media &&
      props.userProfile.userProfile.profileImage.media.mediaUrl &&
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
        props.userProfile.userProfile.profileImage.media.mediaUrl
  );

  async function fetchNdjson(response) {
    // let navigationDetails = [];
    // // const response = await fetch(
    // //   process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/shop-options"
    // // );
    // const exampleReader = ndjsonStream(response).getReader();

    // let result;
    // while (!result || !result.done) {
    //   result = await exampleReader.read();
    //   if (!result.done) navigationDetails.push(result.value);
    //   // console.log(result.done, result.value); //result.value is one line of your NDJSON data
    // }
    let responseJSON;
    if (process.env.NODE_ENV === "production") {
      responseJSON = responseJSONProd;
    } else {
      responseJSON = responseJSONDev;
    }
    let navigationItems = _.mapValues(
      _.groupBy(responseJSON, "column"),
      (clist) => clist.map((navigationDetails) => navigationDetails)
    );
    setNavigationItems(navigationItems);
    let columnLength = Object.keys(navigationItems).length;
    setColumns(columnLength);
  }

  const handleVisibleChange = (flag) => {
    setSearchVisible(false);
    setClose(false);
    setShopVisible(flag);
    if (flag) {
      setShopColor(true);
    } else {
      setShopColor(false);
    }
  };

  const onSearch = () => {
    let formValues = searchForm.getFieldValue();
    let { searchBy = "", search = "" } = formValues;
    let searchLink =
      "/search" +
      "?searchBy=" +
      encodeURIComponent(searchBy) +
      "&search=" +
      encodeURIComponent(search);
    router.push(searchLink);
    handleSearchChangeMob(false);
    handleSearchChange(false);
  };

  const searchMenu = (
    <Menu theme="dark" style={{ marginTop: "10px", cursor: "default" }}>
      <Menu.Item key="1" className="search-dropdown">
        <Form name="search-form" form={searchForm} onFinish={onSearch}>
          <Input.Group compact>
            <Form.Item
              name="searchBy"
              style={{ width: "20%" }}
              className="search-list"
            >
              <Select
                defaultValue="product"
                dropdownClassName="qa-dark-menu-theme"
                onChange={(value) => setSelectedType(value)}
              >
                <Option value="product">Search by product</Option>
                <Option value="seller">Search by seller</Option>
              </Select>
            </Form.Item>
            <Form.Item name="search" style={{ width: "80%" }}>
              <Input.Search
                placeholder="what are you looking for"
                onPressEnter={onSearch}
                onSearch={onSearch}
              />
            </Form.Item>
          </Input.Group>
        </Form>
      </Menu.Item>
    </Menu>
  );

  const searchMenuMob = (
    <Menu theme="dark">
      <Menu.Item key="1" className="search-dropdown">
        <Form name="search-form" form={searchForm} onFinish={onSearch}>
          <Form.Item
            name="searchBy"
            style={{ width: "60%", marginBottom: "10px" }}
            className="search-list"
          >
            <Select
              defaultValue="product"
              dropdownClassName="qa-dark-menu-theme"
              onChange={(value) => setSelectedType(value)}
            >
              <Option value="product">Search by product</Option>
              <Option value="seller">Search by seller</Option>
            </Select>
          </Form.Item>
          <div
            onClick={() => {
              handleSearchChangeMob(false);
            }}
            style={{
              position: "absolute",
              right: "20px",
              top: "20px",
              cursor: "pointer",
              zIndex: "1",
            }}
          >
            <Icon
              component={closeButton}
              style={{ width: "30px", height: "30px" }}
            />
          </div>
          <Form.Item name="search" style={{ width: "100%" }}>
            <Input.Search
              placeholder="what are you looking for"
              onPressEnter={onSearch}
              onSearch={onSearch}
            />
          </Form.Item>
        </Form>
      </Menu.Item>
    </Menu>
  );

  const navMenu = (
    <Menu
      theme="dark"
      style={{ cursor: "default" }}
      onClick={(e) => {
        handleVisibleChange(true);
      }}
    >
      <Menu.Divider style={{ height: "0.5px", color: "#ddd" }} />
      <Menu.Item key="1" style={{ padding: "40px 0px", cursor: "default" }}>
        <Row justify="space-around">
          {_.map(navigationItems, function (value, key) {
            return (
              <Col
                key={key}
                className={
                  key < columns
                    ? `navigation-border nav-key-${key}`
                    : "qa-pad-lft-40"
                }
              >
                {_.map(value, function (details, id) {
                  let link = "";
                  if (details.filterType) {
                    link =
                      "/sellers/all-categories" +
                      "?" +
                      details.filterType.toLowerCase() +
                      "=" +
                      encodeURIComponent(details.values);
                  } else if (details.action === "L2" && details.values) {
                    link = "/sellers/" + encodeURIComponent(details.values);
                  }
                  // console.log("details", details);
                  return (
                    <div
                      className={
                        details.font === "H1"
                          ? "navigation-item navigation-title"
                          : "navigation-item"
                      }
                      key={key + id}
                    >
                      {details.action === "URL" ? (
                        <Link href={details.values}>
                          {details.displayTitle}
                        </Link>
                      ) : link ? (
                        <Link href={link}>{details.displayTitle}</Link>
                      ) : (
                        <span>{details.displayTitle}</span>
                      )}
                    </div>
                  );
                })}
              </Col>
            );
          })}
        </Row>
      </Menu.Item>
    </Menu>
  );

  const handleSearchChange = (flag) => {
    setSearchVisible(flag);
    setShopVisible(false);
    if (flag) {
      setClose(true);
    } else {
      setClose(false);
    }
  };

  const handleSearchChangeMob = (flag) => {
    // console.log(searchVisibleMob, flag);
    setSearchVisibleMob(flag);
  };

  useEffect(() => {
    // props.getNavigation(token);
    searchForm.setFieldsValue({ searchBy: "product" });
    fetchNdjson();
  }, []);

  useEffect(() => {
    setImageUrl(
      props.userProfile.userProfile &&
        props.userProfile.userProfile.profileImage &&
        props.userProfile.userProfile.profileImage.media &&
        props.userProfile.userProfile.profileImage.media.mediaUrl &&
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
          props.userProfile.userProfile.profileImage.media.mediaUrl
    );
  }, [props.userProfile.userProfile]);

  let firstName = "";
  let orgName = "";
  let verificationStatus = "";
  let profileType = "";

  let requesterName = "";
  if (
    userProfile &&
    userProfile.firstName &&
    userProfile &&
    userProfile.lastName
  ) {
    requesterName = userProfile.firstName + " " + userProfile.lastName;
    firstName = userProfile.firstName;
    orgName = userProfile.orgName;
    verificationStatus = userProfile.verificationStatus;
    profileType = userProfile.profileType;
  }

  let values = {
    profileId: userProfile && userProfile.profileId,
    profileType: userProfile && userProfile.profileType,
    category: "",
    requirementDetails: "",
    upload: {},
    quantity: "",
    pricePerItem: "",
    deliveryDate: "",
    requesterName: requesterName,
    companyName: userProfile && userProfile.orgName,
    emailId: userProfile && userProfile.email,
    country: userProfile && userProfile.country,
    city: "",
    mobileNo: userProfile && userProfile.orgPhone,
  };

  const showDrawer = () => {
    let state = !drawer;
    setDrawer(state);
  };

  const onClose = () => {
    setDrawer(false);
  };

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
  };

  const handleMyAccount = () => {
    router.push("/account/profile");
  };

  const handleVideoRequest = () => {
    router.push("/account/video");
  };
  // console.log(profileType)

  const handleQuotesRequest = () => {
    router.push("/account/quote");
  };

  const handleMyOrders = () => {
    router.push("/account/orders");
  };

  const handleAddress = () => {
    router.push("/account/addresses");
  };

  const handleLogout = () => {
    logoutFromApp(keycloak, undefined);
  };

  const userMenu = (
    <Menu style={{ width: "100%", border: "none" }}>
      {props.isGuest == "false" || props.isGuest == undefined ? (
        <Menu.Item key="1" style={{ height: "auto" }}>
          <div className="header-text">
            {(verificationStatus === "VERIFIED" ||
              verificationStatus === "REGISTERED") && (
              <span
                style={{
                  color: "#d9bb7f",
                  verticalAlign: "middle",
                }}
              >
                <Icon component={certifiedIcon} className="certified-icon" />
              </span>
            )}
            {orgName},
          </div>
          <div className="header-text">{firstName}</div>
        </Menu.Item>
      ) : (
        ""
      )}

      <Menu.Item key="2" onClick={handleMyAccount}>
        <span style={{ fontFamily: "senregular", fontSize: "14px" }}>
          <span className="qa-font-san qa-fs-14">Profile</span>
        </span>
      </Menu.Item>
      <Menu.Item key="3" onClick={handleVideoRequest}>
        <span className="qa-font-san qa-fs-14">Video Meeting</span>
        <Badge
          count={props.meetingCount}
          style={{
            backgroundColor: "#D9BB7F",
            marginLeft: "25px",
            marginTop: "-10px",
          }}
        ></Badge>
      </Menu.Item>
      <Menu.Item
        key="quotes"
        onClick={handleQuotesRequest}
        style={
          props.profileType === "SELLER" || props.isGuest == "true"
            ? { display: "none" }
            : {}
        }
      >
        <span className="qa-font-san qa-fs-14">Quotations</span>
      </Menu.Item>
      <Menu.Item
        key="orders"
        onClick={handleMyOrders}
        style={
          props.profileType === "SELLER" || props.isGuest == "true"
            ? { display: "none" }
            : {}
        }
      >
        <span className="qa-font-san qa-fs-14">My Orders</span>
      </Menu.Item>
      <Menu.Item
        key="6"
        onClick={handleAddress}
        style={
          props.profileType === "SELLER" || props.isGuest == "true"
            ? { display: "none" }
            : {}
        }
      >
        <span className="qa-fs-14 qa-font-san">Addresses</span>
      </Menu.Item>
      <Menu.Divider
        style={{
          height: "0.5px",
          background: "rgb(217, 187, 127)",
          opacity: "0.2",
          margin: "15px 0",
        }}
      />
      {verificationStatus === "CREATED" && profileType === "SELLER" && (
        <Menu.Item key="4" style={{ height: "auto" }}>
          <Button
            className="qa-button apply-to-sell-header"
            style={{ verticalAlign: "middle" }}
            onClick={() => {
              router.push("/applytosell");
            }}
          >
            <div className="">Apply to sell</div>
          </Button>
        </Menu.Item>
      )}
      {verificationStatus === "CREATED" && profileType === "SELLER" && (
        <Menu.Divider style={{ height: "1px" }} />
      )}
      <Menu.Item key="5" onClick={handleLogout}>
        <span style={{ fontFamily: "senregular", fontSize: "14px" }}>
          Sign out
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Row style={{ zIndex: 1, width: "100%" }}>
      <Col xs={0} sm={0} md={0} lg={24} xl={24}>
        <Header className="app-header">
          <Col
            xs={0}
            sm={0}
            md={10}
            lg={10}
            xl={10}
            style={{ textAlign: "left", margin: "auto" }}
          >
            <div>
              <span>
                <Link href="/" className="app-header-home-button">
                  <Icon
                    component={homeIcon}
                    className="search-icon qa-cursor"
                    style={{
                      verticalAlign: "middle",
                      width: "32px",
                      marginTop: "-5px",
                    }}
                  />
                </Link>
              </span>

              <Dropdown
                overlayClassName="shop-navigation"
                overlay={navMenu}
                trigger={["hover"]}
                onVisibleChange={handleVisibleChange}
                visible={shopVisible}
                overlayStyle={{ width: "100%", cursor: "pointer" }}
              >
                <div
                  className={
                    shopColor
                      ? "shop my-account-header qa-cursor qa-hover"
                      : "shop my-account-header qa-cursor"
                  }
                  style={{
                    verticalAlign: "middle",
                    marginLeft: "20px",
                    marginRight: "20px",
                  }}
                >
                  SHOP
                </div>
              </Dropdown>
              <Button
                className="send-query-button"
                onClick={() => {
                  setVisible(true);
                }}
              >
                <div className="send-query-button-text qa-rfq-button">
                  Request for Quote
                </div>
              </Button>
            </div>
          </Col>

          <Col
            xs={0}
            sm={0}
            md={3}
            lg={3}
            xl={3}
            style={{ textAlign: "center", margin: "auto" }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
              }}
            >
              <Icon
                component={LogoWithText}
                style={{
                  height: "100%",
                  width: "135px",
                  verticalAlign: "middle",
                }}
              ></Icon>
            </Link>
          </Col>

          <Col
            xs={0}
            sm={0}
            md={11}
            lg={11}
            xl={11}
            style={{
              textAlign: "right",
              margin: "auto",
            }}
          >
            <div>
              <CurrencyConverter />
              <Link
                href="/cart"
                style={{
                  textDecoration: "none",
                }}
              >
                <Icon
                  component={cartIcon}
                  className="cart-icon"
                  style={{
                    width: "32px",
                    verticalAlign: "middle",
                    marginRight: "20px",
                    cursor: "pointer",
                  }}
                />
              </Link>
              <Popover
                placement="bottomRight"
                content={userMenu}
                trigger="click"
                overlayClassName="header-popup"
              >
                <div className="my-account-header qa-cursor">My Account</div>
                {imageUrl ? (
                  <span
                    style={{
                      marginLeft: "5px",
                      verticalAlign: "middle",
                      cursor: "pointer",
                    }}
                  >
                    <Avatar size={34} src={imageUrl}></Avatar>
                  </span>
                ) : (
                  <span>
                    <Icon
                      component={userProfileIcon}
                      className="user-profile-icon qa-cursor"
                      style={{
                        marginLeft: "5px",
                        verticalAlign: "middle",
                        width: "32px",
                      }}
                    />
                  </span>
                )}
              </Popover>
            </div>
          </Col>
        </Header>
      </Col>
      <Col xs={24} sm={24} md={24} lg={0} xl={0}>
        <Header className="app-header">
          <div
            style={{
              textAlign: "left",
              marginTop: "-4px",
              marginRight: "10px",
            }}
          >
            <Icon
              component={menuIcon}
              className="menu-icon"
              onClick={showDrawer}
            />
          </div>
          <div>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Icon
                component={LogoWithText}
                style={{ width: "120px", height: "30px" }}
              ></Icon>
            </Link>
          </div>

          <div style={{ textAlign: "right", width: "100%", marginTop: "-4px" }}>
            <Link
              href="/cart"
              style={{
                textDecoration: "none",
              }}
            >
              <Icon
                component={cartIcon}
                className="cart-icon"
                style={{
                  width: "40px",
                  cursor: "pointer",
                }}
              />
            </Link>
            <Drawer
              placement="left"
              closable={false}
              onClose={onClose}
              visible={drawer}
              className="mobile-slider-menu"
            >
              <Menu
                defaultOpenKeys={[
                  "my-account",
                  "shop",
                  "sub0",
                  "sub1",
                  "sub2",
                  "sub3",
                  "sub4",
                  "sub5",
                ]}
                mode="inline"
                theme="dark"
              >
                <Menu.Item key="1">
                  <Button
                    className="send-query-button"
                    onClick={() => {
                      setVisible(true);
                    }}
                  >
                    <div className="send-query-button-text qa-rfq-button">
                      Request for Quote
                    </div>
                  </Button>
                </Menu.Item>
                <Menu.Divider style={{ height: "0.5px" }} />
                <SubMenu key="my-account" title="MY ACCOUNT">
                  {props.isGuest == "false" || props.isGuest == undefined ? (
                    <Menu.Item
                      key="5"
                      className="user-account-details"
                      style={{ marginLeft: "-15px" }}
                    >
                      {imageUrl ? (
                        <span
                          style={{
                            marginRight: "10px",
                            display: "inline-block",
                          }}
                        >
                          <Avatar size={40} src={imageUrl}></Avatar>
                        </span>
                      ) : (
                        <span
                          style={{
                            verticalAlign: "middle",
                            marginRight: "10px",
                            display: "inline-block",
                            height: "42px",
                          }}
                        >
                          <Icon
                            component={userProfileIcon}
                            className="user-profile-icon"
                          />
                        </span>
                      )}
                      <div className="header-text">
                        <span style={{ marginBottom: "10px" }}>
                          {orgName},
                          {(verificationStatus === "VERIFIED" ||
                            verificationStatus === "REGISTERED") && (
                            <span
                              style={{
                                color: "#d9bb7f",
                                marginLeft: "5px",
                                verticalAlign: "middle",
                              }}
                            >
                              <Icon
                                component={certifiedIcon}
                                className="certified-icon"
                              />
                            </span>
                          )}
                        </span>
                        <br></br>
                        <span style={{ marginTop: "5px", display: "block" }}>
                          {firstName}
                        </span>
                      </div>
                    </Menu.Item>
                  ) : (
                    ""
                  )}
                  <Menu.Divider style={{ height: "0px" }} />
                  <Menu.Item key="6" onClick={handleMyAccount}>
                    <span className="qa-fs-14 qa-font-san">Profile</span>
                  </Menu.Item>
                  <Menu.Item key="7" onClick={handleVideoRequest}>
                    <span className="qa-fs-14 qa-font-san">Video Meeting</span>
                    <Badge
                      count={props.meetingCount}
                      style={{
                        backgroundColor: "#D9BB7F",
                        marginLeft: "25px",
                        marginTop: "-10px",
                      }}
                    ></Badge>
                  </Menu.Item>
                  <Menu.Item
                    key="8"
                    onClick={handleQuotesRequest}
                    style={
                      props.profileType === "SELLER" || props.isGuest == "true"
                        ? { display: "none" }
                        : {}
                    }
                  >
                    <span className="qa-fs-14 qa-font-san">Quotations</span>
                  </Menu.Item>
                  <Menu.Item
                    key="9"
                    onClick={handleMyOrders}
                    style={
                      props.profileType === "SELLER" || props.isGuest == "true"
                        ? { display: "none" }
                        : {}
                    }
                  >
                    <span className="qa-fs-14 qa-font-san">My Orders</span>
                  </Menu.Item>
                  <Menu.Item
                    key="10"
                    onClick={handleAddress}
                    style={
                      props.profileType === "SELLER" || props.isGuest == "true"
                        ? { display: "none" }
                        : {}
                    }
                  >
                    <span className="qa-fs-14 qa-font-san">Addresses</span>
                  </Menu.Item>
                  <Menu.Divider style={{ height: "0.5px" }} />
                  {verificationStatus === "CREATED" &&
                    profileType === "SELLER" && (
                      <Menu.Item key="3" style={{ height: "auto" }}>
                        <Button
                          className="qa-button apply-to-sell-header"
                          style={{ verticalAlign: "middle" }}
                          onClick={() => {
                            router.push("/applytosell");
                          }}
                        >
                          <div className="">Apply to sell</div>
                        </Button>
                      </Menu.Item>
                    )}
                  {verificationStatus === "CREATED" &&
                    profileType === "SELLER" && (
                      <Menu.Divider style={{ height: "0.5px" }} />
                    )}
                  <Menu.Item key="4" onClick={handleLogout}>
                    Sign out
                  </Menu.Item>
                </SubMenu>
                <Menu.Divider style={{ height: "0.5px" }} />
                <SubMenu
                  key="price-converter"
                  title={`CURRENCY (${convertToCurrency})`}
                >
                  <Menu.Item key="8">
                    <CurrencyConverter mobile={true} />
                  </Menu.Item>
                </SubMenu>
                <Menu.Divider style={{ height: "0.5px" }} />
                <SubMenu
                  key="shop"
                  title="SHOP"
                  className="shop-menu-navigation"
                  style={{ paddingBottom: "120px" }}
                >
                  <Menu.Divider style={{ height: "0.5px" }} />
                  {_.map(navigationItems, function (value, key) {
                    let hasSubNav = _.find(value, { font: "H2" });
                    let header = _.find(value, { font: "H1" });
                    if (hasSubNav) {
                      return (
                        <SubMenu
                          key={`sub${key}`}
                          title={header.displayTitle}
                          className="shop-submenu"
                        >
                          {_.map(value, function (details, id) {
                            let link = "";
                            if (details.filterType) {
                              link =
                                "/sellers/all-categories?" +
                                details.filterType.toLowerCase() +
                                "=" +
                                encodeURIComponent(details.values);
                            } else if (
                              details.action === "L2" &&
                              details.values
                            ) {
                              link =
                                "/sellers/" +
                                encodeURIComponent(details.values);
                            }
                            return (
                              details.font !== "H1" && (
                                <Menu.Item key={key + id}>
                                  <div
                                    className={
                                      details.font === "H1"
                                        ? "navigation-item navigation-title"
                                        : "navigation-item "
                                    }
                                  >
                                    {details.action === "URL" ? (
                                      <Link href={details.values}>
                                        {details.displayTitle}
                                      </Link>
                                    ) : link ? (
                                      <Link href={link}>
                                        {details.displayTitle}
                                      </Link>
                                    ) : (
                                      <span>{details.displayTitle}</span>
                                    )}
                                  </div>
                                </Menu.Item>
                              )
                            );
                          })}
                        </SubMenu>
                      );
                    } else {
                      return (
                        <div className="qa-border-bottom" key={key}>
                          {_.map(value, function (details, id) {
                            let link = "";
                            if (details.filterType) {
                              link =
                                "/sellers/all-categories?" +
                                details.filterType.toLowerCase() +
                                "=" +
                                encodeURIComponent(details.values);
                            } else if (
                              details.action === "L2" &&
                              details.values
                            ) {
                              link =
                                "/sellers/" +
                                encodeURIComponent(details.values);
                            }
                            return (
                              <Menu.Item key={key + id}>
                                <div
                                  className={
                                    details.font === "H1"
                                      ? "navigation-item navigation-title"
                                      : "navigation-item "
                                  }
                                >
                                  {details.action === "URL" ? (
                                    <Link href={details.values}>
                                      {details.displayTitle}
                                    </Link>
                                  ) : link ? (
                                    <Link href={link}>
                                      {details.displayTitle}
                                    </Link>
                                  ) : (
                                    <span>{details.displayTitle}</span>
                                  )}
                                </div>
                              </Menu.Item>
                            );
                          })}
                        </div>
                      );
                    }
                  })}
                </SubMenu>
              </Menu>
            </Drawer>
          </div>
        </Header>
      </Col>

      <Modal
        visible={visible}
        footer={null}
        closable={false}
        onCancel={sendQueryCancel}
        style={{ top: 5 }}
        bodyStyle={{ padding: "0" }}
        className="rfq-submit-modal"
        width={props.buyerDetails || props.sellerDetails ? 775 : 550}
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
            token={token}
            initialValues={values}
            userId={
              props.userProfile &&
              props.userProfile.userProfile &&
              props.userProfile.userProfile.profileId
            }
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
              We have received your request for quote and will revert within the
              next 48 to 72 hours.
            </p>
          </div>
          <Link href="/">
            <Button className="send-query-success-modal-button">
              Back to home page
            </Button>
          </Link>
        </div>
      </Modal>
      <Modal
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
              Welcome to the invite-only preview of Qalara. You are amongst a
              select group invited to experience Qalara and share your valuable
              feedback.
            </p>
            <p className="send-query-success-modal-para2">
              We have sellers across Home & Lifestyle categories. Our seller
              portfolio increases daily, so keep coming back to check in!{" "}
              <b>
                Invitees have access to our Seller’s product catalogs and the
                new video demo feature.
              </b>
            </p>
            <p
              className="send-query-success-modal-para2"
              style={{ marginBottom: "0px", fontSize: "12px" }}
            >
              Please click the button below and enter your Invite-only Username
              and Code for unrestricted access to Qalara.
            </p>
          </div>
          <Button
            className="send-query-success-modal-button"
            onClick={() => {}}
          >
            SIGN IN TO UNLOCK ACCESS
          </Button>
          <p className="send-query-success-modal-para2">
            <b>
              Note: If you are a buyer, you may email us at{" "}
              <a href="mailto:buyers@qalara.com">buyers@qalara.com</a> with
              details of your company to get an Invite Code.
            </b>
          </p>
        </div>
      </Modal>
      {shopColor && <div id="overlay"></div>}
    </Row>
  );
}

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    auth: state.auth,
    priceDetails: state.currencyConverter,
    meetingCount: state.userProfile.meetingCount,
    isGuest:
      state.auth &&
      state.auth.userAuth &&
      state.auth.userAuth.attributes &&
      state.auth.userAuth.attributes.isGuest &&
      state.auth.userAuth.attributes.isGuest[0],
    profileType:
      state.userProfile &&
      state.userProfile.userProfile &&
      state.userProfile.userProfile.profileType,
  };
};

export default connect(mapStateToProps, null)(UserHeader);
