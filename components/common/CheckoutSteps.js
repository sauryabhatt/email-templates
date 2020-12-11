/** @format */

import React from "react";
import { Row, Col } from "antd";
import { useRouter } from "next/router";

function CheckoutSteps(props) {
  let { pageId = "" } = props;
  const mediaMatch = window.matchMedia("(min-width: 1024px)");
  const router = useRouter();

  const redirectToCart = () => {
    if (pageId !== "cart") {
      router.push("/cart");
    }
  };

  const redirectToShipping = () => {
    if (pageId !== "cart" && pageId !== "shipping") {
      router.push("/shipping");
    }
  };

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
      {mediaMatch.matches ? (
        <Row className="qa-mar-btm-2">
          <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
          <Col xs={24} sm={24} md={20} lg={20} xl={20}>
            <div className="qa-cart-steps ant-steps-small cart-border-bottom qa-pad-btm-1">
              <div
                className={
                  pageId === "cart"
                    ? "ant-steps-item-process qa-disp-inline"
                    : "qa-disp-inline qa-cursor"
                }
                onClick={redirectToCart}
              >
                <div className="ant-steps-item-icon">
                  <span className="ant-steps-icon">1</span>
                </div>
                <div className="ant-steps-item-content">
                  <div className="qa-ant-steps-item-title">Cart</div>
                </div>
                <div className="qa-disp-tc qa-pad-rgt-1 qa-pad-lft-1">
                  <svg
                    width="25"
                    height="8"
                    viewBox="0 0 18 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                      fill="rgba(25, 25, 25, 0.45)"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={
                  pageId === "shipping"
                    ? "ant-steps-item-process qa-disp-inline"
                    : pageId === "payment"
                    ? "qa-disp-inline qa-cursor"
                    : "qa-disp-inline"
                }
                onClick={redirectToShipping}
              >
                <div className="ant-steps-item-icon">
                  <span className="ant-steps-icon">2</span>
                </div>
                <div className="ant-steps-item-content">
                  <div className="qa-ant-steps-item-title">Shipping</div>
                </div>
                <div className="qa-disp-tc qa-pad-rgt-1 qa-pad-lft-1 ">
                  <svg
                    width="25"
                    height="8"
                    viewBox="0 0 18 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                      fill="rgba(25, 25, 25, 0.45)"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={
                  pageId === "payment"
                    ? "ant-steps-item-process qa-disp-inline"
                    : "qa-disp-inline"
                }
              >
                <div className="ant-steps-item-icon">
                  <span className="ant-steps-icon">3</span>
                </div>
                <div className="ant-steps-item-content">
                  <div className="qa-ant-steps-item-title">Payment</div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
        </Row>
      ) : (
        <Row className="qa-mar-2 qa-pad-btm-05 cart-border-bottom">
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <div className="qa-cart-steps ant-steps-small qa-txt-alg-cnt">
              <div
                className={
                  pageId === "cart"
                    ? "ant-steps-item-process qa-disp-inline qa-txt-alg-cnt"
                    : "qa-disp-inline qa-txt-alg-cnt"
                }
                onClick={redirectToCart}
              >
                <div className="ant-steps-item-icon">
                  <span className="ant-steps-icon">1</span>
                </div>
                <div className="ant-steps-item-content qa-disp-block">
                  <div className="qa-ant-steps-item-title">Cart</div>
                </div>
              </div>
              <div className="qa-disp-ta">
                <svg
                  width="25"
                  height="8"
                  viewBox="0 0 18 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                    fill="rgba(25, 25, 25, 0.45)"
                  />
                </svg>
              </div>
              <div
                className={
                  pageId === "shipping"
                    ? "ant-steps-item-process qa-disp-inline qa-txt-alg-cnt"
                    : "qa-disp-inline qa-txt-alg-cnt"
                }
                onClick={redirectToShipping}
              >
                <div className="ant-steps-item-icon">
                  <span className="ant-steps-icon">2</span>
                </div>
                <div className="ant-steps-item-content qa-disp-block">
                  <div className="qa-ant-steps-item-title">Shipping</div>
                </div>
              </div>
              <div className="qa-disp-ta">
                <svg
                  width="25"
                  height="8"
                  viewBox="0 0 18 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.4964 4.35355C17.6917 4.15829 17.6917 3.84171 17.4964 3.64645L14.3144 0.464467C14.1192 0.269205 13.8026 0.269205 13.6073 0.464467C13.4121 0.659729 13.4121 0.976312 13.6073 1.17157L16.4357 4L13.6073 6.82843C13.4121 7.02369 13.4121 7.34027 13.6073 7.53554C13.8026 7.7308 14.1192 7.7308 14.3144 7.53554L17.4964 4.35355ZM-4.37114e-08 4.5L17.1429 4.5L17.1429 3.5L4.37114e-08 3.5L-4.37114e-08 4.5Z"
                    fill="rgba(25, 25, 25, 0.45)"
                  />
                </svg>
              </div>
              <div
                className={
                  pageId === "payment"
                    ? "ant-steps-item-process qa-disp-inline qa-txt-alg-cnt"
                    : "qa-disp-inline qa-txt-alg-cnt"
                }
              >
                <div className="ant-steps-item-icon">
                  <span className="ant-steps-icon">3</span>
                </div>
                <div className="ant-steps-item-content qa-disp-block">
                  <div className="qa-ant-steps-item-title">Payment</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      )}
    </Col>
  );
}

export default CheckoutSteps;
