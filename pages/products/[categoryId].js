/** @format */

import { Layout } from "../../components/common/Layout";
import ProductListing from "../../components/ProductListing/ProductListing";
import Spinner from "../../components/Spinner/Spinner";
import { useRouter } from "next/router";
export default function ProductListingPage({ data }) {
  const router = useRouter();
  const { categoryId = "" } = data || {};
  let meta;
  switch (categoryId) {
    case "home-furnishing":
      meta = {
        title: "Home furnishings & linens",
        description:
          "Wholesale cushions, throws, quilts, bedding, bath linen, rugs & carpets",
      };
      break;

    case "furniture-and-storage":
      meta = {
        title: "Furniture & storage",
        description:
          "Shop bookcases, benches, chairs, desks, wine cabinets, trunks, beds & poufs in bulk",
      };
      break;

    case "home-decor-and-accessories":
      meta = {
        title: "Home decor",
        description:
          "Wholesale home decor, lighting, ornaments, wall art, candlesticks and garden accessories",
      };
      break;

    case "kitchen-and-dining":
      meta = {
        title: "Kitchen & dining",
        description:
          "Shop tableware, dinnerware, cookware, utensils, cutlery, linens & bar accessories in bulk",
      };
      break;

    case "fashion":
      meta = {
        title: "Fashion, accessories & textiles",
        description:
          "Wholesale textiles, apparel, scarves, stoles, bags, shawls, belts & footwear",
      };
      break;

    case "pets-essentials":
      meta = {
        title: "Pet accessories",
        description:
          "Shop dog beds, feeders, cat towers, collars & leashes in bulk",
      };
      break;

    case "baby-and-kids":
      meta = {
        title: "Baby & kids products",
        description:
          "Shop in bulk for organic cotton crib sets, eco-friendly toys, learning tools and & kids furniture",
      };
      break;

    case "jewelry":
      meta = {
        title: "Jewelry",
        description:
          "Wholesale earrings, necklaces, bracelets, rings, nose pins and cuff links",
      };
      break;

    default:
      meta = {
        title: "All categories",
        description:
          "Shop handcrafted and artisanal products, produced ethically at wholesale prices",
      };
  }

  if (router.isFallback) {
    return <Spinner />;
  }
  return (
    <Layout meta={meta}>
      <ProductListing data={data} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
const getURL = (category) => {
  if (category === "all-categories") {
    return (
      process.env.REACT_APP_API_FACET_PRODUCT_URL +
      "/plp?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC"
    );
  } else {
    return (
      process.env.REACT_APP_API_FACET_PRODUCT_URL +
      `/plp?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC&f_categories=${category}`
    );
  }
};
export const getStaticProps = async ({ params: { categoryId = "" } = {} }) => {
  const response = await fetch(getURL(categoryId), {
    method: "GET",
  });
  const res1 = await response.json();
  return {
    props: {
      data: {
        slp_count: res1.totalHits,
        slp_content: res1.products,
        slp_facets: res1.aggregates,
        slp_categories: res1.fixedAggregates,
        categoryId: categoryId,
      },
    },
  };
};
