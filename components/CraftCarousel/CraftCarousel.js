/** @format */

import React, { useState, useEffect} from 'react';
import Slider from "react-slick";
import { Button, Row, Col } from "antd";
import { LeftOutlined, RightOutlined, MinusOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { enquireScreen } from "enquire-js";

function CraftCarousel(props) {
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const settings = {
    infinite: true,
    // autoplay: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: isMobile ? 1 : 1,
    //slidesToShow: 1,
    //slidesToScroll: 1,
    arrows: false,
    // style: { height: '100%' }
  };

  useEffect(() => {
    enquireScreen((status) => setIsMobile(status));
  }, []); 
  let slider;

  const next = () => {
    slider.slickNext();
  };

  const previous = () => {
    slider.slickPrev();
  };

  const slides = props.items.map((item, i) => {
    return (
      <div key={i} className="slider-slide">
        <Row>
          <Col >
            <Link href={item.path}>
              <div className="slider-left">
                <div className="qa-rel-pos" style={{ cursor: "pointer" }}>
                  <img
                    className="images"
                    src={item.imageInner}
                    width={"100%"}
                    alt={item.imageHeading}
                  />
                </div>

                <div className="slider-right">
                  <Link href={item.path}>
                    <p
                      className="slider-right-heading"
                      style={{ cursor: "pointer" }}
                    >
                      {item.imageTitle}
                    </p>
                  </Link>
                  <p
                    className="slider-right-para"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {item.slideText}
                  </p>
                  <p className = "explore-text">+EXPLORE</p>
                </div>
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    );
  });

  return (
    <div className="category-carousel craft-carousel">
      <div className="category-heading-section">
        <div className="category-heading">
          <h3 style={{ marginBottom: "0" }}>Shop by trends</h3>

          <p style={{ marginBottom: "0" }}>Handpicked on-trend collections from responsible suppliers</p>
        </div>
          <div className="craft-action-container" >
        {!isMobile ? (
            <Button type="link" className="button-show-prev" onClick={previous}>
              Prev &nbsp;&nbsp;
              <MinusOutlined />
              <MinusOutlined />
              <MinusOutlined />
            </Button>
        ) : null}
            <Button type="link" className="button-show-more" onClick={next}>
              <MinusOutlined />
              <MinusOutlined />
              <MinusOutlined />
              &nbsp;&nbsp;Next
            </Button>
          </div>
      </div>
      <Slider 
        className="category-slider"
        ref={(c) => (slider = c)} 
        {...settings}>
        {slides}
      </Slider>
      <div className= "craft-explore-all-wrp"><Link href="/explore/curatedbyus"><span className = "craft-explore-all">EXPLORE ALL TRENDS</span></Link></div>
    </div>
  );
}

export default CraftCarousel;
