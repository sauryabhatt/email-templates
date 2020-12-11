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
    url: "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_1_1.jpg",
    linkTo: "home-decor-and-accessories",
  },
  {
    title: "Home linen",
    url: "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_4_1.jpg",
    linkTo: "home-furnishing",
  },
  {
    title: "Kitchen & dining",
    url: "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_3_1.jpg",
    linkTo: "kitchen-and-dining",
  },
  {
    title: "Fashion accessories",
    url: "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_2_1.jpg",
    linkTo: "fashion",
  },
  {
    title: "Furniture & storage",
    url: "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_5_1.jpg",
    linkTo: "furniture-and-storage",
  },
  // {
  //   title: "Jewellery",
  //   url: "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_6.jpg",
  //   linkTo: "jewellery",
  // },
  {
    title: "Baby & kids",
    url: "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_7.jpg",
    linkTo: "baby-and-kids",
  },
  {
    title: "Stationery & novelty",
    url: "https://cdn.qalara.com/images/Img_HomePageCategory_4x_Vertical_8.jpg",
    linkTo: "stationery-and-novelty",
  },
  {
    title: "Shop all",
    url: "https://cdn.qalara.com/images/Img_HomePageCategory_7.jpg",
    linkTo: "all-categories",
  },
];
const slides = categoryData?.map((item, index) => {
  return (
    <Link href={`/sellers/${item.linkTo}`} key={index} className="qa-cursor">
      <div className="category-card qa-cursor">
        {(index + 1) % 2 === 0 ? (
          <div className="category-title">{item.title ?? ""}</div>
        ) : null}
        <img src={item.url} width="100%" alt="category" />
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
