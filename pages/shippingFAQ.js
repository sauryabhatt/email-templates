/** @format */

import { Layout } from "../components/common/Layout";
import ShippingFAQforwholesalebuyers from "../components/ShippingFAQ/ShippingFAQ";

export default function ShippingFAQ() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Digitally. Reliably. Affordably. Responsibly.",
    url: "/shippingFAQforwholesalebuyers",
  };

  return (
    <Layout meta={meta}>
      <ShippingFAQforwholesalebuyers />
    </Layout>
  );
}
