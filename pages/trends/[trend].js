/** @format */

import { Layout } from "../../components/common/Layout";
import NotFound from "../../components/NotFound/NotFound";

export default function TrendDetails({ res, error, trend }) {
  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
    url: "/trends/" + trend,
  };

  let { body = "" } = res || {};
  if (error?.status || res?.body == null) {
    return (
      <>
        <NotFound />
      </>
    );
  }
  return (
    <Layout meta={meta}>
      <div
        dangerouslySetInnerHTML={{
          __html: body,
        }}
      ></div>
    </Layout>
  );
}
const trendsObj = {
  earthinspired: "EarthInspired",
  globaltextures: "GlobalTextures",
  urbanjungle: "UrbanJungle",
  homeoffice: "HomeOffice",
  christmasspirit: "ChristmasSpirit",
  "sunkissed-spring21": "SpringSummer",
};
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}
export async function getStaticProps({ params: { trend = "" } = {} }) {
  let res;
  const error = { status: false };
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_REACT_APP_CONTENT_URL +
        `/content/${trendsObj[trend.toLowerCase()]}`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
        },
      }
    );
    res = await response.json();
  } catch (error) {
    error["status"] = true;
  }

  return {
    props: {
      res: res,
      error: error,
      trend: trend.toLowerCase(),
    },
  };
}
