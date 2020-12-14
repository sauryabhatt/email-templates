import dynamic from 'next/dynamic';
import {Layout} from "../components/common/Layout"; 
import Spinner from "../components/Spinner/Spinner"
import Auth from "../components/common/Auth"; 

const DynamicShippingWrapper = dynamic(
    () => import('../components/Shipping/Shipping'),
    { 
    ssr: false,
    loading: () => <Spinner/>
    }
  )

export default function Shipping() {
  
  const meta = {
    title:"Cart - Shipping | Qalara",
}
  
  return (
    <Layout meta={meta} privateRoute>
      <Auth path="/shipping"><><DynamicShippingWrapper/></></Auth>
    </Layout>  
  )

}