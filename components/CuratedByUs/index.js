/** @format */

import React, { useState } from "react";

import values1 from "../../public/filestore/Landing-page/values1.jpg";
import values2 from "../../public/filestore/Landing-page/values2.jpg";
import values3 from "../../public/filestore/Landing-page/values3.jpg";
import values4 from "../../public/filestore/Landing-page/values4.jpg";
import values5 from "../../public/filestore/Landing-page/values5.jpg";
import values6 from "../../public/filestore/Landing-page/values6.jpg";

import trend1 from "../../public/filestore/Landing-page/trend1.jpg";
import trend2 from "../../public/filestore/Landing-page/trend2.jpg";
import trend3 from "../../public/filestore/Landing-page/trend3.jpg";
import trend4 from "../../public/filestore/Landing-page/trend4.jpg";
import trend5 from "../../public/filestore/Landing-page/trend5.jpg";
import trend6 from "../../public/filestore/Landing-page/trend6.jpg";

import category1 from "../../public/filestore/Landing-page/category1.jpg"
import category2 from "../../public/filestore/Landing-page/category2.jpg"
import category3 from "../../public/filestore/Landing-page/category3.jpg"
import category4 from "../../public/filestore/Landing-page/category4.jpg"
import category5 from "../../public/filestore/Landing-page/categorys5.jpg"
import category6 from "../../public/filestore/Landing-page/category6.jpg"

import craft1 from "../../public/filestore/Landing-page/craft1.jpg";
import craft2 from "../../public/filestore/Landing-page/craft2.jpg";
import craft3 from "../../public/filestore/Landing-page/craft3.jpg";
import craft4 from "../../public/filestore/Landing-page/craft4.jpg";

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
      img: trend1,
      text: "Earth inspired",
      alt: "Source Earth Inspired products from India",
    },
    {
      url: "/trends/urbanjungle",
      img: trend2,
      text: "Urban jungle",
      alt:
        "Collection of wholesale handmade and sustainable products from Qalara",
    },
    {
      url: "/trends/globaltextures",
      img: trend3,
      text: "Global textures",
      alt:
        "Source beautiful traditional crafts and textures by Indian artisans from Qalara",
    },
    {
      url: "/trends/homeoffice",
      img: trend4,
      text: "Home office",
      alt:
        "Collection of home workspace by our artisanal and responsible sellers fro Qalara",
    },
    {
      url: "/trends/christmasspirit",
      img: trend5,
      text: "Holiday spirit",
      alt:
        "Explore holiday decorations perfect for any celebration from Qalara",
    },
    {
      url: "/trends/sunkissed-spring21",
      img: trend6,
      text: "Sunlit Spring '21",
      alt: "Sunlit Spring '21",
    },
  ];

  const category = [
    {
      url: "/categoryedit/kitchendining",
      img: category1,
      text: "Kitchen & dining",
      alt: "Wholesale kitchenware and dinnerware products from Qalara",
    },
    {
      url: "/categoryedit/homedecor",
      img: category2,
      text: "Home decor",
      alt: "Wholesale home accents & utilities from Qalara",
    },
    {
      url: "/categoryedit/furniture",
      img: category3,
      text: "Furniture",
      alt: "Source collection of handpicked wholesale furniture from Qalara",
    },
    {
      url: "/categoryedit/homelinen",
      img: category4,
      text: "Home linen",
      alt: "Wholesale furnishings & linens from Qalara",
    },
    {
      text: "Jewelry",
      img: category5,
      url: "/categoryedit/jewelry",
      alt: "Explore jewelry handcrafted by Indian artisans from Qalara",
    },
    {
      text: "Fashion accessories",
      img: category6,
      url: "/categoryedit/fashionaccessories",
      alt: "",
    },
  ];

  const crafts = [
    {
      url: "/artisancrafts/carvingandinlay",
      img: craft1,
      text: "Carving & Inlay",
      alt:
        "Shop wholesale for unique products from our curated, responsible sellers ",
    },
    {
      url: "/artisancrafts/metalcrafts",
      img: craft2,
      text: "Metal crafts",
      alt: "Explore Qalara's curation of traditional crafts across South Asia",
    },
    {
      url: "/artisancrafts/basketry",
      img: craft3,
      text: "Basketry",
      alt: "Sustainable and eco-friendly handmade products curated by Qalara",
    },
    {
      url: "/artisancrafts/textileweaves",
      img: craft4,
      text: "Knots & Weaves",
      alt:
        "Shop wholesale textiles crafted in indigenous techniques from Qalara",
    },
  ];

  const values = [
    {
      url: "/sellers/all-categories?f_values=ORGANIC",
      img: values1,
      text: "Organic",
      alt: "Explore selection of organic products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=ECO_FRIENDLY",
      img: values2,
      text: "Ecofriendly",
      alt: "Explore selection of eco friendly  products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=FAIR_TRADE",
      img: values3,
      text: "Fair & social",
      alt: "Explore our selection of fair and social products  by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=RECYCLED",
      img: values4,
      text: "Recycled",
      alt: " Explore selection of recycled products  by Qalara",
    },
    {
      text: "Sustainable",
      img: values5,
      url: "/sellers/all-categories?f_values=SUSTAINABLE",
      alt: " Explore selection of sustainable products by Qalara",
    },
    {
      url: "/sellers/all-categories?f_values=ARTISANAL",
      img: values6,
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
            <div className="button-wrp">
              <Link href="/request-for-quote" className="button">
                request for quote
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
                    <div className="image-wrp" onClick={()=>router.push(e.url)}>
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
            style={{ backgroundImage: "url(" + zoom_url.img + ")" }}
            className="fold-heading"
          >
            <div className="dialog-box">
              <span className="dialog-big-text">Handcrafted by artisans</span>
              <span className="dialog-small-text">{zoom_url.text}</span>
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
              <Link
                href="/products/all-categories?f_product_types=Ready%20to%20ship&sort_by=visibleTo"
                className="image-wrp"
              >
                {ship()}
                <span className="svg-text">READY TO SHIP</span>
              </Link>
              <Link
                href="/products/all-categories?f_product_types=Express%20custom&sort_by=visibleTo"
                className="image-wrp"
              >
                {expres()}
                <span className="svg-text">Express custom</span>
              </Link>
              <Link
                href="/products/all-categories?f_product_types=Make%20to%20order&sort_by=visibleTo"
                className="image-wrp"
              >
                {ordered()}
                <span className="svg-text">Made to order</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}