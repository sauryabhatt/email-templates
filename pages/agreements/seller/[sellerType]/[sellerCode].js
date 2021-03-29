/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../../../../components/common/Layout";
import Spinner from "../../../../components/Spinner/Spinner";
import Auth from "../../../../components/common/Auth";
import { useRouter } from "next/router";

const DynamicSellerAgreementWrapper = dynamic(
  () => import("../../../../components/SellerAgreement/SellerAgreement"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function SellerAgreement() {
  const router = useRouter();

  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India and South East Asia. Digitally. Reliably. Affordably. Responsibly.",
  };

  return (
    <Layout meta={meta} privateRoute>
      <Auth
        path={`/agreements/seller/${router.query.sellerType}/${router.query.sellerCode}`}
      >
        <>
          <DynamicSellerAgreementWrapper />
        </>
      </Auth>
    </Layout>
  );
}
