import { Layout } from "../../components/common/Layout";
import CategoryEditWrapper from "../../components/CategoryEditWrapper"
import NotFound from "../../components/NotFound/NotFound";

export default function ArtisanDetails({ data }) {
  let { res, artisan } = data || {};
  let meta;

  switch (artisan) {
    case "textileweaves":
      meta={
        title:"Shop wholesale textiles crafts like tangalia, jamdani, ikat, namda, chanderi, hand-knotted, extra weft, zardozi and more",
        description:"Shop wholesale textiles crafts like tangalia, jamdani, ikat, namda, chanderi, hand-knotted, extra weft, zardozi and more"
      }
      break;
    case "carvingandinlay":
      meta={
        title:"Shop wholesale for wood turning, horn & bone craft, hand lacquer, marble inlay, stone carving, wood cutting, hand engraving & more traditional crafts from southeast Asia",
        description:"Shop wholesale for wood turning, horn & bone craft, hand lacquer, marble inlay, stone carving, wood cutting, hand engraving & more traditional crafts from southeast Asia"
      }
      break;
    case "basketry":
      meta={
        title:"Shop wholesale laundry baskets, storage boxes, bags, hats, coasters, placemats, planters and also customise products",
        description:"Shop wholesale laundry baskets, storage boxes, bags, hats, coasters, placemats, planters and also customise products"
      }
      break;
    case "metalcrafts":
      meta={
        title:"Shop wholesale decor and accessories in brass, copper, iron and wrought iron, produced consciously and responsibly",
        description:"Shop wholesale decor and accessories in brass, copper, iron and wrought iron, produced consciously and responsibly"
      }
      break;
    default:
      meta = {
        title:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
        description:"How to source from India? How to source handmade goods? How to find verified suppliers from India? How to find genuine suppliers? How to source genuine fair trade products from India?",
      }
      break;
  }
  if(data?.error?.status || res?.body == null) {
    return <><NotFound /></>;
  }
  return (
    <Layout meta={meta}>
      <CategoryEditWrapper body={res?.body || "<p>No Data Available</p>"}/>
    </Layout>
  );
}

const artisanObj = {
    textileweaves:"WeavesKnot",
    carvingandinlay:"CarvingInlay",
    basketry:"Basketry",
    metalcrafts:"MetalCrafts"
}
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
export async function getStaticProps({ params: { artisan = "" } = {} }) {

  let res; 
  const error={status:false};
  try {
  const response = await fetch(
    process.env.NEXT_PUBLIC_REACT_APP_CONTENT_URL +
      `/content/${artisanObj[artisan.toLowerCase()]}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization:
          "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
      },
    }
  );
  res = await response.json();
  } catch (e) {
    error["status"]=true;
  }

  return {
    props: {
      data :{
        res:res,
        artisan:artisan.toLowerCase(),
        error:error
      }
    },
  };
}