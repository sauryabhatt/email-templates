/** @format */

import { Layout } from "../../../components/common/Layout";
import SellerLanding from "../../../components/SellerLanding/SellerLanding";
import Spinner from "../../../components/Spinner/Spinner";
import NotFound from "../../../components/NotFound/NotFound";

import { useRouter } from "next/router";
export default function SellerLandingPage({ data }) {
  const router = useRouter();

  const meta = {
    title:
      data?.sellerDetails?.brandName ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:
      data?.sellerDetails?.companyDescription ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
  };
  if(data?.error?.status) {
    return <><NotFound /></>;
  }

  if (router.isFallback) {
    return <Spinner />;
  }
  return (
    <Layout meta={meta}>
      <SellerLanding data={data} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async ({ params }) => {
  const { sellerId } = params || {};

  let res; 
  const error={status:false};
  try {
  const response = await fetch(
    process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + `/${sellerId}`,
    {
      method: "GET",
    }
    );
  res = await response.json();
  } catch (error) {
    error["status"]=true;
  }
  return {
    props: {
      data: {
        sellerDetails: res,
        error:error
      },
    },
  };
};
