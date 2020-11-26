/** @format */

import { Layout } from "../components/common/Layout";
import FAQ from "../components/FAQ/FAQ";
export default function TermsOfUse() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "How to source from India? How to source handmade goods? How to find verified suppliers from India? How to find genuine suppliers? How to source genuine fair trade products from India?",
    url: "/faqforwholesalebuyers",
  };

  return (
    <Layout meta={meta}>
      <FAQ />
    </Layout>
  );
}
