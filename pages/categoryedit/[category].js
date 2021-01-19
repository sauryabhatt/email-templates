/** @format */

import { Layout } from "../../components/common/Layout";
import CategoryEditWrapper from "../../components/CategoryEditWrapper";
import NotFound from "../../components/NotFound/NotFound";

export default function CategoryEditDetails({ data }) {
  let { res, category } = data || {};
  let meta;
  switch (category) {
    case "kitchendining":
      meta = {
        title:
          "Source wholesale Kitchenware products like brass cutlery, marble platters, cheese boards, ceramic cups, copper bottles, handcrafted plates & coasters, coffee sets, cotton hand printed towels",
        description:
          "Source wholesale Kitchenware products like brass cutlery, marble platters, cheese boards, ceramic cups, copper bottles, handcrafted plates & coasters, coffee sets, cotton hand printed towels",
      };
      break;
    case "homedecor":
      meta = {
        title:
          "Shop in bulk for recycled metal chimes, wood storage boxes, hand painted lamps, indigenous decor pieces, terracotta & jute planters, carved candle-stands, diffusers & tealight holders, organic incense, wall plates",
        description:
          "Shop in bulk for recycled metal chimes, wood storage boxes, hand painted lamps, indigenous decor pieces, terracotta & jute planters, carved candle-stands, diffusers & tealight holders, organic incense, wall plates",
      };
      break;
    case "fashionaccessories":
      meta = {
        title:
          "Shop in bulk for jute tote bags, leather satchels, ikat clutch purses, cotton kaftans, handwoven stoles, warm embroidered wraps, block printed scarves, handmade comfy sandals & dress material",
        description:
          "Shop in bulk for jute tote bags, leather satchels, ikat clutch purses, cotton kaftans, handwoven stoles, warm embroidered wraps, block printed scarves, handmade comfy sandals & dress material",
      };
      break;
    case "furniture":
      meta = {
        title:
          "Shop in bulk for bookcases, chairs, sofas, benches, poufs, folding desks and dining tables, rattan outdoor pieces, buffets, storage cabinets, side tables and more",
        description:
          "Shop in bulk for bookcases, chairs, sofas, benches, poufs, folding desks and dining tables, rattan outdoor pieces, buffets, storage cabinets, side tables and more",
      };
      break;
    case "homelinen":
      meta = {
        title:
          "Shop in bulk for block printed bed linen, hand made quilts, embroidered cushions, hand-tufted rugs, applique curtains, kantha throws, organic cotton towels and recycled rugs all produced consciously by Indian suppliers",
        description:
          "Shop in bulk for block printed bed linen, hand made quilts, embroidered cushions, hand-tufted rugs, applique curtains, kantha throws, organic cotton towels and recycled rugs all produced consciously by Indian suppliers",
      };
      break;
    case "stationery-novelty":
      meta = {
        title:
          "Wholesale stationery and novelty products to delight your customers. Shop in bulk for handcrafted journals, DIY kits, wooden table organizers, hand painted ganjifa cards, dice games, vintage binoculars and learning tools.",
        description:
          "Wholesale stationery and novelty products to delight your customers. Shop in bulk for handcrafted journals, DIY kits, wooden table organizers, hand painted ganjifa cards, dice games, vintage binoculars and learning tools.",
      };
    case "baby-kids":
      meta = {
        title:
          "Wholesale bay and kids products, handpicked to help your customers choose the best for the kids and families. Shop in bulk for eco friendly clothing, teethers, rattles and crib mobiles, early learning games and comforting soft toys.",
        description:
          "Wholesale bay and kids products, handpicked to help your customers choose the best for the kids and families. Shop in bulk for eco friendly clothing, teethers, rattles and crib mobiles, early learning games and comforting soft toys.",
      };

    default:
      meta = {
        title:
          "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
        description:
          "How to source from South East Asia? How to source handmade goods? How to find verified suppliers from South East Asia? How to find genuine suppliers? How to source genuine fair trade products from South East Asia?",
      };
      break;
  }
  if (data?.res?.body == null) {
    return (
      <>
        <NotFound />
      </>
    );
  }
  meta["url"] = "/categoryedit/" + category;
  return (
    <Layout meta={meta}>
      <CategoryEditWrapper body={res?.body || "<p>No Data Available</p>"} />
    </Layout>
  );
}

const categoryObj = {
  kitchendining: "KitchenDining",
  homedecor: "HomeDecor",
  fashionaccessories: "fashionaccessories",
  furniture: "Furniture",
  homelinen: "HomeLinen",
  jewelry: "Jewelry",
  "stationery-novelty": "Stationery",
  "baby-kids": "BabyKids",
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
export async function getStaticProps({ params: { category = "" } = {} }) {
  let res;
  const error = { status: false };
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_REACT_APP_CONTENT_URL +
        `/content/${categoryObj[category.toLowerCase()]}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
        },
      }
    );
    res = await response.json();
  } catch (error) {
    error["status"] = true;
  }
  return {
    props: {
      data: {
        res: res,
        category: category.toLowerCase(),
        error: error,
      },
    },
  };
}
