/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../components/common/Layout";
import Spinner from "../components/Spinner/Spinner";

const DynamicCartWrapper = dynamic(() => import("../components/Cart/Cart"), {
  ssr: false,
  loading: () => <Spinner />,
});

function Cart() {
  const meta = {
    title: "Cart | Qalara",
  };

  return (
    <Layout meta={meta}>
      <DynamicCartWrapper />
    </Layout>
  );
}
export default Cart;
