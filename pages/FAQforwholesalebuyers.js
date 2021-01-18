/** @format */

import { Layout } from "../components/common/Layout";
import FAQ from "../components/FAQ/FAQ";
export default function TermsOfUse() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South East Asia | Qalara",
    description:
      "How to source wholesale from South East Asia? How to source handmade goods? How to find verified suppliers from South East Asia? How to find genuine suppliers? How to source fair trade products from South East Asia?",
    keywords:
      "handmade, fair trade, wholesale buying, global sourcing, Indian crafts, Exporters from South East Asia, Verified manufacturers and suppliers, B2B platform",
    url: "/faqforwholesalebuyers",
  };

  return (
    <Layout meta={meta}>
      <FAQ />
    </Layout>
  );
}
