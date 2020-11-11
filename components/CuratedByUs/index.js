/** @format */

import React, { useState } from "react";
import ordered from "../../public/filestore/Landing-page/ordered";
import ship from "../../public/filestore/Landing-page/ship";
import expres from "../../public/filestore/Landing-page/express";
import  Link  from "next/link";
import {useRouter} from "next/router";
import Carousel from "./Carousel";

export default function CuratedByUsWrapper(props) {

    const router = useRouter();
  const trend = [
    {
      url: "/trends/earthinspired",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend1.jpg",
      text: "Earth inspired",
      alt: "Source Earth Inspired products from India",
    },
    {
      url: "/trends/urbanjungle",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend2.jpg",
      text: "Urban jungle",
      alt:
        "Collection of wholesale handmade and sustainable products from Qalara",
    },
    {
      url: "/trends/globaltextures",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend3.jpg",
      text: "Global textures",
      alt:
        "Source beautiful traditional crafts and textures by Indian artisans from Qalara",
    },
    {
      url: "/trends/homeoffice",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend4.jpg",
      text: "Home office",
      alt:
        "Collection of home workspace by our artisanal and responsible sellers fro Qalara",
    },
    {
      url: "/trends/christmasspirit",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend5.jpg",
      text: "Holiday spirit",
      alt:
        "Explore holiday decorations perfect for any celebration from Qalara",
    },
    {
      url: "/trends/sunkissed-spring21",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Trend6.jpg",
      text: "Sunlit Spring '21",
      alt: "Sunlit Spring '21",
    },
  ];

  const category = [
    {
      url: "/categoryedit/kitchendining",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category1.jpg",
      text: "Kitchen & dining",
      alt: "Wholesale kitchenware and dinnerware products from Qalara",
    },
    {
      url: "/categoryedit/homedecor",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category2.jpg",
      text: "Home decor",
      alt: "Wholesale home accents & utilities from Qalara",
    },
    {
      url: "/categoryedit/furniture",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category3.jpg",
      text: "Furniture",
      alt: "Source collection of handpicked wholesale furniture from Qalara",
    },
    {
      url: "/categoryedit/homelinen",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category4.jpg",
      text: "Home linen",
      alt: "Wholesale furnishings & linens from Qalara",
    },
    {
      text: "Jewelry",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Categorys5.jpg",
      url: "/categoryedit/jewelry",
      alt: "Explore jewelry handcrafted by Indian artisans from Qalara",
    },
    {
      text: "Fashion accessories",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Category6.jpg",
      url: "/categoryedit/fashionaccessories",
      alt: "",
    },
  ];

  const crafts = [
    {
      url: "/artisancrafts/carvingandinlay",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Craft1.jpg",
      text: "Carving & Inlay",
      alt:
        "Shop wholesale for unique products from our curated, responsible sellers ",
    },
    {
      url: "/artisancrafts/metalcrafts",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Craft2.jpg",
      text: "Metal crafts",
      alt: "Explore Qalara's curation of traditional crafts across South Asia",
    },
    {
      url: "/artisancrafts/basketry",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Craft3.jpg",
      text: "Basketry",
      alt: "Sustainable and eco-friendly handmade products curated by Qalara",
    },
    {
      url: "/artisancrafts/textileweaves",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Craft4.jpg",
      text: "Knots & Weaves",
      alt:
        "Shop wholesale textiles crafted in indigenous techniques from Qalara",
    },
  ];

  const values = [
    {
      url: "/sellers/all-categories?f_values=ORGANIC",
      img:  process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values1.jpg",
      text: "Organic",
      alt: "Explore selection of organic products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=ECO_FRIENDLY",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values2.jpg",
      text: "Ecofriendly",
      alt: "Explore selection of eco friendly  products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=FAIR_TRADE",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values3.jpg",
      text: "Fair & social",
      alt: "Explore our selection of fair and social products  by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=RECYCLED",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values4.jpg",
      text: "Recycled",
      alt: " Explore selection of recycled products  by Qalara",
    },
    {
      text: "Sustainable",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values5.jpg",
      url: "/sellers/all-categories?f_values=SUSTAINABLE",
      alt: " Explore selection of sustainable products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=ARTISANAL",
      img: process.env.NEXT_PUBLIC_REACT_APP_CDN_URL + "/images/Img_Values6.jpg",
      text: "Artisanal",
      alt: "Explore our selection of artisanal products  by Qalara",
    },
  ];

  const [zoom_url, setZoomUrl] = useState(crafts[crafts.length - 1]);
  const [craft_new, setCraftNew] = useState(crafts);
  const [category_new, setCategoryNew] = useState(category);
  const [values_new, setValuesNew] = useState(values);

  return (
    <div className="landing-container">
      <div className="landing right-align-container">
        <div className="landing-first-fold curated-fold">
          <div className="fold-heading">
            <h2 className="main-header">Curated by us</h2>
            <p className="discription-text">
              Handpicked on-trend collections from hundreds of ethical
              suppliers, for contemporary living.
            </p>
            <div className="button-wrp" >
              <Link href="/request-for-quote">
                <span className="button" style={{cursor:"pointer"}} >request for quote</span>
              </Link>
              <p className="tagline-small-text">
                We can curate for your brand!
              </p>
            </div>
          </div>
          <div className="fold-content">
            <h2 className="bar-heading">Shop by trend</h2>
            <div className="fold-image">
              <div className="fold-image-container">
                {trend.map((e, index) => {
                  return (
                    <div key ={`trend-img-${index}`} className="image-wrp" onClick={()=>router.push(e.url)}>
                      <img alt={e.alt} src={e.img} />
                      <h3>{e.text}</h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="right-align-container">
        <div className="landing-second-fold curated-fold">
          <div className="big-heading">
            <span>
              Did you know, India has the world's largest organic producer base?
            </span>
            <span className="big-text-bottom-line">
              -International Federation for Organic Agriculture Movements
            </span>
          </div>
          <div className="aligne-column">
            <div className="fold-heading side-heading">
              <h2 className="bar-heading">Shop by category</h2>
              <p className="discription-text">
                Choose from a wide range of handcrafted, consciously produced
                and mindfully designed products.
              </p>
            </div>
            <div className="fold-content">
              <Carousel
                updateArray={setCategoryNew}
                carouselContent={category_new}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="landing-third-fold right-align-container">
        <div className="curated-fold">
          <Link
            href={zoom_url.url}
          >
            <div style={{ backgroundImage: "url(" + zoom_url.img + ")" }} className="fold-heading">
              <div className="dialog-box">
                <span className="dialog-big-text">Handcrafted by artisans</span>
                <span className="dialog-small-text">{zoom_url.text}</span>
              </div>
            </div>
          </Link>
          <div className="fold-content">
            <div className="craft-text-wrap">
              <h2 className="bar-heading">Shop by crafts</h2>
              <p className="discription-text">
                Did you know South Asia's heritage of handloom & handicrafts is
                almost 4000 yrs old! India itself has over 516 documented craft
                clusters, supported by 7 million talented artisans.
              </p>
            </div>
            <Carousel
              updateArray={setCraftNew}
              setZoomUrl={setZoomUrl}
              carouselContent={craft_new}
            />
          </div>
        </div>
      </div>

      <div className="right-align-container">
        <div className="landing-fourth-fold curated-fold">
          <div className="big-heading">
            <span>
              54% consumers think that they can make a positive contribution to
              the world with their purchases!
            </span>
            <span className="big-text-bottom-line">-Euromonitor 2020</span>
          </div>
          <div className="aligne-column">
            <div className="fold-heading side-heading">
              <h2 className="bar-heading">Shop by values</h2>
              <p className="discription-text">
                This is important to us and we do our best to handpick suppliers
                based on these values.
              </p>
            </div>
            <div className="fold-content">
              <Carousel
                updateArray={setValuesNew}
                carouselContent={values_new}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="right-align-container">
        <div className="landing-fifth-fold curated-fold">
          <div className="fold-heading ">
            <h2 className="bar-heading">Shop by order type</h2>
            <p className="discription-text">
              We offer different ordering options for everyone - from new
              businesses to larger companies.
            </p>
          </div>
          <div className="fold-content">
            <div
              style={{ display: "flex" }}
              className="hroizontal-img-container"
            >
              <div
                onClick={()=>router.push("/products/all-categories?f_product_types=Ready%20to%20ship&sort_by=minimumOrderQuantity")}
                className="image-wrp"
                style={{cursor:"pointer"}} 
              >
                {ship()}
                <span className="svg-text" >READY TO SHIP</span>
              </div>
              <div
                onClick={()=>router.push("/products/all-categories?f_product_types=Express%20custom&sort_by=minimumOrderQuantity")}
                className="image-wrp"
                style={{cursor:"pointer"}} 
              >
                {expres()}
                <span className="svg-text" >Express custom</span>
              </div>
              <div
                onClick={()=>router.push("/products/all-categories?f_product_types=Make%20to%20order&sort_by=minimumOrderQuantity")}
                className="image-wrp"
                style={{cursor:"pointer"}} 
              >
                {ordered()}
                <span className="svg-text" >Made to order</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}