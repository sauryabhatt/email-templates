/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../components/common/Layout";
import Spinner from "../components/Spinner/Spinner";
const DynamicNotFoundWrapper = dynamic(
  () => import("../components/NotFound/NotFound"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function NotFound() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
  };

  return (
    <Layout meta={meta}>
      <DynamicNotFoundWrapper />
    </Layout>
  );
}
