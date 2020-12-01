/** @format */

import { Layout } from "../components/common/Layout";
import PromotionDetails from "../components/PromotionDetails/PromotionDetails";
export default function AboutUs() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
    url: "/promotionsfaq",
  };

  return (
    <Layout meta={meta}>
      <PromotionDetails />
    </Layout>
  );
}
