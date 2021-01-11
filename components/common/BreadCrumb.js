/** @format */

import React from "react";
import { Breadcrumb } from "antd";
import Link from "next/link";
import _upperFirst from "lodash/upperFirst";

function BreadCrumb(props) {
  let { pageId = "", categoryName = "", brandName = "", vanityId = "" } = props;

  let pageName = "Category";
  let linkTo = "/products/all-categories";
  if (pageId === "seller-listing") {
    pageName = "Sellers";
    linkTo = "/sellers/all-categories";
  } else if (pageId === "search-listing") {
    pageName = "Search";
    linkTo = "/";
  }
  let brandNameSC =
    brandName.toLowerCase().charAt(0).toUpperCase() +
    brandName.toLowerCase().slice(1);

  const getCategoryName = (categoryName) => {
    if (categoryName === "all-categories") {
      return "All categories";
    } else if (categoryName === "baby-and-kids") {
      return "Baby & kids";
    } else if (categoryName === "fashion") {
      return "Fashion";
    } else if (categoryName === "furniture-and-storage") {
      return "Furniture & storage";
    } else if (categoryName === "home-decor-and-accessories") {
      return "Home décor & accessories";
    } else if (categoryName === "home-furnishing") {
      return "Home furnishing";
    } else if (categoryName === "jewelry") {
      return "Jewelry";
    } else if (categoryName === "kitchen-and-dining") {
      return "Kitchen & dining";
    } else if (categoryName === "pets-essentials") {
      return "Pets essentials";
    } else if (categoryName === "stationery-and-novelty") {
      return "Stationery & novelty";
    } else return _upperFirst(categoryName);
  };

  let categoryNameSC = getCategoryName(categoryName);

  return (
    <Breadcrumb className="breadcrumb-text qa-fs-12">
      <Breadcrumb.Item>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Breadcrumb.Item>
      {pageId === "product-description" ||
      pageId === "seller-product-listing" ? (
        <Breadcrumb.Item>
          <Link href={`/seller/${vanityId}`}>
            <a>{brandName}</a>
          </Link>
        </Breadcrumb.Item>
      ) : (
        <Breadcrumb.Item>
          <Link href={linkTo}>
            <a>{pageName}</a>
          </Link>
        </Breadcrumb.Item>
      )}
      <Breadcrumb.Item>{categoryNameSC}</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default BreadCrumb;
