/** @format */

import React from "react";
import { Layout, Row, Col } from "antd";
import Link from "next/link";

const { Footer } = Layout;

function AppFooter(props) {
  return (
    <Footer id="app-footer">
      <Row>
        <Col style={{ margin: "auto" }} xs={24} sm={24} md={24} lg={24} xl={24}>
          <Row>
            <Col
              className="app-footer-text"
              xs={24}
              sm={24}
              md={3}
              lg={3}
              xl={3}
            >
              <Link href="/AboutUs">
                <a>about us</a>
              </Link>
            </Col>
            <Col
              className="app-footer-text"
              xs={24}
              sm={24}
              md={3}
              lg={3}
              xl={3}
            >
              <Link href="/TermsOfUse">
                <a>Terms of use</a>
              </Link>
            </Col>
            <Col
              className="app-footer-text"
              xs={24}
              sm={24}
              md={3}
              lg={3}
              xl={3}
            >
              <Link href="/PrivacyPolicy">
                <a>Privacy policy</a>
              </Link>
            </Col>
            <Col
              className="app-footer-text"
              xs={24}
              sm={24}
              md={3}
              lg={3}
              xl={3}
            >
              <Link href="/FAQforwholesalebuyers">
                <a>Buyer faq</a>
              </Link>
            </Col>
            <Col
              className="app-footer-text"
              xs={24}
              sm={24}
              md={3}
              lg={3}
              xl={3}
            >
              <Link href="/promotionsFAQ">
                <a>Promotions FAQ</a>
              </Link>
            </Col>
            <Col xs={24} sm={24} md={9} lg={9} xl={9} className="footer-links">
              <span style={{ padding: "0px 5px" }}>
                <a href="https://facebook.com/QalaraGlobal/" target="_blank">
                  <svg
                    width="37"
                    height="37"
                    viewBox="0 0 37 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.06"
                      d="M0 15C0 6.71573 6.71573 0 15 0H21.3158C29.6001 0 36.3158 6.71573 36.3158 15V21.3158C36.3158 29.6001 29.6001 36.3158 21.3158 36.3158H15C6.71572 36.3158 0 29.6001 0 21.3158V15Z"
                      fill="white"
                    />
                    <path
                      d="M16.3345 24.2566H18.9144V18.0858H20.7234L20.9013 16.0195H18.9144C18.9144 16.0195 18.9144 15.2552 18.9144 14.8306C18.9144 14.3494 19.0034 14.1513 19.5075 14.1513C19.8931 14.1513 20.9013 14.1513 20.9013 14.1513V12C20.9013 12 19.4186 12 19.122 12C17.1945 12 16.3345 12.8209 16.3345 14.3494C16.3345 15.7081 16.3345 15.9912 16.3345 15.9912H15V18.0858H16.3345V24.2566Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </span>
              <span style={{ padding: "0px 5px" }}>
                <a
                  href="https://www.instagram.com/qalaraglobal/"
                  target="_blank"
                >
                  <svg
                    width="38"
                    height="37"
                    viewBox="0 0 38 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.06"
                      d="M0.842163 15C0.842163 6.71573 7.55789 0 15.8422 0H22.158C30.4422 0 37.158 6.71573 37.158 15V21.3158C37.158 29.6001 30.4422 36.3158 22.158 36.3158H15.8422C7.55789 36.3158 0.842163 29.6001 0.842163 21.3158V15Z"
                      fill="white"
                    />
                    <path
                      d="M22.0219 14.2537C21.884 14.2537 21.7493 14.2961 21.6346 14.3755C21.52 14.4549 21.4307 14.5678 21.3779 14.6999C21.3252 14.8319 21.3114 14.9773 21.3383 15.1175C21.3652 15.2577 21.4315 15.3865 21.529 15.4875C21.6265 15.5886 21.7507 15.6575 21.8859 15.6854C22.0211 15.7133 22.1612 15.6989 22.2886 15.6442C22.4159 15.5895 22.5248 15.4969 22.6014 15.378C22.678 15.2592 22.7189 15.1194 22.7189 14.9765C22.7189 14.7848 22.6454 14.6009 22.5147 14.4654C22.384 14.3298 22.2067 14.2537 22.0219 14.2537ZM18.9314 15.1781C18.3539 15.1781 17.7894 15.3557 17.3092 15.6884C16.8291 16.0212 16.4548 16.4941 16.2339 17.0474C16.0129 17.6007 15.9551 18.2095 16.0679 18.7968C16.1806 19.3842 16.4587 19.9237 16.8671 20.3471C17.2755 20.7705 17.7958 21.0588 18.3622 21.1756C18.9286 21.2923 19.5157 21.2323 20.0492 21.003C20.5827 20.7737 21.0386 20.3855 21.3594 19.8875C21.6801 19.3895 21.8512 18.804 21.8511 18.2052C21.8502 17.4025 21.5422 16.633 20.9949 16.0655C20.4475 15.498 19.7054 15.1789 18.9314 15.1781ZM18.9314 20.1451C18.5614 20.1453 18.1996 20.0316 17.8919 19.8186C17.5842 19.6055 17.3443 19.3025 17.2026 18.9481C17.0609 18.5936 17.0237 18.2035 17.0958 17.8271C17.1679 17.4508 17.3461 17.105 17.6077 16.8337C17.8693 16.5623 18.2026 16.3774 18.5655 16.3025C18.9284 16.2276 19.3046 16.266 19.6464 16.4128C19.9883 16.5596 20.2805 16.8083 20.4861 17.1273C20.6917 17.4463 20.8014 17.8214 20.8014 18.2052C20.8009 18.7194 20.6037 19.2124 20.2531 19.5761C19.9026 19.9397 19.4273 20.1444 18.9314 20.1451ZM24.8231 15.6927C24.8231 15.2077 24.7309 14.7275 24.5519 14.2794C24.373 13.8314 24.1106 13.4242 23.7799 13.0813C23.4491 12.7384 23.0565 12.4664 22.6244 12.2809C22.1923 12.0954 21.7291 11.9999 21.2614 12H16.5616C16.0939 11.9999 15.6308 12.0954 15.1987 12.2809C14.7666 12.4664 14.374 12.7384 14.0432 13.0813C13.7125 13.4242 13.4501 13.8314 13.2711 14.2794C13.0921 14.7275 13 15.2077 13 15.6927V20.5673C13 21.0523 13.0921 21.5325 13.2711 21.9806C13.4501 22.4286 13.7125 22.8358 14.0432 23.1787C14.374 23.5216 14.7666 23.7936 15.1987 23.9791C15.6308 24.1646 16.0939 24.2601 16.5616 24.26H21.2614C21.7291 24.2601 22.1923 24.1646 22.6244 23.9791C23.0565 23.7936 23.4491 23.5216 23.7799 23.1787C24.1106 22.8358 24.373 22.4286 24.5519 21.9806C24.7309 21.5325 24.8231 21.0523 24.8231 20.5673V15.6927ZM23.7079 20.5673C23.7079 21.2399 23.4502 21.885 22.9915 22.3607C22.5329 22.8363 21.9108 23.1035 21.2621 23.1035H16.5616C16.2404 23.1036 15.9223 23.0381 15.6255 22.9107C15.3287 22.7833 15.059 22.5965 14.8318 22.3609C14.6046 22.1254 14.4244 21.8458 14.3014 21.538C14.1785 21.2303 14.1152 20.9004 14.1152 20.5673V15.6927C14.1152 15.3596 14.1785 15.0297 14.3014 14.722C14.4244 14.4142 14.6046 14.1346 14.8318 13.8991C15.059 13.6635 15.3287 13.4767 15.6255 13.3493C15.9223 13.2219 16.2404 13.1564 16.5616 13.1565H21.2614C21.9101 13.1565 22.5322 13.4237 22.9908 13.8993C23.4495 14.375 23.7072 15.0201 23.7072 15.6927L23.7079 20.5673Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </span>
              <span style={{ padding: "0px 5px" }}>
                <a
                  href="https://in.linkedin.com/company/qalara"
                  target="_blank"
                >
                  <svg
                    width="37"
                    height="37"
                    viewBox="0 0 37 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.06"
                      d="M0.684204 15C0.684204 6.71573 7.39993 0 15.6842 0H22C30.2843 0 37 6.71573 37 15V21.3158C37 29.6001 30.2843 36.3158 22 36.3158H15.6842C7.39993 36.3158 0.684204 29.6001 0.684204 21.3158V15Z"
                      fill="white"
                    />
                    <path
                      d="M25.6128 19.3592V23.7998C25.6128 23.8525 25.5919 23.9031 25.5545 23.9404C25.5172 23.9778 25.4665 23.9989 25.4136 23.9991H23.1103C23.0574 23.9989 23.0067 23.9778 22.9694 23.9404C22.932 23.9031 22.9111 23.8525 22.9111 23.7998V19.6718C22.9111 18.5854 22.5214 17.8424 21.5439 17.8424C20.7981 17.8424 20.3547 18.3421 20.159 18.8261C20.09 19.0376 20.0602 19.2599 20.0709 19.4821V23.8015C20.0707 23.8542 20.0495 23.9047 20.012 23.9419C19.9745 23.9791 19.9237 24 19.8708 24H17.5701C17.5439 24.0001 17.5179 23.9951 17.4937 23.9851C17.4695 23.9752 17.4475 23.9606 17.429 23.9421C17.4104 23.9237 17.3958 23.9017 17.3858 23.8776C17.3758 23.8535 17.3708 23.8276 17.3709 23.8015C17.3762 22.7019 17.3991 17.3655 17.3709 16.1113C17.3704 16.085 17.3752 16.0588 17.385 16.0344C17.3948 16.0099 17.4095 15.9877 17.428 15.969C17.4466 15.9502 17.4687 15.9354 17.4931 15.9253C17.5175 15.9152 17.5437 15.91 17.5701 15.9102H19.8664C19.9192 15.9102 19.9699 15.9311 20.0073 15.9683C20.0446 16.0055 20.0656 16.056 20.0656 16.1087V17.0563C20.0603 17.066 20.0524 17.0748 20.048 17.0827H20.0656V17.0563C20.4244 16.5065 21.0643 15.7205 22.4985 15.7205C24.2747 15.7205 25.6067 16.8763 25.6067 19.3609L25.6128 19.3592ZM13.3777 23.9991H15.6775C15.7304 23.9989 15.7811 23.9778 15.8184 23.9404C15.8558 23.9031 15.8767 23.8525 15.8767 23.7998V16.1069C15.8767 16.0543 15.8558 16.0038 15.8184 15.9665C15.781 15.9293 15.7304 15.9084 15.6775 15.9084H13.3777C13.3248 15.9084 13.274 15.9293 13.2365 15.9665C13.199 16.0037 13.1778 16.0542 13.1776 16.1069V23.7998C13.1776 23.8526 13.1987 23.9033 13.2362 23.9407C13.2737 23.9781 13.3246 23.9991 13.3777 23.9991Z"
                      fill="white"
                    />
                    <path
                      d="M14.4448 14.8789C15.2427 14.8789 15.8895 14.2345 15.8895 13.4395C15.8895 12.6445 15.2427 12 14.4448 12C13.6468 12 13 12.6445 13 13.4395C13 14.2345 13.6468 14.8789 14.4448 14.8789Z"
                      fill="white"
                    />
                  </svg>
                </a>
              </span>
            </Col>
          </Row>
        </Col>
        <Col
          className="app-footer-social"
          xs={0}
          sm={0}
          md={4}
          lg={4}
          xl={4}
        ></Col>
      </Row>
      <div className="app-footer-copyright">
        QALARA.COM IS OWNED BY MESINDUS VENTURES PRIVATE LIMITED
      </div>
    </Footer>
  );
}

export default AppFooter;
