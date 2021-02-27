/** @format */

import React, { useEffect } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";

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
          35,000+ products from verified suppliers
          <br />
          Air and Sea delivery to 100+ countries
          <br />
          Secure payments in major global currencies
          <br />
          We quality inspect all goods before dispatch
          <br />
          One-stop-shop from design to delivery
          <br />
          Zero commission promotional offer
        </p>
        {/*<p className="paragraph">
          Get early access by sending a <b>request for quote</b> for your
          sourcing needs.
          <br />
          Limited time launch offers on shipping and services!
        </p>*/}
        <div className="payment-banner-home-page">
          <Button
            className="send-query-button secondary-btn"
            // onClick={() => {
            //   router.push("/FAQforwholesalebuyers");
            // }}
          >
            <Link href="/FAQforwholesalebuyers">
              <a target="_blank">
                <div className="send-query-button-text qa-buyer-button qa-payment">
                  FREQUENTLY ASKED QUESTIONS
                </div>
              </a>
            </Link>
          </Button>
          <Button
            className="send-query-button"
            // onClick={() => {
            //   router.push("/AboutUs");
            // }}
          >
            <Link href="/AboutUs">
              <a target="_blank">
                <div className="send-query-button-text qa-buyer-button qa-payment">
                  KNOW MORE ABOUT US
                </div>
              </a>
            </Link>
          </Button>
        </div>

        {/* <div
          className="qa-font-san qa-fs-12 qa-tc-white qa-mar-top-05"
          style={{ lineHeight: "initial" }}
        >
          Your wholesale shopping assistant
        </div> */}
      </span>
      {props.children}
    </div>
  );
}

export default connect(null, null)(PaymentBanner);
