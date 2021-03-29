/** @format */

import { Layout } from "../../components/common/Layout";
import ProductDescription from "../../components/ProductDescription/ProductDescription";
import Spinner from "../../components/Spinner/Spinner";
import { useRouter } from "next/router";
import NotFound from "../../components/NotFound/NotFound";

export default function ProductDescriptionPage({ data, articleId }) {
  const router = useRouter();

  const meta = {
    title:
      `Buy ${data?.productDetails?.productName} online from India and South East Asia for wholesale exports. Source from verified exporters | Qalara` ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      `Looking to buy ${data?.productDetails?.productName} from Indian exporters? Buy wholesale, connect with hundreds of verified manufacturers and trade online!` ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India and South East Asia. Digitally. Reliably. Affordably. Responsibly.",
    keywords: `${data?.productDetails?.productName} sellers, handcrafted online, Wholesale ${data?.productDetails?.productName} , source ${data?.productDetails?.productName}  online, ${data?.productDetails?.productName}  manufacturers, ${data?.productDetails?.productName}  exporters`,
    url: "/product/" + articleId,
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
      <ProductDescription data={data} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async ({ params: { articleId = "" } = {} }) => {
  let res = {};
  const error = { status: false };
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_PRODUCT_DESCRIPTION_URL +
        `/products/${articleId}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
        },
      }
    );

    res["productDetails"] = await response.json();
    const { sellerCode } = (await res.product_details) || {};
    const responseListingPage = await fetch(
      process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL +
        `/splpv2?from=0&size=6&sort_by=minimumOrderQuantity&sort_order=ASC&sellerId=${sellerCode}`
    );
    res["listingPage"] = await responseListingPage.json();
  } catch (error) {
    error["status"] = true;
  }

  return {
    props: {
      data: res || null,
      error: error,
      articleId: articleId,
    },
    revalidate: 60,
  };
};
