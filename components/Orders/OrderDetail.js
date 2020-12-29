import React, { useEffect, useState } from "react";
import { Row, Col, Button, Popover } from "antd";
import getSymbolFromCurrency from "currency-symbol-map";
import Icon from "@ant-design/icons";
import closeButton from "../../public/filestore/closeButton";
import Link from "next/link";
import ParentOrderStatuses from "../../public/filestore/ParentOrderStatuses.json";
import sellerList from "../../public/filestore/freeShippingSellers.json";
import moment from "moment";

const OrderDetail = (props) => {
  const {order, handleShowOrder} = props
  const subOrders = order.subOrders[0]
  const [popover, setPopover] = useState(false);
  console.log(subOrders)
  const addDefaultSrc = (ev) => {
    ev.target.src = process.env.NEXT_PUBLIC_URL + "/placeholder.png";
  };
  let priceBreakup = (
    <div className="breakup-popup qa-font-san">
      <div className="qa-border-bottom qa-pad-btm-15 qa-fs-14 qa-fw-b">
        Order value  breakup
        <span
          onClick={() => {
            setPopover(false);
          }}
          style={{
            float: "right",
            marginTop: "-8px",
            cursor: "pointer",
          }}
        >
          <Icon
            component={closeButton}
            style={{ width: "30px", height: "30px" }}
          />
        </span>
      </div>
      <div className="qa-mar-btm-1 cart-ship-pt qa-mar-top-15">
        <div className="c-left-blk qa-mar-btm-05">Value of products purchased</div>
        <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
          {getSymbolFromCurrency(order && order.currency)}
          {order.subTotal}
        </span>
        <div className="c-left-blk qa-mar-btm-05">Freight fees</div>
        {order && order.orderType == "RTS" ? (
          <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(order && order.currency) ||
                "$"}
            {order &&
                order.miscChargesActual &&
                order.miscChargesActual.find(
                  (x) => x.chargeId === "FREIGHT_MAX"
                )
                  ? parseFloat(
                    order.miscChargesActual.find(
                      (x) => x.chargeId === "FREIGHT_MAX"
                    ).amount * order.conversionFactor
                  ).toFixed(2)
                  : order &&
                order.miscCharges &&
                order.miscCharges.find(
                  (x) => x.chargeId === "FREIGHT_MAX"
                ) &&
                parseFloat(
                  order.miscCharges.find(
                    (x) => x.chargeId === "FREIGHT_MAX"
                  ).amount * order.conversionFactor
                ).toFixed(2)}
          </span>
        ) : (
          <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(order && order.currency)}
            {order &&
                order.miscChargesActual &&
                order.miscChargesActual.find(
                  (x) => x.chargeId === "FREIGHT_CHARGES"
                )
                  ? order.miscChargesActual.find(
                    (x) => x.chargeId === "FREIGHT_CHARGES"
                  ).amount
                  : order &&
                order.miscCharges &&
                order.miscCharges.find(
                  (x) => x.chargeId === "FREIGHT_CHARGES"
                ) &&
                order.miscCharges.find(
                  (x) => x.chargeId === "FREIGHT_CHARGES"
                ).amount}
          </span>
        )}

        <div className="c-left-blk qa-mar-btm-05">Custom, taxes & duties</div>
        {order && order.orderType == "RTS" ? (
          <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(order && order.currency) ||
                "$"}
            {order &&
                order.miscChargesActual &&
                order.miscChargesActual.find(
                  (x) => x.chargeId === "DUTY_MAX"
                )
                  ? parseFloat(
                    order.miscChargesActual.find(
                      (x) => x.chargeId === "DUTY_MAX"
                    ).amount * order.conversionFactor
                  ).toFixed(2)
                  : order &&
                order.miscCharges &&
                order.miscCharges.find(
                  (x) => x.chargeId === "DUTY_MAX"
                ) &&
                parseFloat(
                  order.miscCharges.find(
                    (x) => x.chargeId === "DUTY_MAX"
                  ).amount * order.conversionFactor
                ).toFixed(2)}
          </span>
        ) : (
          <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(order && order.currency)}
            {order &&
                order.miscChargesActual &&
                order.miscChargesActual.find(
                  (x) => x.chargeId === "CUSTOM_CHARGES"
                )
                  ? order.miscChargesActual.find(
                    (x) => x.chargeId === "CUSTOM_CHARGES"
                  ).amount
                  : order &&
                order.miscCharges &&
                order.miscCharges.find(
                  (x) => x.chargeId === "CUSTOM_CHARGES"
                ) &&
                order.miscCharges.find(
                  (x) => x.chargeId === "CUSTOM_CHARGES"
                ).amount}
          </span>
        )}
        <div className = "qa-border-bottom" style={{paddingBottom: "15px", marginBottom: "15px"}}>
        <div className="c-left-blk qa-mar-btm-05">VAT/ GST / Taxes</div>
        {order && order.orderType == "RTS" ? (
          <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(order && order.currency) ||
                "$"}
            {order &&
                order.miscChargesActual &&
                order.miscChargesActual.find(
                  (x) => x.chargeId === "VAT"
                )
                  ? parseFloat(
                    order.miscChargesActual.find(
                      (x) => x.chargeId === "VAT"
                    ).amount * order.conversionFactor
                  ).toFixed(2)
                  : order &&
                order.miscCharges &&
                order.miscCharges.find(
                  (x) => x.chargeId === "VAT"
                ) &&
                parseFloat(
                  order.miscCharges.find(
                    (x) => x.chargeId === "VAT"
                  ).amount * order.conversionFactor
                ).toFixed(2)}
          </span>
        ) : (
          <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
            {getSymbolFromCurrency(order && order.currency)}
            {order &&
                order.miscChargesActual &&
                order.miscChargesActual.find(
                  (x) => x.chargeId === "VAT"
                )
                  ? order.miscChargesActual.find(
                    (x) => x.chargeId === "VAT"
                  ).amount
                  : order &&
                order.miscCharges &&
                order.miscCharges.find(
                  (x) => x.chargeId === "VAT"
                ) &&
                order.miscCharges.find(
                  (x) => x.chargeId === "VAT"
                ).amount}
          </span>
        )}
        </div>
        <div className="c-left-blk qa-mar-btm-05 qa-fw-b">Total order value</div>
        <span className="c-right-blk qa-txt-alg-rgt qa-mar-btm-05 qa-fw-b">
          {getSymbolFromCurrency(order && order.currency)}
          {order.total}
        </span>
      </div>
    </div>
  )
  return(
    <div className="tst">
      <div> Order ID #26888999</div>
    <Col xs={24} sm={24} md={24} lg={24} className="order-card-container qa-mar-btm-2 qa-font-san">
      <div className="order-card-header">
        <div className="order-card-headr-tile">
          <div className="qa-fs-10 odrer-header-title qa-grey-color">
            Order ID
          </div>
          <div className="qa-fs-14 order-header-tile-content">
            {order.orderId}
          </div>
        </div>
        <div className="order-card-headr-tile">
          <div className="qa-fs-10 odrer-header-title qa-grey-color">
            ORDER STATUS
          </div>
          <div className="qa-fs-14 order-header-tile-content">
            {order.status}
          </div>
        </div>
        {order.status === "DELIVERED" || order.status === "CANCELED" 
          ? null
          : (
            <React.Fragment>
              <div className="order-card-headr-tile">
                <div className="qa-fs-10 odrer-header-title qa-grey-color">
                  ESTIMATED DELIVERY DATE
                </div>
                <div className="qa-fs-14 order-header-tile-content qa-green-color">
                  {moment(order.expectedDeliveryDateMin).format("DD MMM YY")} - {moment(order.expectedDeliveryDateMax).format("DD MMM YY")}
                </div>
              </div>
              <div className="order-card-headr-tile">
                <div className="qa-fs-14 odrer-header-title qa-sm-color qa-fw-b qa-cursor">
                  TRACK SELLER ORDER
                </div>
                {/*<div className="qa-fs-14 order-header-tile-content qa-green-color">
                  Arriving early.
                </div>*/}
              </div>

            </React.Fragment>
          )
        }
      </div>
      <div className="order-card-body">
        <div className="qa-flex-row" style={{justifyContent: "space-between"}}>
          <div className="qa-flex-column">
            <div className="qa-fs-17 qa-fw-b">TOTAL SELLER ORDER VALUE</div>
            <div>Seller ID: {subOrders.sellerCode}</div>

          </div>
          <div className="qa-flex-column qa-txt-alg-rgt">
            <span  className = "qa-fw-b">
              {getSymbolFromCurrency(order && order.currency)}
              {subOrders.total}
            </span>
            <Popover
                placement="bottomRight"
                content={priceBreakup}
                trigger="click"
                visible={popover}
                overlayClassName="price-breakup-popup"
              >
            <span onClick = {() => setPopover(true)} className = "qa-cursor qa-fs-14 qa-sm-color"> See breakup</span>
            </Popover>
          </div>
        </div>

        {subOrders.products && subOrders.products.length > 0 
          ?(
            subOrders.products.map((p, i) =>{
              return (
                <div key={i} className="qa-flex-row order-card-details-tile">
                  {order.orderType === "RTS" ? (
                    <img
                      className="images"
                      onError={addDefaultSrc}
                      src={p.image}
                      alt="Order placeholder"
                    ></img>
                  ) : (
                    <img
                      className="images"
                      onError={addDefaultSrc}
                      src={
                        process.env
                          .NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
                          `${p.thumbnailMedia ? p.thumbnailMedia.mediaUrl : null}`
                      }
                      alt="Order placeholder"
                    ></img>
                  )}
                  <div className="qa-flex-row" style={{justifyContent: "space-between", width: "100%", marginLeft: "16px"}}>
                    <div className = "qa-flex-column">
                      <span>{p.productName}</span>
                      <span>Item ID - <span className = "qa-fw-b">{p.articleId}</span></span>
                      <span>{p.color} {p.size ? `, ${p.size}` : null}</span>
                      {p.qualityTestingCharge ? <span>Quality testing</span> : null}
                    </div>
                    <div className="qa-flex-column">
                      <div className="qa-flex-row" style={{justifyContent: "space-between"}}>
                        <span>Units</span>
                        <span className = "qa-fw-b">{p.quantity}</span>
                      </div>
                      <div className="qa-flex-row" style={{justifyContent: "space-between"}}>
                        <span>Base price</span>
                        <span className = "qa-fw-b">
                          {getSymbolFromCurrency(order && order.currency)}
                          {p.total}
                        </span>
                      </div>
                      <div className="qa-flex-row" style={{justifyContent: "space-between"}}>
                        <span>Apportioned  freight,<br/> customs, duties & taxes</span>
                        <span className = "qa-fw-b">$80.00</span>
                      </div>
                    </div>
                  </div>
                  <hr/>
                </div>
              )})
          ): null}

      </div>
    </Col>
    </div>
  )
}

export default OrderDetail;
