/** @format */

import { Layout } from "../../components/common/Layout";
import SellerListing from "../../components/SellerListing/SellerListing";
import Spinner from "../../components/Spinner/Spinner";
import NotFound from "../../components/NotFound/NotFound";

import { useRouter } from "next/router";
export default function SellerListingPage({ data }) {
  const router = useRouter();
  const { categoryId = "" } = data || {};

  let meta;
  switch (categoryId) {
    case "home-furnishing":
      meta = {
        title: "Source quality Home furnishing suppliers  from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "Wholesale home furnishing brands who cater to all your needs for sheets, quilts, blankets, cushions, throws, rugs, table mats, runners and more, handcrafted in a wide variety of techniques like applique, kantha, macrame, tufting and hand weaving.",
      };
      break;

    case "furniture-and-storage":
      meta = {
        title: "Source quality Furniture suppliers  from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "Discover bulk furniture suppliers for chairs, benches, coffee tables, dressers and more, made in artisinal techniques like hand carving, hand weaving & hand painting. Choose from sustainable materials across wood, metal, wicker, rope & marble.",
      };
      break;

    case "home-decor-and-accessories":
      meta = {
        title: "Source quality Home decor suppliers and accessories  from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "Handpicked wholesale home decor suppliers who specialize in artisanal techniques of hand carved wood, marble inlay, metal sand casting, cane weaving to create beautiful home accents; lamps, baskets, vases, mirrors, clocks.",
      };
      break;

    case "kitchen-and-dining":
      meta = {
        title: "Source quality Kitchenware suppliers from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "Curated wholesale brands for platters, cutlery, mugs, wine glasses & kitchen storage. Hand carved & hand painted kitchenware turns everyday utilities into objects of art. Choose from sustainable materials like wood, iron, ceramic & glass.",
      };
      break;

    case "fashion":
      meta = {
        title: "Source quality Fashion accessories and textiles suppliers from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "The best wholesale textile and fashion accessories suppliers across silk, cashmere, cotton and other fabrics specializing in shibori, tie-dye, hand weaving, embroidery, patchwork and many more intricate techniques.",
      };
      break;

    case "pets-essentials":
      meta = {
        title: "Source quality Pets accessories suppliers from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "Pet accessories wholesale suppliers who cater to all pet needs like food bowls, beds, mats and toys. Crafted in specialized techniques of knitting, patchwork, embroidery in sustainable materials like wood, leather, cotton and more.",
      };
      break;

    case "baby-and-kids":
      meta = {
        title: "Source quality Baby & Kids accessories suppliers from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "The best wholesale suppliers specialising in baby and kids products. Choose from a wide range of available designs in crib sets, sheets, quilts, diaper bags and even customize designs to your specifications. These exquisite handcrafted eco-friendly wooden and cotton toys will become a part of your kid’s treasures.",
      };
      break;

    case "jewelry":
      meta = {
        title: "Source quality Jewelry suppliers from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "Wholesale suppliers for all kinds of Jewelry and accessories. Our sellers specialise in techniques like hammering, inlay, gem craft, wire braiding and more to create stunning earrings, anklets, necklaces, bracelets, nose pins and other accessories.",
      };
      break;

    default:
      meta = {
        title: "Source quality All curated suppliers from verified manufacturers at affordable wholesale prices | Qalara",
        description:
          "Wholesale suppliers for all kinds of Jewelry and accessories. Our sellers specialise in techniques like hammering, inlay, gem craft, wire braiding and more to create stunning earrings, anklets, necklaces, bracelets, nose pins and other accessories.",
      };
  }
  if(data?.error?.status) {
    return <><NotFound /></>;
  }
  if (router.isFallback) {
    return <Spinner />;
  }
  return (
    <Layout meta={meta}>
      <SellerListing data={data} />
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
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      "/seller-homev2?from=0&size=30&sort_by=popularity&sort_order=DESC"
    );
  } else {
    return (
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      `/seller-homev2?from=0&size=30&sort_by=popularity&sort_order=DESC&f_categories=${category}`
    );
  }
};

export const getStaticProps = async ({ params: { categoryId = "" } = {} }) => {
  
  let res; 
  const error={status:false};
  try {
  const response = await fetch(getURL(categoryId), {
    method: "GET",
  });
  res = await response.json();
  } catch (error) {
    error["status"]=true;
  }
  return {
    props: {
      data: {
        slp_count: res.totalHits,
        slp_content: res.sellerHomeLiteViews,
        slp_facets: res.aggregates,
        slp_categories: res.fixedAggregates,
        categoryId: categoryId,
        error:error
      },
    },
  };
};
