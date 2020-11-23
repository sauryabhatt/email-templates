

import React, { useState , useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import FeedbackModal from "./../FeedbackModal/FeedbackModal";
import Icon from "@ant-design/icons";

export default function PromotionDetails() {
  const token = useSelector(
    (state) => state.appToken.token && state.appToken.token.access_token
  );

  const [htmlContent, setHtmlContent] = useState(null);
  const [cookie, setCookie] = useCookies(["qalaraUser"]);
  const [mobile, setMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let width = window.innerWidth;
    if (width <= 768) {
      setMobile(true);
    }

  })
  useState(() => {
    fetch(process.env.REACT_APP_CONTENT_URL + "/content/PromotionDetails", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "COntent not found";
        }
      })
      .then((res) => {
        setHtmlContent(res.body);
        setLoading(false);
      })
      .catch((error) => {
        // message.error(error)
        setLoading(false);
      });
  }, []);

  if (loading) {
    /*if (mobile) {
      return (
        <Icon
          component={TrendsLoaderMobile}
          style={{ width: "100%" }}
          className="trends-loader-icon"
        />
      );
    } else {
      return (
        <Icon
          component={TrendsLoader}
          style={{ width: "100%" }}
          className="trends-loader-icon"
        />
      );
    }*/
  }

  return (
    <React.Fragment>
      {/*<Helmet>
        <title>
          Source unique handmade products, home decor,rugs and carpets,
          textiles, hand embroidered cushion, hand woven wall hanging, handwoven
          natural palm & grass Basket, hand-Crafted Wooden Cheese Board,
          minimalist and eco-friendly furniture Online from Indian manufacturers
        </title>
        <meta
          name="description"
          content="Source unique Tie-dye, Macrame, Handweaving, Knotting, Shibori, Carpet weaving, Crewel Embroidery, Madhubani, Ikat, Tangalia, Bagh, Carving and more traditional crafts and textures online from Indian manufacturers"
        />
        <link
          rel="canonical"
          href="https://www.qalara.com/trends/globaltextures"
        />
      </Helmet>*/}
      {cookie.qalaraUser && cookie.qalaraUser !== "oldUser" && (
        <FeedbackModal />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{ paddingTop: "3%" }}
      ></div>
    </React.Fragment>
  );
};

