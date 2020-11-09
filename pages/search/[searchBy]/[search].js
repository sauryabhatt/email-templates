import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import { Layout } from "../../../components/common/Layout";
import Spinner from "../../../components/Spinner/Spinner";
const DynamicSearchListingWrapper = dynamic(
    () => import("../../../components/SearchListing/SearchListing"),
    { 
    ssr: false,
    loading: () => <Spinner/>
    }
  )
export default function SearchListingPage() {
const router = useRouter();
const { search, searchBy} = router.query;
let categoryTitle = `Showing ${searchBy==="products"?"products":"sellers"} related to ${decodeURIComponent(search)}`;
const meta = {
    title: `Source quality ${categoryTitle} from verified manufacturers at affordable wholesale prices | Qalara`,
    description:`Buy ${categoryTitle} wholesale from sellers online, pay securely and get it delivered at your doorstep anywhere in the world.`,
}

return (
    <Layout meta={meta}>
    <DynamicSearchListingWrapper/>
    </Layout>
);
}




// export async function getStaticPaths() {
//   return {
//     paths: [],
//     fallback: true,
//   };
// }
// const getURL = (searchByLC, search) => {
//   if(searchByLC==="product") {
//     return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/plpv2?from=0&size=30&sort_by=minimumOrderQuantity&sort_order=ASC&search=${search}`;
//   } else  {
//     return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/seller-homev2?from=0&size=30&sort_by=publishedTimeStamp&sort_order=DESC&search=${search}`;
//   }
// };

// export const getStaticProps = async ({ params}) => {
//   const {searchBy, search} = params;
//   let searchByLC = searchBy.toLowerCase();
//   const response = await fetch(getURL(searchByLC, search), {
//     method: "GET",
//   });
//   const res1 = await response.json();

//   return {
//     props: {
//       data: {
//         slp_count: res1.totalHits,
//         slp_content:  searchByLC==="product"?res1.products:res1.sellerHomeLiteViews,
//         slp_facets: res1.aggregates,
//         slp_categories: res1.fixedAggregates,
//         search: search,
//         searchBy:searchByLC,
//       }
//     },
//   };
// };

