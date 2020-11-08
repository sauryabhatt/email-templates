/** @format */

import React, { useState, useEffect } from "react";
import { useSelector, connect } from "react-redux";
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
  Dropdown,
  Input,
  Form,
  message,
  Select,
} from "antd";
import Icon from "@ant-design/icons";
import LogoWithText from "../../public/filestore/logo_with_text.js";
import { loginToApp } from "../AuthWithKeycloak";
import userProfileIcon from "../../public/filestore/userProfileIcon";
import homeIcon from "../../public/filestore/homeIcon";
import menuIcon from "../../public/filestore/menuIcon";
import closeButton from "../../public/filestore/closeButton";
import searchIcon from "../../public/filestore/searchIcon";
import { useKeycloak } from "@react-keycloak/ssr";

import SendQueryForm from "../SendQueryForm/SendQueryForm";
import CurrencyConverter from "../common/CurrencyConverter";

import _ from "lodash";
import _isEmpty from "lodash/isEmpty";
import cartIcon from "../../public/filestore/headerCart";

const { Header } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

function AppHeader(props) {
  let { priceDetails = {} } = props;
  const { keycloak } = useKeycloak();
  const router = useRouter();
  let { convertToCurrency = "" } = priceDetails || {};
  // const mediaMatch = window.matchMedia("(min-width: 768px)");
  const mediaMatch = { matches: true };
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [shopVisible, setShopVisible] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const [navigationItems, setNavigationItems] = useState({});
  const [columns, setColumns] = useState();
  const [shopColor, setShopColor] = useState(false);
  const [inviteAccess, setInviteAccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchVisibleMob, setSearchVisibleMob] = useState(false);
  const [selectedType, setSelectedType] = useState("product");
  const [close, setClose] = useState(false);

  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );
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

  const sendQueryCancel = (status) => {
    if (status === "success") {
      setVisible(false);
      setSuccessQueryVisible(true);
    } else {
      setVisible(false);
    }
  };

  const showDrawer = () => {
    let state = !drawer;
    setDrawer(state);
  };

  const onClose = () => {
    setDrawer(false);
  };

  const successQueryCancel = () => {
    setSuccessQueryVisible(false);
    setInviteAccess(false);
    setSubmitted(false);
    form.resetFields();
  };

  const handleLogin = () => {
    loginToApp(keycloak, { currentPath: encodeURI(router.asPath) });
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  const onSearch = () => {
    console.log("search page runs")
    let formValues = searchForm.getFieldValue();
    let { searchBy = "", search = "" } = formValues;
    if (!searchBy) {
      searchBy = "product";
    }
    if (search && search.trim().length > 0) {
      search = search.replace("%", "");
      handleSearchChangeMob(false);
      handleSearchChange(false);
      let searchLink = "";
      if (
        search.includes("order") ||
        search.includes("return") ||
        search.includes("cancel") ||
        search.includes("track")
      ) {
        searchLink = "/FAQforwholesalebuyers";
      } else {
        searchLink =
          "/search" +
          "/" +
          encodeURIComponent(searchBy) +
          "/" +
          encodeURIComponent(search);
      }
      router.push(searchLink);
    }

    searchForm.setFieldsValue({ search: "" });
  };

  async function fetchNdjson(resonse) {

    let responseJSON;
    if(process.env.NODE_ENV === 'production') {
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
    return navigationItems;
  }

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

  const searchMenu = (
    <Menu theme="dark" style={{ marginTop: "-7px", cursor: "default" }}>
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
                      "/sellers/" +
                      "all-categories" +
                      "?" +
                      details.filterType.toLowerCase() +
                      "=" +
                      details.values;
                  } else if (details.action === "L2" && details.values) {
                    link = "/sellers/" + details.values;
                  }
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
                          {details.displayTitle || ""}
                        </Link>
                      ) : link ? (
                        <Link href={link}>{details.displayTitle || ""}</Link>
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

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      searchForm.setFieldsValue({ searchBy: "product" });
      fetchNdjson();
    }
    return () => {
      mounted = false;
    };
  }, []);

  const userMenu = (
    <Menu
      style={{ width: "100%", border: "none" }}
      onClick={(e) => {
        handleUserMenu(false);
      }}
    >
      <Menu.Item key="1" style={{ height: "auto", padding: "0px" }}>
        <span
          onClick={handleSignUp}
          style={{
            fontFamily: "senregular",
            fontSize: "14px",
            padding: "10px 25px 10px 10px",
            cursor: "pointer",
          }}
        >
          Sign up
        </span>
      </Menu.Item>
      <Menu.Divider
        style={{
          height: "0.5px",
          background: "#D9BB7F",
          opacity: "0.2",
          marginTop: "15px",
          marginBottom: "15px",
        }}
      />
      <Menu.Item key="2" style={{ height: "auto", padding: "0px" }}>
        <span
          onClick={handleLogin}
          style={{
            fontFamily: "senregular",
            fontSize: "14px",
            padding: "10px 25px 10px 10px",
            cursor: "pointer",
          }}
        >
          Sign in
        </span>
      </Menu.Item>
    </Menu>
  );

  const handleVisibleChange = (flag) => {
    setShopVisible(flag);
    setSearchVisible(false);
    setClose(false);
    if (flag) {
      setShopColor(true);
    } else {
      setShopColor(false);
    }
  };

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
    setSearchVisibleMob(flag);
  };
  if (_isEmpty(navigationItems)) {
    return null;
  } else {
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
              <Dropdown
                overlayClassName="search-section"
                overlay={searchMenu}
                trigger={["click"]}
                onVisibleChange={handleSearchChange}
                visible={searchVisible}
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
                  }}
                >
                  {!close ? (
                    <Icon
                      component={searchIcon}
                      style={{ height: "36px", width: "32px", verticalAlign:"middle" }}
                    ></Icon>
                  ) : (
                      <Icon
                        component={closeButton}
                        style={{ height: "32px", width: "32px", verticalAlign:"middle" }}
                      ></Icon>
                    )}
                </div>
              </Dropdown>
                {/*<span>
                  <Link href="/" className="app-header-home-button">
                    <a>
                      <Icon
                        component={homeIcon}
                        className="search-icon qa-cursor"
                        style={{
                          verticalAlign: "middle",
                          width: "32px",
                          marginTop: "-5px",
                        }}
                      />
                    </a>
                  </Link>
                </span>*/}
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
              style={{ textAlign: "center" }}
            >
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                }}
              >
                <a>
                  <Icon
                    component={LogoWithText}
                    style={{
                      height: "100%",
                      width: "135px",
                      verticalAlign: "middle",
                    }}
                  ></Icon>
                </a>
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
                <CurrencyConverter mobile={false} />
                <Link
                  href="/cart"
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <a>
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
                  </a>
                </Link>
                <Popover
                  placement="bottomRight"
                  content={userMenu}
                  trigger="click"
                  overlayClassName="header-popup"
                >
                  <div className="my-account-header qa-cursor">My Account</div>
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
                <a>
                  <Icon
                    component={LogoWithText}
                    style={{ width: "120px", height: "30px" }}
                  ></Icon>
                </a>
              </Link>
            </div>
            <div
              style={{ textAlign: "right", width: "100%", marginTop: "-4px" }}
            >
              <Dropdown
              overlayClassName="search-section"
              overlay={searchMenuMob}
              trigger={["click"]}
              onVisibleChange={handleSearchChangeMob}
              visible={searchVisibleMob}
              overlayStyle={{ width: "100%", cursor: "pointer" }}
            >
              <Icon
                component={searchIcon}
                className="search-icon"
                style={{
                  width: "40px",
                  marginRight: "15px",
                  cursor: "pointer",
                }}
              />
            </Dropdown>

              <Link
                href="/cart"
                style={{
                  textDecoration: "none",
                }}
              >
                <a>
                  <Icon
                    component={cartIcon}
                    className="cart-icon"
                    style={{
                      width: "40px",
                      cursor: "pointer",
                    }}
                  />
                </a>
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
                  <Menu.Item key="rfq">
                    {" "}
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
                    <Menu.Item key="5" style={{ marginLeft: "-15px" }}>
                      <div
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
                      </div>
                      Hi there!
                    </Menu.Item>
                    <Menu.Divider style={{ height: "0px" }} />
                    <Menu.Item key="6" onClick={handleSignUp}>
                      Sign up
                    </Menu.Item>
                    <Menu.Divider style={{ height: "0.5px" }} />
                    <Menu.Item key="7" onClick={handleLogin}>
                      Sign in
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
                  {/* <Menu.Item key="blog">BLOG</Menu.Item> */}
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
                                  "/sellers/" +
                                  "all-categories" +
                                  "?" +
                                  details.filterType.toLowerCase() +
                                  "=" +
                                  details.values;
                              } else if (
                                details.action === "L2" &&
                                details.values
                              ) {
                                link = "/sellers/" + details.values;
                              }
                              return (
                                details.font !== "H1" && (
                                  <Menu.Item key={`key-${id}`}>
                                    <div
                                      className={
                                        details.font === "H1"
                                          ? "navigation-item navigation-title"
                                          : "navigation-item "
                                      }
                                    >
                                      {details.action === "URL" ? (
                                        <Link href={details.values}>
                                          {details.displayTitle || ""}
                                        </Link>
                                      ) : link ? (
                                        <Link href={"/"}>
                                          {details.displayTitle || ""}
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
                                  "/sellers/" +
                                  "all-categories" +
                                  "?" +
                                  details.filterType.toLowerCase() +
                                  "=" +
                                  details.values;
                              } else if (
                                details.action === "L2" &&
                                details.values
                              ) {
                                link = "/sellers/" + details.values;
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
                                        {details.displayTitle || ""}
                                      </Link>
                                    ) : link ? (
                                      <Link href={link}>
                                        {details.displayTitle || ""}
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
              />
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
                We have received your request for quote and will revert within
                the next 48 to 72 hours.
              </p>
            </div>
            <Link href="/">
              <a>
                <Button className="send-query-success-modal-button">
                  Back to home page
                </Button>
              </a>
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
              <p className="send-query-success-modal-para1">
                Invite only access
              </p>
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
                Seller’s product catalogs and the new video demo feature.{" "}
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
                Please click the button below and enter your Invite-only
                Username and Code for unrestricted access to Qalara.
              </p>
            </div>
            <Button
              className="send-query-success-modal-button"
              onClick={handleLogin}
            >
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
                please share your details below and we’ll get back to you within
                a few hours.
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
                    message: "Please enter a correct email address.",
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

        {shopColor && <div id="overlay"></div>}
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    priceDetails: state.currencyConverter,
    userProfile: state.userProfile,
  };
};

export default connect(mapStateToProps, null)(AppHeader);
