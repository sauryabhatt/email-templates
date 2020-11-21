/** @format */

import React from "react";
import Slider from "react-slick";
import { Button } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
function SellerCarousel(props) {
  const router = useRouter();

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 5,
    slidesToScroll: 1,
    // autoplay: true,
    speed: 500,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
    // style: { height: '100%' }
  };

  let slider;

  const next = () => {
    slider.slickNext();
  };

  const previous = () => {
    slider.slickPrev();
  };

  const slides = props.items.map((item, i) => {
    // console.log(item.image.toString());
    return (
      <Link href={item.url} key={i} className="qa-cursor">
        <div className="slider-slide">
          <div
            className="slider-slide-main"
            style={{ backgroundImage: `url(${item.image.toString()})` }}
          >
            <p className="slider-image-text">{item.imageHeading}</p>
          </div>
        </div>
      </Link>
    );
  });

  return (
    <>
      <div id="seller-carousel">
        <div className="seller-carousel-heading">
          <p className="carousel-text" style={{ fontWeight: "300" }}>
            We work with sellers who produce responsibly
          </p>
        </div>
        <div className="carousel-main">
          <div className="circle" />
          {/* <div className='carousel-inner'> */}
          <Slider ref={(c) => (slider = c)} {...settings}>
            {slides}
          </Slider>
          {/* </div> */}
          <Button type="link" className="button-show-less" onClick={previous}>
            Prev&nbsp;&nbsp;
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
        </div>
        <div className="slider-button">
          <Button
            className="button-seller-group button-seller"
            onClick={() => {
              router.push("/seller-subscription"); /*setVisible(true)*/
            }}
          >
            Become a supplier
          </Button>
        </div>
      </div>
    </>
  );
}

export default SellerCarousel;
