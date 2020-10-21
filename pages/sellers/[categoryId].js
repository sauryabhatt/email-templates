import {Layout} from "../../components/common/Layout" ;
import SellerListing from "../../components/SellerListing/SellerListing";
import Spinner from "../../components/Spinner/Spinner"
import {useRouter} from "next/router";
export default function SellerListingPage({data}) {
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
        
        <SellerListing data={data}/>
      </Layout>  
    )
}

export async function getStaticPaths() {
    return {
      paths: [],
      fallback: true,
    };
}
const getURL = (category) =>{
  if(category==="All Categories") {      
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + "/seller-home?from=0&size=30&sort_by=publishedTimeStamp&sort_order=DESC"
}else {
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/seller-home?from=0&size=30&sort_by=publishedTimeStamp&sort_order=DESC&f_categories=${encodeURIComponent(category)}`
}
}
export const getStaticProps=async ({ params: { categoryId = "" } = {} })=>{


      const response = await fetch(getURL(categoryId),
      {
        method: "GET",
      });
      const res1 = await response.json(); 
  return {
    props: {
      data: {
        slp_count: res1.totalHits,
        slp_content: res1.sellerHomeLiteViews,
        slp_facets: res1.aggregates,
        slp_categories: res1.fixedAggregates,
        categoryId:categoryId
      }
    }
  }
}