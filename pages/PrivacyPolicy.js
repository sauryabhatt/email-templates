/** @format */

import { Layout } from "../components/common/Layout";
import PrivacyPolicyWrapper from "../components/PrivacyPolicy/PrivacyPolicyWrapper";
export default function PrivacyPolicy() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "How to source from India and South East Asia? How to source handmade goods? How to find verified suppliers from India and South East Asia? How to find genuine suppliers? How to source genuine fair trade products from India and South East Asia?",
    url: "/privacypolicy",
  };

  return (
    <Layout meta={meta}>
      <PrivacyPolicyWrapper />
    </Layout>
  );
}
