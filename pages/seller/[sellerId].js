/** @format */

import { Layout } from "../../components/common/Layout";
import SellerLanding from "../../components/SellerLanding/SellerLanding";
import Spinner from "../../components/Spinner/Spinner";
import NotFound from "../../components/NotFound/NotFound";

import { useRouter } from "next/router";
export default function SellerLandingPage({ data }) {
  const router = useRouter();

  const meta = {
    title:
      `Source quality home & lifestyle products from ${
        data?.sellerDetails?.brandName
      }. Manufacturer of ${data?.sellerDetails?.categoryDescs.join(
        ", "
      )} | Qalara` ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Shop for wholesale online. Explore products with quality and product assurance, and place orders securely.",
    keywords: `${
      data?.sellerDetails?.brandName
    }, Global sourcing, ${data?.sellerDetails?.categoryDescs.join(
      ", "
    )}, wholesale, bulk, suppliers, exports, handcrafted, handmade, South East Asia, South Asia`,
    url: "/seller/" + data?.sellerId,
  };

  if (data?.error?.status) {
    return (
      <>
        <NotFound />
      </>
    );
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

export const getStaticProps = async ({ params: { sellerId = "" } = {} }) => {
  let res = {};
  const error = { status: false };

  try {
    const responseSD = await fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + `/${sellerId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
        },
      }
    );
    res["sellerDetails"] = await responseSD.json();

    let id = await res?.sellerDetails?.id?.replace("HOME::", "");

    const response_about = await fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
        "/seller-home/ABOUT::" +
        id +
        "/about",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
        },
      }
    );
    const res_about = await response_about.json();
    res["about"] = res_about.length > 0 ? res_about[0]["htmlContent"] : "";

    const response_category_product_range = await fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
        "/seller-home/" +
        id +
        "/category-product-range",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
        },
      }
    );
    res[
      "category_product_range"
    ] = await response_category_product_range.json();
  } catch (error) {
    error["status"] = true;
  }

  return {
    props: {
      data: {
        sellerDetails: res.sellerDetails || null,
        about: res.about || null,
        category_product_range: res.category_product_range || null,
        error: error,
        sellerId: sellerId,
      },
    },
    revalidate: 1000,
  };
};
