/** @format */

export default function TrendDetails({ res }) {
  return <div style={{ paddingTop: "3%" }}>Trends page!!</div>;
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
