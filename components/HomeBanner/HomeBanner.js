/** @format */

import React from "react";
import HomePageCarousel from "./HomePageCarousel";

function HomeBanner(props) {
  let { isAuthenticated = "", showRFQ = "" } = props;
  return (
    <div id="banner-container">
      <div className="home-first-fold">
        <HomePageCarousel isAuthenticated={isAuthenticated} showRFQ={showRFQ} />
      </div>
    </div>
  );
}

export default HomeBanner;
