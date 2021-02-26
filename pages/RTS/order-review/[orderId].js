/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../../../components/common/Layout";
import Auth from "../../../components/common/Auth";
import Spinner from "../../../components/Spinner/Spinner";
import { useRouter } from "next/router";
const DynamicRtsOrderReviewWrapper = dynamic(
  () => import("../../../components/OrderReview/RtsOrderReview"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

function RtsOrderReview() {
  const router = useRouter();
  const meta = {
    title:
      "Buy online from South East Asia for wholesale exports. Source from verified exporters | Qalara",
    description:
      "Looking to buy from Indian exporters? Buy wholesale, connect with hundreds of verified manufacturers and trade online!",
  };

  return (
    <Layout meta={meta} privateRoute>
      <Auth path={`/order-review/${router.query.orderId}`}>
        <>
          <DynamicRtsOrderReviewWrapper />
        </>
      </Auth>
    </Layout>
  );
}
export default RtsOrderReview;
