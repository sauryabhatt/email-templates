/** @format */
import { useEffect } from "react";
import { Layout } from "../../components/common/Layout";
import NotFound from "../../components/NotFound/NotFound";
import { useCookies } from "react-cookie";
import FeedbackModal from "../../components/FeedbackModal/FeedbackModal";

export default function TrendDetails({ res, error, trend }) {
  const [cookie, setCookie] = useCookies(["qalaraUser"]);

  // set cookie to identify if it's new user on site or old user
  useEffect(() => {
    if (cookie.qalaraUser && cookie.qalaraUser === "newUser") {
      setCookie("qalaraUser", "oldUser", {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    } else {
      !cookie.qalaraUser &&
        setCookie("qalaraUser", "newUser", {
          path: "/",
          maxAge: 60 * 60 * 24 * 30,
        }); // set to expire in 30
    }
    return function cleanup() {
      console.log("returned");
    };
  }, []);

  const meta = {
    title:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from South Asia | Qalara",
    description:
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from South East Asia. Digitally. Reliably. Affordably. Responsibly.",
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
      {/*(cookie.qalaraUser && cookie.qalaraUser !== 'oldUser') && <FeedbackModal />*/}
      <div
        dangerouslySetInnerHTML={{
          __html: body,
        }}
      ></div>
    </Layout>
  );
}
const trendsObj = {
  earthinspired: "earthinspired",
  globaltextures: "GlobalTextures",
  urbanjungle: "UrbanJungle",
  homeoffice: "HomeOffice",
  christmasspirit: "ChristmasSpirit",
  "sunkissed-spring21": "SpringSummer",
  "play-and-learn": "KidsLearning",
  indigoblues: "IndigoBlues",
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
