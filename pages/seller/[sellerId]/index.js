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
      `Connect with ${data?.sellerDetails?.brandName} and source quality home & lifestyle products.
      Manufacturer of ${data?.sellerDetails?.categoryDescs.join(", ")} | Qalara` ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:
      data?.sellerDetails?.companyDescription ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
    url:"/seller/"+ data?.sellerId
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

  let res={}; 
  const error={status:false};
  try {

    const response_sellerDetails = await fetch(process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + `/${sellerId}`,{method: "GET"});
    res["sellerDetails"] = await response_sellerDetails.json();

    let id = await res?.sellerDetails?.id?.replace("HOME::", "");

    const response_about =   await fetch(process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/seller-home/ABOUT::" + id +"/about",{method: "GET", headers: {Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,},});
    const res_about = await response_about.json();
    res["about"] = res_about.length > 0 ? res_about[0]["htmlContent"] : "";

    const response_category_product_range = await fetch(process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/seller-home/" + id + "/category-product-range",{method: "GET", headers: {Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,},})
    res["category_product_range"] = await response_category_product_range.json();

  } catch (error) {
    error["status"]=true;
  }
  return {
    props: {
      data: {
        sellerDetails: res.sellerDetails,
        about:res.about,
        category_product_range:res.category_product_range,
        error:error,
        sellerId:sellerId
      },
    },
  };
};
