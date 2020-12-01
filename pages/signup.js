
import {Layout} from "../components/common/Layout" 
import Signup from "../components/Auth/Register"
export default function AboutUs() {
  
  const meta = {
    title:"Sign up to connect with buyers and sellers of unique, sustainable, recycled, organic products | Qalara",
    description:"Join the community of buyers and sellers on Qalara, the best way to trade Indian products, home and kitchen items, handmade products, carpets and textiles.",
    url:"/signup"
  }
  
  return (
    <Layout meta={meta}>
      <Signup/>
    </Layout>  
  )

}
