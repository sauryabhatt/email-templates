import dynamic from "next/dynamic";
import { Layout } from "../../components/common/Layout";
import Spinner from "../../components/Spinner/Spinner";
import Auth from "../../components/common/Auth";

const DynamicRecentlyViewedProductsWrapper = dynamic(
  () => import("../../components/RecentlyViewed/RecentlyViewedProducts"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function RecentlyViewedProducts() {
  const meta = {
    title: "Recently Viewed Products | Qalara",
  };

  return (
    <Layout meta={meta} privateRoute>
      <Auth path={`/recently-viewed/product`}>
        <>
          <DynamicRecentlyViewedProductsWrapper />
        </>
      </Auth>
    </Layout>
  );
}
