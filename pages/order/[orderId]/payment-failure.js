/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../../../components/common/Layout";
import Spinner from "../../../components/Spinner/Spinner";
const DynamicPaymentFailureWrapper = dynamic(
  () => import("../../../components/PaymentConfirmation/PaymentFailure"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function PaymentFailure() {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from South East Asia. Digitally. Reliably. Affordably. Responsibly.",
  };

  return (
    <Layout meta={meta}>
      <DynamicPaymentFailureWrapper />
    </Layout>
  );
}
