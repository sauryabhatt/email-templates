import {Layout} from "../../../components/common/Layout" ;
import SellerProductListing from "../../../components/SellerProductListing/SellerProductListing";
import Spinner from "../../../components/Spinner/Spinner"
import {useRouter} from "next/router";
export default function SellerProductListingPage({data}) {
   const router = useRouter();

    const meta = {
      title: data?.sellerDetails?.brandName || "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods from India | Qalara",
      description:data?.sellerDetails?.companyDescription|| "Global online wholesale platform for sourcing artisanal and sustainable lifestyle goods - Décor, Rugs and Carpets, Kitchen, Home Furnishings – from India. Digitally. Reliably. Affordably. Responsibly."
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

const getURL = (categoryId, sellerId) =>{
  if(categoryId==="all-categories") {      
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/splp?from=0&size=30&sort_by=visibleTo&sort_order=ASC&sellerId=${sellerId}`
  }else {
    return process.env.NEXT_PUBLIC_REACT_APP_API_FACET_PRODUCT_URL + `/splp?from=0&size=30&sort_by=visibleTo&sort_order=ASC&sellerId=${sellerId}&f_categories=${categoryId}`
  }
}
export const getServerSideProps=async ({req, params })=>{
const {categoryId, sellerId} = params||{};
      const response = fetch(getURL(categoryId, sellerId),
      {
        method: "GET",
        
      });
      const sellerResponse = fetch((process.env.NEXT_PUBLIC_REACT_APP_API_PROFILE_URL +"/seller-home/internal-views?view=SPLP&id=" + sellerId),{
        method: "GET",
        headers: {
          'Authorization': req.headers.Authorization
        }});
        const [res, sellerRes] = await Promise.all([
          response,
          sellerResponse
        ]);
      const res1 = await res.json(); 
      const sellerDetails = await sellerRes.json();
      console.log("this is res1-->",res1)
      console.log("this is sellerDetails--->",sellerDetails);
  return {
    props: {
      data: {
        slp_count: res1.totalHits,
        slp_content: res1.products,
        slp_facets: res1.aggregates,
        slp_categories: res1.fixedAggregates,
        sellerDetails:sellerDetails
      }
    }
  }
}