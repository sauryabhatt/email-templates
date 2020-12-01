/** @format */

import React, { useState } from "react";
import Slider from "react-slick";

export default function PromotionCarousel(props) {
  const [count, setCount] = useState(1);
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplaySpeed: 5000,
    afterChange: onSlideChange,
  };
  let slider = "";
  const next = () => {
    slider.slickNext();
  };
  const previous = () => {
    slider.slickPrev();
  };

  function onSlideChange(e) {
    setCount(e + 1);
  }

  let promotiolList = [
    {
      title: "Holiday offer!",
      copy:
        <div> Use coupon code <b>FLAT75OFF</b> to avail <b>$75 off*</b> on all orders. <span style={{fontSize: "12px"}}>*T&C </span></div>,
    },
    {
      title: "Launch offer!",
      copy:
        "ZERO Commissions. FREE quality inspections. Automatically applied.",
    },
  ];

  return (
    <div className="cart-banner">
      <span
        onClick={previous}
        className="cart-left-arrow cart-arrow"
      >{`<`}</span>
      <Slider ref={(c) => (slider = c)} {...settings}>
        {promotiolList.map((p, index) => {
          return (
            <div key={index} className="cart-sildes">
              <span className="cart-banner-title">{p.title}</span>
              <span className="cart-banner-copy">{p.copy}</span>
            </div>
          );
        })}
      </Slider>
      <span onClick={next} className="cart-right-arrow cart-arrow">
        &gt;
      </span>
      <span className="slider-count">
        {count}/{promotiolList.length}
      </span>
    </div>
  );
}
