/** @format */

import { Layout } from "../components/common/Layout";
import HomePage from "../components/HomePage/Home";
export default function Home() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South East Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from South East Asia. Digitally. Reliably. Affordably. Responsibly.",
    keywords:
      "handmade, fair trade, wholesale buying, global sourcing, Indian crafts, Exporters from South East Asia, Verified manufacturers and suppliers, B2B platform",
    url: "/",
  };

  return (
    <Layout meta={meta}>
      <HomePage />
    </Layout>
  );
}
