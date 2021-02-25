/** @format */

import { Layout } from "../../components/common/Layout";
import SellerListing from "../../components/SellerListing/SellerListing";
import Spinner from "../../components/Spinner/Spinner";
import NotFound from "../../components/NotFound/NotFound";
import { useRouter } from "next/router";

export default function SellerListingPage({ data }) {
  const router = useRouter();
  const { categoryId = "" } = data || {};
  const meta = {
    title: `Source quality ${categoryId
      ?.split("-")
      ?.join(
        " "
      )} from verified manufacturers at affordable wholesale prices | Qalara`,
    description: `Shop ${categoryId
      ?.split("-")
      ?.join(
        " "
      )} wholesale from sellers online, pay securely and get it delivered at your doorstep with product assurance.`,
    keywords: `Global sourcing, ${categoryId
      ?.split("-")
      ?.join(
        " "
      )}, wholesale, exports, handcrafted, bulk, suppliers, manufacturers, vendors, South East Asia`,
    url: `/sellers/${categoryId}`,
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
      <SellerListing data={data} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
const getURL = (category) => {
  if (category === "all-categories") {
    return (
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      "/seller-homev2?from=0&size=30&sort_by=popularity&sort_order=DESC"
    );
  } else {
    return (
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      `/seller-homev2?from=0&size=30&sort_by=popularity&sort_order=DESC&f_categories=${category}`
    );
  }
};

export const getStaticProps = async ({ params: { categoryId = "" } = {} }) => {
  let res;
  const error = { status: false };
  try {
    const response = await fetch(getURL(categoryId), {
      method: "GET",
    });
    res = await response.json();
  } catch (error) {
    error["status"] = true;
  }
  return {
    props: {
      data: {
        slp_count: res?.totalHits || null,
        slp_content: res?.sellerHomeLiteViews || null,
        slp_facets: res?.aggregates || null,
        slp_categories: res?.fixedAggregates || null,
        categoryId: categoryId.toLowerCase(),
        error: error,
      },
    },
  };
};
