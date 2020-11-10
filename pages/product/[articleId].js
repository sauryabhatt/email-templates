/** @format */

import { Layout } from "../../components/common/Layout";
import ProductDescription from "../../components/ProductDescription/ProductDescription";
import Spinner from "../../components/Spinner/Spinner";
import { useRouter } from "next/router";
import NotFound from "../../components/NotFound/NotFound";

export default function ProductDescriptionPage({ data }) {
  const router = useRouter();

  const meta = {
    title:
      data?.productName ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:
      data?.productionDescription ||
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

export const getStaticProps = async ({
  params: { articleId = "" } = {},
}) => {
  let res; 
  const error={status:false};
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

  res = await response.json();
} catch (error) {
  error["status"]=true;
}
  return {
    props: {
      data: res,
      error:error
    },
  };
};
