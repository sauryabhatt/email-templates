/** @format */

import React, { useState, useEffect } from "react";
import { enquireScreen } from "enquire-js";

import Slider from "react-slick";

import left from "../../public/filestore/left";
import right from "../../public/filestore/right";

export default function PressCrousel(props) {
  const [isMobile, setIsMobile] = useState(false);
  let slider;

  const next = () => {
    slider.slickNext();
  };
  const previous = () => {
    slider.slickPrev();
  };

  useEffect(() => {
    enquireScreen((status) => setIsMobile(status));
  }, []);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 1.5 : 5,
    slidesToScroll: isMobile ? 1.5 : 1,
    arrows: false,
  };

  const press_data = [
    {
      title: "",
      url: "https://cdn.qalara.com/images/Img_Hot1.jpg",
      linkTo: "/gb/?f_isfreeshipping=true",
    },
    {
      title: "",
      url: "https://cdn.qalara.com/images/Img_Hot2.jpg",
      linkTo: "/seller/SL10789/all-categories/",
    },
    {
      title: "",
      url: "https://cdn.qalara.com/images/Img_Hot3.jpg",
      linkTo: "/gb/?f_seller_code=SL10996%2CSL11014%2CSL10847",
    },
    {
      title: "",
      url: "https://cdn.qalara.com/images/Img_Hot4.jpg",
      linkTo: "/gb/?f_seller_code=SL10691%2CSL10237",
    },
  ];

  return (
    <div className="hot-weel-crousel">
      <div className="hot-weel-header">In the spotlight</div>
      {isMobile ? (
        <Slider ref={(c) => (slider = c)} {...settings}>
          {press_data.map((data, index) => {
            return (
              <a
                className="hot-week-link"
                key={`hot-m-weel-${index}`}
                href={data.linkTo}
                target="blank"
              >
                <img
                  style={{ height: `${data.height}` }}
                  src={data.url}
                  alt={data.url}
                />
              </a>
            );
          })}
        </Slider>
      ) : (
        <div className="hot-weel-wrp">
          {press_data.map((data, index) => {
            return (
              <a key={`hot-weel-${index}`} href={data.linkTo} target="blank">
                <img
                  style={{ height: `${data.height}` }}
                  src={data.url}
                  alt={data.url}
                />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
