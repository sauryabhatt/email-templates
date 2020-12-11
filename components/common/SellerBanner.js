/** @format */

import React, { useState, useEffect } from "react";

function SellerBanner(props) {
  let { orgName = "", companyDescription = "" } = props;

  orgName = orgName.toLowerCase();

  const [imageUrl, setImageUrl] = useState(
    props.bannerImage &&
      props.bannerImage.media &&
      props.bannerImage.media.mediaUrl &&
      process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
        props.bannerImage.media.mediaUrl
  );

  useEffect(() => {
    setImageUrl(
      props.bannerImage &&
        props.bannerImage.media &&
        props.bannerImage.media.mediaUrl &&
        process.env.NEXT_PUBLIC_REACT_APP_ASSETS_FILE_URL +
          props.bannerImage.media.mediaUrl
    );
  }, [props]);

  if (props.id === "SELLER-LANDING") {
    return (
      <div
        className="banner qa-rel-pos seller-landing-banner"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      >
        <span className="banner-seller-name">{orgName}</span>
      </div>
    );
  } else {
    return (
      <div className="banner qa-rel-pos">
        <div className="seller-text-details">
          <div
            style={{
              display: "inline-block",
              width: "100%",
              verticalAlign: "middle",
              height: "100%",
            }}
          >
            <div className="banner-text-small qa-font-san qa-fs-12 qa-text-3line qa-tc-f">
              {companyDescription}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SellerBanner;
