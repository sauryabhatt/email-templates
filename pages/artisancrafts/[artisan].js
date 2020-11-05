import { Layout } from "../../components/common/Layout";
import CategoryEditWrapper from "../../components/CategoryEditWrapper"

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

  return (
    <Layout meta={meta}>
      <CategoryEditWrapper body={res.body}/>
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
  const response = await fetch(
    process.env.NEXT_PUBLIC_REACT_APP_CONTENT_URL +
      `/content/${artisanObj[artisan.toLowerCase()]}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MTIyNTU0MjgsImlhdCI6MTYwNDQ3OTQyOCwianRpIjoiZWUxMjk1YTMtNTlmMi00MzRlLTk3NjMtZTY5MzBiZThkZDAwIiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiYTIwMTg5YTYtNjgzZC00YjI3LWI3ZDktMmFmNTA3MzY4Y2QzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4wLjQyIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtcmVhY3R1aSIsImNsaWVudEFkZHJlc3MiOiIxMC4yLjAuNDIifQ.V6-7rnSb6RxhxwsDolIMx6MtdUUSoZjOsFIAF5S9f8OCCm_MCeane_xQYqR_49jZ8S2eiTk829n6UtVmr-ogtrtb0-L9akHw_8JyNDErd2yir0vQODjgJgVrMvgHrbywzD536n4Xv610pQWmnCfCUGgezTthwf5-I0sek0ZvSAYg0EnUcs4TcrSfG7Raqx_-32ngWORriOub6OXdA7gNwINJ0_WBtghz5OfG1gEP9kBZGJK5Ze-02qv_I2ioQo0E7dt7sMYS7cjbhzxCuHllaM1-3MNdkJ1GfW9g66LIcal7JdR0RVzQvqXjoUlz_SohSegGAC19gwojD8G9nc3FTw",
      },
    }
  );
  const res = await response.json();

  return {
    props: {
      data :{
        res:res,
        artisan:artisan.toLowerCase()
      }
    },
  };
}