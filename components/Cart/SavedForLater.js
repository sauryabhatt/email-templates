/** @format */

import React, { useState } from "react";
import { connect } from "react-redux";
import { Button, Row, Col, message } from "antd";
import Icon, {
  CheckCircleOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import deleteIcon from "../../public/filestore/deleteIcon";
import cartIcon from "../../public/filestore/cartIcon";
import {
  getSavedForLater,
  getCart,
  checkInventory,
  updateCart,
  checkCart,
} from "../../store/actions";
import { useKeycloak } from "@react-keycloak/ssr";
import _ from "lodash";
import getSymbolFromCurrency from "currency-symbol-map";
import { QuantityInput } from "./QuantityInput";

const SavedForLater = (props) => {
  const { keycloak } = useKeycloak();
  const mediaMatch = window.matchMedia("(min-width: 1024px)");
  const [error, setError] = useState({});
  const [showRow, setShowRow] = useState(true);
  let { cart = {}, userProfile = {}, sfl = {}, brandNames = {} } = props;
  let { orderId = "" } = cart || {};
  let { products = [] } = sfl || {};
  let subOrders = [];
  if (products.length) {
    let orders = [];
    let groupedOrders = _.groupBy(products, "sellerCode");
    for (let order in groupedOrders) {
      let obj = {};
      obj["sellerCode"] = order;
      obj["products"] = groupedOrders[order];
      orders.push(obj);
    }
    subOrders = orders;
  }

  let { currencyDetails = {} } = props;
  let { convertToCurrency = "" } = currencyDetails || {};
  let { profileId = "" } = userProfile || {};

  profileId = profileId.replace("BUYER::", "");

  const getConvertedCurrency = (baseAmount) => {
    let { convertToCurrency = "", rates = [] } = currencyDetails;
    return Number.parseFloat(
      (baseAmount *
        Math.round((rates[convertToCurrency] + Number.EPSILON) * 100)) /
        100
    ).toFixed(2);
  };

  const enableUpdateQty = (id) => {
    // console.log(id);
  };

  const addToCart = (order, i = 0) => {
    let count = 0;
    let { products = [], sellerCode = "" } = order;
    let productIds = [];

    for (let product of products) {
      let { productId = "" } = product;
      productIds.push(productId);
    }

    props.checkInventory(keycloak.token, productIds, (result) => {
      let doNotDelete = false;
      let errorObjFinal = {};
      let productList = [];
      let obj = { ...order };
      for (let product of products) {
        let {
          quantity = "",
          productId = "",
          minimumOrderQuantity = "",
          productName = "",
          color = "",
          size = "",
          image = "",
          articleId = "",
          productType = "",
        } = product;
        // let newQty =
        //   document.getElementById(`sfl_quantity_${i}${count}`).value ||
        //   quantity;
        let newQty = quantity;
        if (result[productId] < newQty) {
          doNotDelete = true;
          let errObj = {};
          errObj[productId] = result[productId];
          errorObjFinal = { ...errObj, ...errorObjFinal };
        }
        let prodObj = {
          quantity: parseInt(newQty),
          sellerCode: sellerCode,
          productId: productId,
          minimumOrderQuantity: minimumOrderQuantity,
          isSampleDeliveryRequired: false,
          isQualityTestingRequired: false,
          productName: productName,
          color: color,
          size: size,
          image: image,
          articleId: articleId,
          productType: productType,
          typeOfOrder: productType,
        };

        if (doNotDelete) {
          prodObj["quantity"] = parseInt(result[productId]);
        }
        productList.push(prodObj);
        count++;
      }
      obj["products"] = productList;
      obj["orderId"] = orderId;
      setError(errorObjFinal);

      if (orderId) {
        props.updateCart(keycloak.token, "ADD", obj, (response) => {
          message.success("Products have been moved to your cart!", 5);
          deleteFromSFL(productIds);
          props.getCart(keycloak.token);
        });
      } else {
        props.checkCart(keycloak.token, (result) => {
          let { orderId = "" } = result;
          if (orderId) {
            obj["orderId"] = orderId;
            props.updateCart(keycloak.token, "ADD", obj, (response) => {
              message.success("Products have been moved to your cart!", 5);
              deleteFromSFL(productIds);
              props.getCart(keycloak.token);
            });
          } else {
            fetch(
              `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/rts/` +
                profileId,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + keycloak.token,
                },
              }
            )
              .then((res) => {
                if (res.ok) {
                  return res.json();
                } else {
                  throw res.statusText || "Error while signing up.";
                }
              })
              .then((res) => {
                let { orderId = "" } = res;
                obj["orderId"] = orderId;
                props.updateCart(keycloak.token, "ADD", obj, (response) => {
                  message.success("Products have been moved to your cart!", 5);
                  deleteFromSFL(productIds);
                  props.getCart(keycloak.token);
                });
              })
              .catch((err) => {
                console.log(err);
              });
          }
        });
      }
    });
  };

  const deleteFromSFL = (productId) => {
    fetch(`${process.env.NEXT_PUBLIC_REACT_APP_WISHLIST_URL}/v1/my/wish-list`, {
      method: "PUT",
      body: JSON.stringify(productId),
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
        let { products = [] } = res || {};
        let orders = [];
        let groupedOrders = _.groupBy(products, "sellerCode");
        for (let order in groupedOrders) {
          let obj = {};
          obj["sellerCode"] = order;
          obj["products"] = groupedOrders[order];
          orders.push(obj);
        }
        subOrders = orders;
        props.getSavedForLater(keycloak.token);
        // message.success("Product has been deleted from Wishlist!", 5);
      })
      .catch((err) => {
        message.error(err.message || err, 5);
      });
  };

  return (
    <div>
      {subOrders && subOrders.length > 0 ? (
        <Row>
          {mediaMatch.matches && (
            <Col xs={0} sm={0} md={24} lg={24} xl={24}>
              <div
                className="sfs-title qa-mar-btm-2 qa-cursor"
                onClick={() => setShowRow(!showRow)}
              >
                Saved for later{" "}
                <span style={{ float: "right" }}>
                  {showRow ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>
              {showRow && (
                <div className="qa-pad-2 c-item-list">
                  {_.map(subOrders, (order, i) => {
                    let { sellerCode = "", products = "" } = order;
                    let totalAmount = 0;
                    let productIds = [];
                    for (let items of products) {
                      let { total = 0, productId = "" } = items;
                      totalAmount = totalAmount + total;
                      productIds.push(productId);
                    }

                    return (
                      <div
                        className={`qa-bg-light-theme qa-pad-3  ${
                          i < subOrders.length - 1 ? "qa-mar-btm-2" : ""
                        }`}
                        key={i}
                      >
                        <div className="cart-ship-pt qa-fw-b qa-border-bottom">
                          <Icon
                            component={cartIcon}
                            className="cart-icon"
                            style={{
                              width: "20px",
                              verticalAlign: "middle",
                              marginRight: "8px",
                            }}
                          />
                          {brandNames &&
                            brandNames[sellerCode] &&
                            brandNames[sellerCode].brandName}
                          <span
                            className="cart-delete qa-cursor"
                            onClick={() => deleteFromSFL(productIds)}
                          >
                            Delete cart
                          </span>
                        </div>
                        {_.map(products, (product, j) => {
                          let {
                            color = "",
                            image = "",
                            productId = "",
                            productName = "",
                            quantity = "",
                            size = "",
                            total = 0,
                            articleId = "",
                            unitOfMeasure = "",
                          } = product;
                          quantity = parseInt(quantity);
                          return (
                            <Row className="qa-pad-20-0" key={j}>
                              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                                <div className="aspect-ratio-box">
                                  <img
                                    className="images"
                                    src={image}
                                    alt={productName}
                                  ></img>
                                </div>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={10}
                                lg={10}
                                xl={10}
                                className="qa-pad-0-10"
                              >
                                <div className="cart-prod-title qa-fw-b">
                                  {productName}
                                </div>
                                <div className="cart-prod-title">
                                  Item ID - {articleId}
                                </div>
                                <div className="cart-subtitle">{color}</div>
                                <div className="cart-subtitle">{size}</div>
                                {/* <div className=" qa-mar-top-1">
                                  <QuantityInput
                                    quantity={quantity}
                                    sellerCode={sellerCode}
                                    minQty={minimumOrderQuantity}
                                    name={`sfl_quantity_${i}${j}`}
                                    enableUpdateQty={enableUpdateQty}
                                  />
                                </div> */}
                                <div className="cart-prod-title qa-mar-top-1">
                                  Units:{" "}
                                  {error[productId]
                                    ? error[productId]
                                    : quantity}{" "}
                                  {unitOfMeasure}
                                </div>
                                <div className="qa-error">
                                  {error[productId] ? (
                                    <span>
                                      We have {error[productId]} units of
                                      inventory available.
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={8}
                                lg={8}
                                xl={8}
                                className="qa-mar-top-15"
                              >
                                <div className="qa-disp-table-cell">
                                  <div className="cart-prod-title qa-fw-b qa-txt-alg-rgt">
                                    {getSymbolFromCurrency(convertToCurrency)}
                                    {total ? getConvertedCurrency(total) : ""}
                                  </div>
                                  <div className="cart-price-text">
                                    Base price per unit excl. margin and other
                                    charges
                                  </div>
                                </div>
                                <div
                                  className="qa-txt-alg-rgt qa-disp-table-cell qa-cart-delete qa-cursor"
                                  onClick={() => deleteFromSFL([productId])}
                                >
                                  <Icon
                                    component={deleteIcon}
                                    className="delete-icon"
                                    style={{
                                      width: "15px",
                                      verticalAlign: "middle",
                                    }}
                                  />
                                </div>
                              </Col>
                            </Row>
                          );
                        })}
                        <Row className="qa-pad-20-0">
                          <Col
                            xs={14}
                            sm={14}
                            md={14}
                            lg={14}
                            xl={14}
                            className="cart-prod-title qa-fw-b"
                          >
                            SELLER CART VALUE
                          </Col>
                          <Col
                            xs={10}
                            sm={10}
                            md={10}
                            lg={10}
                            xl={10}
                            className="qa-txt-alg-rgt cart-prod-title qa-fw-b"
                          >
                            {getSymbolFromCurrency(convertToCurrency)}
                            {totalAmount
                              ? getConvertedCurrency(totalAmount)
                              : ""}
                          </Col>
                        </Row>

                        <Button className="qa-button qa-fs-12 cart-save-later qa-mar-top-2 qa-vs-hide">
                          Save for later
                        </Button>
                        <Button
                          className="qa-button qa-fs-12 cart-opt-service qa-mar-top-2"
                          onClick={() => addToCart(order, i)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Col>
          )}

          {!mediaMatch.matches && (
            <Col span={24}>
              <div className="sfs-title" onClick={() => setShowRow(!showRow)}>
                Saved for later{" "}
                {products.length > 0 && <span>({products.length})</span>}
                <span style={{ float: "right" }}>
                  {showRow ? (
                    <UpOutlined style={{ fontSize: "12px" }} />
                  ) : (
                    <DownOutlined style={{ fontSize: "12px" }} />
                  )}
                </span>
              </div>

              {showRow && (
                <div>
                  {_.map(subOrders, (order, i) => {
                    let { sellerCode = "", products = "" } = order;
                    let totalAmount = 0;
                    let productIds = [];
                    for (let items of products) {
                      let { total = 0, productId = "" } = items;
                      totalAmount = totalAmount + total;
                      productIds.push(productId);
                    }

                    return (
                      <div className="qa-bg-light-theme" key={i}>
                        <div className="cart-ship-pt qa-fw-b qa-border-bottom">
                          <Icon
                            component={cartIcon}
                            className="cart-icon qa-disp-tc"
                            style={{
                              width: "20px",
                              verticalAlign: "middle",
                              marginRight: "8px",
                            }}
                          />
                          <div className="qa-disp-tc" style={{ width: "60%" }}>
                            {brandNames &&
                              brandNames[sellerCode] &&
                              brandNames[sellerCode].brandName}
                          </div>
                          <span
                            className="cart-delete qa-disp-tc qa-cursor"
                            onClick={() => deleteFromSFL(productIds)}
                          >
                            Delete cart
                          </span>
                        </div>
                        {_.map(products, (product, j) => {
                          let {
                            color = "",
                            image = "",
                            productId = "",
                            productName = "",
                            quantity = "",
                            size = "",
                            total = 0,
                            articleId = "",
                            unitOfMeasure = "",
                          } = product;
                          quantity = parseInt(quantity);
                          return (
                            <Row className="qa-pad-20-0" key={j}>
                              <Col xs={9} sm={9} md={9} lg={9} xl={9}>
                                <div className="aspect-ratio-box">
                                  <img
                                    className="images"
                                    src={image}
                                    alt={productName}
                                  ></img>
                                </div>
                              </Col>
                              <Col
                                xs={15}
                                sm={15}
                                md={15}
                                lg={15}
                                xl={15}
                                className="qa-pad-0-10"
                              >
                                <div className="cart-prod-title qa-fw-b">
                                  {productName}
                                </div>
                                <div className="cart-prod-title">
                                  Item ID - {articleId}
                                </div>
                                <div className="cart-subtitle">{color}</div>
                                <div className="cart-subtitle">{size}</div>
                                {/* <div className="cart-subtitle qa-mar-top-05">
                                  <CheckCircleOutlined /> Quality testing
                                </div>
                                <div className="cart-subtitle">
                                  <CheckCircleOutlined /> Sample required
                                </div> */}
                              </Col>
                              <Col
                                xs={24}
                                sm={24}
                                md={24}
                                lg={24}
                                xl={24}
                                className="qa-mar-top-1"
                              >
                                <div className="cart-prod-title qa-fw-b">
                                  {getSymbolFromCurrency(convertToCurrency)}
                                  {total ? getConvertedCurrency(total) : ""}
                                </div>
                                <div className="cart-price-text qa-mar-btm-1">
                                  Base price per unit excl. margin and other
                                  charges
                                </div>
                                <div>
                                  <div
                                    className="qa-disp-tc"
                                    style={{ width: "90%" }}
                                  >
                                    {/* <QuantityInput
                                      quantity={quantity}
                                      sellerCode={sellerCode}
                                      minQty={minimumOrderQuantity}
                                      name={`sfl_quantity_${i}${j}`}
                                      enableUpdateQty={enableUpdateQty}
                                    /> */}
                                    <div className="cart-prod-title qa-mar-top-1">
                                      Units:{" "}
                                      {error[productId]
                                        ? error[productId]
                                        : quantity}{" "}
                                      {unitOfMeasure}
                                    </div>
                                    <div className="qa-error">
                                      {error[productId] ? (
                                        <span>
                                          We have {error[productId]} units of
                                          inventory available.
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                  <div
                                    className="qa-txt-alg-rgt qa-disp-tc"
                                    style={{ width: "10%" }}
                                    onClick={() => deleteFromSFL([productId])}
                                  >
                                    <Icon
                                      component={deleteIcon}
                                      className="delete-icon"
                                      style={{
                                        width: "15px",
                                        verticalAlign: "middle",
                                      }}
                                    />
                                  </div>
                                </div>
                              </Col>
                            </Row>
                          );
                        })}
                        <Row className="qa-pad-20-0">
                          <Col
                            xs={14}
                            sm={14}
                            md={14}
                            lg={14}
                            xl={14}
                            className="cart-prod-title qa-fw-b"
                          >
                            SELLER CART VALUE
                          </Col>
                          <Col
                            xs={10}
                            sm={10}
                            md={10}
                            lg={10}
                            xl={10}
                            className="qa-txt-alg-rgt cart-prod-title qa-fw-b"
                          >
                            {getSymbolFromCurrency(convertToCurrency)}
                            {totalAmount
                              ? getConvertedCurrency(totalAmount)
                              : ""}
                          </Col>
                        </Row>

                        <Button
                          className="qa-button qa-fs-12 cart-opt-service qa-mar-top-2"
                          onClick={() => addToCart(order, i)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Col>
          )}
        </Row>
      ) : (
        <div></div>
      )}
      {subOrders && subOrders.length > 0 && showRow && (
        <div className="qa-tc-white qa-fs-12 qa-lh qa-mar-top-05">
          *To checkout or update quantity please move products to cart
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    sfl: state.checkout.sfl,
    cart: state.checkout.cart,
    currencyDetails: state.currencyConverter,
    userProfile: state.userProfile.userProfile,
  };
};

export default connect(mapStateToProps, {
  getSavedForLater,
  getCart,
  checkInventory,
  updateCart,
  checkCart,
})(SavedForLater);
