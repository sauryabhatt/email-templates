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
    infinite: isMobile ? true : true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: isMobile ? 1 : 1,
    arrows: false,
  };

  const press_data = [
    /*{
      title: "",
      url: "https://yourstory.com/video/how-qalara-is-enabling-small-businesses-aditi-pany",
      linkTo: "https://cdn.qalara.com/images/Img_YS_Logo.png",
    },*/
    {
      mobile_height: "35px",
      title: "",
      url:
        "https://sourcingjournal.com/topics/sourcing/qalara-india-artisans-ethical-manufacturing-retail-online-sustainability-241851/",
      linkTo: "https://cdn.qalara.com/images/Img_SJ_Logo.png",
    },
    {
      mobile_height: "60px",
      title: "",
      url: "https://futureofsourcing.com/women-in-global-sourcing-aditi-pany",
      linkTo: "https://cdn.qalara.com/images/Img_Logo_Fos.png",
    },
    /*{
      mobile_height: "25px",
      title: "",
      url: "https://ideamensch.com/aditi-pany/",
      linkTo: "https://cdn.qalara.com/images/Img_IM_Logo.png",
    }*/
  ];
  let mobile_view = [];
  for (let i = 0; i < 2; i = i + 2) {
    let view = (
      <div className="mobile-press-crousel-container" key={i}>
        <div className="mobile-img-wrp">
          <a href={press_data[i].url} target="blank">
            <img
              style={{ height: `${press_data[i].mobile_height}` }}
              src={press_data[i].linkTo}
              alt={press_data[i].url}
            />
          </a>
        </div>
        <div className="mobile-img-wrp" target="blank">
          <a href={press_data[i].url} className={`press-${i + 1}`}>
            <img
              style={{ height: `${press_data[i + 1].mobile_height}` }}
              src={press_data[i + 1].linkTo}
              alt={press_data[i + 1].url}
            />
          </a>
        </div>
      </div>
    );
    mobile_view.push(view);
  }

  return (
    <div className="press-crousel">
      <div className="press-header">In the news</div>
      {isMobile && press_data.length > 2 ? (
        <span className="press-arrow press-left-arrow" onClick={previous}>
          {left()}
        </span>
      ) : null}
      {isMobile ? (
        <Slider ref={(c) => (slider = c)} {...settings}>
          {mobile_view}
        </Slider>
      ) : (
        <div className="press-web-wrp">
          {press_data.map((data, index) => {
            return (
              <a key={`press-${index}`} href={data.url} target="blank">
                <img
                  style={{ height: `${data.height}` }}
                  src={data.linkTo}
                  alt={data.url}
                />
              </a>
            );
          })}
        </div>
      )}
      {isMobile && press_data.length > 2 ? (
        <span className="press-arrow press-right-arrow" onClick={next}>
          {right()}
        </span>
      ) : null}
    </div>
  );
}
