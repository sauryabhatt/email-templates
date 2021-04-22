/** @format */

import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import Link from "next/link";
import Icon from "@ant-design/icons";
import Carousel from "../CuratedByUs/Carousel";
import { enquireScreen } from "enquire-js";
import NewsCarousel from "./NewsCarousel";
import SoundIcon from "../../public/filestore/soundIcon";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

function AboutUsWrapper() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    enquireScreen((status) => setIsMobile(status));
  }, []);

  const values = [
    {
      url: "/sellers/all-categories?f_values=ORGANIC",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values1.jpg",
      text: "Organic",
      alt: "Explore selection of organic products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=ECO_FRIENDLY",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values2.jpg",
      text: "Ecofriendly",
      alt: "Explore selection of eco friendly  products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=FAIR_TRADE",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values3.jpg",
      text: "Fair & social",
      alt: "Explore our selection of fair and social products  by Qalara",
    },
    {
      text: "Sustainable",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values5.jpg",
      url: "/sellers/all-categories?f_values=SUSTAINABLE",
      alt: " Explore selection of sustainable products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=ARTISANAL",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values6.jpg",
      text: "Artisanal",
      alt: "Explore our selection of artisanal products  by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=RECYCLED",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values4.jpg",
      text: "Recycled",
      alt: " Explore selection of recycled products  by Qalara",
    },
  ];

  const [values_new, setValuesNew] = useState(values);

  let url = process.env.NEXT_PUBLIC_URL + "/qalara-sound.mp3";
  const [playing, toggle] = useAudio(url);

  return (
    <div id="aboutus">
      <div id="aboutus-banner" style={{ marginTop: "-70px" }}>
        <span className="banner-text">
          About us
          {/* <p className="banner-text-small">
            Reimagining the global supply chain for conscious goods.
          </p> */}
        </span>
      </div>
      <div id="aboutus-body-parent">
        <div className="landing-container">
          {isMobile && (
            <h2 className="section-heading after">Our philosophy</h2>
          )}
          <Row className="aboutus-container">
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <img
                className="aboutus-img1"
                src={
                  process.env.NEXT_PUBLIC_REACT_APP_CDN_URL +
                  "/images/Img_AboutUs_Philosophy.jpg"
                }
              ></img>
            </Col>
            <Col xs={24} sm={24} md={24} lg={16} xl={16}>
              <div>
                {!isMobile && (
                  <h2 className="section-heading after">Our philosophy</h2>
                )}
                <div
                  className={
                    isMobile
                      ? "section-content qa-mar-top-2"
                      : "section-content"
                  }
                >
                  <p>
                    Our vision is for Qalara and its partners to become pivotal
                    to driving sustainable consumption around the world by
                    reimagining the global supply chain. Every day we strive to
                    build a reliable and efficient ecosystem of global trade,
                    facilitating digitally enabled wholesale commerce between
                    buyers and sellers from around the world.
                  </p>
                  <p>
                    Our mission is to make available the widest range of
                    responsibly produced goods across all consumer categories
                    from South Asia and South East Asia at competitive wholesale
                    prices, helping buyers of all sizes source conveniently,
                    reliably and affordably, while equally supporting producers
                    and manufacturers gain access to global markets efficiently.
                    We specialise in handmade, artisanal, eco-friendly,
                    recycled, organic, sustainable products, but have the
                    capabilities to extend well beyond.
                  </p>
                  <p>
                    We enjoy working with people across geographies and
                    cultures. We strive to do right by the planet. We are
                    passionate about artisanal crafts. We believe in leveraging
                    data and technology in simple but powerful ways. And, we are
                    committed to operational excellence.
                  </p>
                  <p className="highlight-text">
                    Digitally. Reliably. Affordably. Responsibly.
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          <div className="aboutus-container center-align-container">
            {isMobile && <div className="line-divider"></div>}
            <h2
              className={
                isMobile
                  ? "section-heading qalara-heading"
                  : "section-heading after"
              }
            >
              Why the name "Qalara"{isMobile && <br></br>} (kuh-laa-raa)?
              <div
                className="qa-cursor qa-mar-lft qa-disp-inline"
                onClick={toggle}
              >
                <Icon
                  component={SoundIcon}
                  style={{
                    height: "25px",
                    width: "25px",
                  }}
                ></Icon>
              </div>
            </h2>
            <p className="section-content center-align">
              Kala in Hindi means ‘a skilled craft’ while Ira stands for ‘Earth’
              in Sanskrit. We believe that these two combined form the essence
              of who we are - a celebration of human ingenuity and the immense
              possibilities and inspiration from nature.
            </p>
          </div>

          {!isMobile && (
            <Row className="aboutus-container">
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={12}
                xl={12}
                className="qa-pad-rgt-5"
              >
                <div>
                  <h2 className="section-heading before qa-txt-alg-rgt">
                    Our team
                  </h2>
                  <Row>
                    <Col
                      xs={12}
                      sm={12}
                      md={14}
                      lg={14}
                      xl={14}
                      className="aboutus-pr-1"
                    >
                      <div>
                        <video
                          muted
                          loop
                          autoPlay
                          controls={false}
                          width="100%"
                        >
                          <source
                            src={
                              process.env.NEXT_PUBLIC_URL +
                              "/Img_AboutUs_Team1.mp4"
                            }
                            type="video/mp4"
                          />
                          Your browser does not support HTML5 video.
                        </video>
                      </div>
                    </Col>
                    <Col
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                      xl={10}
                      className="aboutus-pl-1"
                    >
                      <div className="aspect-ratio-box abtus-img-team">
                        <img
                          className="aboutus-full"
                          src={
                            process.env.NEXT_PUBLIC_REACT_APP_CDN_URL +
                            "/images/Img_AboutUs_Team.jpg"
                          }
                        ></img>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={10}
                      sm={10}
                      md={8}
                      lg={8}
                      xl={8}
                      className="aboutus-pr-1"
                    >
                      <div className="aspect-ratio-box abtus-img-aditi">
                        <img
                          className="aboutus-full"
                          src={
                            process.env.NEXT_PUBLIC_REACT_APP_CDN_URL +
                            "/images/Img_AboutUs_Aditi.jpg"
                          }
                        ></img>
                      </div>
                    </Col>
                    <Col
                      xs={14}
                      sm={14}
                      md={16}
                      lg={16}
                      xl={16}
                      className="aboutus-pl-1"
                    >
                      <div>
                        <video
                          muted
                          loop
                          autoPlay
                          controls={false}
                          width="100%"
                        >
                          <source
                            src={
                              process.env.NEXT_PUBLIC_URL +
                              "/Img_AboutUs_Team2.mp4"
                            }
                            type="video/mp4"
                          />
                          Your browser does not support HTML5 video.
                        </video>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <div className="section-content mr-top-6">
                  <p>
                    Qalara is founded by Aditi Pany, an MBA graduate from
                    Stanford University, with close to a decade of experience in
                    lifestyle retail across both brick and mortar and ecommerce,
                    working with India's largest retailer. In her last stint,
                    Aditi was the Chief Operating Officer of AJIO.com, a leading
                    fashion ecommerce company in India. Previously, Aditi worked
                    at Ashoka, a global non-profit that supports the world’s
                    largest network of social entrepreneurs with innovative
                    ideas to change their community. Aditi has also been a Board
                    Member of RLHL which manages companies like Hamleys in
                    India.
                  </p>
                  <p>
                    Qalara is additionally led by a team of seasoned
                    entrepreneurial, passionate leaders with strong track record
                    and decades of experience in sourcing, merchandising,
                    product design & development, supply chain and technology,
                    with leading global companies like Amazon, Target, DHL
                    Global, Flipkart, and more.
                  </p>
                  <div className="highlight-text">
                    “Qalara is a powerful combination of a strong mission-driven
                    experienced team venture and the digital & supply chain
                    ecosystem of a Fortune 100 company”
                    <div className="qa-mar-top-1">-Aditi</div>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {isMobile && (
            <Row className="aboutus-container center-align-container">
              <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                <div className="line-divider"></div>
                <h2 className="section-heading">Our team</h2>
                <div className="section-content">
                  <p>
                    Qalara is founded by Aditi Pany, an MBA graduate from
                    Stanford University, with close to a decade of experience in
                    lifestyle retail across both brick and mortar and ecommerce,
                    working with India's largest retailer. In her last stint,
                    Aditi was the Chief Operating Officer of AJIO.com, a leading
                    fashion ecommerce company in India. Previously, Aditi worked
                    at Ashoka, a global non-profit that supports the world’s
                    largest network of social entrepreneurs with innovative
                    ideas to change their community. Aditi has also been a Board
                    Member of RLHL which manages companies like Hamleys in
                    India.
                  </p>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                <div>
                  <Row>
                    <Col
                      xs={14}
                      sm={14}
                      md={14}
                      lg={14}
                      xl={14}
                      className="aboutus-pr-1"
                    >
                      <video muted loop autoPlay controls={false} width="100%">
                        <source
                          src={
                            process.env.NEXT_PUBLIC_URL +
                            "/Img_AboutUs_Team1.mp4"
                          }
                          type="video/mp4"
                        />
                        Your browser does not support HTML5 video.
                      </video>
                    </Col>
                    <Col
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                      xl={10}
                      className="aboutus-pl-1"
                    >
                      <div className="aspect-ratio-box abtus-img-team">
                        <img
                          className="aboutus-full"
                          src={
                            process.env.NEXT_PUBLIC_REACT_APP_CDN_URL +
                            "/images/Img_AboutUs_Team.jpg"
                          }
                        ></img>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={10}
                      sm={10}
                      md={8}
                      lg={8}
                      xl={8}
                      className="aboutus-pr-1"
                    >
                      <div className="aspect-ratio-box abtus-img-aditi">
                        <img
                          className="aboutus-full"
                          src={
                            process.env.NEXT_PUBLIC_REACT_APP_CDN_URL +
                            "/images/Team-Aditi-mob.jpg"
                          }
                        ></img>
                      </div>
                    </Col>
                    <Col
                      xs={14}
                      sm={14}
                      md={16}
                      lg={16}
                      xl={16}
                      className="aboutus-pl-1"
                    >
                      <video muted loop autoPlay controls={false} width="100%">
                        <source
                          src={
                            process.env.NEXT_PUBLIC_URL +
                            "/Img_AboutUs_Team2.mp4"
                          }
                          type="video/mp4"
                        />
                        Your browser does not support HTML5 video.
                      </video>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs={24} sm={24} md={24} lg={0} xl={0}>
                <div className="section-content qa-mar-top-2">
                  <p>
                    Qalara is additionally led by a team of seasoned
                    entrepreneurial, passionate leaders with strong track record
                    and decades of experience in sourcing, merchandising,
                    product design & development, supply chain and technology,
                    with leading global companies like Amazon, Target, DHL
                    Global, Flipkart, and more.
                  </p>
                  <div className="highlight-text">
                    “Qalara is a powerful combination of a strong mission-driven
                    experienced team venture and the digital & supply chain
                    ecosystem of a Fortune 100 company”
                    <div className="qa-mar-top-1">-Aditi</div>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {!isMobile && (
            <Row className="aboutus-container">
              <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
              <Col
                xs={24}
                sm={24}
                md={10}
                lg={10}
                xl={10}
                className="qa-pad-rgt-100 qa-mar-top-25"
              >
                <div className="fortune-head qa-mar-top-4 qa-mar-btm-4">
                  An entity of a fortune 100 company
                </div>
                <div className="qa-flex-row qa-font-san qa-mar-top-3">
                  <div>
                    <span className="about-status">35000+</span>
                    <br></br>
                    products
                  </div>
                  <div>
                    <span className="about-status">500+</span>
                    <br></br>vendors
                  </div>
                  <div>
                    <span className="about-status">80+</span>
                    <br></br>countries
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <h2 className="section-heading after">Our credentials</h2>
                <div className="section-content">
                  <p>
                    Qalara is backed by Reliance Industries, a USD 100 bn Indian
                    conglomerate spanning Telecom, Retail, Energy and Consumer
                    Technology applications and more! Reliance services over 400
                    mn customers in India alone, and is India's largest exporter
                    contributing to nearly 10% of India's total exports.
                  </p>
                  <p>
                    Reliance also has in its luxury retail portfolio in India,
                    some of the world’s most prominent fashion brands like
                    Diesel, Hugo Boss, Armani, Marks & Spencer, Muji, West Elm,
                    Pottery Barn, GAS, Tiffany, Canali, Burberry, Kate Spade,
                    Mothercare, Zegna, Ferragamo, Tumi and many more! Reliance
                    has also recently seen investments from leading global
                    companies like Google, Facebook and several others towards
                    its new age digital initiatives.
                  </p>
                  <p>
                    The Board of Directors of Qalara comprises eminent leaders
                    in Retail, Operations and Finance having built and scaled
                    multiple billion-dollar businesses across industries.
                  </p>
                </div>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
            </Row>
          )}

          {isMobile && (
            <Row className="aboutus-container center-align-container">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <div className="line-divider"></div>
                <h2 className="section-heading">Our credentials</h2>
                <div className="section-content">
                  <p>
                    Qalara is backed by Reliance Industries, a USD 100 bn Indian
                    conglomerate spanning Telecom, Retail, Energy and Consumer
                    Technology applications and more! Reliance services over 400
                    mn customers in India alone, and is India's largest exporter
                    contributing to nearly 10% of India's total exports.
                  </p>
                  <p>
                    Reliance also has in its luxury retail portfolio in India,
                    some of the world’s most prominent fashion brands like
                    Diesel, Hugo Boss, Armani, Marks & Spencer, Muji, West Elm,
                    Pottery Barn, GAS, Tiffany, Canali, Burberry, Kate Spade,
                    Mothercare, Zegna, Ferragamo, Tumi and many more! Reliance
                    has also recently seen investments from leading global
                    companies like Google, Facebook and several others towards
                    its new age digital initiatives.
                  </p>
                  <p>
                    The Board of Directors of Qalara comprises eminent leaders
                    in Retail, Operations and Finance having built and scaled
                    multiple billion-dollar businesses across industries.
                  </p>
                </div>
              </Col>
              <Col
                xs={24}
                sm={24}
                md={24}
                lg={10}
                xl={10}
                className="qa-pad-rgt-100 qa-mar-top-1"
              >
                <div className="fortune-head">
                  An entity of a fortune 100 company
                </div>
                <div className="qa-flex-row qa-font-san qa-mar-top-3">
                  <div>
                    <span className="about-status">35000+</span>
                    <br></br>
                    products
                  </div>
                  <div>
                    <span className="about-status">500+</span>
                    <br></br>vendors
                  </div>
                  <div>
                    <span className="about-status">80+</span>
                    <br></br>countries
                  </div>
                </div>
              </Col>
            </Row>
          )}

          <div className="aboutus-container news-section">
            <NewsCarousel />
          </div>

          <div className="aboutus-container center-align-container core-value">
            <div>
              {isMobile && <div className="line-divider"></div>}
              {isMobile ? (
                <h2
                  className={
                    isMobile ? "section-heading" : "section-heading after"
                  }
                >
                  Our values
                </h2>
              ) : (
                <h2 className="section-heading before">
                  Our core product values
                </h2>
              )}
              <p
                className={
                  isMobile
                    ? "section-content center-align"
                    : "section-content center-align core-value"
                }
              >
                We have great respect for the skill and craftsmanship behind the
                products on Qalara. We believe we have a responsibility towards
                our planet, and try to do our bit. We strive to work with
                like-minded responsible and ethical partners.
              </p>
            </div>

            <Carousel
              updateArray={setValuesNew}
              carouselContent={values_new}
              pageId="about-us"
            />
          </div>

          {!isMobile && (
            <Row className="aboutus-container">
              <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
              <Col
                xs={24}
                sm={24}
                md={9}
                lg={9}
                xl={9}
                className="aboutus-svg-bg"
              >
                <div className="about-whyus">
                  <b>35,000+</b> products from verified suppliers<br></br> Air
                  and Sea delivery to <b>100+ countries</b>
                  <br></br> Secure payments in major global currencies<br></br>
                  Quality Inspection included for all goods<br></br>
                  One-stop-shop from design to delivery<br></br> Minimum order
                  value starting <b>as low as USD 250</b>
                </div>
                <div className="about-status qa-txt-alg-cnt qa-mar-top-1">
                  -try us out!
                </div>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <h2 className="section-heading after">Why us</h2>
                <div className="section-content">
                  <p>
                    We cater to all types of wholesale buying and sourcing
                    requirements, and believe in long-term relationships.
                    Tapping into the rich tradition, culture, natural resources
                    and expertise of India, Sri Lanka, Thailand, Indonesia,
                    Vietnam, and neighbouring countries, we curate sellers and
                    their products based on our brand values. We quality inspect
                    all orders before they are shipped, monitor production for
                    custom orders, arrange for custom packaging, compute the
                    best shipping mode and cost combination, manage
                    documentation, facilitate secure payments and ensure safe
                    door delivery across the world. And we seek to get better
                    with every order.
                  </p>
                  <div
                    className={
                      isMobile
                        ? "aboutus-btn"
                        : "aboutus-btn qa-vertical-center"
                    }
                  >
                    <Link href="/products/all-categories">
                      <div className="button qa-primary-btn">
                        <span className="sign-up-text">SHOP BY PRODUCTS</span>
                      </div>
                    </Link>

                    <Link href="/sellers/all-categories">
                      <span className="button qa-secondary-btn">
                        <span className="sign-up-text">SHOP BY SELLERS</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </Col>
              <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
            </Row>
          )}

          {isMobile && (
            <Row className="aboutus-container center-align-container qa-mar-top-3">
              <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                <div className="line-divider"></div>
                <h2 className="section-heading">Why us</h2>
                <div className="aboutus-svg-bg">
                  <div className="about-whyus qa-mar-btm-2">
                    <b>35,000+</b> products from verified suppliers<br></br> Air
                    and Sea delivery to <b>100+ countries</b>
                    <br></br> Secure payments in major global currencies
                    <br></br>
                    Quality Inspection included for all goods<br></br>
                    One-stop-shop from design to delivery<br></br> Minimum order
                    value starting <b>as low as USD 250</b>
                    <span className="about-status"> -try us out!</span>
                  </div>
                </div>
              </Col>

              <Col xs={24} sm={24} md={24} lg={10} xl={10}>
                <div className="section-content qa-mar-top-2">
                  <p>
                    We cater to all types of wholesale buying and sourcing
                    requirements, and believe in long-term relationships.
                    Tapping into the rich tradition, culture, natural resources
                    and expertise of India, Sri Lanka, Thailand, Indonesia,
                    Vietnam, and neighbouring countries, we curate sellers and
                    their products based on our brand values. We quality inspect
                    all orders before they are shipped, monitor production for
                    custom orders, arrange for custom packaging, compute the
                    best shipping mode and cost combination, manage
                    documentation, facilitate secure payments and ensure safe
                    door delivery across the world. And we seek to get better
                    with every order.
                  </p>
                  <div
                    className={
                      isMobile
                        ? "aboutus-btn"
                        : "aboutus-btn qa-vertical-center"
                    }
                  >
                    <Link href="/products/all-categories">
                      <div className="button qa-primary-btn">
                        <span className="sign-up-text">SHOP BY PRODUCTS</span>
                      </div>
                    </Link>

                    <Link href="/sellers/all-categories">
                      <span className="button qa-secondary-btn">
                        <span className="sign-up-text">SHOP BY SELLERS</span>
                      </span>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {!isMobile && (
            <Row className="aboutus-container">
              <Col
                xs={24}
                sm={24}
                md={15}
                lg={15}
                xl={15}
                className="qa-pad-rgt-2"
              >
                <h2 className="section-heading before qa-txt-alg-rgt">
                  How we work
                </h2>
                <div className="qa-flex-row qa-font-san qa-mar-top-3">
                  <div className="aboutus-mr">
                    <span className="aboutus-step-num">1</span>
                  </div>
                  <div>
                    <div className="wework">Ready to ship</div>
                    <p className="aboutus-detail">
                      These are products for which inventory is readily
                      available with the supplier and are generally dispatched
                      within 10-14 days of the order confirmation, after being
                      quality inspected by Qalara. Many of these products are
                      fast moving and can run out of stock!
                    </p>
                  </div>
                </div>
                <div className="qa-flex-row qa-font-san qa-mar-top-3">
                  <div className="aboutus-mr">
                    <span className="aboutus-step-num">2</span>
                  </div>
                  <div>
                    <div className="wework">Express custom</div>
                    <p className="aboutus-detail">
                      These are products that don’t have ready inventory but can
                      be produced in small batches within 3-5 weeks. These are a
                      great alternative to ready stock and many hard goods are
                      able to meet these requirements.
                    </p>
                  </div>
                </div>
                <div className="qa-flex-row qa-font-san qa-mar-top-3">
                  <div className="aboutus-mr">
                    <span className="aboutus-step-num">3</span>
                  </div>
                  <div>
                    <div className="wework">Made to order</div>
                    <p className="aboutus-detail">
                      These are manufactured on order with predefined Minimum
                      Order Quantities (MOQ) where suppliers need to procure raw
                      materials and undertake production. Such orders are
                      usually dispatched within 45-60 days of order
                      confirmation, but may take more or less time depending on
                      product specifications and quantities.
                    </p>
                  </div>
                </div>
                <div className="qa-flex-row qa-font-san qa-mar-top-3">
                  <div className="aboutus-mr">
                    <span className="aboutus-step-num">4</span>
                  </div>
                  <div>
                    <div className="wework">Design to order</div>
                    <p className="aboutus-detail">
                      Many of our suppliers can develop your own designs or
                      product ideas, subject to Minimum Order Quantities (MOQ).
                      Such orders usually require sample development, and entail
                      a longer process depending on product specifications and
                      quantities, and are usually shipped within 60-90 days.
                    </p>
                  </div>
                </div>
              </Col>
              <Col xs={24} sm={24} md={1} lg={1} xl={1}></Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <div className="highlight-text qa-fs-36 qa-mar-btm-4">
                  You can shop on Qalara in many different ways
                </div>
                <div className="qa-txt-alg-cnt">
                  <div className="qa-flex-row qa-font-san qa-mar-top-4">
                    <div className="aboutus-hw">
                      <div className="aboutus-step qa-fs-20">Step 1</div>
                      <div className="aboutus-step qa-fs-24 qa-mar-btm-1">
                        Browse products
                      </div>
                    </div>
                    <div className="aboutus-hw">
                      <div className="aboutus-step qa-fs-20">Step 2</div>
                      <div className="aboutus-step qa-fs-24 qa-mar-btm-1">
                        Confirm order
                      </div>
                    </div>
                  </div>
                  <div className="qa-flex-row qa-font-san qa-mar-top-3">
                    <div className="aboutus-hw">
                      <div className="aboutus-step qa-fs-20">Step 3</div>
                      <div className="aboutus-step qa-fs-24 qa-mar-btm-1">
                        Get updates
                      </div>
                    </div>
                    <div className="aboutus-hw">
                      <div className="aboutus-step qa-fs-20">Step 4</div>
                      <div className="aboutus-step qa-fs-24 qa-mar-btm-1">
                        Receive order
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="qa-txt-alg-cnt qa-mar-top-4">
                  <div className="aboutus-video">
                    WATCH OUR VIDEO STORY
                    <span className="qa-mar-lft">
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 8L0.5 15.7942L0.5 0.205771L14 8Z"
                          fill="#F9F7F2"
                        />
                      </svg>
                    </span>
                  </div>
                </div> */}

                <Link href="/FAQforwholesalebuyers">
                  <div className="qa-txt-alg-cnt qa-mar-top-3">
                    <span className="news-article">View FAQs</span>
                  </div>
                </Link>
              </Col>
            </Row>
          )}

          {isMobile && (
            <Row className="aboutus-container center-align-container qa-mar-top-3">
              <Col xs={24} sm={24} md={24} lg={15} xl={15}>
                <div className="line-divider"></div>
                <h2 className="section-heading">How we work</h2>
                <div className="qa-font-san qa-mar-top-3">
                  <div>
                    <div className="wework qa-mar-btm-05">Ready to ship</div>
                    <p className="aboutus-detail">
                      These are products for which inventory is readily
                      available with the supplier and are generally dispatched
                      within 10-14 days of the order confirmation, after being
                      quality inspected by Qalara. Many of these products are
                      fast moving and can run out of stock!
                    </p>
                  </div>
                </div>
                <div>
                  <div className="wework qa-mar-btm-05">Express custom</div>
                  <p className="aboutus-detail">
                    These are products that don’t have ready inventory but can
                    be produced in small batches within 3-5 weeks. These are a
                    great alternative to ready stock and many hard goods are
                    able to meet these requirements.
                  </p>
                </div>
                <div>
                  <div className="wework qa-mar-btm-05">Made to order</div>
                  <p className="aboutus-detail">
                    These are manufactured on order with predefined Minimum
                    Order Quantities (MOQ) where suppliers need to procure raw
                    materials and undertake production. Such orders are usually
                    dispatched within 45-60 days of order confirmation, but may
                    take more or less time depending on product specifications
                    and quantities.
                  </p>
                </div>
                <div>
                  <div className="wework qa-mar-btm-05">Design to order</div>
                  <p className="aboutus-detail">
                    Many of our suppliers can develop your own designs or
                    product ideas, subject to Minimum Order Quantities (MOQ).
                    Such orders usually require sample development, and entail a
                    longer process depending on product specifications and
                    quantities, and are usually shipped within 60-90 days.
                  </p>
                </div>
              </Col>
              <Col xs={0} sm={0} md={0} lg={1} xl={1}></Col>
              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <div className="highlight-text qa-fs-36 qa-mar-btm-2">
                  You can shop on Qalara in many different ways
                </div>
                <div className="qa-txt-alg-cnt">
                  <div className="qa-flex-row qa-font-san qa-mar-top-1">
                    <div className="aboutus-hw">
                      <div className="aboutus-step qa-fs-20">Step 1</div>
                      <div className="aboutus-step qa-fs-24">
                        Browse products
                      </div>
                    </div>
                    <div className="aboutus-hw">
                      <div className="aboutus-step qa-fs-20">Step 2</div>
                      <div className="aboutus-step qa-fs-24">Confirm order</div>
                    </div>
                  </div>
                  <div className="qa-flex-row qa-font-san qa-mar-top-1">
                    <div className="aboutus-hw">
                      <div className="aboutus-step qa-fs-20">Step 3</div>
                      <div className="aboutus-step qa-fs-24">Get updates</div>
                    </div>
                    <div className="aboutus-hw">
                      <div className="aboutus-step qa-fs-20">Step 4</div>
                      <div className="aboutus-step qa-fs-24">Receive order</div>
                    </div>
                  </div>
                </div>

                {/* <div className="qa-txt-alg-cnt qa-mar-top-4">
                  <div className="aboutus-video">
                    WATCH OUR VIDEO STORY
                    <span className="qa-mar-lft">
                      <svg
                        width="12"
                        height="10"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 8L0.5 15.7942L0.5 0.205771L14 8Z"
                          fill="#F9F7F2"
                        />
                      </svg>
                    </span>
                  </div>
                </div> */}

                <Link href="/FAQforwholesalebuyers">
                  <div className="qa-txt-alg-cnt qa-mar-top-2 qa-mar-btm-1">
                    <span className="news-article">View FAQs</span>
                  </div>
                </Link>
              </Col>
            </Row>
          )}

          <Row
            className={
              isMobile
                ? "aboutus-container center-align-container"
                : "aboutus-container"
            }
          >
            <Col xs={24} sm={24} md={24} lg={1} xl={1}>
              {isMobile && <div className="line-divider"></div>}
              {isMobile && <h2 className="section-heading">Contact us</h2>}
            </Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
              <div className="qa-txt-alg-cnt">
                <img
                  className="aboutus-full qa-mar-btm-2 india-map"
                  src={
                    process.env.NEXT_PUBLIC_REACT_APP_CDN_URL +
                    "/images/Img_AboutUs_IndiaMap.png"
                  }
                ></img>
              </div>
            </Col>
            <Col xs={0} sm={0} md={0} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
              {!isMobile && (
                <h2 className="section-heading after">Contact us</h2>
              )}
              <div className="section-content">
                <p>
                  Qalara is headquartered in Bengaluru, India with teams across
                  continents.
                </p>
                <p>
                  We would love to meet you, once we are past this global
                  crisis. Meanwhile, please write to us at{" "}
                  <span className="qa-primary-c">contact@qalara.com</span> for
                  any questions or just to say hi!
                </p>
                <p>
                  We are also hiring across teams – merchandising, business
                  development, QA, product management, UIUX design, category
                  management, digital marketing and supply chain. Write to us at{" "}
                  <span className="qa-primary-c">careers@qalara.com</span> with
                  a brief summary of your interests, and your resume and we will
                  revert if we find our interests match!
                </p>
              </div>
            </Col>
            <Col xs={0} sm={0} md={0} lg={1} xl={1}></Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default AboutUsWrapper;
