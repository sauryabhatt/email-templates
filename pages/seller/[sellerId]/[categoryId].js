import {Layout} from "../../../components/common/Layout" ;
import SellerProductListing from "../../../components/SellerProductListing/SellerProductListing";
import Spinner from "../../../components/Spinner/Spinner"
import {useRouter} from "next/router";
export default function SellerProductListingPage({data}) {
   const router = useRouter();

    const meta = {
     title:"Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
     description:"How to source from India? How to source handmade goods? How to find verified suppliers from India? How to find genuine suppliers? How to source genuine fair trade products from India?",
     keywords:"handmade, fair trade, wholesale buying, global sourcing, Indian crafts, Exporters from India, Verified manufacturers and suppliers, B2B platform"
   }
    if(router.isFallback) {
      return <Spinner/>
    }
    return (
      <Layout meta={meta}>
        
        <SellerProductListing data={data}/>
      </Layout>  
    )
}

export async function getStaticPaths() {
    return {
      paths: [],
      fallback: true,
    };
}
const getURL = (categoryId, sellerId) =>{
  if(categoryId==="All Categories") {      
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/splp?from=0&size=30&sort_by=visibleTo&sort_order=ASC&sellerId=${sellerId}`
}else {
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/splp?from=0&size=30&sort_by=visibleTo&sort_order=ASC&sellerId=${sellerId}&f_categories=${encodeURIComponent(categoryId)}`
}
}
export const getStaticProps=async ({ params })=>{
const {categoryId, sellerId} = params||{};
      const response = await fetch(process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/splp?from=0&size=30&sort_by=visibleTo&sort_order=ASC&sellerId=${sellerId}`,
      {
        method: "GET",
      });
      const res1 = await response.json(); 
  return {
    props: {
      data: {
        slp_count: res1.totalHits,
        slp_content: res1.products,
        slp_facets: res1.aggregates,
        slp_categories: res1.fixedAggregates,
      }
    }
  }
}