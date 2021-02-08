/** @format */

import React, { useState, useEffect } from "react";
import { Col, Row } from "antd";
import Link from "next/link";
import Icon from "@ant-design/icons";
import { useRouter } from "next/router";
import Carousel from "../CuratedByUs/Carousel";
import { useSelector } from "react-redux";
import { enquireScreen } from "enquire-js";
import AboutUsCarousel from "./AboutUsCrousel";
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
  const [visible, setVisible] = useState(false);
  const [successQueryVisible, setSuccessQueryVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    enquireScreen((status) => setIsMobile(status));
  }, []);

  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );
  const trend = [
    {
      url: "/trends/earthinspired",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend1.jpg",
      text: "Earth inspired",
      alt: "Source Earth Inspired products from India",
    },
    {
      url: "/trends/urbanjungle",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend2.jpg",
      text: "Urban jungle",
      alt:
        "Collection of wholesale handmade and sustainable products from Qalara",
    },
    {
      url: "/trends/globaltextures",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend3.jpg",
      text: "Crafted Boho",
      alt:
        "Boho cushion covers, rugs, throws, bags & decor; crafted by hand picked sellers, combining local crafts with modern aesthetics",
    },
    {
      url: "/trends/homeoffice",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend4.jpg",
      text: "Home office",
      alt:
        "Collection of home workspace by our artisanal and responsible sellers fro Qalara",
    },
    /*{
      url: "/trends/christmasspirit",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend5.jpg",
      text: "Holiday spirit",
      alt:
        "Explore holiday decorations perfect for any celebration from Qalara",
    },*/
    // {
    //   url: "/trends/sunkissed-spring21",
    //   img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend6.jpg",
    //   text: "Summer Pastels",
    //   alt: "Summer Pastels",
    // },
    {
      url: "/trends/indigoblues",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend8.jpg",
      text: "Indigo Blues",
      alt: "Indigo Blues",
    },
    {
      url: "/trends/play-and-learn",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL +
        "/images/Img_Play-learn.jpg",
      text: "Play and learn",
      alt: "Play and learn",
    },
  ];

  const category = [
    {
      url: "/categoryedit/kitchendining",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category1.jpg",
      text: "Kitchen & dining",
      alt: "Wholesale kitchenware and dinnerware products from Qalara",
    },
    {
      url: "/categoryedit/homedecor",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category2.jpg",
      text: "Home decor",
      alt: "Wholesale home accents & utilities from Qalara",
    },
    {
      url: "/categoryedit/furniture",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category3.jpg",
      text: "Furniture",
      alt: "Source collection of handpicked wholesale furniture from Qalara",
    },
    {
      url: "/categoryedit/homelinen",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category4.jpg",
      text: "Home linen",
      alt: "Wholesale furnishings & linens from Qalara",
    },
    {
      text: "Jewelry",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL +
        "/images/Img_Categorys5.jpg",
      url: "/categoryedit/jewelry",
      alt: "Explore jewelry handcrafted by Indian artisans from Qalara",
    },
    {
      text: "Fashion accessories",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category6.jpg",
      url: "/categoryedit/fashionaccessories",
      alt: "",
    },
    {
      text: "Stationery & novelty",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category7.jpg",
      url: "/categoryedit/stationery-novelty",
      alt: "",
    },
    {
      text: "Baby & kids",
      img:
        process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_BabyKids.jpg",
      url: "/categoryedit/baby-kids",
      alt: "",
    },
  ];

  const crafts = [
    {
      url: "/artisancrafts/carvingandinlay",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Craft1.jpg",
      text: "Carving & Inlay",
      alt:
        "Shop wholesale for unique products from our curated, responsible sellers ",
    },
    {
      url: "/artisancrafts/metalcrafts",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Craft2.jpg",
      text: "Metal crafts",
      alt: "Explore Qalara's curation of traditional crafts across South Asia",
    },
    {
      url: "/artisancrafts/basketry",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Craft3.jpg",
      text: "Basketry",
      alt: "Sustainable and eco-friendly handmade products curated by Qalara",
    },
    {
      url: "/artisancrafts/textileweaves",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Craft4.jpg",
      text: "Knots & Weaves",
      alt:
        "Shop wholesale textiles crafted in indigenous techniques from Qalara",
    },
  ];

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

  const [zoom_url, setZoomUrl] = useState(crafts[crafts.length - 1]);
  const [craft_new, setCraftNew] = useState(crafts);
  const [category_new, setCategoryNew] = useState(category);
  const [values_new, setValuesNew] = useState(values);

  let url = process.env.NEXT_PUBLIC_URL + "/qalara-sound.mp3";
  const [playing, toggle] = useAudio(url);

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
  };

  return (
    <div id="aboutus">
      <div id="aboutus-banner" style={{ marginTop: "-70px" }}>
        <span className="banner-text">
          About Qalara
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
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <img
                className="aboutus-img1"
                src={process.env.NEXT_PUBLIC_URL + "/vase.jpg"}
              ></img>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              <div className="qa-mar-top-2">
                {!isMobile && (
                  <h2 className="section-heading after">Our philosophy</h2>
                )}
                <div className="section-content">
                  <p>
                    Our vision is for Qalara and its partners to become pivotal
                    to driving sustainable and meaningful consumption around the
                    world, by reimagining the global supply chain for
                    consciously designed goods. Every day we strive to build a
                    stronger ecosystem of trust and accountability, facilitating
                    digitally enabled commerce between responsible buyers and
                    sellers, from all over the world.
                  </p>
                  <p>
                    Our mission is to make available the widest range of
                    artisanal, ecofriendly, organic, recycled products across
                    all consumer categories from South Asia and South East Asia
                    at competitive wholesale prices, helping buyers of all sizes
                    source conveniently, reliably and affordably, while equally
                    supporting producers and manufacturers gain access to global
                    markets efficiently.
                  </p>
                  <p>
                    We are passionate about artisanal crafts. We want to do
                    right by the planet. We enjoy working with people across
                    geographies and cultures. We believe in leveraging
                    technology in simple but powerful ways to empower us all.
                    And, we are committed to operational excellence.
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
              className={isMobile ? "section-heading" : "section-heading after"}
            >
              Why the name "Qalara"{isMobile && <br></br>} (kuh-laa-raa)?
              <span className="qa-cursor qa-mar-lft qa-va-m" onClick={toggle}>
                <Icon
                  component={SoundIcon}
                  style={{
                    height: "25px",
                    width: "25px",
                  }}
                ></Icon>
              </span>
            </h2>
            <p className="section-content center-align">
              Kala in Hindi means 'a skilled craft' while Ira stands for 'Earth'
              in Sanskrit. We believe these descriptors form the essence of who
              we are. Qalara is a combination of artisanal crafts and
              responsibly produced earth-friendly offerings. It's a celebration
              of human ingenuity and a deep regard for the environment.
            </p>
          </div>

          <Row className="aboutus-container">
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <div>
                {isMobile && <div className="line-divider"></div>}
                <h2
                  className={
                    isMobile ? "section-heading" : "section-heading after"
                  }
                >
                  Our team
                </h2>
                <Row className="">
                  <Col
                    xs={14}
                    sm={14}
                    md={14}
                    lg={14}
                    xl={14}
                    className="aboutus-pr-1"
                  >
                    <img
                      className="aboutus-full"
                      src={process.env.NEXT_PUBLIC_URL + "/group photo.jpg"}
                    ></img>
                  </Col>
                  <Col
                    xs={10}
                    sm={10}
                    md={10}
                    lg={10}
                    xl={10}
                    className="aboutus-pl-1"
                  >
                    <img
                      className="aboutus-full"
                      src={process.env.NEXT_PUBLIC_URL + "/aditi.jpg"}
                    ></img>
                  </Col>
                </Row>
                <Row className="">
                  <Col
                    xs={10}
                    sm={10}
                    md={8}
                    lg={8}
                    xl={8}
                    className="aboutus-pr-1"
                  >
                    <img
                      className="aboutus-full"
                      src={process.env.NEXT_PUBLIC_URL + "/aditi.jpg"}
                    ></img>
                  </Col>
                  <Col
                    xs={14}
                    sm={14}
                    md={16}
                    lg={16}
                    xl={16}
                    className="aboutus-pl-1"
                  >
                    <img
                      className="aboutus-full"
                      src={process.env.NEXT_PUBLIC_URL + "/group photo.jpg"}
                    ></img>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col xs={24} sm={24} md={11} lg={11} xl={11}>
              <div className="section-content">
                <p>
                  Qalara is founded by Aditi Pany, an MBA graduate from Stanford
                  University, with close to a decade of experience in lifestyle
                  retail across both brick and mortar and ecommerce. In her last
                  stint, Aditi was the Chief Operating Officer of AJIO.com, a
                  leading lifestyle ecommerce company in India. Previously,
                  Aditi worked at Ashoka, a global non-profit that supports the
                  world's largest network of social entrepreneurs with
                  innovative ideas to change their community. Aditi has also
                  been a Board Member of RLHL which manages companies like
                  Hamleys in India.
                </p>
                <p>
                  Qalara is led by a team of seasoned entrepreneurial,
                  passionate leaders with strong track record and decades of
                  experience in manufacturing, digital technology, fashion &
                  lifestyle merchandising and retail, and supply chain, across
                  geographies.
                </p>
                <p className="highlight-text">
                  “Amet eu facilisi posuere ut at cras non ipsum proin nunc
                  purus tellus ultricies velit”<br></br>-Aditi
                </p>
              </div>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
          </Row>

          <Row className="aboutus-container">
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
            <Col
              xs={24}
              sm={24}
              md={10}
              lg={10}
              xl={10}
              className="qa-pad-rgt-100"
            >
              <div className="fortune-head qa-mar-top-3">
                An entity of a fortune 100 company
              </div>
              <div className="qa-flex-row qa-font-san qa-mar-top-3">
                <div>
                  <span className="about-status">25000+</span>
                  <br></br>
                  products
                </div>
                <div>
                  <span className="about-status">500+</span>
                  <br></br>vendors
                </div>
                <div>
                  <span className="about-status">3000+</span>
                  <br></br>buyers
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <h2 className="section-heading after">Our credentials</h2>
              <div className="section-content">
                <p>
                  Qalara is backed by Reliance Industries, a USD 100 bn Indian
                  conglomerate spanning Telecom, Retail, Energy and Consumer
                  Technology applications across AI, Content, Payments,
                  Commerce, and more! Reliance also has in its luxury retail
                  portfolio some of the world's most prominent fashion &
                  lifestyle brands like Diesel, Hugo Boss, Zegna, Armani, Marks
                  & Spencer, Muji, West Elm, Pottery Barn, GAS, Tiffany, Canali,
                  Burberry, Kate Spade, Mothercare and many many more!
                </p>
                <p>
                  With a strong mission-driven start-up team leveraging the
                  incredible digital and supply chain ecosystem of a Fortune 100
                  Indian company, Qalara seeks to achieve its vision of becoming
                  pivotal to driving sustainable consumption by reimagining the
                  global supply chain.
                </p>
              </div>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
          </Row>

          <div className="aboutus-container">
            <AboutUsCarousel />
          </div>

          <div className="aboutus-container center-align-container">
            <div>
              <h2 className="section-heading before">
                Our core product values
              </h2>
              <p className="section-content center-align">
                We have great respect for the skill and craftsmanship behind the
                products on Qalara. We believe we have a responsibility towards
                our planet, and want to do our bit. We strive to work with
                like-minded responsible and ethical partners.
              </p>
            </div>

            <Carousel
              updateArray={setValuesNew}
              carouselContent={values_new}
              pageId="about-us"
            />
          </div>

          <Row className="aboutus-container">
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10}>
              <div className="bird-vector" />
              <div className="about-whyus">
                <b>30,000+</b> products from verified suppliers Air and Sea
                delivery to 100+ countries Secure payments in major global
                currencies Quality Inspection included for all goods
                One-stop-shop from design to delivery Minimum order value
                starting <b>as low as USD 250</b>
              </div>
              <div className="about-status qa-txt-alg-cnt qa-mar-top-1">
                try us out!
              </div>
            </Col>
            <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10}>
              <h2 className="section-heading after">Why us</h2>
              <div className="section-content">
                <p>
                  We cater to all types of wholesale buying and sourcing
                  requirements, and invest in building long-term relationships.
                  Tapping into the rich tradition, culture, natural resources
                  and expertise of India, Sri Lanka, Thailand, Indonesia,
                  Vietnam, and neighbouring countries, we curate sellers and
                  their products based on our brand values. We quality inspect
                  all orders before they are shipped, monitor production for
                  custom orders, arrange for custom packaging, compute the best
                  shipping mode and cost combination, manage documentation,
                  facilitate secure payments and ensure safe door delivery
                  across the world. And we seek to get better with every order.
                </p>
                <div
                  className={
                    isMobile ? "aboutus-btn" : "aboutus-btn qa-vertical-center"
                  }
                >
                  <Link href="/products/all-categories">
                    <div className="button qa-primary-btn">
                      <span className="sign-up-text">SHOP BY PRODUCTS</span>
                    </div>
                  </Link>

                  <Link href="/signup">
                    <span className="button qa-secondary-btn">
                      <span className="sign-up-text">SHOP BY SELLERS</span>
                    </span>
                  </Link>
                </div>
              </div>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
          </Row>

          <Row className="aboutus-container">
            <Col xs={24} sm={24} md={15} lg={15} xl={15}>
              <h2 className="section-heading before">How we work</h2>
              <div className="qa-flex-row qa-font-san qa-mar-top-3">
                <div className="aboutus-mr">
                  <span className="aboutus-step-num">1</span>
                </div>
                <div>
                  <div className="wework">Ready to ship</div>
                  <p className="aboutus-detail">
                    These are products for which inventory is readily available
                    with the supplier and are generally dispatched within 7-10
                    days of the order confirmation, after being quality
                    inspected by Qalara. Many of these products are fast moving
                    and can run out of stock!
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
                    materials and undertake production. Such orders are usually
                    dispatched within 45-60 days of order confirmation, but may
                    take more or less time depending on product specifications
                    and quantities.
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
                    Such orders usually require sample development, and entail a
                    longer process depending on product specifications and
                    quantities, and are usually shipped within 60-90 days.
                  </p>
                </div>
              </div>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              <div className="highlight-text qa-fs-36 qa-mar-btm-4">
                You can shop on Qalara in many different ways
              </div>
              <div className="qa-txt-alg-cnt">
                <div className="qa-flex-row qa-font-san qa-mar-top-1">
                  <div className="aboutus-hw">
                    <div className="aboutus-step qa-fs-20">Step 1</div>
                    <div className="aboutus-step qa-fs-24">Browse products</div>
                  </div>
                  <div className="aboutus-hw">
                    <div className="aboutus-step qa-fs-20">Step 2</div>
                    <div className="aboutus-step qa-fs-24">Confirm order</div>
                  </div>
                </div>
                <div className="qa-flex-row qa-font-san qa-mar-top-4">
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

              <div className="qa-txt-alg-cnt qa-mar-top-4">
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
              </div>

              <div className="news-article qa-txt-alg-cnt qa-mar-top-2">
                View FAQs
              </div>
            </Col>
          </Row>

          <Row className="aboutus-container">
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10}>
              <img
                className="aboutus-map"
                src={process.env.NEXT_PUBLIC_URL + "/India.png"}
              ></img>
            </Col>
            <Col xs={0} sm={0} md={2} lg={2} xl={2}></Col>
            <Col xs={24} sm={24} md={10} lg={10} xl={10}>
              <h2 className="section-heading after">Contact us</h2>
              <div className="section-content">
                <p>
                  Qalara is headquartered in Bengaluru, India with teams across
                  continents.
                </p>
                <p>
                  We would love to meet you, once we are past this global
                  crisis. Meanwhile, please write to us at contact@qalara.com
                  for any questions or just to say hi!
                </p>
                <p>
                  We are also hiring across teams – merchandising, business
                  development, QA, product management, UIUX design, category
                  management, digital marketing and supply chain. Write to us at
                  careers@qalara.com with a brief summary of your interests, and
                  your resume and we will revert if we find our interests match!
                </p>
              </div>
            </Col>
            <Col xs={0} sm={0} md={1} lg={1} xl={1}></Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default AboutUsWrapper;
