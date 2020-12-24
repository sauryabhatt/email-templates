/** @format */

import { Layout } from "../../components/common/Layout";
import ProductListing from "../../components/ProductListing/ProductListing";
import Spinner from "../../components/Spinner/Spinner";
import { useRouter } from "next/router";
import NotFound from "../../components/NotFound/NotFound";

export default function ProductListingPage({ data }) {
  const router = useRouter();
  const { categoryId = "" } = data || {};

  if (data?.error?.status) {
    return (
      <>
        <NotFound />
      </>
    );
  }

  const meta = {
    title: `Buy ${categoryId
      ?.split("-")
      ?.join(
        " "
      )} wholesale from Indian suppliers.Shop thousands of products wholesale | Qalara`,
    description: `Looking to buy wholesale  ${categoryId
      ?.split("-")
      ?.join(
        " "
      )} from Indian manufacturers? Source online with ease from Qalara.com, your reliable partner for ${categoryId
      ?.split("-")
      ?.join(" ")} from India.`,
    keywords: `${categoryId
      ?.split("-")
      ?.join(" ")} wholesale, ${categoryId
      ?.split("-")
      ?.join(" ")} sourcing, ${categoryId
      ?.split("-")
      ?.join(" ")} manufacturers, ${categoryId
      ?.split("-")
      ?.join(" ")} India, ${categoryId?.split("-")?.join(" ")} exporters`,
    url: `/products/${categoryId}`,
  };
  if (router.isFallback) {
    return <Spinner />;
  }
  return (
    <Layout meta={meta}>
      <ProductListing data={data} />
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
      "/plpv2?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC"
    );
  } else {
    return (
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      `/plpv2?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC&f_categories=${category}`
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
        slp_count: res?.totalHits,
        slp_content: res?.products,
        slp_facets: res?.aggregates,
        slp_categories: res?.fixedAggregates,
        categoryId: categoryId,
        error: error,
      },
    },
  };
};
