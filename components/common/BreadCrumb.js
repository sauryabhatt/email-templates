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
    linkTo = "";
  }
  let brandNameSC =
    brandName.toLowerCase().charAt(0).toUpperCase() +
    brandName.toLowerCase().slice(1);
  categoryName = categoryName?.replace(/-/gi, " ");
  categoryName = categoryName?.replace(/and/gi, "&");
  let categoryNameSC = _upperFirst(categoryName);

  return (
    <Breadcrumb className="breadcrumb-text">
      <Breadcrumb.Item>
        <Link href="/">
          <a>Home</a>
        </Link>
      </Breadcrumb.Item>
      {pageId === "product-description" ||
      pageId === "seller-product-listing" ? (
        <Breadcrumb.Item>
          <Link href={`/seller/${vanityId}`}>
            <a>{brandNameSC}</a>
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
