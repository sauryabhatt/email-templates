/** @format */

import { Layout } from "../../../components/common/Layout";
import SellerProductListing from "../../../components/SellerProductListing/SellerProductListing";
import Spinner from "../../../components/Spinner/Spinner";
import { useRouter } from "next/router";
export default function SellerProductListingPage({ data }) {
  const router = useRouter();

  const meta = {
    title:
      data?.sellerDetails?.brandName ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
    description:
      data?.sellerDetails?.companyDescription ||
      "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly.",
  };
  if (router.isFallback) {
    return <Spinner />;
  }
  return (
    <Layout meta={meta}>
      <SellerProductListing data={data} />
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

const getURL = (categoryId, sellerId) =>{
  if(categoryId==="all-categories") {      
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/splpv2?from=0&size=30&sort_by=visibleTo&sort_order=ASC&sellerId=${sellerId}`
  }else {
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/splpv2?from=0&size=30&sort_by=visibleTo&sort_order=ASC&sellerId=${sellerId}&f_categories=${categoryId}`
  }
};
export const getStaticProps = async ({ params }) => {
  const { categoryId, sellerId } = params || {};
  const response = fetch(getURL(categoryId, sellerId), {
    method: "GET",
  });
  const sellerResponse = fetch(
    process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +
      "/seller-home/internal-views?view=SPLP&id=" +
      sellerId,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzcHdjbzJSVUs1cXlnSlRjbHNyeHhQZnJUVi1Rd0FxdnRNQjV3TkZXZXlNIn0.eyJleHAiOjE2MDQ0Mjc1MDMsImlhdCI6MTYwNDM5ODcwMywianRpIjoiOTUwMTNjNWItMGVkMS00Y2UxLWIxMzUtNDZjNjJmN2UyZjY3IiwiaXNzIjoiaHR0cHM6Ly9hcGktZGV2LnFhbGFyYS5jb206ODQ0My9hdXRoL3JlYWxtcy9Hb2xkZW5CaXJkRGV2IiwiYXVkIjoiYWNjb3VudCIsInN1YiI6IjNiMDVjNDZkLWE0YTItNGFlMS04ZDk5LTI3NWFlOWEyNDc0ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6InJlYWN0VUkiLCJzZXNzaW9uX3N0YXRlIjoiZTcxYjY5MDYtNTk1NS00ZjFiLThhMDctMGE4OWE5NzcwMjRhIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJxb3Flc3dvaWNxZWsuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQzNWV5bmw0MHo4NTByLmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMnFvcWVzd29pY3Flay5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tKiIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20qIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzVleW5sNDB6ODUwci5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDJmOXhuNXEweG51cnkuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tLyIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDIxenRpdGZvZ3YxN2EuYW1wbGlmeWFwcC5jb20iLCJodHRwczovL2RldmVsb3BtZW50LmQxaWc0aW0yemg2OGk5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tIiwiaHR0cHM6Ly93d3cucHJvZHVjdGFkbWluLWRldi5xYWxhcmEuY29tKiIsImh0dHA6Ly8xMy4yMzMuNzkuNTA6MzAwMC8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAqIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMWY1bjJ6cWJsM2trcS5hbXBsaWZ5YXBwLmNvbSoiLCJodHRwczovL2hpbWFuc2h1LWRldmVsb3BtZW50LmQyZjl4bjVxMHhudXJ5LmFtcGxpZnlhcHAuY29tIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbS8iLCJodHRwOi8vMTMuMjM1LjIzOC44NzozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMzZjd2dqZXp2NHdrdy5hbXBsaWZ5YXBwLmNvbSIsImh0dHBzOi8vZGV2ZWxvcG1lbnQuZDM2Y3dnamV6djR3a3cuYW1wbGlmeWFwcC5jb20qIiwiaHR0cDovL2xvY2FsaG9zdDozMDAwLyoiLCJodHRwczovL2RldmVsb3BtZW50LmQxZjVuMnpxYmwza2txLmFtcGxpZnlhcHAuY29tIiwiaHR0cDovLzEzLjIzMy43OS41MDozMDAwIiwiaHR0cHM6Ly9kZXZlbG9wbWVudC5kMmY5eG41cTB4bnVyeS5hbXBsaWZ5YXBwLmNvbSoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFjdFVJIjp7InJvbGVzIjpbInVtYV9wcm90ZWN0aW9uIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJjbGllbnRJZCI6InJlYWN0VUkiLCJjbGllbnRIb3N0IjoiMTAuMi4xLjIwOCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXJlYWN0dWkiLCJjbGllbnRBZGRyZXNzIjoiMTAuMi4xLjIwOCJ9.ZPl2AP5tiQcoc9SfGXZokJtjME1qXehu_-7lrpXetWryBKWnVbdsi5VlD1erfEDc399zbu8mgiGo-eR_xm2o_VIW2ilTP7dbGCKsBL3hrjzP1BrRncsoYQGl1SfaTRmK4Zln9ZyJhkmH5m1qy-6W_gPLxqIoFZfj7klub96j5gtVVVuO7ZDkXR-cByNgdjUuLktrbe-navNSDVWgNG374mnhb2D7_OSAurWXAlOAkhRGREzRDCVilpqRh7qFVlgqwGPoPAG7dl9NCiuDkf0EGYgU0q4I8DH65g_Jk4RCK9p0dXAfFZ0KVD7ujacsGGvSBybXqahFTbD-MoYhJkCiOQ",
      },
    }
  );
  const [res, sellerRes] = await Promise.all([response, sellerResponse]);
  const res1 = await res.json();
  const sellerDetails = await sellerRes.json();
  return {
    props: {
      data: {
        slp_count: res1.totalHits,
        slp_content: res1.products,
        slp_facets: res1.aggregates,
        slp_categories: res1.fixedAggregates,
        sellerDetails: sellerDetails,
      },
    },
  };
};
