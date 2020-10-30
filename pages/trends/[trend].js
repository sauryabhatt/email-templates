/** @format */

import { Layout } from "../../components/common/Layout";

const meta = {
  title:
    "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
  description:
    "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
};

export default function TrendDetails({ res }) {
  return (
    <Layout meta={meta}>
      <div
        // style={{ paddingTop: "3%" }}
        dangerouslySetInnerHTML={{
          __html: res.body,
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
export async function getServerSideProps({ req, params: { trend = "" } = {} }) {
  const response = await fetch(
    process.env.REACT_APP_CONTENT_URL + `/content/${trendsObj[trend]}`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: req.headers.Authorization,
      },
    }
  );
  const res = await response.json();

  return {
    props: {
      res: res,
    },
  };
}
