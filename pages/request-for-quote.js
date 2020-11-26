/** @format */

import { Layout } from "../components/common/Layout";
import RFQWrapper from "../components/RequestForQuote/SwitchRFQ";
export default function RFQ() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
    url: "/request-for-quote",
  };

  return (
    <Layout meta={meta}>
      <RFQWrapper />
    </Layout>
  );
}
