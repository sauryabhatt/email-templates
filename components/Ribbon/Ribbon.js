import React from 'react';
import Slider from "react-slick";
import ribbonCross from "../../public/filestore/RibbonCross"

export default function Ribbon(props){
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
  let slider = ""
  let t = ["$75 OFF on shipping for all orders", "ZERO Commissions. FREE quality inspections"]
  return(
    <div  className="home-page-ribben-wrp">
      <Slider ref={(c) => (slider = c)} {...settings}>
        {t.map(a => {
          return(
            <a target="_blank" href="/promotionsFAQ" key = {a} className="home-page-ribben">
              <span className="ribbon-title">
                {a}.
                <a href="/" className="ribbon-link">T&C*</a>
              </span>
            </a>
          )
        })

        }
      </Slider>
      <span onClick={()=>props.setShowRibbon(false)} className = "cross-btn">{ribbonCross()}</span>
    </div >

  )
}
