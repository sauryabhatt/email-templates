/** @format */

import { Layout } from "../components/common/Layout";
import ApplyToSell from "../components/ApplyToSell/ApplyToSell";
export default function ApplyToSellWrapper() {
  const meta = {
    title:
      "Discover verified global buyers digitally | Export Handicrafts, Textiles, Furniture, Décor & more | Qalara",
    description:
      "Discover verified global buyers digitally. Export Handicrafts, Textiles, Furniture, Décor & more digitally.",
    keywords:
      "Export from India, Export handicrafts, Find global buyers, Wholesale exports, Export home décor and textiles",
    url: "/applytosell",
  };

  return (
    <Layout meta={meta}>
      <ApplyToSell />
    </Layout>
  );
}
