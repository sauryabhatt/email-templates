import {Layout} from "../../components/common/Layout" ;
import ProductDescription from "../../components/ProductDescription/ProductDescription";
import Spinner from "../../components/Spinner/Spinner"
import {useRouter} from "next/router";
export default function ProductDescriptionPage({data}) {
   const router = useRouter();

    const meta = {
    title:data.productName,
    description:data.productionDescription 
    }
    
    if(router.isFallback) {
      return <Spinner/>
    }
    return (
      <Layout meta={meta}>      
        <ProductDescription data={data}/> 
      </Layout>  
    )
}


export const getServerSideProps=async ({req, params: { articleId = "" } = {} })=>{
    
    const response = await fetch((process.env.NEXT_PUBLIC_REACT_APP_API_PRODUCT_DESCRIPTION_URL + `/products/${articleId}`), {
        method: "GET",
        headers: {
            'Authorization': req.headers.Authorization
        }
    });

    const res1 = await response.json(); 
  return {
    props: {
      data: res1
    }
  }
}