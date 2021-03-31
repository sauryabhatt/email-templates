/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../components/common/Layout";
import Spinner from "../components/Spinner/Spinner";
const DynamicErrorWrapper = dynamic(
  () => import("../components/Error500/Error500"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function Error() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India and South East Asia. Digitally. Reliably. Affordably. Responsibly.",
  };

  return (
    <Layout meta={meta}>
      <DynamicErrorWrapper />
    </Layout>
  );
}
