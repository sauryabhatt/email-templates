/** @format */

import { Layout } from "../components/common/Layout";
import ProductListing from "../components/ProductListing/ProductListing";
import Spinner from "../components/Spinner/Spinner";
import NotFound from "../components/NotFound/NotFound";
import { useRouter } from "next/router";

export default function ListingPage({ data }) {
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
      ?.join(" ")} from South East Asia.`,
    keywords: `${categoryId
      ?.split("-")
      ?.join(" ")} wholesale, ${categoryId
      ?.split("-")
      ?.join(" ")} sourcing, ${categoryId
      ?.split("-")
      ?.join(" ")} manufacturers, ${categoryId
      ?.split("-")
      ?.join(" ")} South East Asia, ${categoryId
      ?.split("-")
      ?.join(" ")} exporters`,
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

const getURL = () => {
  return (
    process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
    "/custom/plp?sort_by=popularity&sort_order=DESC&size=30&from=0"
  );
};

export const getStaticProps = async () => {
  let res;
  const error = { status: false };
  try {
    const response = await fetch(getURL(), {
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
        slp_content: res?.products || null,
        slp_facets: res?.aggregates || null,
        slp_categories: res?.fixedAggregates || null,
        gb: true,
        categoryId: "all-categories",
        error: error,
      },
    },
  };
};
