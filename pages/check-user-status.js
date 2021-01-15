/** @format */

import dynamic from "next/dynamic";
import { Layout } from "../components/common/Layout";
import Spinner from "../components/Spinner/Spinner";
import Auth from "../components/common/Auth";

const DynamicCheckUserStatusWrapper = dynamic(
  () => import("../components/CheckUserStatus/CheckUserStatus"),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function CheckUserStatus() {
  const meta = {
    title: "Qalara",
  };

  return (
    <Layout meta={meta} privateRoute>
      <Auth path="/check-user-status">
        <>
          <DynamicCheckUserStatusWrapper />
        </>
      </Auth>
    </Layout>
  );
}
