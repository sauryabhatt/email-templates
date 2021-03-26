/** @format */

import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { enquireScreen } from "enquire-js";

import Slider from "react-slick";
import { MinusOutlined } from "@ant-design/icons";

import Link from "next/link";

const categoryData = [
  {
    title: "Home decor",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_1_2.jpg",
    linkTo: "home-decor-and-accessories",
    alt: "Handpicked wholesale home decor suppliers at Qalara",
  },
  {
    title: "Home linen",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_4_2.jpg",
    linkTo: "home-furnishing",
    alt: "Shop wide variety of wholesale home furnishing brands from Qalara",
  },
  {
    title: "Kitchen & dining",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_3_2.jpg",
    linkTo: "kitchen-and-dining",
    alt: "Handcarved and Handpainted wholesale kitchenware brands at Qalara",
  },
  {
    title: "Fashion accessories",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_2_2.jpg",
    linkTo: "fashion",
    alt: "Best wholesale textile and fashion accessories suppliers at Qalara",
  },
  {
    title: "Furniture & storage",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_5_2.jpg",
    linkTo: "furniture-and-storage",
    alt:
      "Discover bulk furniture suppliers made with artisanal techniques at Qalara",
  },

  {
    title: "Baby & kids",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_7_2.jpg",
    linkTo: "baby-and-kids",
    alt:
      "Handcrafted and eco friendly wholesale suppliers specializing in Baby & kids products at Qalara",
  },
  {
    title: "Stationery & novelty",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_8_2.jpg",
    linkTo: "stationery-and-novelty",
    alt:
      "Curated wholesale suppliers offering a wide range of stationery & novelty products at Qalara",
  },
  {
    title: "Jewelry",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_6_2.jpg",
    linkTo: "jewelry",
    alt:
      "Wholesale earrings, necklaces, bracelets, rings, nose pins and cufflinks",
  },
  {
    title: "Shop all",
    url:
      "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_9_2.jpg",
    linkTo: "all-categories",
    alt:
      "Shop consciously designed products with curated craftsmanship at Qalara",
  },
];
const slides = categoryData?.map((item, index) => {
  return (
    <Link href={`/sellers/${item.linkTo}`} key={index} className="qa-cursor">
      <div className="category-card qa-cursor">
        {(index + 1) % 2 === 0 ? (
          <div className="category-title">{item.title ?? ""}</div>
        ) : null}
        <img src={item.url} width="100%" alt={item.alt} />
        {(index + 1) % 2 !== 0 ? (
          <div className="category-title">{item.title ?? ""}</div>
        ) : null}
      </div>
    </Link>
  );
});

function CategoryBannerCarousel(props) {
  const [isMobile, setIsMobile] = useState(false);
  const settings = {
    infinite: isMobile ? false : true,
    speed: 500,
    slidesToShow: isMobile ? 1.5 : 5,
    slidesToScroll: isMobile ? 1 : 1,
    arrows: false,
  };

  let slider;

  const next = () => {
    slider.slickNext();
  };
  const previous = () => {
    slider.slickPrev();
  };
  //   const nextButton=;

  let { pageId = "" } = props;

  useEffect(() => {
    enquireScreen((status) => setIsMobile(status));
  }, []);

  return (
    <div
      className={`${
        pageId === "SLP"
          ? "category-carousel search-listing"
          : "category-carousel"
      }`}
    >
      <div className="category-heading-section">
        <div className="category-heading">
          <h3 style={{ marginBottom: "0" }}>Shop by category</h3>

          {pageId !== "SLP" && (
            <p style={{ marginBottom: "0" }}>
              Browse our curated range of verified suppliers and beautiful
              products
            </p>
          )}
        </div>

        {!isMobile ? (
          <div
            style={{
              marginTop: "25px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button type="link" className="button-show-prev" onClick={previous}>
              Prev &nbsp;&nbsp;
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
        ) : null}
      </div>
      <Slider
        className="category-slider"
        ref={(c) => (slider = c)}
        {...settings}
      >
        {slides}
      </Slider>
    </div>
  );
}

export default CategoryBannerCarousel;
