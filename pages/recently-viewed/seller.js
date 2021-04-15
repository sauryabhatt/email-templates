import dynamic from "next/dynamic";
import { Layout } from "../../components/common/Layout";
import Spinner from "../../components/Spinner/Spinner";

const DynamicRecentlyViewedSellersWrapper = dynamic(
  () => import("../../components/RecentlyViewed/RecentlyViewedSellers"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function RecentlyViewedSellers() {
  const meta = {
    title: "Recently Viewed Sellers | Qalara",
  };

  return (
    <Layout meta={meta} privateRoute>
      <DynamicRecentlyViewedSellersWrapper />
    </Layout>
  );
}
