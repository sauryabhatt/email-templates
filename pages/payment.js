import dynamic from 'next/dynamic';
import {Layout} from "../components/common/Layout"; 
import Spinner from "../components/Spinner/Spinner"
const DynamicPaymentWrapper = dynamic(
    () => import('../components/Payment/Payment'),
    { 
    ssr: false,
    loading: () => <Spinner/>
    }
  )

export default function Payment() {
  
  const meta = {
    title:"Buy online from India for wholesale exports. Source from verified exporters | Qalara",
    description:"Looking to buy from Indian exporters? Buy wholesale, connect with hundreds of verified manufacturers and trade online!",
  }
  
  return (
    <Layout meta={meta} privateRoute>
      <DynamicPaymentWrapper/>
    </Layout>  
  )

}