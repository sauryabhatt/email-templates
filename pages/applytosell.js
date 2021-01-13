/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../components/common/Layout";
import Spinner from "../components/Spinner/Spinner";
import Auth from "../components/common/Auth";

const DynamicApplyToSellWrapper = dynamic(
  () => import("../components/ApplyToSell/ApplyToSell"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function ApplyToSellWrapper() {
  const meta = {
    title: "Apply to Sell | Qalara",
    description:
      "Discover verified global buyers digitally. Export Handicrafts, Textiles, Furniture, Décor & more digitally.",
    keywords:
      "Export from India, Export handicrafts, Find global buyers, Wholesale exports, Export home décor and textiles",
    url: "/applytosell",
  };

  return (
    <Layout meta={meta} privateRoute>
      <Auth path="/applytosell">
        <>
          <DynamicApplyToSellWrapper />
        </>
      </Auth>
    </Layout>
  );
}
