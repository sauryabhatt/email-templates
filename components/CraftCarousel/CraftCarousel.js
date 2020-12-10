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
    slidesToShow: 1,
    slidesToScroll: 1,
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
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Link href={item.path}>
              <div className="slider-left">
                <div className="qa-rel-pos" style={{ cursor: "pointer" }}>
                  <img
                    className="images"
                    src={item.imageInner}
                    width={"100%"}
                    alt={item.imageHeading}
                  />
                  <div
                    className="image-text"
                    style={item.path !== "" ? { cursor: "pointer" } : {}}
                  >
                    {item.imageHeading}
                  </div>
                </div>
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <div className="slider-right">
              <p className="slider-trend-heading">#TrendAlert</p>
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
            </div>
          </Col>
        </Row>
      </div>
    );
  });

  return (
    <div id="craft-carousel">
      {/* <Row>
                <Col xs={0} sm={0} md={24} lg={24} xl={24}></Col>
            </Row> */}

      <Slider ref={(c) => (slider = c)} {...settings}>
        {slides}
      </Slider>
      {/* <div className='slider-button'> */}
      <Button type="link" className="button-show-more-prev" onClick={previous}>
        Prev &nbsp;&nbsp;
        <MinusOutlined />
        <MinusOutlined />
        <MinusOutlined />
      </Button>
      <Button type="link" className="button-show-more" onClick={next}>
        <MinusOutlined />
        <MinusOutlined />
        <MinusOutlined />
        &nbsp;&nbsp;Next
      </Button>
      {/* </div> */}
    </div>
  );
}

export default CraftCarousel;
