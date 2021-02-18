/** @format */

import { Layout } from "../components/common/Layout";
import Spinner from "../components/Spinner/Spinner";
import Auth from "../components/common/Auth";
import Shipping from "../components/Shipping/Shipping";
import { useRouter } from "next/router";
import cookie from "cookie";

export default function ShippingPage({ data }) {
  const router = useRouter();

  const meta = {
    title: "Shipping | Qalara",
    url: "/shipping",
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
    <Layout meta={meta} privateRoute>
      <Auth path="/shipping">
        <>
          <Shipping data={data} />
        </>
      </Auth>
    </Layout>
  );
}

export const getServerSideProps = async ({ req }) => {
  let res = {};
  const error = { status: false };

  let { cookie: s_cookie = "" } = req.headers || {};
  let serializeCookie = cookie.parse(s_cookie);
  let { appToken = "" } = serializeCookie || {};

  if (appToken) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/my/cart`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + appToken,
          },
        }
      );

      let cartResp = await response.json();
      cartResp["currency"] = "USD";
      res["cart"] = cartResp;

      let cartDetails = (await res?.cart) || {};

      let { priceQuoteRef = "" } = cartDetails || {};

      if (priceQuoteRef) {
        const airData = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=AIR`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + appToken,
            },
          }
        );

        res["airData"] = await airData.json();

        const seaData = await fetch(
          `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=SEA`,
          {
            method: "GET",
            headers: {
              "content-type": "application/json",
              Authorization: "Bearer " + appToken,
            },
          }
        );

        res["seaData"] = await seaData.json();
      }
    } catch (error) {
      error["status"] = true;
    }
  }

  return {
    props: {
      data: res || null,
      appToken: appToken || "",
      error: error,
    },
  };
};
