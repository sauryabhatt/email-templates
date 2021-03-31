/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../components/common/Layout";
import Spinner from "../components/Spinner/Spinner";

const DynamicFAQ = dynamic(() => import("../components/FAQ/FAQ"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function FAQForWholesaleBuyers() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India and South East Asia | Qalara",
    description:
      "How to source wholesale from India and South East Asia? How to source handmade goods? How to find verified suppliers from India and South East Asia? How to find genuine suppliers? How to source fair trade products from India and South East Asia?",
    keywords:
      "handmade, fair trade, wholesale buying, global sourcing, Indian crafts, Exporters from India and South East Asia, Verified manufacturers and suppliers, B2B platform",
    url: "/faqforwholesalebuyers",
  };

  return (
    <Layout meta={meta}>
      <>
        <DynamicFAQ />
      </>
    </Layout>
  );
}
