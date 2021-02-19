/** @format */

import React, { useState, useEffect } from "react";
import { enquireScreen } from "enquire-js";

import Slider from "react-slick";

import left from "../../public/filestore/left";
import right from "../../public/filestore/right";

export default function NewsCrousel(props) {
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
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: isMobile ? 1 : 1,
    arrows: false,
  };

  const press_data = [
    {
      mobile_height: "15px",
      height: "40px",
      url:
        "https://sourcingjournal.com/topics/sourcing/qalara-india-artisans-ethical-manufacturing-retail-online-sustainability-241851/",
      linkTo: process.env.NEXT_PUBLIC_URL + "/news2.jpg",
      title:
        "“This Virtual Wholesale Platform Links Regional Artisans to Global Retail”",
    },
    {
      mobile_height: "15px",
      height: "40px",
      url:
        "https://giftguideonline.com.au/blog/are-you-looking-to-expand-on-a-global-scale.html",
      linkTo: process.env.NEXT_PUBLIC_URL + "/news1.jpg",
      title:
        "“Qalara strives to reimagine the global supply chain to make it convenient, reliable and affordable for wholesale buyers of all sizes to source...”",
    },

    {
      mobile_height: "15px",
      height: "40px",
      url: "https://futureofsourcing.com/women-in-global-sourcing-aditi-pany",
      linkTo: process.env.NEXT_PUBLIC_URL + "/news3.jpg",
      title:
        "Our founder featured alongside pioneering 'women in global sourcing'",
    },
    // {
    //   mobile_height: "15px",
    //   height: "40px",
    //   url:
    //     "https://yourstory.com/2020/12/mukesh-ambani-reliance-industries-startup-qalara-aditi-pany",
    //   linkTo: process.env.NEXT_PUBLIC_URL + "/news4.jpg",
    //   title:
    //     "“Qalara offers a wholesale ecommerce marketplace for small businesses to export across the world.”",
    // },
    {
      mobile_height: "15px",
      height: "40px",
      url: "https://ideamensch.com/aditi-pany/",
      linkTo: process.env.NEXT_PUBLIC_URL + "/news5.jpg",
      title:
        "“Qalara aimed at redesigning the global supply chain for artisan goods”",
    },
  ];
  let mobile_view = [];

  for (let i = 0; i < press_data.length; i++) {
    let view = (
      <div className="mobile-press-crousel-container qa-mar-top-3" key={i}>
        <div className="mobile-img-wrp">
          <img src={press_data[i].linkTo} alt={press_data[i].url} />
          <div className="news-para">{press_data[i].title}</div>
          <div>
            <a href={press_data[i].url} target="_blank">
              <span className="news-article">Read Article</span>
            </a>
          </div>
        </div>
      </div>
    );
    mobile_view.push(view);
  }

  return (
    <div className="aboutus-press-crousel press-crousel">
      {/* <div className="press-header">In the news</div> */}
      {!isMobile && press_data.length > 3 ? (
        <span className="press-arrow press-left-arrow" onClick={previous}>
          {left()}
        </span>
      ) : null}
      {!isMobile ? (
        <Slider ref={(c) => (slider = c)} {...settings}>
          {press_data.map((data, index) => {
            return (
              <div key={`press-${index}`} className="qa-txt-alg-cnt press-blk">
                <img
                  style={{ height: `${data.height}` }}
                  src={data.linkTo}
                  alt={data.url}
                />
                <div className="news-para qa-text-2line">{data.title}</div>
                <div className="new-read-article">
                  <a href={data.url} target="_blank">
                    <span className="news-article">Read Article</span>
                  </a>
                </div>
              </div>
            );
          })}
        </Slider>
      ) : (
        <div className="qa-txt-alg-cnt">{mobile_view}</div>
      )}
      {!isMobile && press_data.length > 3 ? (
        <span className="press-arrow press-right-arrow" onClick={next}>
          {right()}
        </span>
      ) : null}
    </div>
  );
}
