
import {Layout} from "../components/common/Layout" 
import Signup from "../components/Auth/Register"
export default function AboutUs() {
  
  const meta = {
    title:"Sign up for global wholesale buying and selling of unique, artisanal, recycled, organic products | Qalara",
    description:"Join the community of wholesale buyers and sellers on Qalara, the best global sourcing platform for Indian handmade products, home decor, furniture, jewelry, kitchen, carpets and textiles.",
    keywords:"Indian exporters, Indian manufacturers, products from India, buy and sell wholesale, sell in USA, Sell in Europe",
    url:"/signup"
  }
  
  return (
    <Layout meta={meta}>
      <Signup/>
    </Layout>  
  )

}
