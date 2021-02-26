/** @format */

import { Layout } from "../components/common/Layout";
import Spinner from "../components/Spinner/Spinner";
import Auth from "../components/common/Auth";
import Payment from "../components/Payment/Payment";
import { useRouter } from "next/router";
import cookie from "cookie";

export default function PaymentPage({ data }) {
  const router = useRouter();

  const meta = {
    title: "Payment | Qalara",
    url: "/payment",
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
      <Auth path="/payment">
        <>
          <Payment data={data} />
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

  console.log("apptoken payment ", appToken);

  if (appToken) {
    try {
      const cartResp = await fetch(
        process.env.NEXT_PUBLIC_REACT_APP_ORDER_URL + "/v1/orders/my",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + appToken,
          },
        }
      );
      res["cartResp"] = await cartResp.json();

      let { orderId = "", priceQuoteRef = "", shippingMode = "" } =
        (await res?.cartResp) || {};

      const priceQuoteResp = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_PRICE_QUOTATION_URL}/quotes/rts/${priceQuoteRef}?mode=${shippingMode}`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + appToken,
          },
        }
      );
      res["priceQuoteResp"] = await priceQuoteResp?.json();

      const orderResp = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_ORDER_ORC_URL}/orders/composite/${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + appToken,
            Accept: "*/*",
          },
        }
      );
      res["cart"] = await orderResp?.json();
    } catch (error) {
      error["status"] = true;
      console.log("Error in payment page ", error);
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
