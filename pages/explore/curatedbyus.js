/** @format */

import { Layout } from "../../components/common/Layout";
import CuratedByUsWrapper from "../../components/CuratedByUs"
export default function AboutUs() {
  const meta = {
    title:"Shop curated trends at Qalara wholesale marketplace for artisanal and sustainable lifestyle products.",
    description:"Shop curated trends at Qalara wholesale marketplace for artisanal and sustainable lifestyle products. Discover latest trends in wellness, homeoffice, earthinspired, urbanjungle, and craft forms across carving & inlay, hand weaving, metal work, and shop in bulk.",
    keywords:"Curated, trends, values, categories, wholesale, bulk, ready-to-ship, custom, fashion, accessories, homedecor, furniture, rugs, kitchen, dining, linen, furnishings, artisanal, organic, sustainable, ecofriendly India, Southeast asia, carving, inlay, basketry, weaving, metal, global, exports, imports, vendors, suppliers",
    url:"/explore/curatedbyus"
    };

  return <Layout meta={meta}><CuratedByUsWrapper/></Layout>;
}
