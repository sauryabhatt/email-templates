/** @format */

import { useRouter } from "next/router";
import { Layout } from "../../../components/common/Layout";
import Spinner from "../../../components/Spinner/Spinner";
import NotFound from "../../../components/NotFound/NotFound";
import SearchListing from "../../../components/SearchListing/SearchListing";

export default function SearchListingPage({ data }) {
  const router = useRouter();
  const { search, searchBy } = router.query;
  let categoryTitle = `Showing ${
    searchBy === "products" ? "products" : "sellers"
  } related to ${decodeURIComponent(search)}`;
  const meta = {
    title: `Source quality ${categoryTitle} from verified manufacturers at affordable wholesale prices | Qalara`,
    description: `Buy ${categoryTitle} wholesale from sellers online, pay securely and get it delivered at your doorstep anywhere in the world.`,
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
      <SearchListing data={data} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
const getURL = (searchByLC, search) => {
  if (searchByLC === "product") {
    return (
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      `/plpv2?from=0&size=30&sort_by=popularity&sort_order=DESC&searchBy=product&search=${search}`
    );
  } else {
    return (
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
      `/seller-homev2?from=0&size=30&sort_by=publishedTimeStamp&sort_order=DESC&searchBy=seller&search=${search}`
    );
  }
};

export const getStaticProps = async ({ params }) => {
  const { searchBy, search } = params;
  let searchByLC = searchBy.toLowerCase();
  let res;
  const error = { status: false };
  try {
    const response = await fetch(getURL(searchByLC, search), {
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
        slp_content:
          searchByLC === "product"
            ? res?.products || null
            : res?.sellerHomeLiteViews || null,
        slp_facets: res?.aggregates || null,
        slp_categories: res?.fixedAggregates || null,
        search: search,
        searchBy: searchByLC,
        error: error,
      },
    },
  };
};
