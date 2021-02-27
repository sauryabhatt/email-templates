/** @format */

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Link from "next/link";
import ribbonCross from "../../public/filestore/RibbonCross";

export default function Ribbon(props) {
  const settings = {
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    //slidesToShow: 1,
    //slidesToScroll: 1,
    //arrows: false,
    //vertical: true,
    verticalSwiping: true,
    autoplay: true,
    autoplaySpeed: 7000,
  };
  let slider = "";
  let t = [
    "USD 100 OFF on your first order. Minimum order value USD 500. Apply code FAB100",
    "FREE SHIPPING on select styles",
    "ZERO Commissions. FREE quality inspections",
  ];

  const [pathname, setPathname] = useState("");

  useEffect(() => {
    let { location: { pathname = "" } = {} } = window || {};
    setPathname(pathname);
  }, []);

  return (
    <div className="home-page-ribben-wrp">
      <Slider ref={(c) => (slider = c)} {...settings}>
        {t.map((a, i) => {
          return (
            <a
              target="_blank"
              href={i === 1 ? "/gb/?f_isfreeshipping=true" : "/promotionsFAQ"}
              key={a}
              className="home-page-ribben"
            >
              <span className="ribbon-title">
                {a}.
                {pathname !== "/" ? (
                  <Link href="/">
                    <span className="ribbon-link qa-cursor">T&C*</span>
                  </Link>
                ) : (
                  <span
                    className="ribbon-link qa-cursor"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    T&C*
                  </span>
                )}
              </span>
            </a>
          );
        })}
      </Slider>
      <span onClick={() => props.setShowRibbon(false)} className="cross-btn">
        {ribbonCross()}
      </span>
    </div>
  );
}
