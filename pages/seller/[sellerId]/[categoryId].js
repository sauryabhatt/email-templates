/** @format */

import { Layout } from "../../../components/common/Layout";
import SellerProductListing from "../../../components/SellerProductListing/SellerProductListing";
import Spinner from "../../../components/Spinner/Spinner";
import { useRouter } from "next/router";
import NotFound from "../../../components/NotFound/NotFound";

export default function SellerProductListingPage({ data }) {
  const router = useRouter();

  const meta = {
    title:
      `Source quality ${data?.sellerDetails?.categoryDescs.join(", ")} from ${
        data?.sellerDetails?.brandName
      } for
      wholesale. | Qalara` ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      `Buy ${data?.sellerDetails?.categoryDescs.join(", ")} from ${
        data?.sellerDetails?.brandName
      } online and get it delivered at your doorstep. Check out all the products, pricing and place your order online, securely.` ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
    keywords: `${
      data?.sellerDetails?.brandName
    }, ${data?.sellerDetails?.categoryDescs.join(
      ", "
    )}, Global sourcing, wholesale, exports, handcrafted, India, bulk, vendors, manufacturer`,
    url: `/seller/${data?.sellerId}/${data?.categoryId}`,
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
      <SellerProductListing data={data} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

const getURL = (categoryId, sellerId) => {
  if (categoryId?.toLowerCase() === "all-categories") {
    return (
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      `/splpv2?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC&sellerId=${sellerId}`
    );
  } else {
    return (
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      `/splpv2?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC&sellerId=${sellerId}&f_categories=${categoryId}`
    );
  }
};
export const getStaticProps = async ({ params }) => {
  const { categoryId, sellerId } = params || {};

  let res1, sellerDetails;
  const error = { status: false };
  try {
    const response = fetch(getURL(categoryId, sellerId), {
      method: "GET",
    });
    const sellerResponse = fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
        "/seller-home/internal-views?view=SPLP&id=" +
        sellerId,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
        },
      }
    );
    const [res, sellerRes] = await Promise.all([response, sellerResponse]);
    res1 = await res.json();
    sellerDetails = await sellerRes.json();
  } catch (error) {
    error["status"] = true;
  }
  return {
    props: {
      data: {
        slp_count: res1?.totalHits,
        slp_content: res1?.products,
        slp_facets: res1?.aggregates,
        slp_categories: res1?.fixedAggregates,
        sellerDetails: sellerDetails,
        error: error,
        sellerId: sellerId,
        categoryId: categoryId,
      },
    },
  };
};
