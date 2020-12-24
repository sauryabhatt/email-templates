/** @format */

import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { useRouter } from "next/router";

function PaymentBanner(props) {
  const router = useRouter();

  let mediaMatch = undefined;
  const handleSignUp = () => {
    //  router.push("/request-for-quote");
    props.showRFQ();
  };

  useEffect(() => {
    mediaMatch = window.matchMedia("(min-width: 768px)");
  }, []);
  return (
    <div id="payment-banner">
      {/* <div className='bird-vector' /> */}
      {/* <div className='bird-shape'/> */}
      <span className="heading">
        <h5>Why us?</h5>

        <p className="paragraph-points">
          Zero commission promotional offer
          <br />
          25,000+ products from verified suppliers
          <br />
          One-stop-shop from design to delivery
          <br />
          Secure payments & lowest shipping costs
          <br />
          Based in India, with worldwide reach
        </p>
        {/*<p className="paragraph">
          Get early access by sending a <b>request for quote</b> for your
          sourcing needs.
          <br />
          Limited time launch offers on shipping and services!
        </p>*/}
        <div className="payment-banner-home-page">
          <Button
            className="send-query-button invite-access-button"
            disabled={false}
            onClick={() => {
              handleSignUp();
            }}
          >
            <div className="send-query-button-text qa-buyer-button qa-payment">
              REQUEST FOR QUOTE
            </div>
          </Button>
        </div>

        <div
          className="qa-font-san qa-fs-12 qa-tc-white qa-mar-top-05"
          style={{ lineHeight: "initial" }}
        >
          Your wholesale shopping assistant
        </div>
      </span>
      {props.children}
    </div>
  );
}

export default connect(null, null)(PaymentBanner);
