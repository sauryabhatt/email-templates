import dynamic from 'next/dynamic';
import {Layout} from "../components/common/Layout"; 
import Spinner from "../components/Spinner/Spinner"
import Auth from "../components/common/Auth"; 

const DynamicPaymentWrapper = dynamic(
    () => import('../components/Payment/Payment'),
    { 
    ssr: false,
    loading: () => <Spinner/>
    }
  )

export default function Payment() {
  
  const meta = {
    title:"Cart - Payment | Qalara",
  }
  
  return (
    <Layout meta={meta} privateRoute>
      <Auth path="/payment"><><DynamicPaymentWrapper/></></Auth>
    </Layout>  
  )

}