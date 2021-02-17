/** @format */

import { Layout } from "../components/common/Layout";
import Cart from "../components/Cart/Cart";
import Spinner from "../components/Spinner/Spinner";
import { useRouter } from "next/router";
import NotFound from "../components/NotFound/NotFound";
import AnonymousCart from "../components/Cart/AnonymousCart";
import cookie from "cookie";

export default function CartPage({ data, appToken }) {
  const router = useRouter();

  const meta = {
    title: "Cart | Qalara",
    url: "/cart",
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
      {appToken ? <Cart data={data} /> : <AnonymousCart />}
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

      const sflResp = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_WISHLIST_URL}/v1/my/wish-list`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + appToken,
          },
        }
      );
      res["sfl"] = await sflResp.json();
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
